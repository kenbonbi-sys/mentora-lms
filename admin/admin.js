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
let stepCount       = 0;  // legacy (kept for safety)
let quizCount       = 0;  // legacy (kept for safety)
let localModules    = [];
let currentDays     = 30;
let _lastModStats   = [];
let _chartHour      = null;
let _blockIdSeed    = 0;
let _journeyItems   = [];
let _journeyDragId  = null;
let _editingPrerequisites = [];
let _chartFunnel    = null;
let _chartDrillDaily = null;
let _sparkCharts    = {};

// ── Block system helpers ───────────────────────────────────
function genBlockId() { return 'blk-' + Date.now() + '-' + (++_blockIdSeed); }

const BLOCK_META = {
  text:      { icon: 'fa-paragraph',       label: 'Đoạn văn bản' },
  steps:     { icon: 'fa-list-check',      label: 'Quy trình / Các bước' },
  checklist: { icon: 'fa-square-check',    label: 'Checklist' },
  quiz:      { icon: 'fa-circle-question', label: 'Quiz kiểm tra' },
  video:     { icon: 'fa-video',           label: 'Video YouTube' },
  image:     { icon: 'fa-image',           label: 'Hình ảnh' },
  file:      { icon: 'fa-paperclip',       label: 'Tài liệu đính kèm' },
  callout:   { icon: 'fa-lightbulb',       label: 'Callout / Lưu ý' },
};

// close block picker when clicking outside
document.addEventListener('click', e => {
  const picker = document.getElementById('block-type-picker');
  if (!picker) return;
  if (!e.target.closest('.block-add-wrap')) picker.style.display = 'none';
});

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
    if (tab.dataset.tab === 'journey')  loadJourneyBuilder();
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
  const titleMap = { 7: '7 ngày', 30: '30 ngày', 90: '90 ngày', 0: 'Tất cả' };
  const el = document.getElementById('chart-daily-title');
  if (el) el.textContent = 'Theo ngày · ' + titleMap[days];
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

function _renderTarget() {}

