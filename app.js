// Windup 看板：直接读本 repo 的 GitHub Issues（任务源=Issues，和老师说的"GitHub承载流程"对齐）。
// 三列：待认领(open 未 assign) / 进行中(open 已 assign) / 完成(closed)。免登录读公开 issues。

const REPO = "johnnyzhang-eng/windup-board";
const API = `https://api.github.com/repos/${REPO}/issues?state=all&per_page=100`;

async function load() {
  const r = await fetch(API, { headers: { "Accept": "application/vnd.github+json" } });
  if (!r.ok) throw new Error("GitHub API " + r.status + (r.status === 403 ? "（速率限制，稍后再刷）" : ""));
  const issues = (await r.json()).filter(i => !i.pull_request); // 排除 PR
  return issues;
}

function labelChips(labels) {
  return labels.map(l => {
    const c = "#" + (l.color || "888");
    return `<span class="lchip" style="border-color:${c};color:${c}">${l.name}</span>`;
  }).join("");
}

function card(issue) {
  const assignees = (issue.assignees || []).map(a => `<span class="chip">@${a.login}</span>`).join("")
    || `<span class="chip" style="opacity:.45">未认领</span>`;
  // body 里提取交付物/完成标准做简述
  const body = (issue.body || "").replace(/\*\*/g, "").slice(0, 260);
  return `<div class="card">
    <div class="top">
      <a class="id" href="${issue.html_url}" target="_blank">#${issue.number}</a>
      ${labelChips(issue.labels)}
    </div>
    <div class="title"><a href="${issue.html_url}" target="_blank" style="color:inherit;text-decoration:none">${issue.title}</a></div>
    <div class="desc">${body}</div>
    <div class="who">${assignees}</div>
  </div>`;
}

async function render() {
  document.getElementById("ns").textContent = "北极星：人物一致性 + 动作方向";
  let issues;
  try { issues = await load(); }
  catch (e) { document.getElementById("todo").innerHTML = `<div class="desc">加载失败：${e.message}</div>`; return; }

  const cols = { todo: [], doing: [], done: [] };
  for (const i of issues) {
    if (i.state === "closed") cols.done.push(i);
    else if ((i.assignees || []).length) cols.doing.push(i);
    else cols.todo.push(i);
  }
  // 按 issue number 排序，稳定
  for (const k of ["todo", "doing", "done"]) {
    cols[k].sort((a, b) => a.number - b.number);
    document.getElementById(k).innerHTML = cols[k].map(card).join("") || `<div class="desc" style="padding:8px;opacity:.4">空</div>`;
    document.getElementById("c-" + k).textContent = cols[k].length;
  }
  document.getElementById("updated").textContent = "共 " + issues.length + " 个任务 · 数据源 GitHub Issues";
}
render();
setInterval(() => render().catch(() => {}), 90000); // 90s 刷新（避开 API 速率限制）
