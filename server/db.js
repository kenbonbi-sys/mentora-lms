// ══════════════════════════════════════════════════════════
//  Database — JSON file store (pure Node.js, no deps)
//  File: data/lms-db.json  (tự tạo khi chạy lần đầu)
//  Phù hợp với LMS nội bộ vài trăm người dùng
// ══════════════════════════════════════════════════════════
const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/lms-db.json');
const EMPTY_DB  = { page_views: [], quiz_attempts: [], modules_cms: [] };

// ── Đọc / ghi file ────────────────────────────────────────
function load() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return JSON.parse(JSON.stringify(EMPTY_DB));  // deep clone
  }
}

function save(data) {
  // Ghi atomic: ghi vào .tmp trước rồi rename để tránh corrupt nếu crash giữa chừng
  const tmp = DATA_FILE + '.tmp';
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, DATA_FILE);
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function now() {
  return new Date().toLocaleString('sv-SE'); // "2026-04-25 14:30:00"
}

// ── DB API ─────────────────────────────────────────────────
const db = {

  // INSERT vào table, tự thêm id & created_at
  insert(table, record) {
    const data = load();
    if (!data[table]) data[table] = [];
    const row = Object.assign({ id: genId(), created_at: now() }, record);
    data[table].push(row);
    save(data);
    return row;
  },

  // SELECT toàn bộ (có filter, sort, limit)
  all(table, { filter, sortDesc, limit } = {}) {
    const data = load();
    let rows = (data[table] || []).slice();
    if (filter)   rows = rows.filter(filter);
    if (sortDesc) rows.sort(function (a, b) { return b[sortDesc] < a[sortDesc] ? -1 : 1; });
    if (limit)    rows = rows.slice(0, limit);
    return rows;
  },

  // COUNT (có filter)
  count(table, filter) {
    const data = load();
    const rows = data[table] || [];
    return filter ? rows.filter(filter).length : rows.length;
  },

  // AVG (field value, có filter)
  avg(table, field, filter) {
    const data = load();
    let rows = data[table] || [];
    if (filter) rows = rows.filter(filter);
    if (!rows.length) return null;
    return rows.reduce(function (s, r) { return s + (r[field] || 0); }, 0) / rows.length;
  },

  // GROUP BY field, trả về array { key, count, sumPct, sumPassed }
  groupBy(table, field) {
    const data = load();
    const rows = data[table] || [];
    const map  = {};
    rows.forEach(function (r) {
      const k = r[field] || '';
      if (!map[k]) map[k] = { key: k, module_name: r.module_name || k, count: 0, sumPct: 0, sumPassed: 0 };
      map[k].count++;
      map[k].sumPct    += (r.pct    || 0);
      map[k].sumPassed += (r.passed ? 1 : 0);
    });
    return Object.values(map);
  },

  // UPSERT modules_cms (id là primary key)
  upsert(table, idField, id, record) {
    const data = load();
    if (!data[table]) data[table] = [];
    const idx = data[table].findIndex(function (r) { return r[idField] === id; });
    if (idx >= 0) {
      data[table][idx] = Object.assign({}, data[table][idx], record, { updated_at: now() });
    } else {
      data[table].push(Object.assign({ created_at: now(), updated_at: now() }, record, { [idField]: id }));
    }
    save(data);
  },

  // DELETE — trả về số bản ghi đã xóa
  delete(table, idField, id) {
    const data  = load();
    const before = (data[table] || []).length;
    data[table] = (data[table] || []).filter(function (r) { return r[idField] !== id; });
    save(data);
    return before - data[table].length;
  },

  // GET ONE by field
  findOne(table, idField, id) {
    const data = load();
    return (data[table] || []).find(function (r) { return r[idField] === id; }) || null;
  },
};

module.exports = db;
