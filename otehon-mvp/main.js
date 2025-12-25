const $ = (self) => document.querySelector(self);

const elTitle = $("#title");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");
const elDow = $("#dow");
const elGrid = $("#grid");

const DOW_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

// state
const state = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
};

// ======== utility ========
// セルの表示日付が対象月か判定
function isSameYMD(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ===== core: 42マス作る =====
function buildCalenderCell(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const start = new Date(year, month, 1 - startOffset);

  const today = new Date();
  const cells = [];

  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);

    cells.push({
      day: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
      isToday: isSameYMD(d, today),
    });
  }

  if (!cells[35].isCurrentMonth) {
    cells.splice(35);
  }

  return cells;
}

// ===== render =====
const render = () => {
  elTitle.textContent = `${state.year}年 ${state.month + 1}月`;

  elDow.innerHTML = DOW_LABELS.map((d) => `<div>${d}</div>`).join("");

  const cells = buildCalenderCell(state.year, state.month);

  elGrid.innerHTML = cells
    .map((cell) => {
      const classList = [
        "cell",
        !cell.isCurrentMonth && "outside",
        cell.isToday && "today",
      ]
        .filter(Boolean)
        .join(" ");

      return `<div class="${classList}">
      <span class="daynum">${cell.day}</span>
    </div>`;
    })
    .join("");
};

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

render();
