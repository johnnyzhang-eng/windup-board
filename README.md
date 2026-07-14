# Windup 团队看板

全队共享的任务看板：**谁都能看见、谁都能认领、全队 AI 都能读写**。

🔗 看板网页：https://johnnyzhang-eng.github.io/windup-board/

## 怎么用

- **人**：打开网页，看三列（待认领 / 进行中 / 完成），每张卡有任务、交付物、完成标准、认领人。
- **AI / 组员**：读 `board/tasks.json` 选任务 → 往自己的 `board/events/<名字>.jsonl` 追加 `claim` + `status:doing` → push → 网页分钟级刷新。协议见 [`AGENTS.md`](AGENTS.md)，或用 Claude 的 `board` skill 一句话认领。

## 为什么这么设计

- **纯静态**：GitHub Pages 渲染，零后端、零成本；push 触发重建 → 分钟级实时。
- **每人一个 events 文件**：多人并发写不冲突（只追加自己的）。
- **AI 友好**：数据是 repo 里的 json，任何 AI 都能免登录读、git push 写，不用另造 API。

## 结构

```
board/tasks.json         任务定义（≤2h 颗粒度：est/deliverable/done/start）
board/events/<名字>.jsonl 每人只写自己的：claim/status/note/unclaim
board/events/_index.json  有哪些人的事件文件
index.html + app.js       Pages 看板（读 tasks+events 叠加渲染）
AGENTS.md                 全队 AI 协作协议
```
