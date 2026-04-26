// ══════════════════════════════════════════════════════════
//  Mentora LMS — Admin Dashboard (Supabase)
//  Điền credentials bên dưới sau khi tạo Supabase project
// ══════════════════════════════════════════════════════════

const SUPABASE_URL  = 'https://ufpsgmlpexpfcaybeula.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmcHNnbWxwZXhwZmNheWJldWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjQxMzIsImV4cCI6MjA5MjcwMDEzMn0.coJ9nVNGtS8qomQugZSH3htmZDNCmZdVOiti4IJfBlU';

// ── Init Supabase client ──────────────────────────────────
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── State ─────────────────────────────────────────────────
let editingModuleId = null;
let stepCount       = 0;
let quizCount       = 0;
let localModules    = [];
let currentDays     = 30;
let _lastModStats   = [];
let _chartHour      = null;

// ── KPI benchmark targets ──────────────────────────────────
const KPI_TARGETS = { views: 500, quiz: 200, avgScore: 80, passRate: 85 };

// ══════════════════════════════════════════════════════════
//  AUTH — Supabase email/password
// ══════════════════════════════════════════════════════════
async function checkAuth() {
  if (SUPABASE_URL.includes('YOUR_PROJECT')) {
    showLoginError('⚠️ Chưa điền Supabase credentials. Mở admin/admin.js để cập nhật.');
    return;
  }
  const { data: { session } } = await sb.auth.getSession();
  session ? showDash(session.user) : showLogin();
}

async function doLogin() {
  const email    = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  const errEl    = document.getElementById('login-error');
  const btn      = document.getElementById('btn-admin-login');
  if (!email || !password) { showLoginError('Vui lòng nhập email và mật khẩu.'); return; }
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Đang đăng nhập...';
  errEl.style.display = 'none';
  try {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    showDash(data.user);
  } catch (err) {
    showLoginError(err.message || 'Đăng nhập thất bại.');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Đăng nhập';
  }
}

async function doLogout() {
  await sb.auth.signOut();
  showLogin();
}

function showLogin() {
  document.getElementById('screen-login').style.display = '';
  document.getElementById('screen-dash').style.display  = 'none';
  document.getElementById('admin-email').value    = '';
  document.getElementById('admin-password').value = '';
  document.getElementById('login-error').style.display = 'none';
  const btn = document.getElementById('btn-admin-login');
  btn.disabled = false;
  btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Đăng nhập';
}

function showDash(user) {
  document.getElementById('screen-login').style.display = 'none';
  document.getElementById('screen-dash').style.display  = '';
  document.getElementById('admin-user-email').textContent = user.email;
  loadLocalModules().then(() => loadDashData());
}

function showLoginError(msg) {
  const el = document.getElementById('login-error');
  el.textContent   = msg;
  el.style.display = '';
}

async function loadLocalModules() {
  try {
    const r = await fetch('/data/modules.json');
    localModules = await r.json();
  } catch { localModules = []; }
}

// ══════════════════════════════════════════════════════════
//  TABS
// ══════════════════════════════════════════════════════════
function initTabs() {
  const tabEls   = Array.from(document.querySelectorAll('.admin-tab'));
  const panelEls = Array.from(document.querySelectorAll('.tab-content'));

  function activateTab(tab) {
    tabEls.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    panelEls.forEach(p => { p.style.display = 'none'; });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.focus();
    const panel = document.getElementById('tab-' + tab.dataset.tab);
    if (panel) panel.style.display = '';
    if (tab.dataset.tab === 'activity') loadActivity();
    if (tab.dataset.tab === 'modules')  loadCmsModules();
    if (tab.dataset.tab === 'announce') { loadAnnouncements(); loadQuestionAnalysis(); }
  }

  tabEls.forEach(tab => {
    tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', e => {
      const idx = tabEls.indexOf(tab);
      let next  = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % tabEls.length;
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   next = (idx - 1 + tabEls.length) % tabEls.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End')  next = tabEls.length - 1;
      if (next !== null) { e.preventDefault(); activateTab(tabEls[next]); }
    });
  });
}

async function loadDashData() {
  await Promise.all([loadStats(), loadCharts(), loadHeatmap(), loadCmsModules()]);
}

// ── Date filter helpers ───────────────────────────────────
function setDayFilter(days) {
  currentDays = days;
  document.querySelectorAll('.day-filter-btn').forEach(b => {
    b.classList.toggle('active', Number(b.dataset.days) === days);
  });
  const titleMap = { 7: '7 ngày', 30: '30 ngày', 90: '90 ngày', 0: 'tất cả (hiện 90 ngày gần nhất)' };
  const el = document.getElementById('chart-daily-title');
  if (el) el.textContent = 'Traffic theo ngày (' + titleMap[days] + ')';
  Promise.all([loadStats(), loadCharts(), loadHeatmap()]);
}

function _dateRange() {
  if (!currentDays) return { curr: null, prev: null };
  const now = Date.now();
  const ms  = currentDays * 864e5;
  return {
    curr: new Date(now - ms).toISOString(),
    prev: new Date(now - ms * 2).toISOString(),
  };
}