function switchChartTab(name) {
  document.querySelectorAll('.chart-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.chart === name));
  document.querySelectorAll('.chart-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.chart === name));
  // Force chart resize when becoming visible (Chart.js needs a nudge after display:none → block)
  if (name === 'daily'  && _chartDaily)  _chartDaily.resize();
  if (name === 'source' && _chartSource) _chartSource.resize();
  if (name === 'hour'   && _chartHour)   _chartHour.resize();
}

function _renderDelta(elId, curr, prev) {
  const el = document.getElementById(elId);
  if (!el) return;
  if (prev === 0 && curr === 0) { el.innerHTML = ''; return; }
  if (prev === 0) { el.innerHTML = ''; return; }
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
    let qq = sb.from('quiz_attempts').select('module_id, module_name, pct, passed, created_at, session_id');
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
    let vr = sb.from('page_views').select('module_id, module_name, created_at, session_id');
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

    // ── New KPIs ──────────────────────────────────────────
    // E2E rate: unique session_ids who passed / unique session_ids who viewed
    const viewerSessions = new Set((viewRows||[]).map(r=>r.session_id).filter(Boolean));
    const passerSessions = new Set((quizData||[]).filter(r=>r.passed).map(r=>r.session_id).filter(Boolean));
    const e2eRate = viewerSessions.size ? Math.round(passerSessions.size / viewerSessions.size * 100) : 0;
    document.getElementById('stat-e2e').textContent = e2eRate + '%';
    const hintE2e = document.getElementById('hint-e2e');
    if (hintE2e) hintE2e.textContent = passerSessions.size + '/' + viewerSessions.size + ' học viên';

    // Repeat attempt rate: total attempts / unique quiz takers
    const quizSessions = new Set((quizData||[]).map(r=>r.session_id).filter(Boolean));
    const repeatRate = quizSessions.size ? (qTotal / quizSessions.size).toFixed(1) : null;
    document.getElementById('stat-repeat').textContent = repeatRate ? repeatRate + 'x' : '—';
    const hintRepeat = document.getElementById('hint-repeat');
    if (hintRepeat) hintRepeat.textContent = qTotal + ' lượt / ' + quizSessions.size + ' người';

    // Weekly active learners (always last 7 days, independent of currentDays filter)
    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
    const { data: weekRows } = await sb.from('page_views').select('session_id').gte('created_at', weekAgo);
    const weeklyCount = new Set((weekRows||[]).map(r=>r.session_id).filter(Boolean)).size;
    document.getElementById('stat-weekly').textContent = weeklyCount.toLocaleString('vi');

    // ── Sparklines (last 14 data-points from current filter range) ──
    const SPARK_DAYS = 14;
    _renderSpark('spark-views',  _buildDailyCounts(viewRows,  'created_at', SPARK_DAYS), '#a50064');
    _renderSpark('spark-quiz',   _buildDailyCounts(quizData,  'created_at', SPARK_DAYS), '#7759d2');
    _renderSpark('spark-score',  _buildDailyAvg(quizData, 'created_at', 'pct', SPARK_DAYS), '#ca8a04');
    _renderSpark('spark-pass',   _buildDailyPassRate(quizData, 'created_at', SPARK_DAYS), '#5ea12a');
    _renderSpark('spark-weekly', _buildDailyUnique(viewRows, 'created_at', 'session_id', SPARK_DAYS), '#1c66bb');

    // ── Funnel chart ──────────────────────────────────────
    const totalPasses = (quizData||[]).filter(r=>r.passed).length;
    renderFunnel(viewCount||0, qTotal, totalPasses);

    // ── Top / Bottom modules ──────────────────────────────
    renderTopBottom(_lastModStats);

    // ── Module table ──────────────────────────────────────
    const tbody = document.getElementById('module-stats-body');
    if (!_lastModStats.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-cell">Chưa có dữ liệu. Người dùng sẽ xuất hiện khi họ mở module.</td></tr>';
      return;
    }
    tbody.innerHTML = _lastModStats.map(m => {
      const avgQ   = m.attempts ? Math.round(m.pctSum / m.attempts) : null;
      const pRate  = m.attempts ? Math.round((m.passCount / m.attempts) * 100) : null;
      const cls    = avgQ === null ? '' : avgQ >= 75 ? 'good' : avgQ >= 50 ? 'medium' : 'bad';
      const quizRate  = m.views   ? Math.round((m.attempts  / m.views)   * 100) : 0;
      const passRate2 = m.attempts ? Math.round((m.passCount / m.attempts) * 100) : 0;
      const funnel = `<div class="funnel-mini">
        <span class="funnel-step" title="Xem module">👁 ${m.views}</span>
        <span class="funnel-arrow">→</span>
        <span class="funnel-step ${quizRate >= 50 ? 'good' : 'low'}" title="Tỉ lệ làm quiz">📝 ${quizRate}%</span>
        <span class="funnel-arrow">→</span>
        <span class="funnel-step ${passRate2 >= 75 ? 'good' : passRate2 >= 50 ? 'med' : 'low'}" title="Tỉ lệ qua quiz">✅ ${passRate2}%</span>
      </div>`;
      return `<tr onclick="openDrilldown(${JSON.stringify(m.id)},${JSON.stringify(m.name)})">
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
//  SPARKLINE HELPERS
// ══════════════════════════════════════════════════════════
function _buildDailyCounts(rows, dateField, days) {
  const buckets = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  (rows||[]).forEach(r => { const k = (r[dateField]||'').slice(0,10); if (k in buckets) buckets[k]++; });
  return Object.values(buckets);
}

function _buildDailyAvg(rows, dateField, valField, days) {
  const sums = {}, cnts = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = d.toISOString().slice(0, 10); sums[k] = 0; cnts[k] = 0;
  }
  (rows||[]).forEach(r => {
    const k = (r[dateField]||'').slice(0,10);
    if (k in sums) { sums[k] += r[valField]||0; cnts[k]++; }
  });
  return Object.keys(sums).map(k => cnts[k] ? Math.round(sums[k]/cnts[k]) : 0);
}

function _buildDailyPassRate(rows, dateField, days) {
  const totals = {}, passes = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = d.toISOString().slice(0, 10); totals[k] = 0; passes[k] = 0;
  }
  (rows||[]).forEach(r => {
    const k = (r[dateField]||'').slice(0,10);
    if (k in totals) { totals[k]++; if (r.passed) passes[k]++; }
  });
  return Object.keys(totals).map(k => totals[k] ? Math.round(passes[k]/totals[k]*100) : 0);
}

function _buildDailyUnique(rows, dateField, idField, days) {
  const sets = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    sets[d.toISOString().slice(0, 10)] = new Set();
  }
  (rows||[]).forEach(r => {
    const k = (r[dateField]||'').slice(0,10);
    if (k in sets && r[idField]) sets[k].add(r[idField]);
  });
  return Object.values(sets).map(s => s.size);
}

function _renderSpark(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (_sparkCharts[canvasId]) { _sparkCharts[canvasId].destroy(); delete _sparkCharts[canvasId]; }
  const ctx = canvas.getContext('2d');
  _sparkCharts[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data,
        borderColor: color,
        backgroundColor: color + '18',
        borderWidth: 1.5,
        pointRadius: 0,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false, beginAtZero: true } },
      animation: { duration: 400 },
    }
  });
}

// ══════════════════════════════════════════════════════════
//  FUNNEL CHART
// ══════════════════════════════════════════════════════════
function renderFunnel(views, quizAttempts, passes) {
  const canvas = document.getElementById('chart-funnel');
  if (!canvas) return;
  if (_chartFunnel) { _chartFunnel.destroy(); _chartFunnel = null; }
  const ctx = canvas.getContext('2d');
  const maxVal = views || 1;
  _chartFunnel = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Lượt xem', 'Làm quiz', 'Đạt quiz'],
      datasets: [{
        data: [views, quizAttempts, passes],
        backgroundColor: ['#a5006499', '#7759d299', '#5ea12a99'],
        borderColor:     ['#a50064',   '#7759d2',   '#5ea12a'],
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 5.5,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: {
          label: ctx => {
            const pct = Math.round(ctx.raw / maxVal * 100);
            return ' ' + ctx.raw.toLocaleString('vi') + ' (' + pct + '%)';
          }
        }}
      },
      scales: {
        x: { display: false, beginAtZero: true, max: maxVal * 1.05 },
        y: { grid: { display: false }, ticks: { font: { size: 12, weight: '600' }, color: '#475569' } }
      }
    }
  });
}

// ══════════════════════════════════════════════════════════
//  TOP / BOTTOM MODULES
// ══════════════════════════════════════════════════════════
function renderTopBottom(modStats) {
  const el = document.getElementById('top-bottom-modules');
  if (!el) return;
  const valid = modStats.filter(m => m.views > 0);
  if (!valid.length) {
    el.innerHTML = '<div style="padding:20px;color:var(--text-tertiary);font-size:13px">Chưa có dữ liệu</div>';
    return;
  }

  // Top 3 by views
  const byViews = [...valid].sort((a, b) => b.views - a.views);
  const top3 = byViews.slice(0, 3);
  const maxViews = top3[0]?.views || 1;

  // Bottom 3 by pass rate (only modules with quiz attempts)
  const withQuiz = valid.filter(m => m.attempts > 0);
  const byPassRate = [...withQuiz].sort((a, b) => {
    const pa = Math.round(a.passCount / a.attempts * 100);
    const pb = Math.round(b.passCount / b.attempts * 100);
    return pa - pb;
  });
  const bot3 = byPassRate.slice(0, 3);

  const topHtml = top3.map((m, i) => {
    const w = Math.round(m.views / maxViews * 100);
    return `<div class="tb-row">
      <span class="tb-rank">${i + 1}</span>
      <div class="tb-info"><div class="tb-name" title="${esc(m.name)}">${esc(m.name)}</div></div>
      <div class="tb-bar-wrap"><div class="tb-bar-top" style="width:${w}%"></div></div>
      <span class="tb-views">${m.views}</span>
    </div>`;
  }).join('');

  const botHtml = bot3.length ? bot3.map((m, i) => {
    const rate = Math.round(m.passCount / m.attempts * 100);
    return `<div class="tb-row">
      <span class="tb-rank">${i + 1}</span>
      <div class="tb-info"><div class="tb-name" title="${esc(m.name)}">${esc(m.name)}</div></div>
      <div class="tb-bar-wrap"><div class="tb-bar-bot" style="width:${rate}%"></div></div>
      <span class="tb-views">${rate}%</span>
    </div>`;
  }).join('') : '<div style="font-size:12px;color:var(--text-tertiary);padding:4px 0">Chưa có dữ liệu quiz</div>';

  el.innerHTML = `<div class="tb-wrap">
    <div class="tb-section">
      <div class="tb-label top"><i class="fa-solid fa-arrow-trend-up"></i> Top module (lượt xem)</div>
      ${topHtml}
    </div>
    <hr class="tb-divider">
    <div class="tb-section">
      <div class="tb-label bot"><i class="fa-solid fa-triangle-exclamation"></i> Cần cải thiện (tỉ lệ đạt thấp)</div>
      ${botHtml}
    </div>
  </div>`;
}

// ══════════════════════════════════════════════════════════
//  DRILL-DOWN PANEL
// ══════════════════════════════════════════════════════════
async function openDrilldown(moduleId, moduleName) {
  document.getElementById('drilldown-title').textContent = moduleName;
  document.getElementById('drilldown-sub').textContent   = 'Module ID: ' + moduleId;
  document.getElementById('drilldown-kpis').innerHTML    = '<div style="color:var(--text-tertiary);font-size:13px;padding:4px 0"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</div>';
  document.getElementById('drilldown-overlay').classList.add('open');
  document.getElementById('drilldown-panel').classList.add('open');

  try {
    const since30 = new Date(Date.now() - 30 * 864e5).toISOString();
    const [{ data: views }, { data: quizRows }] = await Promise.all([
      sb.from('page_views').select('created_at').eq('module_id', moduleId).gte('created_at', since30),
      sb.from('quiz_attempts').select('pct, passed, created_at').eq('module_id', moduleId),
    ]);

    const totalViews    = (views||[]).length;
    const totalAttempts = (quizRows||[]).length;
    const passes        = (quizRows||[]).filter(r => r.passed).length;
    const avgScore      = totalAttempts ? Math.round((quizRows||[]).reduce((s,r)=>s+r.pct,0)/totalAttempts) : null;
    const passRate      = totalAttempts ? Math.round(passes/totalAttempts*100) : null;
    const convRate      = totalViews    ? Math.round(totalAttempts/totalViews*100) : null;

    document.getElementById('drilldown-kpis').innerHTML = [
      { val: totalViews,                                          label: 'Lượt xem (30 ngày)' },
      { val: totalAttempts,                                       label: 'Lượt quiz' },
      { val: passes,                                              label: 'Lượt đạt' },
      { val: avgScore  !== null ? avgScore  + '%' : '—',          label: 'Điểm trung bình' },
      { val: passRate  !== null ? passRate  + '%' : '—',          label: 'Tỉ lệ đạt' },
      { val: convRate  !== null ? convRate  + '%' : '—',          label: 'View → Quiz' },
    ].map(k => `<div class="drill-kpi">
      <div class="drill-kpi-val">${k.val}</div>
      <div class="drill-kpi-label">${k.label}</div>
    </div>`).join('');

    // Daily bar chart (30 days)
    const dlabels = [], dcounts = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dlabels.push(d.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit' }));
      dcounts[key] = 0;
    }
    (views||[]).forEach(r => { const k = (r.created_at||'').slice(0,10); if (k in dcounts) dcounts[k]++; });

    const ctxDrill = document.getElementById('chart-drill-daily').getContext('2d');
    if (_chartDrillDaily) { _chartDrillDaily.destroy(); _chartDrillDaily = null; }
    _chartDrillDaily = new Chart(ctxDrill, {
      type: 'bar',
      data: {
        labels: dlabels,
        datasets: [{
          label: 'Lượt xem',
          data: Object.values(dcounts),
          backgroundColor: '#a5006428',
          borderColor: '#a50064',
          borderWidth: 1.5,
          borderRadius: 3,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, maxTicksLimit: 8 } },
          y: { beginAtZero: true, ticks: { precision: 0, font: { size: 10 } }, grid: { color: '#f0f0f4' } }
        }
      }
    });

    // Score distribution
    const buckets = [
      { range: '0–24%',   min:  0, max:  25, count: 0, color: '#ef4444' },
      { range: '25–49%',  min: 25, max:  50, count: 0, color: '#f97316' },
      { range: '50–74%',  min: 50, max:  75, count: 0, color: '#eab308' },
      { range: '75–89%',  min: 75, max:  90, count: 0, color: '#22c55e' },
      { range: '90–100%', min: 90, max: 101, count: 0, color: '#10b981' },
    ];
    (quizRows||[]).forEach(r => {
      const b = buckets.find(b => r.pct >= b.min && r.pct < b.max);
      if (b) b.count++;
    });
    const maxCount = Math.max(...buckets.map(b => b.count), 1);
    document.getElementById('drill-score-dist').innerHTML = '<div class="score-dist">' +
      buckets.map(b => `<div class="score-bucket">
        <span class="score-range">${b.range}</span>
        <div class="score-bar-wrap"><div class="score-bar-fill" style="width:${Math.round(b.count/maxCount*100)}%;background:${b.color}"></div></div>
        <span class="score-count">${b.count}</span>
      </div>`).join('') + '</div>';

  } catch (err) {
    console.error('openDrilldown:', err.message);
    document.getElementById('drilldown-kpis').innerHTML = '<div style="color:var(--red);font-size:13px">Lỗi tải dữ liệu: ' + esc(err.message) + '</div>';
  }
}

function closeDrilldown() {
  document.getElementById('drilldown-overlay').classList.remove('open');
  document.getElementById('drilldown-panel').classList.remove('open');
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
        maintainAspectRatio: true,
        aspectRatio: 3.2,
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

  const today    = new Date().toLocaleDateString('vi-VN');
  const dayLabel = currentDays === 0 ? 'Tất cả thời gian' : currentDays + ' ngày gần nhất';

  const q = v => '"' + String(v === '' || v == null ? '—' : v).replace(/"/g, '""') + '"';

  const meta = [
    ['Báo cáo Mentora LMS', '', '', '', '', '', '', ''],
    ['Ngày xuất', today, '', '', '', '', '', ''],
    ['Khoảng thời gian', dayLabel, '', '', '', '', '', ''],
    [],
  ];

  const header = [
    'Module ID',
    'Tên Module',
    'Danh mục',
    'Lượt xem',
    'Lượt làm quiz',
    'Điểm trung bình (%)',
    'Tỉ lệ đạt (%)',
    'Tỉ lệ chuyển đổi view→quiz (%)',
  ];

  const rows = _lastModStats.map(m => {
    const avgScore  = m.attempts ? Math.round(m.pctSum / m.attempts) + '%'  : '—';
    const passRate  = m.attempts ? Math.round((m.passCount / m.attempts) * 100) + '%' : '—';
    const convRate  = m.views    ? Math.round((m.attempts / m.views) * 100) + '%' : '0%';
    return [m.id, m.name, m.category, m.views, m.attempts, avgScore, passRate, convRate];
  });

  const allRows = [...meta, header, ...rows];
  const csv  = allRows.map(r => r.length ? r.map(q).join(',') : '').join('\n');
  const bom  = '﻿';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href: url,
    download: 'mentora-stats-' + new Date().toISOString().slice(0, 10) + '.csv',
  });
  a.click();
  URL.revokeObjectURL(url);
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

async function _fetchCmsModuleRows() {
  const { data, error } = await sb.from('modules_cms')
    .select('id,data,updated_at,status,sort_order')
    .order('sort_order', { ascending: true })
    .order('updated_at',  { ascending: false });
  if (error) {
    if (error.message && (error.message.includes('sort_order') || error.message.includes('status'))) {
      const fallback = await sb.from('modules_cms').select('id,data,updated_at').order('updated_at', { ascending: false });
      if (fallback.error) throw fallback.error;
      return (fallback.data || []).map(row => ({ ...row, status: 'published', sort_order: null }));
    }
    throw error;
  }
  return data || [];
}

function _parseModuleData(row) {
  if (!row || !row.data) return {};
  return typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
}

async function _getJourneyItems() {
  const cmsRows = await _fetchCmsModuleRows();
  const cmsById = new Map((cmsRows || []).map(row => [row.id, row]));
  const seen = new Set();
  const items = [];

  localModules.forEach((mod, idx) => {
    const cms = cmsById.get(mod.id);
    const data = cms ? _parseModuleData(cms) : mod;
    seen.add(mod.id);
    items.push({
      id: mod.id,
      data: Object.assign({}, mod, data),
      status: cms ? (cms.status || 'published') : 'published',
      sort_order: cms && cms.sort_order != null ? cms.sort_order : idx * 10,
      source: cms ? 'CMS + JSON' : 'JSON',
    });
  });

  cmsRows.filter(row => !seen.has(row.id)).forEach((row, idx) => {
    const data = _parseModuleData(row);
    items.push({
      id: row.id,
      data: Object.assign({ id: row.id }, data),
      status: row.status || 'published',
      sort_order: row.sort_order != null ? row.sort_order : (localModules.length + idx) * 10,
      source: 'CMS',
    });
  });

  return items.sort((a, b) => {
    const ao = a.sort_order == null ? 9999 : a.sort_order;
    const bo = b.sort_order == null ? 9999 : b.sort_order;
    if (ao !== bo) return ao - bo;
    return String(a.id).localeCompare(String(b.id));
  });
}

async function loadJourneyBuilder() {
  const builder = document.getElementById('journey-builder');
  const preview = document.getElementById('journey-preview');
  if (!builder || !preview) return;
  builder.innerHTML = '<div class="loading-cell"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</div>';
  preview.innerHTML = '';
  try {
    _journeyItems = await _getJourneyItems();
    document.getElementById('journey-module-count').textContent = '(' + _journeyItems.length + ' modules)';
    renderJourneyBuilder();
  } catch (err) {
    builder.innerHTML = '<div class="empty-cell" style="color:#e5303f">Lỗi: ' + esc(err.message) + '</div>';
  }
}

function renderJourneyBuilder() {
  const builder = document.getElementById('journey-builder');
  const preview = document.getElementById('journey-preview');
  if (!builder || !preview) return;
  if (!_journeyItems.length) {
    builder.innerHTML = '<div class="empty-cell">Chưa có module để tạo lộ trình.</div>';
    preview.innerHTML = '';
    return;
  }

  const catMap = { Policy: 'badge-policy', Process: 'badge-process', Safety: 'badge-safety' };
  builder.innerHTML = _journeyItems.map((item, idx) => {
    const mod = item.data || {};
    const prereqs = Array.isArray(mod.prerequisites) ? mod.prerequisites : [];
    const options = _journeyItems
      .filter(opt => opt.id !== item.id)
      .map(opt => {
        const selected = prereqs.includes(opt.id) ? ' selected' : '';
        return `<option value="${esc(opt.id)}"${selected}>${esc(opt.data.name || opt.id)}</option>`;
      }).join('');
    return `<div class="journey-item" draggable="true" data-id="${esc(item.id)}">
      <div class="journey-drag"><i class="fa-solid fa-grip-vertical"></i></div>
      <div class="journey-index">${idx + 1}</div>
      <div class="journey-icon"><img src="${esc(mod.icon || '/assets/icons/education.png')}" alt=""></div>
      <div class="journey-info">
        <div class="journey-name">${esc(mod.name || item.id)}</div>
        <div class="journey-meta">
          <span class="badge ${catMap[mod.category] || ''}">${esc(mod.category || 'Module')}</span>
          <span class="journey-source">${esc(item.source)}</span>
          ${prereqs.length ? '<span class="journey-prereq"><i class="fa-solid fa-lock"></i> Sau ' + esc(prereqs.join(', ')) + '</span>' : '<span class="journey-prereq open"><i class="fa-solid fa-unlock"></i> Điểm bắt đầu</span>'}
        </div>
        <label class="journey-deps">
          <span>Dieu kien mo khoa</span>
          <select class="journey-prereq-select" multiple aria-label="Chon module dieu kien cho ${esc(mod.name || item.id)}">
            ${options}
          </select>
        </label>
      </div>
    </div>`;
  }).join('');

  renderJourneyPreview();

  builder.querySelectorAll('.journey-item').forEach(item => {
    item.addEventListener('dragstart', onJourneyDragStart);
    item.addEventListener('dragover', onJourneyDragOver);
    item.addEventListener('drop', onJourneyDrop);
    item.addEventListener('dragend', onJourneyDragEnd);
  });
  builder.querySelectorAll('.journey-prereq-select').forEach(select => {
    select.addEventListener('change', function () {
      const id = this.closest('.journey-item').dataset.id;
      const target = _journeyItems.find(item => item.id === id);
      if (!target) return;
      target.data.prerequisites = Array.from(this.selectedOptions).map(opt => opt.value);
      renderJourneyPreview();
    });
  });
}

function renderJourneyPreview() {
  const preview = document.getElementById('journey-preview');
  if (!preview) return;
  preview.innerHTML = _journeyItems.map((item, idx) => {
    const mod = item.data || {};
    const prereqs = Array.isArray(mod.prerequisites) ? mod.prerequisites : [];
    const prereqNames = prereqs.map(id => {
      const found = _journeyItems.find(x => x.id === id);
      return found ? (found.data.name || id) : id;
    });
    return `<div class="journey-preview-node">
      <span class="journey-preview-step">${idx + 1}</span>
      <span class="journey-preview-title">${esc(mod.name || item.id)}</span>
      <span class="journey-preview-rule ${prereqs.length ? '' : 'open'}">
        <i class="fa-solid ${prereqs.length ? 'fa-lock' : 'fa-unlock'}"></i>
        ${prereqs.length ? 'Mo sau: ' + esc(prereqNames.join(', ')) : 'Diem bat dau'}
      </span>
    </div>`;
  }).join('');
}

function syncJourneyDepsFromForm(linearLock) {
  if (linearLock) {
    _journeyItems.forEach((item, idx) => {
      item.data.prerequisites = idx > 0 ? [_journeyItems[idx - 1].id] : [];
    });
    return;
  }
  document.querySelectorAll('.journey-item').forEach(el => {
    const item = _journeyItems.find(x => x.id === el.dataset.id);
    const select = el.querySelector('.journey-prereq-select');
    if (item && select) item.data.prerequisites = Array.from(select.selectedOptions).map(opt => opt.value);
  });
}

function onJourneyDragStart(e) {
  _journeyDragId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', _journeyDragId);
}

function onJourneyDragOver(e) {
  e.preventDefault();
  const target = e.currentTarget;
  if (!target || target.dataset.id === _journeyDragId) return;
  document.querySelectorAll('.journey-item.drop-before, .journey-item.drop-after').forEach(el => {
    el.classList.remove('drop-before', 'drop-after');
  });
  const rect = target.getBoundingClientRect();
  target.classList.add(e.clientY < rect.top + rect.height / 2 ? 'drop-before' : 'drop-after');
}

function onJourneyDrop(e) {
  e.preventDefault();
  const targetId = e.currentTarget.dataset.id;
  const fromIdx = _journeyItems.findIndex(item => item.id === _journeyDragId);
  const targetIdx = _journeyItems.findIndex(item => item.id === targetId);
  if (fromIdx < 0 || targetIdx < 0 || fromIdx === targetIdx) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const after = e.clientY >= rect.top + rect.height / 2;
  const moved = _journeyItems.splice(fromIdx, 1)[0];
  let insertIdx = _journeyItems.findIndex(item => item.id === targetId);
  if (after) insertIdx += 1;
  _journeyItems.splice(insertIdx, 0, moved);
  renderJourneyBuilder();
}

function onJourneyDragEnd() {
  _journeyDragId = null;
  document.querySelectorAll('.journey-item').forEach(el => {
    el.classList.remove('dragging', 'drop-before', 'drop-after');
  });
}

async function saveJourneyOrder() {
  if (!_journeyItems.length) return;
  const btn = document.getElementById('btn-save-journey');
  const oldHtml = btn.innerHTML;
  const linearLock = document.getElementById('journey-linear-lock').checked;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Đang lưu...';
  try {
    syncJourneyDepsFromForm(linearLock);
    const updates = _journeyItems.map((item, idx) => {
      const data = Object.assign({}, item.data || {}, { id: item.id });
      data.prerequisites = Array.isArray(data.prerequisites) ? data.prerequisites : [];
      return {
        id: item.id,
        data: JSON.stringify(data),
        status: item.status || 'published',
        sort_order: (idx + 1) * 10,
      };
    });
    const { error } = await sb.from('modules_cms').upsert(updates, { onConflict: 'id' });
    if (error) throw error;
    showToast('Đã lưu lộ trình học tập', 'success');
    await loadJourneyBuilder();
    loadCmsModules();
  } catch (err) {
    showToast('Lỗi lưu lộ trình: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = oldHtml;
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

// ══════════════════════════════════════════════════════════
//  MODULE PREVIEW MODAL
// ══════════════════════════════════════════════════════════
async function previewModule(id) {
  // Load module data
  let mod = null;
  try {
    const { data } = await sb.from('modules_cms').select('data,status').eq('id', id).single();
    if (data) mod = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
  } catch {}
  if (!mod) mod = localModules.find(m => m.id === id);
  if (!mod) { showToast('Không tìm thấy module', 'error'); return; }

  document.getElementById('preview-module-name').textContent = mod.name || id;
  document.getElementById('preview-doc').innerHTML = _buildPreviewHtml(mod);
  document.getElementById('modal-preview').style.display = '';
  setPreviewDevice('desktop');
}

function closePreview() {
  document.getElementById('modal-preview').style.display = 'none';
}

function setPreviewDevice(mode) {
  const vp = document.getElementById('preview-viewport');
  vp.dataset.device = mode;
  document.getElementById('pvw-btn-desktop').classList.toggle('active', mode === 'desktop');
  document.getElementById('pvw-btn-mobile').classList.toggle('active', mode === 'mobile');
}

function _buildPreviewHtml(mod) {
  const catColors = { Policy: '#a50064', Process: '#1c66bb', Safety: '#f6c315' };
  const catBg     = { Policy: 'rgba(165,0,100,.1)', Process: 'rgba(28,102,187,.1)', Safety: 'rgba(246,195,21,.15)' };
  const lvlColors = { 'Bắt buộc': '#e5303f', 'Theo phòng ban': '#1c66bb', 'Tự nguyện': '#5ea12a' };
  const cat = mod.category || '';
  const lvl = mod.level || '';

  let html = '';

  // ── Hero header ──
  html += `<div class="pvw-hero">
    <div class="pvw-hero-meta">
      <span class="pvw-badge" style="background:${catBg[cat]||'#f3f4f6'};color:${catColors[cat]||'#374151'}">${esc(cat)}</span>
      <span class="pvw-badge" style="background:rgba(229,48,63,.08);color:${lvlColors[lvl]||'#374151'}">${esc(lvl)}</span>
      ${mod.duration ? `<span class="pvw-badge-ghost"><i class="fa-regular fa-clock"></i> ${esc(mod.duration)}</span>` : ''}
    </div>
    <h1 class="pvw-title">${esc(mod.name || '')}</h1>
    ${mod.subtitle ? `<p class="pvw-subtitle">${esc(mod.subtitle)}</p>` : ''}
    ${mod.owner ? `<div class="pvw-owner"><i class="fa-solid fa-user-tie"></i> ${esc(mod.owner)}</div>` : ''}
  </div>`;

  // ── Content blocks (new format) ──
  if (mod.content_blocks && mod.content_blocks.length > 0) {
    html += _previewRenderBlocks(mod.content_blocks);
  } else {
    // Legacy steps
    if (mod.steps && mod.steps.length) {
      html += '<div class="pvw-section-title"><i class="fa-solid fa-list-check"></i> Nội dung & Quy trình</div>';
      html += mod.steps.map((s, i) =>
        `<div class="pvw-step">
          <div class="pvw-step-num">${i + 1}</div>
          <div class="pvw-step-body">
            <div class="pvw-step-title">${esc(s.title || '')}</div>
            <div class="pvw-step-desc">${esc(s.desc || '')}</div>
            ${s.note ? `<div class="pvw-note"><i class="fa-solid fa-circle-info"></i> ${esc(s.note)}</div>` : ''}
          </div>
        </div>`
      ).join('');
    }
    // Legacy video
    if (mod.videoUrl) {
      const safe = mod.videoUrl.includes('youtube.com/embed') ? mod.videoUrl : '';
      if (safe) html += `<div class="pvw-video-wrap"><iframe src="${esc(safe)}" allowfullscreen></iframe></div>`;
    }
    // Legacy quiz
    if (mod.quiz && mod.quiz.length) {
      html += '<div class="pvw-section-title"><i class="fa-solid fa-circle-question"></i> Kiểm tra</div>';
      html += mod.quiz.map((q, qi) =>
        `<div class="pvw-quiz-card">
          <div class="pvw-quiz-num">Câu ${qi + 1}</div>
          <div class="pvw-quiz-q">${esc(q.question || '')}</div>
          <div class="pvw-quiz-opts">
            ${(q.options || []).map((opt, oi) =>
              `<div class="pvw-quiz-opt ${oi === q.correct ? 'correct' : ''}">
                <span class="pvw-opt-key">${'ABCD'[oi]}</span> ${esc(opt)}
                ${oi === q.correct ? '<i class="fa-solid fa-check" style="color:#5ea12a;margin-left:auto"></i>' : ''}
              </div>`
            ).join('')}
          </div>
          ${q.explanation ? `<div class="pvw-explanation"><i class="fa-solid fa-lightbulb"></i> ${esc(q.explanation)}</div>` : ''}
        </div>`
      ).join('');
    }
  }

  return html;
}

function _previewRenderBlocks(blocks) {
  let html = '';
  blocks.forEach(block => {
    const d = block.data || {};
    switch (block.type) {

      case 'text':
        if (d.content) {
          const paras = String(d.content).split('\n').filter(l => l.trim());
          html += '<div class="pvw-text">' + paras.map(p => `<p>${esc(p)}</p>`).join('') + '</div>';
        }
        break;

      case 'steps':
        if (d.items && d.items.length) {
          html += '<div class="pvw-section-title"><i class="fa-solid fa-list-check"></i> Quy trình</div>';
          d.items.forEach((s, i) => {
            html += `<div class="pvw-step">
              <div class="pvw-step-num">${i + 1}</div>
              <div class="pvw-step-body">
                <div class="pvw-step-title">${esc(s.title || '')}</div>
                ${s.desc ? `<div class="pvw-step-desc">${esc(s.desc)}</div>` : ''}
                ${s.note ? `<div class="pvw-note"><i class="fa-solid fa-circle-info"></i> ${esc(s.note)}</div>` : ''}
              </div>
            </div>`;
          });
        }
        break;

      case 'checklist':
        if (d.items && d.items.length) {
          html += '<div class="pvw-checklist">' +
            d.items.map(item => `<div class="pvw-cl-item"><i class="fa-regular fa-square-check"></i><span>${esc(item.text || '')}</span></div>`).join('') +
          '</div>';
        }
        break;

      case 'quiz':
        if (d.questions && d.questions.length) {
          html += '<div class="pvw-section-title"><i class="fa-solid fa-circle-question"></i> Kiểm tra</div>';
          d.questions.forEach((q, qi) => {
            html += `<div class="pvw-quiz-card">
              <div class="pvw-quiz-num">Câu ${qi + 1}</div>
              <div class="pvw-quiz-q">${esc(q.question || '')}</div>
              <div class="pvw-quiz-opts">
                ${(q.options || []).map((opt, oi) =>
                  `<div class="pvw-quiz-opt ${oi === q.correct ? 'correct' : ''}">
                    <span class="pvw-opt-key">${'ABCD'[oi]}</span> ${esc(opt)}
                    ${oi === q.correct ? '<i class="fa-solid fa-check" style="color:#5ea12a;margin-left:auto"></i>' : ''}
                  </div>`
                ).join('')}
              </div>
              ${q.explanation ? `<div class="pvw-explanation"><i class="fa-solid fa-lightbulb"></i> ${esc(q.explanation)}</div>` : ''}
            </div>`;
          });
        }
        break;

      case 'video':
        if (d.url && d.url.includes('youtube.com/embed')) {
          html += `<div class="pvw-block-label">${d.title ? esc(d.title) : 'Video'}</div>
            <div class="pvw-video-wrap"><iframe src="${esc(d.url)}" allowfullscreen></iframe></div>`;
        }
        break;

      case 'image':
        if (d.url) {
          html += `<div class="pvw-image">
            <img src="${esc(d.url)}" alt="${esc(d.caption || '')}" loading="lazy">
            ${d.caption ? `<div class="pvw-image-caption">${esc(d.caption)}</div>` : ''}
          </div>`;
        }
        break;

      case 'file':
        html += `<div class="pvw-file">
          <i class="fa-solid fa-paperclip"></i>
          <span>${esc(d.name || 'Tài liệu')}</span>
          ${d.size ? `<span class="pvw-file-size">${esc(d.size)}</span>` : ''}
          ${d.url ? `<a href="${esc(d.url)}" target="_blank" rel="noopener" class="pvw-file-dl"><i class="fa-solid fa-download"></i></a>` : ''}
        </div>`;
        break;

      case 'callout': {
        const icons = { info: 'fa-circle-info', warning: 'fa-triangle-exclamation', tip: 'fa-lightbulb', danger: 'fa-circle-xmark' };
        const v = d.variant || 'info';
        html += `<div class="pvw-callout pvw-callout--${v}">
          <i class="fa-solid ${icons[v] || 'fa-circle-info'}"></i>
          <div>
            ${d.title ? `<div class="pvw-callout-title">${esc(d.title)}</div>` : ''}
            ${d.text  ? `<div class="pvw-callout-text">${esc(d.text)}</div>` : ''}
          </div>
        </div>`;
        break;
      }
    }
  });
  return html;
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
// ════════════════════════════════════════
//  SITE SETTINGS
// ════════════════════════════════════════
async function loadSiteSettingsAdmin() {
  try {
    const { data, error } = await sb.from('site_settings').select('key,value');
    if (error) throw error;
    const map = {};
    (data || []).forEach(r => { map[r.key] = r.value; });

    const chk = document.getElementById('toggle-modules-visible');
    const status = document.getElementById('status-modules-visible');
    if (chk) {
      const on = map['modules_section_visible'] === 'true';
      chk.checked = on;
      if (status) status.textContent = on ? 'Đang hiển thị' : 'Đang ẩn';
    }
  } catch (e) {
    const status = document.getElementById('status-modules-visible');
    if (status) status.textContent = 'Lỗi kết nối';
  }
}

async function saveSetting(key, value) {
  const strVal = String(value);
  try {
    const { error } = await sb.from('site_settings')
      .upsert({ key, value: strVal, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;

    // Update status label
    const status = document.getElementById('status-' + key.replace(/_/g, '-'));
    if (status) status.textContent = value === true || value === 'true' ? 'Đang hiển thị' : 'Đang ẩn';

    // Flash save message
    const msg = document.getElementById('settings-save-msg');
    if (msg) {
      msg.style.display = 'flex';
      clearTimeout(msg._t);
      msg._t = setTimeout(() => { msg.style.display = 'none'; }, 2500);
    }
  } catch (e) {
    alert('Lỗi lưu cài đặt: ' + e.message);
  }
}

// Load settings when tab is opened
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('atab-settings')?.addEventListener('click', loadSiteSettingsAdmin);
});

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
// ══════════════════════════════════════════════════════════
//  BLOCK EDITOR
// ══════════════════════════════════════════════════════════

function toggleBlockPicker(e) {
  if (e) e.stopPropagation();
  const picker = document.getElementById('block-type-picker');
  picker.style.display = picker.style.display === 'none' ? '' : 'none';
}

function _updateEmptyHint() {
  const container = document.getElementById('content-blocks-builder');
  const hint = document.getElementById('blocks-empty-hint');
  if (!hint) return;
  hint.style.display = container.querySelectorAll('.block-item').length === 0 ? '' : 'none';
}

function addBlock(type, data) {
  const blockId = genBlockId();
  const meta = BLOCK_META[type] || { icon: 'fa-cube', label: type };
  const div = document.createElement('div');
  div.className = 'block-item';
  div.dataset.blockId = blockId;
  div.dataset.blockType = type;
  div.innerHTML =
    '<div class="block-arrows">'
    +   '<button class="block-arrow-btn" onclick="_moveBlock(this,-1)" title="Lên"><i class="fa-solid fa-chevron-up"></i></button>'
    +   '<button class="block-arrow-btn" onclick="_moveBlock(this,1)" title="Xuống"><i class="fa-solid fa-chevron-down"></i></button>'
    + '</div>'
    + '<div class="block-inner">'
    +   '<div class="block-type-label"><i class="fa-solid ' + meta.icon + '"></i> ' + meta.label + '</div>'
    +   '<div class="block-editor-content">' + _buildBlockEditor(type, blockId, data) + '</div>'
    + '</div>'
    + '<button class="block-remove" onclick="_removeBlock(this)" title="Xóa block"><i class="fa-solid fa-xmark"></i></button>';
  _setupAutoResize(div);
  document.getElementById('content-blocks-builder').appendChild(div);
  _updateEmptyHint();
  return div;
}

function _removeBlock(btn) {
  btn.closest('.block-item').remove();
  _updateEmptyHint();
}

function _buildBlockEditor(type, blockId, data) {
  const d = data || {};
  switch (type) {

    case 'text':
      return '<div class="form-group"><label>Nội dung</label>'
        + '<textarea class="block-data-content" rows="5" placeholder="Nhập nội dung...">'
        + esc(d.content || '') + '</textarea></div>';

    case 'steps':
      return '<div class="steps-block-items" id="sbi-' + blockId + '">'
        + (d.items || []).map((item, i) => _stepItemHtml(i + 1, item)).join('')
        + '</div>'
        + '<button class="btn-sm btn-block-sub" onclick="addStepItem(\'' + blockId + '\')">'
        + '<i class="fa-solid fa-plus"></i> Thêm bước</button>';

    case 'checklist':
      return '<div class="checklist-block-items" id="cli-' + blockId + '">'
        + (d.items || []).map(item => _checklistItemHtml(item)).join('')
        + '</div>'
        + '<button class="btn-sm btn-block-sub" onclick="addChecklistItem(\'' + blockId + '\')">'
        + '<i class="fa-solid fa-plus"></i> Thêm mục</button>';

    case 'quiz':
      return '<div class="quiz-block-questions" id="qbi-' + blockId + '">'
        + (d.questions || []).map((q, i) => _quizItemHtml(i + 1, q)).join('')
        + '</div>'
        + '<button class="btn-sm btn-block-sub" onclick="addQuizItem(\'' + blockId + '\')">'
        + '<i class="fa-solid fa-plus"></i> Thêm câu hỏi</button>';

    case 'video':
      return '<div class="form-group"><label>Tiêu đề video (tùy chọn)</label>'
        + '<input type="text" class="block-data-title" placeholder="Giới thiệu nội dung..." value="' + esc(d.title || '') + '"></div>'
        + '<div class="form-group"><label>URL YouTube Embed *</label>'
        + '<input type="text" class="block-data-url" placeholder="https://www.youtube.com/embed/..." value="' + esc(d.url || '') + '"></div>';

    case 'image':
      return '<div class="form-group"><label>URL hình ảnh *</label>'
        + '<input type="text" class="block-data-url" placeholder="https://..." value="' + esc(d.url || '') + '"></div>'
        + '<div class="form-group"><label>Caption (tùy chọn)</label>'
        + '<input type="text" class="block-data-caption" placeholder="Mô tả hình..." value="' + esc(d.caption || '') + '"></div>';

    case 'file': {
      const ft = d.type || 'pdf';
      return '<div class="form-group"><label>Tên tài liệu *</label>'
        + '<input type="text" class="block-data-name" placeholder="Chính sách ABC.pdf" value="' + esc(d.name || '') + '"></div>'
        + '<div class="form-group"><label>URL tải xuống</label>'
        + '<input type="text" class="block-data-url" placeholder="https://..." value="' + esc(d.url || '') + '"></div>'
        + '<div class="block-file-meta">'
        + '<div class="form-group"><label>Loại file</label><select class="block-data-type">'
        + ['pdf','pptx','doc','video'].map(v => '<option value="' + v + '"' + (ft === v ? ' selected' : '') + '>' + v.toUpperCase() + '</option>').join('')
        + '</select></div>'
        + '<div class="form-group"><label>Dung lượng</label>'
        + '<input type="text" class="block-data-size" placeholder="2.4 MB" value="' + esc(d.size || '') + '"></div>'
        + '</div>';
    }

    case 'callout': {
      const cv = d.variant || 'info';
      return '<div class="callout-editor-meta">'
        + '<div class="form-group"><label>Loại</label><select class="block-data-variant">'
        + [['info','ℹ️ Info'],['warning','⚠️ Warning'],['tip','💡 Tip'],['danger','🔴 Danger']]
            .map(([v,l]) => '<option value="' + v + '"' + (cv === v ? ' selected' : '') + '>' + l + '</option>').join('')
        + '</select></div>'
        + '<div class="form-group"><label>Tiêu đề (tùy chọn)</label>'
        + '<input type="text" class="block-data-title" placeholder="Lưu ý quan trọng" value="' + esc(d.title || '') + '"></div>'
        + '</div>'
        + '<div class="form-group"><label>Nội dung</label>'
        + '<textarea class="block-data-text" rows="2" placeholder="Nội dung callout...">' + esc(d.text || '') + '</textarea></div>';
    }

    default: return '<p style="color:var(--text-tertiary)">Block type không xác định.</p>';
  }
}

// ── Sub-item builders ─────────────────────────────────────

function _stepItemHtml(n, data) {
  const d = data || {};
  return '<div class="step-block-item">'
    + '<div class="sbi-header"><span class="step-builder-num">Bước ' + n + '</span>'
    + '<button class="item-remove" onclick="this.closest(\'.step-block-item\').remove()"><i class="fa-solid fa-xmark"></i></button></div>'
    + '<div class="form-group"><label>Tiêu đề *</label>'
    + '<input type="text" class="step-item-title" placeholder="Tiêu đề bước..." value="' + esc(d.title || '') + '"></div>'
    + '<div class="form-group"><label>Nội dung</label>'
    + '<textarea class="step-item-desc" rows="3" placeholder="Mô tả chi tiết...">' + esc(d.desc || '') + '</textarea></div>'
    + '<div class="form-group"><label>Lưu ý (tùy chọn)</label>'
    + '<input type="text" class="step-item-note" placeholder="Ghi chú cảnh báo..." value="' + esc(d.note || '') + '"></div>'
    + '</div>';
}

function _checklistItemHtml(data) {
  return '<div class="checklist-block-item">'
    + '<i class="fa-regular fa-square" style="color:var(--text-tertiary);flex-shrink:0;margin-top:2px"></i>'
    + '<div class="form-group" style="flex:1;margin:0">'
    + '<input type="text" class="cl-item-text" placeholder="Nội dung mục..." value="' + esc((data || {}).text || '') + '"></div>'
    + '<button class="item-remove" style="position:static;margin-left:4px" onclick="this.closest(\'.checklist-block-item\').remove()"><i class="fa-solid fa-xmark"></i></button>'
    + '</div>';
}

function _quizItemHtml(n, data) {
  const d = data || {};
  const opts = d.options || ['','','',''];
  const correct = d.correct || 0;
  const labels = ['A','B','C','D'];
  return '<div class="quiz-block-item">'
    + '<div class="sbi-header"><span class="step-builder-num">Câu ' + n + '</span>'
    + '<button class="item-remove" onclick="this.closest(\'.quiz-block-item\').remove()"><i class="fa-solid fa-xmark"></i></button></div>'
    + '<div class="form-group"><label>Câu hỏi *</label>'
    + '<input type="text" class="qi-question" value="' + esc(d.question || '') + '"></div>'
    + '<div class="quiz-options-grid">'
    + labels.map((l, i) =>
        '<div class="quiz-option-row"><div class="quiz-option-key">' + l + '</div>'
        + '<div class="form-group" style="flex:1;margin:0"><input type="text" class="qi-option" value="' + esc(opts[i] || '') + '"></div></div>'
      ).join('')
    + '</div>'
    + '<div class="form-group correct-select"><label>Đáp án đúng</label><select class="qi-correct">'
    + labels.map((l, i) => '<option value="' + i + '"' + (correct === i ? ' selected' : '') + '>Đáp án ' + l + '</option>').join('')
    + '</select></div>'
    + '<div class="form-group"><label>Giải thích</label>'
    + '<textarea class="qi-explanation" rows="2">' + esc(d.explanation || '') + '</textarea></div>'
    + '</div>';
}

function addStepItem(blockId) {
  const container = document.getElementById('sbi-' + blockId);
  if (!container) return;
  const n = container.querySelectorAll('.step-block-item').length + 1;
  container.insertAdjacentHTML('beforeend', _stepItemHtml(n, null));
  container.querySelectorAll('.step-block-item:last-child textarea').forEach(ta => {
    ta.addEventListener('input', () => _autoResizeTextarea(ta));
    _autoResizeTextarea(ta);
  });
  container.querySelector('.step-block-item:last-child .step-item-title')?.focus();
}

function addChecklistItem(blockId) {
  const container = document.getElementById('cli-' + blockId);
  if (!container) return;
  container.insertAdjacentHTML('beforeend', _checklistItemHtml(null));
  container.querySelector('.checklist-block-item:last-child .cl-item-text')?.focus();
}

function addQuizItem(blockId) {
  const container = document.getElementById('qbi-' + blockId);
  if (!container) return;
  const n = container.querySelectorAll('.quiz-block-item').length + 1;
  container.insertAdjacentHTML('beforeend', _quizItemHtml(n, null));
  container.querySelectorAll('.quiz-block-item:last-child textarea').forEach(ta => {
    ta.addEventListener('input', () => _autoResizeTextarea(ta));
    _autoResizeTextarea(ta);
  });
  container.querySelector('.quiz-block-item:last-child .qi-question')?.focus();
}

// ── Move block up / down ──────────────────────────────────
function _moveBlock(btn, dir) {
  const block = btn.closest('.block-item');
  const container = block.parentNode;
  if (dir === -1) {
    const prev = block.previousElementSibling;
    if (prev && prev.classList.contains('block-item')) container.insertBefore(block, prev);
  } else {
    const next = block.nextElementSibling;
    if (next && next.classList.contains('block-item')) container.insertBefore(next, block);
  }
}

// ── Auto-resize textareas ─────────────────────────────────
function _autoResizeTextarea(ta) {
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 'px';
}
function _setupAutoResize(blockEl) {
  blockEl.querySelectorAll('textarea').forEach(ta => {
    ta.addEventListener('input', () => _autoResizeTextarea(ta));
    _autoResizeTextarea(ta); // initial
  });
}


// ── Collect all blocks ────────────────────────────────────
function _collectBlocks() {
  const blocks = [];
  document.querySelectorAll('#content-blocks-builder .block-item').forEach(blockEl => {
    const type = blockEl.dataset.blockType;
    const id   = blockEl.dataset.blockId;
    let data   = {};

    switch (type) {
      case 'text':
        data.content = (blockEl.querySelector('.block-data-content') || {}).value?.trim() || '';
        break;
      case 'steps':
        data.items = [];
        blockEl.querySelectorAll('.step-block-item').forEach(item => {
          const title = (item.querySelector('.step-item-title') || {}).value?.trim() || '';
          const desc  = (item.querySelector('.step-item-desc')  || {}).value?.trim() || '';
          const note  = (item.querySelector('.step-item-note')  || {}).value?.trim() || '';
          if (title || desc) data.items.push({ title, desc, ...(note ? { note } : {}) });
        });
        break;
      case 'checklist':
        data.items = [];
        blockEl.querySelectorAll('.cl-item-text').forEach(inp => {
          const text = inp.value?.trim() || '';
          if (text) data.items.push({ text });
        });
        break;
      case 'quiz':
        data.questions = [];
        blockEl.querySelectorAll('.quiz-block-item').forEach(qEl => {
          const question    = (qEl.querySelector('.qi-question')    || {}).value?.trim() || '';
          if (!question) return;
          const options     = Array.from(qEl.querySelectorAll('.qi-option')).map(i => i.value?.trim() || '');
          const correct     = parseInt((qEl.querySelector('.qi-correct') || {}).value || '0', 10);
          const explanation = (qEl.querySelector('.qi-explanation') || {}).value?.trim() || '';
          data.questions.push({ question, options, correct, explanation });
        });
        break;
      case 'video':
        data.url   = (blockEl.querySelector('.block-data-url')   || {}).value?.trim() || '';
        data.title = (blockEl.querySelector('.block-data-title') || {}).value?.trim() || '';
        break;
      case 'image':
        data.url     = (blockEl.querySelector('.block-data-url')     || {}).value?.trim() || '';
        data.caption = (blockEl.querySelector('.block-data-caption') || {}).value?.trim() || '';
        break;
      case 'file':
        data.name = (blockEl.querySelector('.block-data-name') || {}).value?.trim() || '';
        data.url  = (blockEl.querySelector('.block-data-url')  || {}).value?.trim() || '';
        data.type = (blockEl.querySelector('.block-data-type') || {}).value || 'pdf';
        data.size = (blockEl.querySelector('.block-data-size') || {}).value?.trim() || '';
        break;
      case 'callout':
        data.variant = (blockEl.querySelector('.block-data-variant') || {}).value || 'info';
        data.title   = (blockEl.querySelector('.block-data-title')   || {}).value?.trim() || '';
        data.text    = (blockEl.querySelector('.block-data-text')    || {}).value?.trim() || '';
        break;
    }
    blocks.push({ id, type, data });
  });
  return blocks;
}

// ── Convert old-format module → blocks ────────────────────
function _moduleToBlocks(mod) {
  const blocks = [];
  if (mod.steps && mod.steps.length > 0) {
    blocks.push({ id: genBlockId(), type: 'steps', data: { items: mod.steps.map(s => ({ title: s.title || '', desc: s.desc || '', note: s.note || '' })) } });
  }
  (mod.resources || []).forEach(r => {
    blocks.push({ id: genBlockId(), type: 'file', data: { name: r.name || '', url: r.url || '', type: r.type || 'pdf', size: r.size || '' } });
  });
  if (mod.videoUrl) {
    blocks.push({ id: genBlockId(), type: 'video', data: { url: mod.videoUrl, title: '' } });
  }
  if (mod.quiz && mod.quiz.length > 0) {
    blocks.push({ id: genBlockId(), type: 'quiz', data: { questions: mod.quiz } });
  }
  return blocks;
}

function _loadBlocksIntoEditor(blocks) {
  const container = document.getElementById('content-blocks-builder');
  container.querySelectorAll('.block-item').forEach(b => b.remove());
  (blocks || []).forEach(block => addBlock(block.type, block.data));
  _updateEmptyHint();
}

// ══════════════════════════════════════════════════════════
//  WORD UPLOAD
// ══════════════════════════════════════════════════════════
async function _loadMammoth() {
  if (window.mammoth) return;
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Không tải được thư viện đọc file Word.'));
    document.head.appendChild(s);
  });
}

async function handleWordUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const statusEl = document.getElementById('word-upload-status');
  statusEl.style.display = '';
  statusEl.className = 'word-upload-status loading';
  statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang phân tích file Word...';
  try {
    await _loadMammoth();
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const { blocks, title } = _parseWordHtml(result.value);
    if (title && !document.getElementById('mod-name').value.trim()) {
      document.getElementById('mod-name').value = title;
    }
    const container = document.getElementById('content-blocks-builder');
    const existing = container.querySelectorAll('.block-item').length;
    if (existing > 0) {
      if (!confirm('Nội dung hiện tại sẽ bị xóa và thay bằng nội dung từ file Word. Tiếp tục?')) {
        statusEl.style.display = 'none';
        event.target.value = '';
        return;
      }
    }
    _loadBlocksIntoEditor(blocks);
    statusEl.className = 'word-upload-status success';
    statusEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Phân tích thành công — <strong>' + blocks.length + ' block</strong> đã được tạo từ file Word.';
    setTimeout(() => { statusEl.style.display = 'none'; }, 4000);
  } catch (err) {
    statusEl.className = 'word-upload-status error';
    statusEl.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Lỗi: ' + err.message;
  }
  event.target.value = '';
}

function _parseWordHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const blocks = [];
  let title = '';
  let currentStepItems = [];

  function flushSteps() {
    if (currentStepItems.length > 0) {
      blocks.push({ id: genBlockId(), type: 'steps', data: { items: [...currentStepItems] } });
      currentStepItems = [];
    }
  }

  Array.from(doc.body.childNodes).forEach(node => {
    const tag  = node.nodeName;
    const text = (node.textContent || '').trim();
    if (!text) return;

    if (tag === 'H1') {
      title = text;
    } else if (tag === 'H2') {
      currentStepItems.push({ title: text, desc: '', note: '' });
    } else if (tag === 'H3') {
      flushSteps();
      blocks.push({ id: genBlockId(), type: 'callout', data: { variant: 'info', title: text, text: '' } });
    } else if (tag === 'P') {
      const lower = text.toLowerCase();
      if (lower.startsWith('lưu ý:') || lower.startsWith('note:') || lower.startsWith('⚠️') || lower.startsWith('📌')) {
        const content = text.replace(/^(lưu ý:|note:|⚠️|📌)\s*/i, '');
        if (currentStepItems.length > 0) {
          currentStepItems[currentStepItems.length - 1].note = content;
        } else {
          flushSteps();
          blocks.push({ id: genBlockId(), type: 'callout', data: { variant: 'warning', title: 'Lưu ý', text: content } });
        }
      } else if (currentStepItems.length > 0) {
        const last = currentStepItems[currentStepItems.length - 1];
        last.desc = last.desc ? last.desc + '\n' + text : text;
      } else {
        flushSteps();
        blocks.push({ id: genBlockId(), type: 'text', data: { content: text } });
      }
    } else if (tag === 'UL' || tag === 'OL') {
      flushSteps();
      const items = Array.from(node.querySelectorAll('li')).map(li => ({ text: li.textContent.trim() })).filter(i => i.text);
      if (items.length) blocks.push({ id: genBlockId(), type: 'checklist', data: { items } });
    }
  });
  flushSteps();
  return { blocks, title };
}

function downloadWordTemplate() {
  // Generate a simple text template guide since we can't create actual .docx without a library
  const content = [
    'HƯỚNG DẪN SOẠN THẢO MODULE THEO TEMPLATE\n',
    '===========================================\n',
    'Cấu trúc file Word để import vào Mentora LMS:\n\n',
    'HEADING 1 (H1): Tên module\n',
    'HEADING 2 (H2): Tiêu đề bước 1\n',
    '  [Đoạn văn]: Nội dung bước 1...\n',
    '  Lưu ý: Ghi chú cảnh báo (bắt đầu bằng "Lưu ý:")\n',
    'HEADING 2 (H2): Tiêu đề bước 2\n',
    '  [Đoạn văn]: Nội dung bước 2...\n',
    'HEADING 3 (H3): Tiêu đề callout/hộp thông tin\n',
    '[Danh sách gạch đầu dòng]: Tạo checklist\n',
    '  - Mục 1\n',
    '  - Mục 2\n\n',
    'LƯU Ý:\n',
    '- Mỗi H2 sẽ tạo ra 1 bước trong block Quy trình\n',
    '- H3 tạo ra Callout block\n',
    '- Danh sách (bullet/numbered) tạo ra Checklist block\n',
    '- Đoạn văn độc lập (không thuộc H2) tạo ra Text block\n',
    '- "Lưu ý: ..." dưới H2 sẽ thành phần ghi chú của bước đó\n',
  ].join('');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'mentora-template-huong-dan.txt';
  a.click();
  URL.revokeObjectURL(url);
}

// ══════════════════════════════════════════════════════════
//  MODULE MODAL — Add / Edit
// ══════════════════════════════════════════════════════════
function openAddModule() {
  editingModuleId = null;
  _editingPrerequisites = [];
  document.getElementById('modal-module-title').textContent = 'Thêm Module mới';
  document.getElementById('mod-id').disabled = false;
  ['mod-id','mod-name','mod-subtitle','mod-duration','mod-thumbnail','mod-icon','mod-video'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('mod-category').value = 'Process';
  document.getElementById('mod-level').value    = 'Bắt buộc';
  document.getElementById('mod-updated').value  = new Date().toLocaleDateString('vi-VN');
  document.getElementById('mod-status').value   = 'draft';
  _loadBlocksIntoEditor([]);
  document.getElementById('word-upload-status').style.display = 'none';
  document.getElementById('modal-module').style.display = '';
}

async function openEditModule(id) {
  editingModuleId = id;
  _editingPrerequisites = [];
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
  _editingPrerequisites = Array.isArray(mod.prerequisites) ? mod.prerequisites.slice() : [];

  // Load blocks: prefer content_blocks, fallback to converting old steps/quiz
  const blocks = (mod.content_blocks && mod.content_blocks.length > 0)
    ? mod.content_blocks
    : _moduleToBlocks(mod);
  _loadBlocksIntoEditor(blocks);
  document.getElementById('word-upload-status').style.display = 'none';
  document.getElementById('modal-module').style.display = '';
}

function closeModuleModal() {
  document.getElementById('modal-module').style.display = 'none';
  document.getElementById('mod-id').disabled = false;
  editingModuleId = null;
}

async function saveModule() {
  const btn = document.getElementById('btn-save-module');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Đang lưu...';
  try {
    const id   = (editingModuleId || document.getElementById('mod-id').value.trim()).toUpperCase();
    const name = document.getElementById('mod-name').value.trim();
    if (!id || !name) throw new Error('ID và Tên module là bắt buộc');

    const content_blocks = _collectBlocks();

    // Derive legacy fields from blocks for backward compat
    const steps = [], quiz = [], resources = [];
    let videoUrl = document.getElementById('mod-video').value.trim() || '';
    content_blocks.forEach(block => {
      if (block.type === 'steps')     steps.push(...(block.data.items || []));
      if (block.type === 'quiz')      quiz.push(...(block.data.questions || []));
      if (block.type === 'video' && !videoUrl) videoUrl = block.data.url || '';
      if (block.type === 'file')      resources.push({ name: block.data.name, url: block.data.url, type: block.data.type, size: block.data.size });
    });

    const moduleData = {
      id, name, owner: 'HR-L&OD',
      category:  document.getElementById('mod-category').value,
      level:     document.getElementById('mod-level').value,
      duration:  document.getElementById('mod-duration').value.trim() || '30 phút đọc',
      subtitle:  document.getElementById('mod-subtitle').value.trim(),
      thumbnail: document.getElementById('mod-thumbnail').value.trim() || '/assets/images/hero/hero-01.jpg',
      icon:      document.getElementById('mod-icon').value.trim() || '/assets/icons/education.png',
      status:    'Đang hoạt động',
      updated:   document.getElementById('mod-updated').value.trim() || new Date().toLocaleDateString('vi-VN'),
      videoUrl,
      prerequisites: _editingPrerequisites.slice(),
      content_blocks,   // new flexible format
      steps, quiz, resources, images: [],  // legacy compat
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
  // ESC key closes module modal and drill-down
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModuleModal(); closeDrilldown(); }
  });
  initTabs();
  checkAuth();
});
