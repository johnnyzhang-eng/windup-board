# Windup Hub — 团队看板 + 研究中心

全队共享中枢：**任务看板**（谁在做什么，实时）+ **研究/实验中心**（白板所有方向的调研、大 pipeline 演进）+ **组员文档**。

🔗 看板网页：https://johnnyzhang-eng.github.io/windup-board/

## 三大板块

| 板块 | 是什么 | 位置 |
|---|---|---|
| **看板** | 任务认领 + 进度，全队实时可见 | 网页 + `board/` |
| **研究** | 白板方向的技术调研（52条，含"用/P1/P2"结论）+ 大 pipeline 地图 + 实验记录 | `research/` `pipeline-map/` |
| **文档** | 组员上传的竞品/痛点/调研等（按类分） | `docs/` |

## 怎么用

- **看任务**：打开网页看三列（待认领/进行中/完成），或读 `board/tasks.json`。任务都 ≤2h 颗粒度，带交付物/完成标准/从哪下手。
- **认领**：在对应 GitHub Issue 上把自己设为 Assignee（网页自动移到"进行中"）；完成=关闭 Issue。或用 Claude 的 `board` skill。
- **想清楚再做**：`research/00-总纲` 是入口，看白板方向的技术结论；可落地项已拆进看板任务。
- **做完记录**：`research/实验记录/` 按模板记（成功/失败都留证）。

## 工作循环
```
research/(想清楚:白板→调研→结论) → board/(拆≤2h任务→认领→做) → research/实验记录/(回填结果) → pipeline-map(完善大pipeline)
```

## 结构
```
index.html + app.js       看板网页
board/tasks.json          任务原始清单(已转成 GitHub Issues)
research/                  00总纲 + 01-07 分方向调研 + 实验记录/
pipeline-map/             大 pipeline 现状与演进
docs/                     组员文档(竞品/痛点/引擎/会议/产品方案)
AGENTS.md                 全队 AI 协作协议
```

## 关系说明
- 本 hub = 项目中枢（放个人名下，全队看）。
- 正式代码交付 → 主仓 `1024XEngineer/game-asset-character`（Fork+PR）。两者分工。