function _renderTarget(elId, value, target, isPercent) {
  const el = document.getElementById(elId);
  if (!el || !target || isNaN(value)) return;
  const pct = Math.min(100, Math.round((value / target) * 100));
  const fmt = v => isPercent ? v + '%' : v.toLocaleString('vi');
  el.innerHTML = `<div class="target-bar-wrap">
    <div class="target-bar-track" role="progressbar"
         aria-label="Mục tiêu: ${fmt(target)}"
         aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
      <div class="target-bar-fill${pct >= 100 ? ' target-met' : ''}" style="width:${pct}%"></div>
    </div>
    <span class="target-label">Mục tiêu ${fmt(target)} · ${pct}%</span>
  </div>`;
}

function _renderDelta(elId, curr, prev) {
  const el = document.getElementById(elId);
  if (!el) return;
  if (prev === 0 && curr === 0) { el.innerHTML = ''; return; }
  if (prev === 0) { el.innerHTML = '<span class="delta up">Mới</span>'; return; }
  const pct = Math.round(((curr - prev) / prev) * 100);
  if (pct === 0) { el.innerHTML = '<span class="delta neutral">= kỳ trước</span>'; return; }
  const cls = pct > 0 ? 'up' : 'down';
  const icon = pct > 0 ? '▲' : '▼';
  el.innerHTML = `<span class="delta ${cls}">${icon} ${Math.abs(pct)}% so kỳ trước</span>`;
}

// ══════════════════════════════════════════════════════════
//  STATS
// ══════════════════════════════════════════════════════════
async function loadStats() {
  try {
    const { curr, prev } = _dateRange();

    // ── Views ─────────────────────────────────────────────
    let vq = sb.from('page_views').select('*', { count: 'exact', head: true });
    if (curr) vq = vq.gte('created_at', curr);
    const { count: viewCount } = await vq;
    document.getElementById('stat-total-views').textContent = (viewCount || 0).toLocaleString('vi');
    _renderTarget('target-views', viewCount || 0, KPI_TARGETS.views, false);

    if (prev) {
      const { count: prevViews } = await sb.from('page_views').select('*', { count: 'exact', head: true })
        .gte('created_at', prev).lt('created_at', curr);
      _renderDelta('delta-views', viewCount || 0, prevViews || 0);
    }

    // ── Quiz ──────────────────────────────────────────────
    let qq = sb.from('quiz_attempts').select('module_id, module_name, pct, passed');
    if (curr) qq = qq.gte('created_at', curr);
    const { data: quizData } = await qq;
    const qTotal = quizData ? quizData.length : 0;
    document.getElementById('stat-total-quiz').textContent = qTotal.toLocaleString('vi');
    _renderTarget('target-quiz', qTotal, KPI_TARGETS.quiz, false);

    if (qTotal > 0) {
      const avgPct   = Math.round(quizData.reduce((s, r) => s + r.pct, 0) / qTotal);
      const passRate = Math.round((quizData.filter(r => r.passed).length / qTotal) * 100);
      document.getElementById('stat-avg-score').textContent = avgPct + '%';
      document.getElementById('stat-pass-rate').textContent = passRate + '%';
      _renderTarget('target-score', avgPct,   KPI_TARGETS.avgScore, true);
      _renderTarget('target-pass',  passRate, KPI_TARGETS.passRate, true);
    } else {
      document.getElementById('stat-avg-score').textContent = '—';
      document.getElementById('stat-pass-rate').textContent = '—';
    }

    if (prev) {
      const { data: prevQuiz } = await sb.from('quiz_attempts').select('pct, passed')
        .gte('created_at', prev).lt('created_at', curr);
      const pqTotal = prevQuiz ? prevQuiz.length : 0;
      _renderDelta('delta-quiz', qTotal, pqTotal);
      if (pqTotal > 0 && qTotal > 0) {
        const prevAvg  = Math.round(prevQuiz.reduce((s, r) => s + r.pct, 0) / pqTotal);
        const currAvg  = Math.round(quizData.reduce((s, r) => s + r.pct, 0) / qTotal);
        const prevPass = Math.round((prevQuiz.filter(r => r.passed).length / pqTotal) * 100);
        const currPass = Math.round((quizData.filter(r => r.passed).length / qTotal) * 100);
        _renderDelta('delta-score', currAvg, prevAvg);
        _renderDelta('delta-pass',  currPass, prevPass);
      }
    }

    // ── Per-module ────────────────────────────────────────
    let vr = sb.from('page_views').select('module_id, module_name');
    if (curr) vr = vr.gte('created_at', curr);
    const { data: viewRows } = await vr;

    const catMap = { Policy: 'badge-policy', Process: 'badge-process', Safety: 'badge-safety' };
    const modMap = {};
    localModules.forEach(m => {
      modMap[m.id] = { id: m.id, name: m.name, category: m.category, views: 0, attempts: 0, pctSum: 0, passCount: 0 };
    });
    (viewRows || []).forEach(r => {
      if (!modMap[r.module_id]) modMap[r.module_id] = { id: r.module_id, name: r.module_name, category: '', views: 0, attempts: 0, pctSum: 0, passCount: 0 };
      modMap[r.module_id].views++;
    });
    (quizData || []).forEach(r => {
      if (!modMap[r.module_id]) modMap[r.module_id] = { id: r.module_id, name: r.module_name, category: '', views: 0, attempts: 0, pctSum: 0, passCount: 0 };
      modMap[r.module_id].attempts++;
      modMap[r.module_id].pctSum += r.pct;
      if (r.passed) modMap[r.module_id].passCount++;
    });

    _lastModStats = Object.values(modMap);
    const tbody   = document.getElementById('module-stats-body');
    if (!_lastModStats.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-cell">Chưa có dữ liệu. Người dùng sẽ xuất hiện khi họ mở module.</td></tr>';
      return;
    }
    tbody.innerHTML = _lastModStats.map(m => {
      const avgQ   = m.attempts ? Math.round(m.pctSum / m.attempts) : null;
      const pRate  = m.attempts ? Math.round((m.passCount / m.attempts) * 100) : null;
      const cls    = avgQ === null ? '' : avgQ >= 75 ? 'good' : avgQ >= 50 ? 'medium' : 'bad';
      // Funnel: views → quiz rate → pass rate
      const quizRate = m.views ? Math.round((m.attempts / m.views) * 100) : 0;
      const passRate2 = m.attempts ? Math.round((m.passCount / m.attempts) * 100) : 0;
      const funnel = `<div class="funnel-mini">
        <span class="funnel-step" title="Xem module">👁 ${m.views}</span>
        <span class="funnel-arrow">→</span>
        <span class="funnel-step ${quizRate >= 50 ? 'good' : 'low'}" title="Tỉ lệ làm quiz">📝 ${quizRate}%</span>
        <span class="funnel-arrow">→</span>
        <span class="funnel-step ${passRate2 >= 75 ? 'good' : passRate2 >= 50 ? 'med' : 'low'}" title="Tỉ lệ qua quiz">✅ ${passRate2}%</span>
      </div>`;
      return `<tr>
        <td style="font-weight:600">${esc(m.name)}</td>
        <td>${m.category ? '<span class="badge ' + (catMap[m.category] || '') + '">' + m.category + '</span>' : '—'}</td>
        <td>${m.views.toLocaleString('vi')}</td>
        <td>${m.attempts.toLocaleString('vi')}</td>
        <td>${avgQ !== null ? '<div class="pct-bar"><div class="pct-bar-track"><div class="pct-bar-fill ' + cls + '" style="width:' + avgQ + '%"></div></div><span class="pct-bar-label">' + avgQ + '%</span></div>' : '<span style="color:#9ca3af">—</span>'}</td>
        <td>${pRate !== null ? pRate + '%' : '<span style="color:#9ca3af">—</span>'}</td>
        <td>${funnel}</td>
      </tr>`;
    }).join('');
  } catch (err) {
    console.error('loadStats:', err.message);
  }
}

