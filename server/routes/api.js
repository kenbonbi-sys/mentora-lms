// ══════════════════════════════════════════════════════════
//  API Routes
// ══════════════════════════════════════════════════════════
const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const db     = require('../db');
const auth   = require('../middleware/auth');

const JWT_SECRET     = () => process.env.JWT_SECRET     || 'mentora-dev-secret';
const ADMIN_EMAIL    = () => process.env.ADMIN_EMAIL    || 'admin@momo.vn';
const ADMIN_PASSWORD = () => process.env.ADMIN_PASSWORD || 'admin123';

// ─────────────────────────────────────────────────────────
//  PUBLIC — Tracking
// ─────────────────────────────────────────────────────────

// POST /api/track-view
router.post('/track-view', function (req, res) {
  const { module_id, module_name, session_id } = req.body || {};
  if (!module_id || !module_name) {
    return res.status(400).json({ error: 'module_id và module_name là bắt buộc' });
  }
  try {
    db.insert('page_views', { module_id, module_name: String(module_name), session_id: session_id || null });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/track-quiz
router.post('/track-quiz', function (req, res) {
  const { module_id, module_name, score, total, pct, passed, session_id } = req.body || {};
  if (!module_id || score === undefined) {
    return res.status(400).json({ error: 'Thiếu trường bắt buộc' });
  }
  try {
    db.insert('quiz_attempts', {
      module_id, module_name: String(module_name),
      score: Number(score), total: Number(total),
      pct: Number(pct), passed: passed ? true : false,
      session_id: session_id || null,
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/modules/cms — main site lấy modules mới từ CMS
router.get('/modules/cms', function (req, res) {
  try {
    const rows = db.all('modules_cms', { sortDesc: 'created_at' });
    res.json(rows.map(function (r) { return JSON.parse(r.data); }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────────
//  ADMIN — Auth
// ─────────────────────────────────────────────────────────

// POST /api/admin/login
router.post('/admin/login', function (req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu' });
  if (email !== ADMIN_EMAIL() || password !== ADMIN_PASSWORD()) {
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
  }
  const token = jwt.sign({ email }, JWT_SECRET(), { expiresIn: '8h' });
  res.json({ token, email });
});

// ─────────────────────────────────────────────────────────
//  ADMIN — Analytics
// ─────────────────────────────────────────────────────────

// GET /api/admin/stats
router.get('/admin/stats', auth, function (req, res) {
  try {
    const totalViews = db.count('page_views');
    const totalQuiz  = db.count('quiz_attempts');
    const rawAvg     = db.avg('quiz_attempts', 'pct');
    const avgPct     = rawAvg !== null ? Math.round(rawAvg) : null;
    const passCount  = db.count('quiz_attempts', function (r) { return r.passed; });
    const passRate   = totalQuiz ? Math.round((passCount / totalQuiz) * 100) : null;

    // Per-module views
    const viewGroups = db.groupBy('page_views', 'module_id');
    const quizGroups = db.groupBy('quiz_attempts', 'module_id');

    const modMap = {};
    viewGroups.forEach(function (g) {
      modMap[g.key] = { id: g.key, name: g.module_name, views: g.count, attempts: 0, avg_pct: null, pass_rate: null };
    });
    quizGroups.forEach(function (g) {
      if (!modMap[g.key]) modMap[g.key] = { id: g.key, name: g.module_name, views: 0 };
      modMap[g.key].attempts  = g.count;
      modMap[g.key].avg_pct   = g.count ? Math.round(g.sumPct / g.count) : null;
      modMap[g.key].pass_rate = g.count ? Math.round((g.sumPassed / g.count) * 100) : null;
    });

    res.json({ totalViews, totalQuiz, avgPct, passRate, byModule: Object.values(modMap) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/activity
router.get('/admin/activity', auth, function (req, res) {
  try {
    const views   = db.all('page_views',    { sortDesc: 'created_at', limit: 50 })
      .map(function (r) { return Object.assign({ type: 'view' }, r); });
    const quizzes = db.all('quiz_attempts', { sortDesc: 'created_at', limit: 50 })
      .map(function (r) { return Object.assign({ type: 'quiz' }, r); });

    const all = views.concat(quizzes)
      .sort(function (a, b) { return b.created_at < a.created_at ? -1 : 1; })
      .slice(0, 80);

    res.json(all);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────────
//  ADMIN — Module CMS CRUD
// ─────────────────────────────────────────────────────────

// GET /api/admin/modules
router.get('/admin/modules', auth, function (req, res) {
  try {
    const rows = db.all('modules_cms', { sortDesc: 'updated_at' });
    res.json(rows.map(function (r) {
      return { id: r.id, data: JSON.parse(r.data), created_at: r.created_at, updated_at: r.updated_at };
    }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/modules — upsert
router.post('/admin/modules', auth, function (req, res) {
  const { id, data } = req.body || {};
  if (!id || !data || !data.name) return res.status(400).json({ error: 'Thiếu id hoặc data.name' });
  try {
    db.upsert('modules_cms', 'id', String(id).toUpperCase(), { data: JSON.stringify(data) });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/admin/modules/:id
router.delete('/admin/modules/:id', auth, function (req, res) {
  try {
    const changed = db.delete('modules_cms', 'id', req.params.id);
    if (!changed) return res.status(404).json({ error: 'Module không tồn tại' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
