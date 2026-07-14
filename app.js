// Windup 团队看板：读 tasks.json + 所有 events/*.jsonl，叠加算出当前状态，渲染三列。
// 纯静态、无构建。events 每人一个文件（追加式），避免多人写冲突。

const EVENT_AUTHORS = window.__BOARD_AUTHORS__ || [];  // 由 events/_index.json 提供，见下

async function loadJSON(url) {
  const r = await fetch(url + "?t=" + Date.now());
  if (!r.ok) throw new Error(url + " " + r.status);
  return r.json();
}
async function loadEvents() {
  // 读 events/_index.json 拿到有哪些人的事件文件，再逐个读 jsonl
  let authors = [];
  try { authors = (await loadJSON("board/events/_index.json")).authors || []; } catch {}
  const all = [];
  for (const a of authors) {
    try {
      const txt = await (await fetch(`board/events/${a}.jsonl?t=${Date.now()}`)).text();
      for (const line of txt.split("\n")) {
        const s = line.trim(); if (!s) continue;
        try { all.push(JSON.parse(s)); } catch {}
      }
    } catch {}
  }
  // 按时间排序，后来的覆盖先前的（fold）
  all.sort((x, y) => (x.ts || "").localeCompare(y.ts || ""));
  return all;
}

function fold(tasks, events) {
  const state = {};
  for (const t of tasks) state[t.id] = { ...t, status: "todo", assignees: [], note: "" };
  for (const e of events) {
    const s = state[e.task]; if (!s) continue;
    if (e.type === "claim" && e.by && !s.assignees.includes(e.by)) s.assignees.push(e.by);
    if (e.type === "status" && e.status) s.status = e.status;
    if (e.type === "note" && e.text) s.note = e.text;
    if (e.type === "unclaim" && e.by) s.assignees = s.assignees.filter(x => x !== e.by);
  }
  return Object.values(state);
}

function card(t) {
  const who = t.assignees.length
    ? t.assignees.map(a => `<span class="chip">${a}</span>`).join("")
    : `<span class="chip" style="opacity:.5">未认领</span>`;
  const note = t.note ? `<div class="note">${t.note}</div>` : "";
  const meta = [t.est ? "⏱ " + t.est : "", t.deliverable ? "📦 " + t.deliverable : ""].filter(Boolean).join("<br>");
  return `<div class="card">
    <div class="top"><span class="id">${t.id}</span><span class="area">${t.area || ""}</span><span class="diff">${t.est || ""}</span></div>
    <div class="title">${t.title}</div>
    <div class="desc">${t.deliverable ? "<b>交付：</b>" + t.deliverable + "<br>" : ""}${t.done ? "<b>完成标准：</b>" + t.done + "<br>" : ""}${t.start ? "<b>下手：</b>" + t.start : (t.desc || "")}</div>
    <div class="who">${who}</div>${note}
  </div>`;
}

async function render() {
  const board = await loadJSON("board/tasks.json");
  const events = await loadEvents();
  document.getElementById("ns").textContent = "北极星：" + (board.northStar || "");
  document.getElementById("updated").textContent = "更新 " + (board.updated || "");
  const folded = fold(board.tasks, events);
  const cols = { todo: [], doing: [], done: [] };
  for (const t of folded) (cols[t.status] || cols.todo).push(t);
  for (const k of ["todo", "doing", "done"]) {
    document.getElementById(k).innerHTML = cols[k].map(card).join("") || `<div class="desc" style="padding:8px;opacity:.4">空</div>`;
    document.getElementById("c-" + k).textContent = cols[k].length;
  }
}
render().catch(e => { document.getElementById("todo").innerHTML = "<div class='desc'>加载失败：" + e.message + "</div>"; });
setInterval(() => render().catch(() => {}), 60000);  // 每分钟自动刷新