// ══════════════════════════════════════════════════════════
//  CHARTS — Daily traffic + Traffic source
// ══════════════════════════════════════════════════════════
let _chartDaily  = null;
let _chartSource = null;

async function loadCharts() {
  try {
    const { curr } = _dateRange();
    let q = sb.from('page_views').select('created_at, source');
    if (curr) q = q.gte('created_at', curr);
    const { data: rows } = await q;
    if (!rows) return;

    // ── Daily traffic ─────────────────────────────────────
    // "Tất cả" (currentDays=0) → show last 90 days in chart; otherwise use exact filter value
    const displayDays = currentDays === 0 ? 90 : currentDays;
    const labels = [];
    const counts = {};
    for (let i = displayDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10); // "2026-04-12"
      const label = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }); // "12/04"
      labels.push(label);
      counts[key] = 0;
    }
    rows.forEach(r => {
      const day = (r.created_at || '').slice(0, 10);
      if (counts[day] !== undefined) counts[day]++;
    });
    const dailyData = Object.values(counts);

    const ctxDaily = document.getElementById('chart-daily').getContext('2d');
    if (_chartDaily) _chartDaily.destroy();
    _chartDaily = new Chart(ctxDaily, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Lượt xem',
          data: dailyData,
          borderColor: '#a50064',
          backgroundColor: 'rgba(165,0,100,0.08)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#a50064',
          fill: true,
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { beginAtZero: true, ticks: { precision: 0, font: { size: 11 } }, grid: { color: '#f0f0f4' } }
        }
      }
    });

    // ── Traffic source (doughnut) ─────────────────────────
    const srcCount = { direct: 0, search: 0, referral: 0 };
    rows.forEach(r => {
      const s = r.source || 'direct';
      if (srcCount[s] !== undefined) srcCount[s]++;
      else srcCount.direct++;
    });
    const total = rows.length || 1;
    const srcLabels = ['Direct', 'Search', 'Referral'];
    const srcData   = [srcCount.direct, srcCount.search, srcCount.referral];
    const srcColors = ['#a50064', '#7c3aed', '#0891b2'];

    const ctxSrc = document.getElementById('chart-source').getContext('2d');
    if (_chartSource) _chartSource.destroy();
    _chartSource = new Chart(ctxSrc, {
      type: 'doughnut',
      data: {
        labels: srcLabels,
        datasets: [{ data: srcData, backgroundColor: srcColors, borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: { legend: { display: false }, tooltip: { callbacks: {
          label: ctx => ` ${ctx.label}: ${ctx.raw} (${Math.round(ctx.raw / total * 100)}%)`
        }}}
      }
    });

    // Legend
    const legendEl = document.getElementById('source-legend');
    legendEl.innerHTML = srcLabels.map((l, i) => {
      const pct = Math.round(srcData[i] / total * 100);
      return `<div class="source-legend-item">
        <span class="source-dot" style="background:${srcColors[i]}"></span>
        <span style="flex:1;color:#4b5568">${l}</span>
        <span style="font-weight:600;color:#0f1623">${srcData[i]}</span>
        <span style="color:#9ca3af;margin-left:4px">(${pct}%)</span>
      </div>`;
    }).join('');
  } catch (err) {
    console.error('loadCharts:', err.message);
  }
}

