# AGENTS.md — 分工协议

> 一句话：**任务/看板/代码走 GitHub 主仓（原生生态），研究资料 + 实时大流程图走本 hub。**

## 两个仓库，各管各的

| | 仓库 | 管什么 |
|---|---|---|
| **主仓（正式生态）** | `1024XEngineer/game-asset-character` | 任务(Issues) · 看板(Projects) · 代码(PR) · 里程碑(Milestone) |
| **本 hub（我们的）** | `johnnyzhang-eng/windup-board` | 研究调研(research/) · 大 pipeline 流程图(网页) · 组员文档(docs/) |

为什么这么分：GitHub 原生 Issues+Projects 已能替代 Jira/Linear 的任务管理（导师认可），不重复造；本 hub 只做 GitHub 替代不了的**知识沉淀 + 流程地图**。

## 给组员的两个入口
1. **实时大流程图**：https://johnnyzhang-eng.github.io/windup-board/
2. **研究资料**：https://github.com/johnnyzhang-eng/windup-board/tree/main/research

## 怎么用本 hub（AI / 组员）
- **看研究**：`research/README.md` 是索引，`00-总纲` 是入口。
- **做完实验**：回填 `research/实验记录/`（用 `_模板.md`，成功/失败都记）。
- **传文档**：`docs/<类别>/` 放 md 或在 `链接.md` 贴腾讯文档链接。
- **更新流程图**：改 `index.html` 里的 mermaid 块（做实验有新结论就让图长大）。
- **push**：本 hub 在 johnnyzhang-eng 下，用 token 走 HTTPS（避开被封的 SSH 账号）。

## 任务在主仓怎么认领
本账号(johnnyzhang-eng)对主仓有 Issue + PR 权限：
```bash
gh issue list --repo 1024XEngineer/game-asset-character --state open   # 看任务
gh issue comment <N> --repo 1024XEngineer/game-asset-character --body "我来做这个，进度：..."   # 参与
# 代码走 Fork + PR（Refs #Issue号）
```
（assign 自己/建 Project 需 push 权限，由主仓管理员操作。）
