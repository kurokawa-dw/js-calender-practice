const $ = (sel) => document.querySelector(sel);

const elTitle = $("#title");
const elDow = $("#dow");
const elGrid = $("#grid");
const elSelectedText = $("#selectedText");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");

const DOW_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

// ===== state =====
const state = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(), // 0-11
  selected: null, // "YYYY-MM-DD"
};

// ===== utils =====
const pad2 = (n) => String(n).padStart(2, "0");

function formatYMD(date) {
  // ローカル日付で YYYY-MM-DD を作る（toISOStringはズレることがあるので使わない）
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
}

function isSameYMD(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ===== core: 42マス作る =====
function buildCalendarCells(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay(); // 日0〜土6
  const start = new Date(year, month, 1 - startOffset); // グリッド左上の日付

  const today = new Date();
  const cells = [];

  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const ymd = formatYMD(d);

    cells.push({
      ymd,
      day: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
      isToday: isSameYMD(d, today),
    });
  }

  return cells;
}

// ===== render =====
function render() {
  // title
  elTitle.textContent = `${state.year}年 ${state.month + 1}月`;

  // dow
  elDow.innerHTML = DOW_LABELS.map((t) => `<div>${t}</div>`).join("");

  // cells
  const cells = buildCalendarCells(state.year, state.month);

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
        </button>
      `;
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

// イベント委譲：gridに1回だけ
elGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-date]");
  if (!btn) return;

  const ymd = btn.getAttribute("data-date");
  state.selected = state.selected === ymd ? null : ymd; // もう一回押したら解除
  render();
});

// init
render();
