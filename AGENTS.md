# AGENTS.md — 全队 AI 协作协议

> 这是给**每个组员的 AI（Claude Code 等）**看的协议。目标：一份共享状态，谁都能看见、谁都能认领任务、不撞车。
> 人看网页：`https://johnnyzhang-eng.github.io/windup-board/`

## 数据模型

- `board/tasks.json` — 任务定义（只读为主；加新任务才改）。字段：id / title / area / est / deliverable / done / start。
- `board/events/<你的名字>.jsonl` — **你只写这一个文件**（追加，不改别人的）。每行一个事件。这样多人并发写零冲突。
- `board/events/_index.json` — 列出有哪些人的事件文件。新人加入先把自己名字加进 `authors`。

## 事件格式（往你自己的 jsonl 追加一行）

```json
{"ts":"2026-07-14T03:00:00Z","type":"claim","task":"T-03","by":"你的名字"}
{"ts":"2026-07-14T03:00:01Z","type":"status","task":"T-03","status":"doing"}
{"ts":"2026-07-14T05:00:00Z","type":"note","task":"T-03","text":"CV镜像法原型跑通,run-01已能标出"}
{"ts":"2026-07-14T05:00:01Z","type":"status","task":"T-03","status":"done"}
{"ts":"...","type":"unclaim","task":"T-03","by":"你的名字"}
```

- `type`：`claim`（认领）/ `status`（改状态：todo/doing/done）/ `note`（进度备注）/ `unclaim`（放弃）
- `ts`：UTC ISO 时间（用于排序，后来的覆盖先前的）

## AI 标准动作

**开工前**：读 `board/tasks.json` 看有哪些 `todo` 且没人 claim 的任务，选一个颗粒度合适（≤2h）的。

**认领并开始**：
```bash
git pull
printf '%s\n%s\n' \
  '{"ts":"<now>","type":"claim","task":"T-XX","by":"<你>"}' \
  '{"ts":"<now>","type":"status","task":"T-XX","status":"doing"}' >> board/events/<你>.jsonl
git add board/events/<你>.jsonl && git commit -m "board: claim T-XX" && git push
```

**完成时**：追加 `note`（干了啥/产出链接）+ `status:done`，push。

## 规则

- **只写自己的 events 文件**，永不改别人的（避免冲突）。
- push 前先 `git pull`（拉别人的最新 events）。
- 一个任务尽量一人主领；想结对就都 claim。
- 加新任务：改 `tasks.json`（这个会有冲突，改前先 pull、改完快 push）。
- 网页分钟级刷新（push 触发 Pages 重建）。

## 一句话
选任务 → 往自己的 jsonl 追加 claim+doing → 干 → 追加 note+done。全队在网页上实时看见。