// ══════════════════════════════════════════════════════════
//  HEATMAP — Traffic by hour of day
// ══════════════════════════════════════════════════════════
async function loadHeatmap() {
  try {
    const { curr } = _dateRange();
    let q = sb.from('page_views').select('created_at');
    if (curr) q = q.gte('created_at', curr);
    const { data: rows } = await q;
    const hours = new Array(24).fill(0);
    (rows || []).forEach(r => {
      const h = new Date(r.created_at).getHours();
      if (h >= 0 && h < 24) hours[h]++;
    });
    const labels = Array.from({ length: 24 }, (_, i) => i + 'h');
    const maxVal = Math.max(...hours, 1);
    const colors = hours.map(v => {
      const intensity = v / maxVal;
      return `rgba(165,0,100,${0.15 + intensity * 0.75})`;
    });
    const ctx = document.getElementById('chart-hour').getContext('2d');
    if (_chartHour) _chartHour.destroy();
    _chartHour = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data: hours, backgroundColor: colors, borderRadius: 3, borderSkipped: false }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { callbacks: {
          title: ctx => 'Khung giờ ' + ctx[0].label,
          label: ctx => ctx.raw + ' lượt xem',
        }}},
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: { beginAtZero: true, ticks: { precision: 0, font: { size: 10 } }, grid: { color: '#f0f0f4' } }
        }
      }
    });
  } catch (err) {
    console.error('loadHeatmap:', err.message);
  }
}

// ══════════════════════════════════════════════════════════
//  EXPORT CSV
// ══════════════════════════════════════════════════════════
function exportCSV() {
  if (!_lastModStats.length) { showToast('Chưa có dữ liệu để xuất', 'error'); return; }
  const header = ['Module ID', 'Tên Module', 'Danh mục', 'Lượt xem', 'Lượt quiz', 'Điểm TB (%)', 'Tỉ lệ đạt (%)', 'Tỉ lệ làm quiz (%)'];
  const rows   = _lastModStats.map(m => {
    const avgQ    = m.attempts ? Math.round(m.pctSum / m.attempts) : '';
    const pRate   = m.attempts ? Math.round((m.passCount / m.attempts) * 100) : '';
    const qRate   = m.views    ? Math.round((m.attempts / m.views) * 100) : 0;
    return [m.id, m.name, m.category, m.views, m.attempts, avgQ, pRate, qRate];
  });
  const csv   = [header, ...rows].map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
  const bom   = '﻿'; // UTF-8 BOM for Excel
  const blob  = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url   = URL.createObjectURL(blob);
  const a     = Object.assign(document.createElement('a'), { href: url, download: 'mentora-stats-' + new Date().toISOString().slice(0,10) + '.csv' });
  a.click(); URL.revokeObjectURL(url);
  showToast('Đã xuất CSV!', 'success');
}

// ══════════════════════════════════════════════════════════
//  ACTIVITY FEED
// ══════════════════════════════════════════════════════════
async function loadActivity() {
  const feed = document.getElementById('activity-feed');
  feed.innerHTML = '<div style="padding:24px;text-align:center;color:#9ca3af"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</div>';
  try {
    const [{ data: views }, { data: attempts }] = await Promise.all([
      sb.from('page_views').select('module_id,module_name,created_at').order('created_at', { ascending: false }).limit(50),
      sb.from('quiz_attempts').select('module_id,module_name,score,total,pct,passed,created_at').order('created_at', { ascending: false }).limit(50),
    ]);
    const events = [...(views || []).map(r => ({ type: 'view', ...r })), ...(attempts || []).map(r => ({ type: 'quiz', ...r }))]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (!events.length) { feed.innerHTML = '<div class="empty-cell">Chưa có hoạt động nào.</div>'; return; }
    feed.innerHTML = events.slice(0, 80).map(e => {
      const time = formatTime(e.created_at);
      if (e.type === 'view') return `<div class="activity-item"><div class="activity-icon view"><i class="fa-solid fa-eye"></i></div><div class="activity-meta"><div class="activity-text">Mở module <strong>${esc(e.module_name)}</strong></div><div class="activity-time">${time}</div></div></div>`;
      const cls = e.passed ? 'badge-process' : 'badge-policy';
      return `<div class="activity-item"><div class="activity-icon quiz"><i class="fa-solid fa-circle-question"></i></div><div class="activity-meta"><div class="activity-text">Hoàn thành quiz <strong>${esc(e.module_name)}</strong> — ${e.score}/${e.total} (${e.pct}%)</div><div class="activity-time">${time}</div></div><div class="activity-badge"><span class="badge ${cls}">${e.passed ? 'Đạt' : 'Chưa đạt'}</span></div></div>`;
    }).join('');
  } catch (err) { feed.innerHTML = '<div class="empty-cell" style="color:#e5303f">Lỗi: ' + esc(err.message) + '</div>'; }
}

function formatTime(iso) {
  const d = new Date(iso), diff = Date.now() - d.getTime(), m = Math.floor(diff / 60000);
  if (m < 1) return 'Vừa xong';
  if (m < 60) return m + ' phút trước';
  const h = Math.floor(m / 60);
  if (h < 24) return h + ' giờ trước';
  const day = Math.floor(h / 24);
  return day < 7 ? day + ' ngày trước' : d.toLocaleDateString('vi-VN');
}

