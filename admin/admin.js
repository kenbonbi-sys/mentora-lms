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
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).style.display = '';
      if (tab.dataset.tab === 'activity') loadActivity();
      if (tab.dataset.tab === 'modules')  loadCmsModules();
    });
  });
}

async function loadDashData() {
  await Promise.all([loadStats(), loadCharts(), loadCmsModules()]);
}

// ══════════════════════════════════════════════════════════
//  STATS
// ══════════════════════════════════════════════════════════
async function loadStats() {
  try {
    const { count: viewCount } = await sb.from('page_views').select('*', { count: 'exact', head: true });
    document.getElementById('stat-total-views').textContent = (viewCount || 0).toLocaleString('vi');

    const { data: quizData } = await sb.from('quiz_attempts').select('module_id, module_name, pct, passed');
    const qTotal = quizData ? quizData.length : 0;
    document.getElementById('stat-total-quiz').textContent = qTotal.toLocaleString('vi');

    if (qTotal > 0) {
      const avgPct   = Math.round(quizData.reduce((s, r) => s + r.pct, 0) / qTotal);
      const passRate = Math.round((quizData.filter(r => r.passed).length / qTotal) * 100);
      document.getElementById('stat-avg-score').textContent = avgPct + '%';
      document.getElementById('stat-pass-rate').textContent = passRate + '%';
    } else {
      document.getElementById('stat-avg-score').textContent = '—';
      document.getElementById('stat-pass-rate').textContent = '—';
    }

    // Per-module
    const { data: viewRows } = await sb.from('page_views').select('module_id, module_name');
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

    const tbody = document.getElementById('module-stats-body');
    const rows  = Object.values(modMap);
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">Chưa có dữ liệu. Người dùng sẽ xuất hiện khi họ mở module.</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(m => {
      const avgQ  = m.attempts ? Math.round(m.pctSum / m.attempts) : null;
      const pRate = m.attempts ? Math.round((m.passCount / m.attempts) * 100) : null;
      const cls   = avgQ === null ? '' : avgQ >= 75 ? 'good' : avgQ >= 50 ? 'medium' : 'bad';
      return `<tr>
        <td style="font-weight:600">${esc(m.name)}</td>
        <td>${m.category ? '<span class="badge ' + (catMap[m.category] || '') + '">' + m.category + '</span>' : '—'}</td>
        <td>${m.views.toLocaleString('vi')}</td>
        <td>${m.attempts.toLocaleString('vi')}</td>
        <td>${avgQ !== null ? '<div class="pct-bar"><div class="pct-bar-track"><div class="pct-bar-fill ' + cls + '" style="width:' + avgQ + '%"></div></div><span class="pct-bar-label">' + avgQ + '%</span></div>' : '<span style="color:#9ca3af">—</span>'}</td>
        <td>${pRate !== null ? pRate + '%' : '<span style="color:#9ca3af">—</span>'}</td>
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
    const { data: rows } = await sb.from('page_views').select('created_at, source');
    if (!rows) return;

    // ── Daily traffic (last 14 days) ──────────────────────
    const labels = [];
    const counts = {};
    for (let i = 13; i >= 0; i--) {
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
async function loadCmsModules() {
  const tbody = document.getElementById('modules-cms-body');
  tbody.innerHTML = '<tr><td colspan="6" class="loading-cell"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</td></tr>';
  try {
    const { data: cmsRows, error } = await sb.from('modules_cms').select('id,data,updated_at').order('updated_at', { ascending: false });
    if (error) throw error;
    const localIds = new Set(localModules.map(m => m.id));
    const combined = [];
    localModules.forEach(m => {
      const cms = (cmsRows || []).find(r => r.id === m.id);
      combined.push({ id: m.id, name: m.name, category: m.category, updated: m.updated, source: cms ? 'CMS + JSON' : 'JSON', updated_at: cms?.updated_at });
    });
    (cmsRows || []).filter(r => !localIds.has(r.id)).forEach(r => {
      const d = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
      combined.push({ id: r.id, name: d.name || r.id, category: d.category, updated: d.updated || '—', source: 'CMS', updated_at: r.updated_at });
    });
    document.getElementById('cms-module-count').textContent = '(' + combined.length + ' modules)';
    if (!combined.length) { tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">Chưa có module nào.</td></tr>'; return; }
    const catMap = { Policy: 'badge-policy', Process: 'badge-process', Safety: 'badge-safety' };
    tbody.innerHTML = combined.map(m => `<tr>
      <td><code style="font-size:12px;background:#f5f6fa;padding:2px 6px;border-radius:4px">${esc(m.id)}</code></td>
      <td style="font-weight:600;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(m.name)}</td>
      <td>${m.category ? '<span class="badge ' + (catMap[m.category] || '') + '">' + m.category + '</span>' : '—'}</td>
      <td style="color:#9ca3af;font-size:12px">${m.updated || '—'}</td>
      <td><span style="font-size:11px;color:#9ca3af">${m.source}</span></td>
      <td style="white-space:nowrap;display:flex;gap:6px">
        <button class="btn-sm" onclick="openEditModule('${m.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
        ${m.source === 'CMS' ? '<button class="btn-danger" onclick="deleteModule(\'' + m.id + '\',\'' + esc(m.name) + '\')"><i class="fa-solid fa-trash"></i></button>' : ''}
      </td>
    </tr>`).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-cell" style="color:#e5303f">Lỗi: ' + esc(err.message) + '</td></tr>';
  }
}

async function deleteModule(id, name) {
  if (!confirm('Xóa module "' + name + '"?\nHành động này không thể hoàn tác.')) return;
  const { error } = await sb.from('modules_cms').delete().eq('id', id);
  if (error) { showToast('Lỗi xóa: ' + error.message, 'error'); return; }
  showToast('Đã xóa module "' + name + '"', 'success');
  loadCmsModules();
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
  let mod = null;
  try {
    const { data } = await sb.from('modules_cms').select('data').eq('id', id).single();
    if (data) mod = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
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
    const { error } = await sb.from('modules_cms').upsert({ id, data: JSON.stringify(moduleData) }, { onConflict: 'id' });
    if (error) throw error;
    closeModuleModal();
    showToast('Module "' + name + '" đã được lưu!', 'success');
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
  initTabs();
  checkAuth();
});
