// ══════════════════════════════════════════════════════════
//  Mentora LMS — Express Server
//  Khởi động: npm start  (hoặc npm run dev để auto-reload)
// ══════════════════════════════════════════════════════════
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, '..');   // thư mục gốc project

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Static files ──────────────────────────────────────────
// Phục vụ toàn bộ file tĩnh từ thư mục gốc
app.use(express.static(ROOT));

// ── API Routes ────────────────────────────────────────────
app.use('/api', require('./routes/api'));

// ── Admin SPA ─────────────────────────────────────────────
app.get(['/admin', '/admin/'], (req, res) => {
  res.sendFile(path.join(ROOT, 'admin/index.html'));
});

// ── SPA Fallback ──────────────────────────────────────────
// Mọi route khác trả về index.html để client-side routing hoạt động
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ✅  Mentora LMS đang chạy tại:');
  console.log(`       http://localhost:${PORT}`);
  console.log(`       http://localhost:${PORT}/admin  ← Admin Dashboard`);
  console.log('');
});