// ══════════════════════════════════════════════════════════
//  MODULES CMS
// ══════════════════════════════════════════════════════════
const STATUS_CFG = {
  published: { label: 'Đã đăng',  cls: 'status-published', icon: 'fa-circle-check' },
  draft:     { label: 'Draft',     cls: 'status-draft',     icon: 'fa-pen-ruler'    },
  hidden:    { label: 'Ẩn',        cls: 'status-hidden',    icon: 'fa-eye-slash'    },
};

function statusBadge(s) {
  const c = STATUS_CFG[s] || STATUS_CFG.draft;
  const hint = { published: 'Learner thấy', draft: 'Chỉ admin thấy', hidden: 'Tạm ẩn' }[s] || 'Chỉ admin thấy';
  return `<span class="status-stack"><span class="mod-status ${c.cls}"><i class="fa-solid ${c.icon}"></i> ${c.label}</span><span class="status-hint">${hint}</span></span>`;
}

function statusActions(id, s, hasCms) {
  if (!hasCms) return '<span style="font-size:11px;color:#9ca3af">—</span>';
  const btns = [];
  if (s !== 'published') btns.push(`<button class="btn-sm btn-publish" onclick="setModuleStatus('${id}','published',this)" title="Publish"><i class="fa-solid fa-rocket"></i> Đăng</button>`);
  if (s !== 'draft')     btns.push(`<button class="btn-sm" onclick="setModuleStatus('${id}','draft',this)" title="Về Draft"><i class="fa-solid fa-pen-ruler"></i></button>`);
  if (s !== 'hidden')    btns.push(`<button class="btn-sm" onclick="setModuleStatus('${id}','hidden',this)" title="Ẩn"><i class="fa-solid fa-eye-slash"></i></button>`);
  return '<div class="module-actions">' + btns.join('') + '</div>';
}

