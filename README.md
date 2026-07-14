# Windup Hub — 大 Pipeline 流程图 + 研究中心

给组员的一个入口：**大 pipeline 流程图**（GitHub 替代不了的项目地图）+ **研究资料** + **文档**。
任务与看板走 **GitHub 原生**（Issues + Projects），不自建。

🔗 流程图网页：https://johnnyzhang-eng.github.io/windup-board/
📋 看板：GitHub Projects · ✓ 任务：[Issues](https://github.com/johnnyzhang-eng/windup-board/issues) · 📚 研究：[research/](research/)

## 三样东西

| 板块 | 是什么 | 在哪 |
|---|---|---|
| **流程图** | 巨大、持续完善的 pipeline 地图（已实现+待接入，颜色分优先级） | 网页 `index.html` |
| **研究** | 白板方向的技术调研（52条，含"用/P1/P2"结论）+ pipeline 演进 + 实验记录 | `research/` `pipeline-map/` |
| **文档** | 组员上传的竞品/痛点/调研（按类分） | `docs/` |

## 任务怎么管（GitHub 原生，不自建）

- **看板** → GitHub Projects（老师建议）
- **任务** → [Issues](https://github.com/johnnyzhang-eng/windup-board/issues)（18 个，带 area/优先级标签，正文有交付物/完成标准/从哪下手）
- **认领** → 把自己设为 Issue 的 Assignee；**完成** → 关 Issue
- 用 Claude 的 `board` skill 可一句话认领

## 工作循环
```
research/(想清楚:白板→调研→结论) → Issues(拆≤2h任务→认领→做) → research/实验记录/(回填) → 流程图/pipeline-map(完善大pipeline)
```

## 为什么这么分（对齐老师"GitHub 承载流程"）
GitHub Issues+Projects+Milestone 已能替代 Jira/Linear 的任务管理，不重复造。
本 hub 只做 GitHub 替代不了的：**大 pipeline 流程图 + 研究知识沉淀**。

## 结构
```
index.html + mermaid.min.js   大 pipeline 流程图（离线可渲染）
research/   00总纲 + 01-07 分方向调研 + 实验记录/
pipeline-map/   大 pipeline 现状与演进
docs/   组员文档
board/tasks.json   任务原始清单（已转 Issues，归档用）
AGENTS.md   协作协议
```
