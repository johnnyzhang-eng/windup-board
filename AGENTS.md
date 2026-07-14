# AGENTS.md — 全队协作协议（任务走 GitHub Issues）

> 任务源 = 本 repo 的 **GitHub Issues**（和"GitHub 承载软件工程流程"对齐，可替代 Jira/Linear 的任务管理那部分）。
> 网页只做展示：看板 + 大 pipeline 流程图 + 研究中心。人看网页，认领去 Issues。

## 三样东西给组员
1. **网页**：https://johnnyzhang-eng.github.io/windup-board/ —— 看任务看板 + 点右上角看大 pipeline 流程图
2. **研究资料**：https://github.com/johnnyzhang-eng/windup-board/tree/main/research
3. **任务**：https://github.com/johnnyzhang-eng/windup-board/issues

## 怎么认领任务（人）
1. 打开 Issues，挑一个没人 assign 的（标签有 area/优先级，正文有交付物/完成标准/从哪下手）。
2. 把自己设为该 Issue 的 **Assignee** → 网页上它自动移到"进行中"。
3. 干完 → **关闭 Issue** → 网页移到"完成"。进度可在 Issue 评论里记。

## 怎么认领任务（AI / Claude）
用 `board` skill，或直接：
```bash
gh issue list --repo johnnyzhang-eng/windup-board --state open        # 看有什么
gh issue edit <N> --repo johnnyzhang-eng/windup-board --add-assignee @me   # 认领
# 干完
gh issue comment <N> --repo johnnyzhang-eng/windup-board --body "做了X，产出：<链接>"
gh issue close <N> --repo johnnyzhang-eng/windup-board
```

## 加新任务
```bash
gh issue create --repo johnnyzhang-eng/windup-board \
  --title "T-XX 标题" --label "area:XX" --label "P0" \
  --body "交付物：... / 完成标准：... / 从哪下手：..."
```
任务颗粒度 **≤2 小时可出结果**，写清交付物/完成标准/从哪下手。

## 研究 → 任务 → 记录 的循环
- `research/` 想清楚（白板方向 → 调研 → 结论）
- Issues 去做（可落地项拆成 ≤2h 任务、认领）
- `research/实验记录/` 回填结果（成功/失败都记）
- `pipeline-map/` 完善大 pipeline

## 权限
- hub 在 johnnyzhang-eng 下。组员要 assign/关 Issue 需被加为 collaborator；或只读+在 Issue 评论认领由维护者代操作。
- 网页免登录读公开 Issues（GitHub API 无认证限速 60次/小时，够用）。