async function loadCmsModules() {
  const tbody = document.getElementById('modules-cms-body');
  tbody.innerHTML = '<tr><td colspan="7" class="loading-cell"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</td></tr>';
  try {
    let cmsRows, queryErr;
    // Try full query with sort_order + status first; fall back if columns missing
    ({ data: cmsRows, error: queryErr } = await sb.from('modules_cms')
      .select('id,data,updated_at,status,sort_order')
      .order('sort_order', { ascending: true })
      .order('updated_at',  { ascending: false }));
    if (queryErr) {
      // If the error is about missing columns, fall back to a minimal query
      if (queryErr.message && (queryErr.message.includes('sort_order') || queryErr.message.includes('status'))) {
        const fallback = await sb.from('modules_cms').select('id,data,updated_at').order('updated_at', { ascending: false });
        if (fallback.error) throw fallback.error;
        cmsRows = (fallback.data || []).map(r => ({ ...r, status: 'published', sort_order: 0 }));
      } else {
        throw queryErr;
      }
    }

    const localIds = new Set(localModules.map(m => m.id));
    const combined = [];
    localModules.forEach(m => {
      const cms = (cmsRows || []).find(r => r.id === m.id);
      combined.push({
        id: m.id, name: m.name, category: m.category, updated: m.updated,
        source: cms ? 'CMS + JSON' : 'JSON',
        status: cms ? (cms.status || 'published') : 'published',
        hasCms: !!cms,
      });
    });
    (cmsRows || []).filter(r => !localIds.has(r.id)).forEach(r => {
      const d = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
      combined.push({
        id: r.id, name: d.name || r.id, category: d.category,
        updated: d.updated || '—', source: 'CMS',
        status: r.status || 'published', hasCms: true,
      });
    });

    document.getElementById('cms-module-count').textContent = '(' + combined.length + ' modules)';
    if (!combined.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty-cell">Chưa có module nào.</td></tr>'; return; }

    const catMap = { Policy: 'badge-policy', Process: 'badge-process', Safety: 'badge-safety' };
    tbody.innerHTML = combined.map(m => `<tr class="${m.status === 'draft' ? 'row-draft' : ''}">
      <td><code style="font-size:12px;background:#f5f6fa;padding:2px 6px;border-radius:4px">${esc(m.id)}</code></td>
      <td style="max-width:240px">
        <div style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${esc(m.name)}
          ${m.status === 'draft' ? '<span class="draft-inline">DRAFT</span>' : ''}
        </div>
        <span class="module-source"><i class="fa-solid fa-database"></i> ${esc(m.source)}</span>
      </td>
      <td>${m.category ? '<span class="badge ' + (catMap[m.category] || '') + '">' + esc(m.category) + '</span>' : '—'}</td>
      <td style="color:#9ca3af;font-size:12px">${m.updated || '—'}</td>
      <td>${statusBadge(m.status)}</td>
      <td>${statusActions(m.id, m.status, m.hasCms)}</td>
      <td><div class="module-actions">
        <button class="btn-sm" title="Xem trước" onclick="previewModule('${m.id}')"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-sm" title="Chỉnh sửa" onclick="openEditModule('${m.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
        ${m.hasCms ? '<button class="btn-sm" title="Lên" onclick="moveModule(\'' + m.id + '\',-1)"><i class="fa-solid fa-chevron-up"></i></button><button class="btn-sm" title="Xuống" onclick="moveModule(\'' + m.id + '\',1)"><i class="fa-solid fa-chevron-down"></i></button>' : ''}
        ${m.source === 'CMS' ? '<button class="btn-danger" title="Xóa" onclick="deleteModule(\'' + m.id + '\',\'' + esc(m.name) + '\')"><i class="fa-solid fa-trash"></i></button>' : ''}
      </div></td>
    </tr>`).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-cell" style="color:#e5303f">Lỗi: ' + esc(err.message) + '</td></tr>';
  }
}

async function setModuleStatus(id, status, btn) {
  const labels = { published: 'Đã publish module!', draft: 'Đã chuyển về Draft', hidden: 'Đã ẩn module' };
  const oldHtml = btn ? btn.innerHTML : '';
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>'; }
  const { error } = await sb.from('modules_cms').update({ status }).eq('id', id);
  if (error) {
    if (btn) { btn.disabled = false; btn.innerHTML = oldHtml; }
    showToast('Lỗi: ' + error.message, 'error');
    return;
  }
  showToast(labels[status] || 'Đã cập nhật', 'success');
  loadCmsModules();
}

async function deleteModule(id, name) {
  if (!confirm('Xóa module "' + name + '"?\nHành động này không thể hoàn tác.')) return;
  const { error } = await sb.from('modules_cms').delete().eq('id', id);
  if (error) { showToast('Lỗi xóa: ' + error.message, 'error'); return; }
  showToast('Đã xóa module "' + name + '"', 'success');
  loadCmsModules();
}

function previewModule(id) {
  window.open('/?module=' + id, '_blank');
}

async function moveModule(id, dir) {
  // Fetch current sort_order
  const { data, error } = await sb.from('modules_cms').select('id, sort_order').order('sort_order', { ascending: true });
  if (error) { showToast('Cần chạy SQL migration để thêm cột sort_order', 'error'); return; }
  if (!data || data.length < 2) return;
  const idx = data.findIndex(r => r.id === id);
  if (idx < 0) return;
  const swapIdx = idx + dir;
  if (swapIdx < 0 || swapIdx >= data.length) return;
  const a = data[idx];
  const b = data[swapIdx];
  const aOrder = a.sort_order ?? idx;
  const bOrder = b.sort_order ?? swapIdx;
  await Promise.all([
    sb.from('modules_cms').update({ sort_order: bOrder }).eq('id', a.id),
    sb.from('modules_cms').update({ sort_order: aOrder }).eq('id', b.id),
  ]);
  loadCmsModules();
}

// ══════════════════════════════════════════════════════════
//  ANNOUNCEMENTS
// ══════════════════════════════════════════════════════════
async function loadAnnouncements() {
  const el = document.getElementById('announcements-list');
  if (!el) return;
  el.innerHTML = '<div class="loading-cell"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</div>';
  try {
    const { data, error } = await sb.from('announcements').select('*').order('created_at', { ascending: false });
    if (error) {
      if (error.message && (error.message.includes('relation') || error.message.includes('does not exist'))) {
        el.innerHTML = '<div class="empty-cell">⚠️ Chưa tạo bảng <code>announcements</code>. Vui lòng chạy SQL migration trong Supabase.</div>';
      } else {
        throw error;
      }
      return;
    }
    if (!data || !data.length) { el.innerHTML = '<div class="empty-cell">Chưa có thông báo nào.</div>'; return; }
    const typeIcon = { info: '🔵', warning: '🟡', success: '🟢', danger: '🔴' };
    el.innerHTML = data.map(a => `
      <div class="ann-item ${a.active ? '' : 'ann-inactive'}">
        <span class="ann-icon">${typeIcon[a.type] || '🔵'}</span>
        <div class="ann-content">
          <div class="ann-msg">${esc(a.message)}</div>
          <div class="ann-meta">${formatTime(a.created_at)} · ${a.active ? '<span style="color:#166534">Đang hiện</span>' : '<span style="color:#9ca3af">Đã tắt</span>'}</div>
        </div>
        <div class="ann-actions">
          <button class="btn-sm" onclick="toggleAnnouncement('${a.id}',${a.active},this)">${a.active ? 'Tắt' : 'Bật'}</button>
          <button class="btn-danger" onclick="deleteAnnouncement('${a.id}',this)"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`).join('');
  } catch (err) {
    el.innerHTML = '<div class="empty-cell" style="color:#e5303f">Lỗi: ' + esc(err.message) + '</div>';
  }
}

async function createAnnouncement() {
  const msg  = document.getElementById('ann-message').value.trim();
  const type = document.getElementById('ann-type').value;
  if (!msg) { showToast('Vui lòng nhập nội dung thông báo', 'error'); return; }
  const btn = document.getElementById('btn-create-announcement');
  const oldHtml = btn ? btn.innerHTML : '';
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Đang đăng...'; }
  const { error } = await sb.from('announcements').insert({ message: msg, type, active: true });
  if (error) {
    if (btn) { btn.disabled = false; btn.innerHTML = oldHtml; }
    showToast('Lỗi: ' + error.message, 'error');
    return;
  }
  document.getElementById('ann-message').value = '';
  showToast('Đã đăng thông báo!', 'success');
  if (btn) { btn.disabled = false; btn.innerHTML = oldHtml; }
  loadAnnouncements();
}

async function toggleAnnouncement(id, current, btn) {
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>'; }
  await sb.from('announcements').update({ active: !current }).eq('id', id);
  loadAnnouncements();
}

async function deleteAnnouncement(id, btn) {
  if (!confirm('Xóa thông báo này?')) return;
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>'; }
  await sb.from('announcements').delete().eq('id', id);
  showToast('Đã xóa thông báo', 'success');
  loadAnnouncements();
}

// ══════════════════════════════════════════════════════════
//  QUESTION ANALYSIS
// ══════════════════════════════════════════════════════════
async function loadQuestionAnalysis() {
  const tbody = document.getElementById('qa-body');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" class="loading-cell"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</td></tr>';
  try {
    const { data, error } = await sb.from('quiz_answers').select('module_id, question_index, question_text, is_correct');
    if (error) {
      if (error.message && (error.message.includes('relation') || error.message.includes('does not exist'))) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">⚠️ Chưa tạo bảng <code>quiz_answers</code>. Vui lòng chạy SQL migration trong Supabase.</td></tr>';
      } else {
        throw error;
      }
      return;
    }
    if (!data || !data.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">Chưa có dữ liệu. Người dùng cần làm quiz trước.</td></tr>'; return; }

    // Group by module_id + question_index
    const map = {};
    data.forEach(r => {
      const key = r.module_id + '||' + r.question_index;
      if (!map[key]) map[key] = { module_id: r.module_id, qi: r.question_index, text: r.question_text || ('Câu ' + (r.question_index + 1)), total: 0, wrong: 0 };
      map[key].total++;
      if (!r.is_correct) map[key].wrong++;
    });

    const rows = Object.values(map).sort((a, b) => (b.wrong / b.total) - (a.wrong / a.total));
    tbody.innerHTML = rows.map(r => {
      const wrongRate = Math.round((r.wrong / r.total) * 100);
      const diff = wrongRate >= 70 ? '<span class="badge badge-policy">Khó</span>' : wrongRate >= 40 ? '<span class="badge badge-process">Trung bình</span>' : '<span class="badge badge-open">Dễ</span>';
      const barCls = wrongRate >= 70 ? 'bad' : wrongRate >= 40 ? 'medium' : 'good';
      return `<tr>
        <td><code style="font-size:11px;background:#f5f6fa;padding:2px 6px;border-radius:4px">${esc(r.module_id)}</code></td>
        <td style="max-width:280px;font-size:13px">${esc(r.text)}</td>
        <td>${r.total}</td>
        <td><div class="pct-bar"><div class="pct-bar-track"><div class="pct-bar-fill ${barCls}" style="width:${wrongRate}%"></div></div><span class="pct-bar-label">${wrongRate}%</span></div></td>
        <td>${diff}</td>
      </tr>`;
    }).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-cell" style="color:#e5303f">Lỗi: ' + esc(err.message) + '</td></tr>';
  }
}

// ══════════════════════════════════════════════════════════
//  MODULE MODAL — Add / Edit
// ══════════════════════════════════════════════════════════
function openAddModule() {
  editingModuleId = null;
  document.getElementById('modal-module-title').textContent = 'Thêm Module mới';
  document.getElementById('mod-id').disabled = false;
  ['mod-id','mod-name','mod-subtitle','mod-duration','mod-thumbnail','mod-icon','mod-video'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('mod-category').value = 'Process';
  document.getElementById('mod-level').value    = 'Bắt buộc';
  document.getElementById('mod-updated').value  = new Date().toLocaleDateString('vi-VN');
  document.getElementById('mod-status').value   = 'draft'; // new modules default to Draft
  stepCount = quizCount = 0;
  document.getElementById('steps-builder').innerHTML = '';
  document.getElementById('quiz-builder').innerHTML  = '';
  addStep(); addStep(); addStep();
  addQuizQ(); addQuizQ();
  document.getElementById('modal-module').style.display = '';
}

async function openEditModule(id) {
  editingModuleId = id;
  document.getElementById('modal-module-title').textContent = 'Chỉnh sửa Module';
  let mod = null; let cmsStatus = 'published';
  try {
    const { data } = await sb.from('modules_cms').select('data,status').eq('id', id).single();
    if (data) {
      mod = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
      cmsStatus = data.status || 'published';
    }
  } catch {}
  if (!mod) mod = localModules.find(m => m.id === id);
  if (!mod) { showToast('Không tìm thấy module', 'error'); return; }
  document.getElementById('mod-id').value        = mod.id || '';
  document.getElementById('mod-id').disabled     = true;
  document.getElementById('mod-name').value      = mod.name || '';
  document.getElementById('mod-subtitle').value  = mod.subtitle || '';
  document.getElementById('mod-duration').value  = mod.duration || '';
  document.getElementById('mod-updated').value   = mod.updated || '';
  document.getElementById('mod-thumbnail').value = mod.thumbnail || '';
  document.getElementById('mod-icon').value      = mod.icon || '';
  document.getElementById('mod-video').value     = mod.videoUrl || '';
  document.getElementById('mod-category').value  = mod.category || 'Process';
  document.getElementById('mod-level').value     = mod.level || 'Bắt buộc';
  document.getElementById('mod-status').value    = cmsStatus;
  stepCount = quizCount = 0;
  document.getElementById('steps-builder').innerHTML = '';
  document.getElementById('quiz-builder').innerHTML  = '';
  (mod.steps || []).forEach(s => addStep(s));
  (mod.quiz  || []).forEach(q => addQuizQ(q));
  document.getElementById('modal-module').style.display = '';
}

function closeModuleModal() {
  document.getElementById('modal-module').style.display = 'none';
  document.getElementById('mod-id').disabled = false;
  editingModuleId = null;
}

function addStep(data) {
  stepCount++;
  const n = stepCount, div = document.createElement('div');
  div.className = 'step-builder-item';
  div.innerHTML = '<button class="item-remove" onclick="this.closest(\'.step-builder-item\').remove()"><i class="fa-solid fa-xmark"></i></button>'
    + '<div class="step-builder-num">Bước ' + n + '</div>'
    + '<div class="form-group"><label>Tiêu đề *</label><input type="text" class="step-title" placeholder="Chuẩn bị..." value="' + (data ? esc(data.title) : '') + '"></div>'
    + '<div class="form-group"><label>Nội dung *</label><textarea class="step-desc" rows="4">' + (data ? esc(data.desc) : '') + '</textarea></div>'
    + '<div class="form-group"><label>Lưu ý</label><input type="text" class="step-note" value="' + (data ? esc(data.note || '') : '') + '"></div>';
  document.getElementById('steps-builder').appendChild(div);
}

function addQuizQ(data) {
  quizCount++;
  const n = quizCount, labels = ['A','B','C','D'];
  const opts = data ? data.options : ['','','',''];
  const correct = data ? data.correct : 0;
  const div = document.createElement('div');
  div.className = 'quiz-builder-item';
  div.innerHTML = '<button class="item-remove" onclick="this.closest(\'.quiz-builder-item\').remove()"><i class="fa-solid fa-xmark"></i></button>'
    + '<div class="step-builder-num">Câu ' + n + '</div>'
    + '<div class="form-group"><label>Câu hỏi *</label><input type="text" class="q-question" value="' + (data ? esc(data.question) : '') + '"></div>'
    + '<div class="quiz-options-grid">' + labels.map((l,i) => '<div class="quiz-option-row"><div class="quiz-option-key">' + l + '</div><div class="form-group" style="flex:1;margin:0"><input type="text" class="q-option" value="' + (opts[i] ? esc(opts[i]) : '') + '"></div></div>').join('') + '</div>'
    + '<div class="form-group correct-select"><label>Đáp án đúng</label><select class="q-correct">' + labels.map((l,i) => '<option value="' + i + '"' + (correct===i?' selected':'') + '>Đáp án ' + l + '</option>').join('') + '</select></div>'
    + '<div class="form-group"><label>Giải thích *</label><textarea class="q-explanation" rows="2">' + (data ? esc(data.explanation) : '') + '</textarea></div>';
  document.getElementById('quiz-builder').appendChild(div);
}

async function saveModule() {
  const btn = document.getElementById('btn-save-module');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Đang lưu...';
  try {
    const id   = (editingModuleId || document.getElementById('mod-id').value.trim()).toUpperCase();
    const name = document.getElementById('mod-name').value.trim();
    if (!id || !name) throw new Error('ID và Tên module là bắt buộc');
    const steps = [];
    document.querySelectorAll('.step-builder-item').forEach(el => {
      const title = el.querySelector('.step-title').value.trim();
      const desc  = el.querySelector('.step-desc').value.trim();
      if (!title && !desc) return;
      const note = el.querySelector('.step-note').value.trim();
      steps.push({ title, desc, ...(note ? { note } : {}) });
    });
    const quiz = [];
    document.querySelectorAll('.quiz-builder-item').forEach(el => {
      const question    = el.querySelector('.q-question').value.trim();
      const options     = Array.from(el.querySelectorAll('.q-option')).map(i => i.value.trim());
      const correct     = parseInt(el.querySelector('.q-correct').value, 10);
      const explanation = el.querySelector('.q-explanation').value.trim();
      if (!question) return;
      quiz.push({ question, options, correct, explanation });
    });
    const moduleData = {
      id, name, owner: 'HR-L&OD',
      category:  document.getElementById('mod-category').value,
      level:     document.getElementById('mod-level').value,
      duration:  document.getElementById('mod-duration').value.trim() || '30 phút đọc',
      subtitle:  document.getElementById('mod-subtitle').value.trim(),
      thumbnail: document.getElementById('mod-thumbnail').value.trim() || '/assets/images/hero/hero-01.jpg',
      icon:      document.getElementById('mod-icon').value.trim() || '/assets/icons/education.png',
      status: 'Đang hoạt động',
      updated: document.getElementById('mod-updated').value.trim() || new Date().toLocaleDateString('vi-VN'),
      videoUrl: document.getElementById('mod-video').value.trim() || '',
      steps, quiz, images: [], resources: [],
    };
    const modStatus = document.getElementById('mod-status').value || 'draft';
    const { error } = await sb.from('modules_cms').upsert(
      { id, data: JSON.stringify(moduleData), status: modStatus },
      { onConflict: 'id' }
    );
    if (error) throw error;
    closeModuleModal();
    const statusLabel = { draft: '(Draft)', published: '(Đã đăng)', hidden: '(Ẩn)' }[modStatus] || '';
    showToast('Module "' + name + '" đã được lưu! ' + statusLabel, 'success');
    loadCmsModules();
  } catch (err) {
    showToast('Lỗi: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Lưu module';
  }
}

// ══════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════
let toastTimer = null;
function showToast(msg, type) {
  const el = document.getElementById('admin-toast');
  el.textContent = msg; el.className = 'admin-toast ' + (type||'info'); el.style.display = 'flex';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.display = 'none'; }, 3500);
}
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ══════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-admin-login').addEventListener('click', doLogin);
  document.getElementById('btn-logout').addEventListener('click', doLogout);
  document.getElementById('btn-add-module').addEventListener('click', openAddModule);
  ['admin-email','admin-password'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  });
  document.getElementById('modal-module').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-module')) closeModuleModal();
  });
  // ESC key closes module modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModuleModal();
  });
  initTabs();
  checkAuth();
});
