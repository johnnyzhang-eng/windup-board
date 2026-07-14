# 实验记录 · E1-统一评判 · DreamSim 身份漂移基线

- 日期 / 做的人：2026-07-14 / 评判线（E1）
- 对应研究方向：research/06-自动评判标准.md（身份层信号）· Refs Windup #7
- 假设 / 想验证什么：DreamSim 能否本机跑通、能否给出可用的"跨帧身份漂移"量化信号（母版 vs 每帧 + 相邻帧），为定阈值提供第一手数据。

- 方法 / 参数：
  - DreamSim 0.2.1 ensemble（DINO + CLIP + DINOv2），device=mps，`.venv-pose`(torch 2.13 / py3.14)。
  - 抠图帧 RGBA → alpha 合成到统一灰底 (128,128,128) 再喂（去背景偏置，研究06 要求）。
  - 探针：`windup-pipeline/experiments/e1_dreamsim_probe.py`。
  - 踩坑：`torch.hub._validate_not_a_forked_repo` 调 **api.github.com** 校验 backbone 仓，被本机 Clash fake-ip 挂（`dial tcp 198.18.0.87`）→ monkeypatch 跳过该校验；github release/codeload 文件下载正常（ckpt 1.17G 已下成功）。

- 输入：`windup-pipeline/characters/{skeleton,boy}`，各 母版 `01_base/chosen_base.png` + 8 帧 `03_walk_cutout/walk_0*.png`（1024×1024）。

- 结果：

  | 角色 | 母版vs帧 min/mean/max | 相邻帧 min/mean/max | 最漂移帧 |
  |---|---|---|---|
  | skeleton | 0.171 / **0.180** / 0.213 | 0.005 / **0.020** / 0.061 | #0（0.213） |
  | boy | 0.116 / **0.140** / 0.159 | 0.027 / **0.040** / 0.062 | #4（0.159） |

- 结论：**成立**——DreamSim 本机可用（MPS 秒级/对，¥0 无 API），给出可分辨信号。三条关键发现：
  1. **母版vs帧的绝对值被"姿势差"污染**（母版站立 vs 帧行走），不能直接当"身份漂移"阈值——它混了 pose + identity。
  2. **相邻帧 Δ 是干净的帧间抖动/闪烁信号**：skeleton 0.02（很顺）、boy 0.04（抖一些）；异常跳变可定位（boy 2→3=0.062、skeleton 0→1=0.061）。
  3. **序列内离群**才是身份漂移的可用判据：某帧 master 距离显著高于序列中位数 → 该帧漂移（skeleton #0 同时被 master-离群 与 0→1-相邻 两个信号挑出，最可疑）。

- 下一步：
  ① 用 VLM-Judge / 人工标"哪帧真的错"做对照集，校准阈值（相邻帧 Δ 上限 + master 相对中位数的离群倍数），别用绝对值；
  ② 把 `dreamsim_drift()` 接进 `pipeline/qa.py`，与几何层 `alignment_report` 并列（身份层）；
  ③ 补 E1 其余信号：CLIP-IQA（脸崩）、关键点计数（数腿，★不问VLM）、VLM-Judge rubric 化（现 qa.py 只是二元 same?）。

- 成本 / 耗时：一次性下载 ckpt 1.17G + backbones；之后每序列(8帧)秒级。运行 ¥0（本机 MPS）。

---

## 追加 · 阈值校准（2026-07-14，experiments/e1_calibrate.py + e1_calib_viz.py）

用"已知好 vs 已知坏"分界定阈值。坏例=跨角色(lirael/boy 母版 vs skeleton 母版) + 对干净帧注入已知扰动。

| 类别 | 样本 | vs母版相对倍数(÷序列中位数) |
|---|---|---|
| 好带(同角色) | skeleton/boy 8 帧真实 walk | ≤ **1.20×**（含最极端姿势帧） |
| 灰区(细微漂移) | 色相+40° / +90° / 去饱和 / 抹武器块 | 1.17 / 1.31 / 1.23 / **1.41×** |
| 明显漂移 | 换成 boy母版 / lirael母版 | **3.17× / 2.87×** |
| 帧间抖动(相邻Δ) | skeleton / boy | 好带 ≤ **0.062** |

**校准结论（重要）：**
1. **绝对值不可用**——被"站立母版 vs 行走帧"的姿势差污染；判据必须用**序列内相对离群**（÷中位数）。
2. **DreamSim = 粗粒度身份守门员**：换角色轻松爆表(2.9×+)、离好带极远，可高置信硬判；但**细微单属性漂移(配色/道具丢失)只到 1.2–1.4×，贴着好带上沿**，DreamSim 灵敏度不够 → 归 VLM 语义层 / 几何层兜底（印证 research/06"多信号叠加、无单一银弹"）。
3. **水平翻转≈1.0×**：DreamSim 近乎镜像不变 → research/05 的"换手/镜像"问题它**抓不到**，必须走几何/手性检查（E7）。
4. 定阈值（**provisional**，仅 2 条干净序列，样本少，false-positive 率待更多序列收紧）：
   - `DRIFT_RATIO = 1.5×`（好带上限 1.20 + 余量；1.5 会漏灰区细微漂移，那是设计上交给 VLM 的部分）
   - `FLICKER_MAX = 0.10`（好带上限 0.062 + 余量）

## 追加 · 接入 pipeline（2026-07-14，pipeline/qa.py）

- 新增 C 段：`dreamsim_drift()`（懒加载、torch 为可选重依赖，缺失返回 `{available:False}` 不阻断）+ `run_qa(..., use_dreamsim=True)`，与几何层 `alignment_report`(A) 并列成身份层(C)。
- **端到端验证**（真跑 run_qa，非仅单测）：干净 skeleton 序列 `drift_frames=[]` 零误报（最极端 #0=1.20 未误伤）；第4帧偷换 boy母版 → 倍数 3.16、`drift_frames=[4]` 抓到。PASS。
- 可视化：`experiments/e1_dreamsim_viz.png`（母版+8帧标距离）、`e1_calib_viz.png`（灵敏度阶梯）。字体坑：本机 PingFang.ttc cannot open，中文用 STHeiti 兜底。
- 下一步：① 攒更多干净序列收紧 DRIFT_RATIO 的误报率；② 补 VLM-Judge 语义层(抓灰区配色/道具漂移)+几何手性检查(抓翻转换手)；③ CLIP-IQA 脸崩 + 关键点数腿(★不问VLM)。未 commit。
