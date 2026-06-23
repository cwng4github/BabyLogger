// Baby Tracker Application - Client-side JavaScript

const LS_KEYS = {
  BIRTH_DATE: "baby_birth_date",
  REFERENCE: "baby_reference_pattern",
  RECORDS: "baby_history_records",
  FORECASTS: "baby_forecast_records"
};

const todayISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const minutesToTime = (mins) => {
  if (mins == null) return "";
  mins = ((mins % (24 * 60)) + (24 * 60)) % (24 * 60);
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
};

const loadJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
};

const saveJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const computeMonthAge = (birthDateStr) => {
  if (!birthDateStr) return null;
  const birth = new Date(birthDateStr);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  return months < 0 ? 0 : months;
};

const formatAgeText = (months) => {
  if (months == null) return "尚未設定生日";
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} 個月大`;
  if (m === 0) return `${y} 歲`;
  return `${y} 歲 ${m} 個月`;
};

// ===== 月齡專屬參考模板（自創：依建議奶量與頻率設計，非醫療建議）=====
const referenceByMonth = {
  0: [ // 新生至未滿 1 個月：少量多餐（約 8 次）
    { time: "02:00", feed: "母乳 60ml", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "05:00", feed: "母乳 60ml", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "08:00", feed: "母乳 70ml", sleepStart: "08:30", sleepEnd: "09:30", poop: "少量" },
    { time: "11:00", feed: "母乳 70ml", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "14:00", feed: "母乳 70ml", sleepStart: "14:30", sleepEnd: "15:30", poop: "" },
    { time: "17:00", feed: "母乳 70ml", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "20:00", feed: "母乳 80ml", sleepStart: "20:30", sleepEnd: "23:30", poop: "少量" },
    { time: "23:30", feed: "母乳 60ml", sleepStart: "00:00", sleepEnd: "02:00", poop: "" }
  ],
  1: [ // 1 個月：每 3 小時左右，約 7~8 次，單次 80–100ml
    { time: "01:30", feed: "母乳 80ml", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "04:30", feed: "母乳 80ml", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "07:30", feed: "母乳 90ml", sleepStart: "08:00", sleepEnd: "09:30", poop: "少量" },
    { time: "10:30", feed: "母乳 90ml", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "13:30", feed: "母乳 90ml", sleepStart: "14:00", sleepEnd: "15:30", poop: "" },
    { time: "16:30", feed: "母乳 90ml", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "19:30", feed: "母乳 100ml", sleepStart: "20:00", sleepEnd: "23:00", poop: "正常" },
    { time: "23:00", feed: "母乳 80ml", sleepStart: "23:30", sleepEnd: "01:30", poop: "" }
  ],
  2: [ // 2 個月：每 3~4 小時，約 6~7 次，每次 120ml 左右
    { time: "02:00", feed: "母乳 120ml", sleepStart: "02:30", sleepEnd: "05:30", poop: "" },
    { time: "06:00", feed: "母乳 120ml", sleepStart: "", sleepEnd: "", poop: "少量" },
    { time: "09:30", feed: "母乳 120ml", sleepStart: "10:00", sleepEnd: "11:00", poop: "" },
    { time: "13:00", feed: "母乳 130ml", sleepStart: "13:30", sleepEnd: "14:30", poop: "正常" },
    { time: "17:00", feed: "母乳 120ml", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "20:30", feed: "母乳 130ml", sleepStart: "21:00", sleepEnd: "02:00", poop: "" }
  ],
  3: [ // 3 個月：每 3.5~4 小時，約 6 次，單次 130–150ml
    { time: "02:30", feed: "母乳 130ml", sleepStart: "03:00", sleepEnd: "06:30", poop: "" },
    { time: "07:00", feed: "母乳 130ml", sleepStart: "", sleepEnd: "", poop: "少量" },
    { time: "10:30", feed: "母乳 140ml", sleepStart: "11:00", sleepEnd: "12:00", poop: "" },
    { time: "14:00", feed: "母乳 140ml", sleepStart: "14:30", sleepEnd: "15:30", poop: "" },
    { time: "17:30", feed: "母乳 140ml", sleepStart: "", sleepEnd: "", poop: "正常" },
    { time: "21:00", feed: "母乳 150ml", sleepStart: "21:30", sleepEnd: "02:30", poop: "" }
  ],
  4: [ // 4 個月：每 4 小時，約 5~6 次，單次 150–180ml
    { time: "02:30", feed: "母乳 150ml", sleepStart: "03:00", sleepEnd: "06:30", poop: "" },
    { time: "07:00", feed: "母乳 160ml", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "11:00", feed: "母乳 160ml", sleepStart: "11:30", sleepEnd: "12:30", poop: "少量" },
    { time: "15:00", feed: "母乳 170ml", sleepStart: "15:30", sleepEnd: "16:30", poop: "" },
    { time: "19:00", feed: "母乳 170ml", sleepStart: "", sleepEnd: "", poop: "正常" },
    { time: "22:30", feed: "母乳 160ml", sleepStart: "23:00", sleepEnd: "02:30", poop: "" }
  ],
  5: [ // 5 個月：每 4 小時，約 5 次，單次 170–180ml
    { time: "06:30", feed: "母乳 170ml", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "10:30", feed: "母乳 180ml", sleepStart: "11:00", sleepEnd: "12:00", poop: "少量" },
    { time: "14:30", feed: "母乳 180ml", sleepStart: "15:00", sleepEnd: "16:00", poop: "" },
    { time: "18:30", feed: "母乳 170ml", sleepStart: "", sleepEnd: "", poop: "正常" },
    { time: "22:00", feed: "母乳 170ml", sleepStart: "22:30", sleepEnd: "06:30", poop: "" }
  ],
  6: [ // 6 個月：開始副食品，每天 4 次奶 + 1~2 次副食，單次 180–200ml
    { time: "07:00", feed: "母乳 180ml", sleepStart: "", sleepEnd: "", poop: "少量" },
    { time: "10:30", feed: "母乳 180ml + 副食品", sleepStart: "11:00", sleepEnd: "12:00", poop: "" },
    { time: "14:30", feed: "母乳 180ml", sleepStart: "15:00", sleepEnd: "16:00", poop: "" },
    { time: "18:30", feed: "母乳 190ml + 副食品", sleepStart: "", sleepEnd: "", poop: "正常" },
    { time: "22:00", feed: "母乳 180ml", sleepStart: "22:30", sleepEnd: "07:00", poop: "" }
  ],
  7: [ // 7 個月：3~4 次奶 + 副食，單次 180–200ml
    { time: "07:00", feed: "母乳 180ml + 副食品", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "11:00", feed: "母乳 180ml", sleepStart: "11:30", sleepEnd: "12:30", poop: "少量" },
    { time: "15:00", feed: "母乳 180ml + 副食品", sleepStart: "15:30", sleepEnd: "16:30", poop: "" },
    { time: "19:30", feed: "母乳 190ml", sleepStart: "20:00", sleepEnd: "07:00", poop: "正常" }
  ],
  8: [ // 8 個月：3 次奶 + 2~3 次副食，單次約 200ml
    { time: "07:00", feed: "母乳 200ml + 副食品", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "11:30", feed: "母乳 200ml", sleepStart: "12:00", sleepEnd: "13:00", poop: "少量" },
    { time: "16:00", feed: "母乳 200ml + 副食品", sleepStart: "16:30", sleepEnd: "17:30", poop: "" },
    { time: "20:00", feed: "母乳 200ml", sleepStart: "20:30", sleepEnd: "07:00", poop: "正常" }
  ],
  9: [ // 9 個月：3 次奶為主，搭配固體餐
    { time: "07:00", feed: "母乳 200ml + 早餐副食品", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "12:00", feed: "母乳 200ml + 午餐副食品", sleepStart: "12:30", sleepEnd: "13:30", poop: "少量" },
    { time: "16:30", feed: "點心 / 少量母乳", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "20:00", feed: "母乳 200ml + 晚餐副食品", sleepStart: "20:30", sleepEnd: "07:00", poop: "正常" }
  ],
  10: [ // 10 個月
    { time: "07:00", feed: "母乳 200ml + 早餐副食品", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "12:30", feed: "母乳 180ml + 午餐副食品", sleepStart: "13:00", sleepEnd: "14:00", poop: "少量" },
    { time: "16:30", feed: "點心 / 水果", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "20:00", feed: "母乳 180ml + 晚餐副食品", sleepStart: "20:30", sleepEnd: "07:00", poop: "正常" }
  ],
  11: [ // 11 個月
    { time: "07:00", feed: "奶 180ml + 早餐固體", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "12:30", feed: "奶 150ml + 午餐固體", sleepStart: "13:00", sleepEnd: "14:00", poop: "少量" },
    { time: "16:30", feed: "點心 / 少量奶", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "20:00", feed: "奶 150ml + 晚餐固體", sleepStart: "20:30", sleepEnd: "07:00", poop: "正常" }
  ],
  12: [ // 12 個月：逐漸接近幼兒餐
    { time: "07:30", feed: "牛奶 / 配方奶 150ml + 早餐固體", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "12:30", feed: "少量奶 + 午餐固體", sleepStart: "13:00", sleepEnd: "14:00", poop: "正常" },
    { time: "16:00", feed: "點心", sleepStart: "", sleepEnd: "", poop: "" },
    { time: "19:30", feed: "少量奶 + 晚餐固體", sleepStart: "20:00", sleepEnd: "07:30", poop: "" }
  ]
};

// 通用預設（如果使用者按「載入通用預設」）
const genericDefaultReference = [
  { time: "06:30", feed: "母乳 120ml", sleepStart: "", sleepEnd: "", poop: "少量" },
  { time: "09:30", feed: "母乳 100ml", sleepStart: "10:00", sleepEnd: "11:00", poop: "" },
  { time: "13:00", feed: "母乳 120ml", sleepStart: "13:30", sleepEnd: "14:30", poop: "正常" },
  { time: "17:30", feed: "母乳 110ml", sleepStart: "", sleepEnd: "", poop: "" },
  { time: "21:00", feed: "母乳 130ml", sleepStart: "21:30", sleepEnd: "06:00", poop: "" }
];

const clampMonth = (m) => {
  if (m == null) return 0;
  if (m < 0) return 0;
  if (m > 12) return 12;
  return m;
};

const getDefaultReferenceForMonth = (month) => {
  month = clampMonth(month);
  if (referenceByMonth[month]) return referenceByMonth[month];
  if (month <= 1) return referenceByMonth[0];
  if (month <= 3) return referenceByMonth[2];
  if (month <= 5) return referenceByMonth[4];
  if (month <= 7) return referenceByMonth[6];
  if (month <= 12) return referenceByMonth[8];
  return referenceByMonth[12];
};

// DOM Elements
const babyBirthDateInput = document.getElementById("babyBirthDate");
const babyAgeText = document.getElementById("babyAgeText");
const babyAgeChip = document.getElementById("baby-age-chip");
const forecastAgeChip = document.getElementById("forecastAgeChip");
const todayDateLabel = document.getElementById("todayDateLabel");
const referenceTableBody = document.getElementById("referenceTableBody");
const runForecastBtn = document.getElementById("runForecastBtn");
const saveForecastBtn = document.getElementById("saveForecastBtn");
const forecastTableBody = document.getElementById("forecastTableBody");
const planTimeline = document.getElementById("planTimeline");
const loadReferenceBtn = document.getElementById("loadReferenceBtn");
const reloadRefForAgeBtn = document.getElementById("reloadRefForAgeBtn");
const refreshPlanBtn = document.getElementById("refreshPlanBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const currentRefMonthLabel = document.getElementById("currentRefMonthLabel");

const recordDateInput = document.getElementById("recordDate");
const recordTimeInput = document.getElementById("recordTime");
const recordFeedInput = document.getElementById("recordFeed");
const recordSleepStartInput = document.getElementById("recordSleepStart");
const recordSleepEndInput = document.getElementById("recordSleepEnd");
const recordPoopInput = document.getElementById("recordPoop");
const addRecordBtn = document.getElementById("addRecordBtn");
const clearRecordFormBtn = document.getElementById("clearRecordFormBtn");
const recordList = document.getElementById("recordList");
const recordDateFilter = document.getElementById("recordDateFilter");

const loadRecords = () => loadJSON(LS_KEYS.RECORDS, []);
const saveRecords = (records) => {
  saveJSON(LS_KEYS.RECORDS, records);
  renderRecordList();
  populateRecordDateFilter();
};

const clearRecordForm = () => {
  recordDateInput.value = todayISO();
  recordTimeInput.value = "";
  recordFeedInput.value = "";
  recordSleepStartInput.value = "";
  recordSleepEndInput.value = "";
  recordPoopInput.value = "";
};

const renderReferenceTable = () => {
  const ref = loadJSON(LS_KEYS.REFERENCE, genericDefaultReference);
  referenceTableBody.innerHTML = "";
  ref.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-stone-100";
    tr.innerHTML = `
      <td class="py-1 pr-2">
        <input type="time" class="input-base text-[11px] bg-white" data-ref-index="${index}" data-field="time" value="${row.time || ""}">
      </td>
      <td class="py-1 pr-2">
        <input type="text" class="input-base text-[11px] bg-white" data-ref-index="${index}" data-field="feed" value="${row.feed || ""}">
      </td>
      <td class="py-1 pr-2">
        <input type="time" class="input-base text-[11px] bg-white" data-ref-index="${index}" data-field="sleepStart" value="${row.sleepStart || ""}">
      </td>
      <td class="py-1 pr-2">
        <input type="time" class="input-base text-[11px] bg-white" data-ref-index="${index}" data-field="sleepEnd" value="${row.sleepEnd || ""}">
      </td>
      <td class="py-1 pr-2">
        <input type="text" class="input-base text-[11px] bg-white" data-ref-index="${index}" data-field="poop" value="${row.poop || ""}">
      </td>
    `;
    referenceTableBody.appendChild(tr);
  });

  referenceTableBody.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      const index = parseInt(input.dataset.refIndex, 10);
      const field = input.dataset.field;
      const ref = loadJSON(LS_KEYS.REFERENCE, genericDefaultReference);
      if (!ref[index]) return;
      ref[index][field] = input.value;
      saveJSON(LS_KEYS.REFERENCE, ref);
    });
  });
};

const renderRecordList = () => {
  const records = loadRecords().sort((a, b) => {
    if (a.date === b.date) return a.time.localeCompare(b.time);
    return a.date.localeCompare(b.date);
  });
  const filterDate = recordDateFilter.value || "";
  recordList.innerHTML = "";

  const filtered = filterDate ? records.filter(r => r.date === filterDate) : records;

  if (filtered.length === 0) {
    recordList.innerHTML = `<p class="text-[11px] text-stone-400 text-center py-4">目前沒有任何記錄。</p>`;
    return;
  }

  filtered.forEach((r) => {
    const card = document.createElement("div");
    card.className = "muji-card px-3 py-2 flex flex-col gap-1 text-[11px]";
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="chip">${r.date}</span>
          <span class="text-stone-800 font-medium">${r.time || "--:--"}</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="text-stone-400 hover:text-red-500" data-action="delete" data-id="${r.id}">
            <i class="fa fa-trash-o"></i>
          </button>
        </div>
      </div>
      <div class="flex flex-wrap gap-x-3 gap-y-1 mt-1">
        <span><span class="text-stone-400">食：</span>${r.feed || "—"}</span>
        <span><span class="text-stone-400">入睡：</span>${r.sleepStart || "—"}</span>
        <span><span class="text-stone-400">起床：</span>${r.sleepEnd || "—"}</span>
        <span><span class="text-stone-400">痾屎：</span>${r.poop || "—"}</span>
      </div>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.closest("button[data-action='delete']")) return;
      openRecordEditModal(r.id);
    });

    card.querySelector("button[data-action='delete']").addEventListener("click", (e) => {
      e.stopPropagation();
      if (!confirm("確定要刪除此筆記錄？")) return;
      const all = loadRecords();
      const next = all.filter(x => x.id !== r.id);
      saveRecords(next);
    });

    recordList.appendChild(card);
  });
};

const populateRecordDateFilter = () => {
  const records = loadRecords();
  const dates = Array.from(new Set(records.map(r => r.date))).sort();
  const currentValue = recordDateFilter.value;
  recordDateFilter.innerHTML = `<option value="">全部日期</option>`;
  dates.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    recordDateFilter.appendChild(opt);
  });
  if (dates.includes(currentValue)) {
    recordDateFilter.value = currentValue;
  }
};

const openRecordEditModal = (id) => {
  const records = loadRecords();
  const r = records.find(x => x.id === id);
  if (!r) return;
  const newFeed = prompt("食（例如：母乳 120ml）", r.feed || "");
  if (newFeed === null) return;
  const newSleepStart = prompt("入睡時間（HH:MM）", r.sleepStart || "");
  if (newSleepStart === null) return;
  const newSleepEnd = prompt("起床時間（HH:MM）", r.sleepEnd || "");
  if (newSleepEnd === null) return;
  const newPoop = prompt("痾屎（描述）", r.poop || "");
  if (newPoop === null) return;

  r.feed = newFeed;
  r.sleepStart = newSleepStart;
  r.sleepEnd = newSleepEnd;
  r.poop = newPoop;
  saveRecords(records);
};

const loadForecasts = () => loadJSON(LS_KEYS.FORECASTS, []);
const saveForecasts = (forecasts) => {
  saveJSON(LS_KEYS.FORECASTS, forecasts);
};

const computeAverageShiftMinutes = () => {
  const records = loadRecords();
  const reference = loadJSON(LS_KEYS.REFERENCE, genericDefaultReference);
  const byDate = {};
  records.forEach(r => {
    if (!byDate[r.date]) byDate[r.date] = [];
    byDate[r.date].push(r);
  });

  const dates = Object.keys(byDate).sort().reverse();
  const considerDates = dates.slice(0, 3);
  const shifts = [];

  considerDates.forEach(date => {
    const dayRecords = byDate[date];
    reference.forEach(refRow => {
      const refTimeMins = parseTimeToMinutes(refRow.time);
      if (refTimeMins == null) return;
      const sameTimeRecord = dayRecords.find(r => r.time && parseTimeToMinutes(r.time) != null);
      if (!sameTimeRecord) return;
      const actualMins = parseTimeToMinutes(sameTimeRecord.time);
      if (actualMins == null) return;
      shifts.push(actualMins - refTimeMins);
    });
  });

  if (shifts.length === 0) return 0;
  const sum = shifts.reduce((a, b) => a + b, 0);
  return Math.round(sum / shifts.length);
};

const renderForecastTable = (rows) => {
  forecastTableBody.innerHTML = "";
  rows.forEach((row, idx) => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-stone-100";
    tr.innerHTML = `
      <td class="py-1 pr-2">
        <input type="time" class="input-base text-[11px] bg-white forecast-input" data-row="${idx}" data-field="time" value="${row.time || ""}">
      </td>
      <td class="py-1 pr-2">
        <input type="text" class="input-base text-[11px] bg-white forecast-input" data-row="${idx}" data-field="feed" value="${row.feed || ""}">
      </td>
      <td class="py-1 pr-2">
        <input type="time" class="input-base text-[11px] bg-white forecast-input" data-row="${idx}" data-field="sleepStart" value="${row.sleepStart || ""}">
      </td>
      <td class="py-1 pr-2">
        <input type="time" class="input-base text-[11px] bg-white forecast-input" data-row="${idx}" data-field="sleepEnd" value="${row.sleepEnd || ""}">
      </td>
      <td class="py-1 pr-2">
        <input type="text" class="input-base text-[11px] bg-white forecast-input" data-row="${idx}" data-field="poop" value="${row.poop || ""}">
      </td>
    `;
    forecastTableBody.appendChild(tr);
  });
};

const runForecast = () => {
  const reference = loadJSON(LS_KEYS.REFERENCE, genericDefaultReference);
  const shift = computeAverageShiftMinutes();
  const forecastRows = reference.map(row => {
    const base = parseTimeToMinutes(row.time);
    const forecastTime = base == null ? "" : minutesToTime(base + shift);
    return {
      time: forecastTime,
      feed: row.feed,
      sleepStart: row.sleepStart,
      sleepEnd: row.sleepEnd,
      poop: row.poop
    };
  });
  renderForecastTable(forecastRows);
  return forecastRows;
};

const getForecastTableData = () => {
  const rows = [];
  forecastTableBody.querySelectorAll("tr").forEach(() => {
    rows.push({ time: "", feed: "", sleepStart: "", sleepEnd: "", poop: "" });
  });

  forecastTableBody.querySelectorAll(".forecast-input").forEach(input => {
    const rowIndex = parseInt(input.dataset.row, 10);
    const field = input.dataset.field;
    if (!rows[rowIndex]) return;
    rows[rowIndex][field] = input.value;
  });

  return rows;
};

const renderPlanTimeline = () => {
  const today = todayISO();
  const allForecasts = loadForecasts();
  const todayForecast = allForecasts.find(f => f.date === today);
  const records = loadRecords().filter(r => r.date === today);

  planTimeline.innerHTML = "";

  const block = document.createElement("div");
  block.className = "space-y-2";

  if (!todayForecast) {
    block.innerHTML = `
      <p class="text-[11px] text-stone-400 mb-1">尚未保存今日預測，可在 FORECAST 分頁產生並保存。</p>
    `;
  } else {
    const rows = todayForecast.rows;
    rows.forEach(row => {
      const time = row.time || "--:--";
      const li = document.createElement("div");
      li.className = "flex items-start gap-3";

      li.innerHTML = `
        <div class="flex flex-col items-center">
          <span class="text-[11px] text-stone-500">${time}</span>
          <span class="w-px flex-1 bg-stone-200 mt-1"></span>
        </div>
        <div class="flex-1 muji-card px-3 py-2 text-[11px]">
          <div class="flex items-center justify-between">
            <span class="text-stone-800">${row.feed || "—"}</span>
            <span class="chip">預測</span>
          </div>
          <div class="mt-1 text-stone-500">
            <span>入睡：${row.sleepStart || "—"}</span>
            <span class="mx-1">·</span>
            <span>起床：${row.sleepEnd || "—"}</span>
            <span class="mx-1">·</span>
            <span>痾屎：${row.poop || "—"}</span>
          </div>
        </div>
      `;
      block.appendChild(li);
    });
  }

  if (records.length > 0) {
    const subTitle = document.createElement("div");
    subTitle.className = "mt-3 section-title";
    subTitle.textContent = "TODAY ACTUAL";
    block.appendChild(subTitle);

    records.sort((a, b) => a.time.localeCompare(b.time));
    records.forEach(r => {
      const row = document.createElement("div");
      row.className = "flex items-start gap-3 mt-1";
      row.innerHTML = `
        <div class="flex flex-col items-center">
          <span class="text-[11px] text-stone-500">${r.time || "--:--"}</span>
          <span class="w-px flex-1 bg-stone-200 mt-1"></span>
        </div>
        <div class="flex-1 muji-card px-3 py-2 text-[11px]">
          <div class="flex items-center justify-between">
            <span class="text-stone-800">${r.feed || "—"}</span>
            <span class="chip">歷史</span>
          </div>
          <div class="mt-1 text-stone-500">
            <span>入睡：${r.sleepStart || "—"}</span>
            <span class="mx-1">·</span>
            <span>起床：${r.sleepEnd || "—"}</span>
            <span class="mx-1">·</span>
            <span>痾屎：${r.poop || "—"}</span>
          </div>
        </div>
      `;
      block.appendChild(row);
    });
  } else {
    const p = document.createElement("p");
    p.className = "text-[11px] text-stone-400 mt-2";
    p.textContent = "今日尚未有實際記錄，可在 RECORD 分頁新增。";
    block.appendChild(p);
  }

  planTimeline.appendChild(block);
};

const exportToCsv = () => {
  window.location.href = '/api/export/csv';
};

const tabButtons = document.querySelectorAll("button.tab-btn");
const tabSections = {
  plan: document.getElementById("tab-plan"),
  record: document.getElementById("tab-record"),
  forecast: document.getElementById("tab-forecast")
};

const switchTab = (tab) => {
  Object.keys(tabSections).forEach(key => {
    tabSections[key].classList.toggle("hidden", key !== tab);
  });
  tabButtons.forEach(btn => {
    const t = btn.dataset.tab;
    if (t === tab) {
      btn.classList.remove("tab-inactive");
      btn.classList.add("tab-active");
    } else {
      btn.classList.remove("tab-active");
      btn.classList.add("tab-inactive");
    }
  });
};

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    switchTab(btn.dataset.tab);
  });
});

const describeRefMonth = (m) => {
  m = clampMonth(m);
  if (m === null) return "尚未計算";
  if (m === 0) return "0 個月（新生兒少量多餐）";
  if (m === 1) return "1 個月（每 3 小時餵）";
  if (m === 2) return "2 個月（約 6–7 餐）";
  if (m === 3) return "3 個月（約 6 餐）";
  if (m === 4 || m === 5) return m + " 個月（每 4 小時左右）";
  if (m === 6 || m === 7) return m + " 個月（開始副食品）";
  if (m >= 8 && m <= 12) return m + " 個月（3 次奶搭配固體餐）";
  return m + " 個月";
};

const initReferenceForAgeIfEmpty = (months) => {
  if (!localStorage.getItem(LS_KEYS.REFERENCE)) {
    const ref = getDefaultReferenceForMonth(months);
    saveJSON(LS_KEYS.REFERENCE, ref);
  }
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  const today = todayISO();
  todayDateLabel.textContent = `今天：${today}`;
  recordDateInput.value = today;

  const birth = localStorage.getItem(LS_KEYS.BIRTH_DATE) || "";
  if (birth) {
    babyBirthDateInput.value = birth;
  }
  const months = computeMonthAge(birth);
  const ageTextStr = formatAgeText(months);
  babyAgeText.textContent = `目前月齡：約 ${ageTextStr}。`;
  babyAgeChip.textContent = ageTextStr;
  forecastAgeChip.textContent = `預測以 ${ageTextStr} 為參考。`;
  currentRefMonthLabel.textContent = describeRefMonth(months);

  initReferenceForAgeIfEmpty(months);
  renderReferenceTable();

  renderRecordList();
  populateRecordDateFilter();

  renderForecastTable(runForecast());
  renderPlanTimeline();
});

// Event Listeners
babyBirthDateInput.addEventListener("change", () => {
  const v = babyBirthDateInput.value;
  if (v) {
    localStorage.setItem(LS_KEYS.BIRTH_DATE, v);
  } else {
    localStorage.removeItem(LS_KEYS.BIRTH_DATE);
  }
  const months = computeMonthAge(v);
  const ageTextStr = formatAgeText(months);
  babyAgeText.textContent = `目前月齡：約 ${ageTextStr}。`;
  babyAgeChip.textContent = ageTextStr;
  forecastAgeChip.textContent = `預測以 ${ageTextStr} 為參考。`;
  currentRefMonthLabel.textContent = describeRefMonth(months);
});

loadReferenceBtn.addEventListener("click", () => {
  if (!confirm("確定要載入通用預設？這會覆蓋目前參考模板。")) return;
  saveJSON(LS_KEYS.REFERENCE, genericDefaultReference);
  renderReferenceTable();
});

reloadRefForAgeBtn.addEventListener("click", () => {
  const birth = localStorage.getItem(LS_KEYS.BIRTH_DATE) || babyBirthDateInput.value;
  const months = computeMonthAge(birth);
  if (months == null) {
    alert("請先設定嬰兒出生日期。");
    return;
  }
  if (!confirm(`將依照目前月齡（約 ${formatAgeText(months)}）重設參考模板，會覆蓋你已修改的內容，確定繼續？`)) return;
  const ref = getDefaultReferenceForMonth(months);
  saveJSON(LS_KEYS.REFERENCE, ref);
  renderReferenceTable();
  currentRefMonthLabel.textContent = describeRefMonth(months);
  alert("已依月齡載入新的參考模板。");
});

addRecordBtn.addEventListener("click", () => {
  const date = recordDateInput.value || todayISO();
  const time = recordTimeInput.value || "";
  const feed = recordFeedInput.value.trim();
  const sleepStart = recordSleepStartInput.value;
  const sleepEnd = recordSleepEndInput.value;
  const poop = recordPoopInput.value.trim();

  if (!time && !feed && !sleepStart && !sleepEnd && !poop) {
    alert("請至少填寫一個欄位。");
    return;
  }

  const records = loadRecords();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  records.push({ id, date, time, feed, sleepStart, sleepEnd, poop });
  saveRecords(records);
  clearRecordForm();
});

clearRecordFormBtn.addEventListener("click", () => {
  clearRecordForm();
});

recordDateFilter.addEventListener("change", () => {
  renderRecordList();
});

runForecastBtn.addEventListener("click", () => {
  const rows = runForecast();
  alert("已根據最近歷史記錄與月齡模板更新預測時間。");
  renderPlanTimeline();
});

saveForecastBtn.addEventListener("click", () => {
  const today = todayISO();
  const rows = getForecastTableData();
  const forecasts = loadForecasts();
  const existingIdx = forecasts.findIndex(f => f.date === today);
  if (existingIdx >= 0) {
    forecasts[existingIdx].rows = rows;
  } else {
    forecasts.push({ date: today, rows });
  }
  saveForecasts(forecasts);
  alert("已保存今日預測，可於 PLAN 及 CSV 匯出查看。");
  renderPlanTimeline();
});

refreshPlanBtn.addEventListener("click", () => {
  renderPlanTimeline();
});

exportCsvBtn.addEventListener("click", () => {
  exportToCsv();
});

// Made with Bob
