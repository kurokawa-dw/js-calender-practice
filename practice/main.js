const $ = (sel) => document.querySelector(sel);

const elTitle = $("#title");
const elDow = $("#dow");
const elGrid = $("#grid");
const elSelectedText = $("#selectedText");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");

// day of week
const DOW_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

// ====== state =======
const state = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  selected: null,
};

// ====== utils =======
// 一桁の数字を二桁にする関数
const pad2 = (n) => String(n).padStart(2, "0");

// 日付をファーマットして返す
function formatYMD(date) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
}

// 二つの日付を比較して同じ日付か判定 bool
function isSameYMD(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ====== core: 42マス作る =======
function buildCalenderCell(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const start = new Date(year, month, 1 - startOffset);

  // console.log("first：" + first);
  // console.log("startOffset：" + startOffset);
  // console.log("start：" + start);

  const today = new Date();
  const cells = [];

  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const ymd = formatYMD(d);

    cells.push({
      date: d,
      ymd,
      day: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
      isToday: isSameYMD(d, today),
    });
  }

  if (!cells[35].isCurrentMonth) {
    cells.splice(35);
  }

  // console.log(cells);

  return cells;
}

// ====== render =======
function render() {
  elTitle.textContent = `${state.year}年 ${state.month + 1}月`;

  elDow.innerHTML = DOW_LABELS.map((t) => `<div>${t}</div>`).join("");

  const cells = buildCalenderCell(state.year, state.month);

  elGrid.innerHTML = cells
    .map((c) => {
      const classList = [
        "cell",
        !c.isCurrentMonth ? "outside" : "",
        c.isToday ? "today" : "",
        state.selected === c.ymd ? "selected" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `
        <button class="${classList}" type="button" data-date="${c.ymd}" aria-label="${c.ymd}">
          <span class="daynum">${c.day}</span>
        </button>`;
    })
    .join("");

  elSelectedText.textContent = state.selected ?? "なし";
}

// ===== events =====
prevBtn.addEventListener("click", () => {
  const d = new Date(state.year, state.month - 1, 1);
  state.year = d.getFullYear();
  state.month = d.getMonth();
  render();
});
nextBtn.addEventListener("click", () => {
  const d = new Date(state.year, state.month + 1, 1);
  state.year = d.getFullYear();
  state.month = d.getMonth();
  render();
});

elGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-date]");
  if (!btn) return;

  const ymd = btn.getAttribute("data-date");
  state.selected = state.selected === ymd ? null : ymd;

  render();
});

render();

const date = new Date();
const EOM = new Date(date.getFullYear(), date.getMonth() + 1, 0);
console.log(EOM);
