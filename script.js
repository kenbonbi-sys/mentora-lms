// ══════════════════════════════════════════════════════
//  Mentora LMS — script.js
//  Pure static — data từ /data/modules.json
// ══════════════════════════════════════════════════════

// Fallback data — dùng khi fetch /data/modules.json lỗi
var SAMPLE_MODULES = [
  {
    id: 'M001',
    name: 'Quy trình Onboarding Nhân viên Mới',
    owner: 'HR-L&OD',
    duration: '30 phút đọc',
    category: 'Process',
    level: 'Bắt buộc',
    subtitle: 'Tổng quan quy trình tiếp nhận và định hướng nhân viên mới từ ngày đầu tiên đến hết thử việc.',
    thumbnail: '/assets/images/hero/hero-02.jpg',
    icon: '/assets/icons/education.png',
    status: 'Đang hoạt động',
    updated: '15/04/2026',
    steps: [
      { title: 'Chuẩn bị trước ngày đầu tiên', desc: 'HR gửi welcome email kèm checklist cần thiết. IT chuẩn bị máy tính, tài khoản email, badge từ trước 1 ngày.', note: 'Deadline: hoàn thành trước 17h ngày làm việc cuối trước khi nhân viên vào.' },
      { title: 'Ngày đầu tiên — Orientation', desc: 'Nhân viên check-in tại reception lúc 8:30. Meeting giới thiệu với manager trực tiếp. Tour văn phòng và giới thiệu các phòng ban liên quan.' },
      { title: 'Tuần 1 — Nắm bắt công việc', desc: 'Nhân viên nhận bàn giao tài liệu, tool, quy trình liên quan đến vị trí. Hoàn thành các khóa đào tạo bắt buộc trên hệ thống LMS này.' },
      { title: 'Tuần 2–4 — Thực hành có hướng dẫn', desc: 'Thực hiện công việc thực tế dưới sự hỗ trợ của buddy/mentor. Check-in 1:1 với manager hàng tuần để review tiến độ.', note: 'Buddy được chỉ định trong ngày đầu tiên, ít nhất 3 tháng kinh nghiệm tại vị trí tương đương.' },
      { title: 'Đánh giá kết thúc thử việc', desc: 'Manager điền form đánh giá thử việc trước ngày kết thúc 5 ngày làm việc. HR xác nhận kết quả và thực hiện hợp đồng chính thức.' },
    ],
    images: [
      { url: '/assets/images/hero/hero-02.jpg',   caption: 'Workspace chuẩn bị sẵn sàng' },
      { url: '/assets/images/hero/hero-03.jpg',   caption: 'Orientation session' },
      { url: '/assets/images/hero/hero-04.jpg',   caption: 'On-the-job training' },
      { url: '/assets/images/promo/promo-01.jpg', caption: 'Form đánh giá thử việc' },
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    resources: [
      { name: 'Onboarding Checklist.pdf', type: 'pdf', size: '245 KB', url: '#' },
      { name: 'Slide Orientation 2026.pptx', type: 'pptx', size: '3.2 MB', url: '#' },
      { name: 'Hướng dẫn hệ thống nội bộ.pdf', type: 'pdf', size: '1.1 MB', url: '#' },
    ]
  },
  {
    id: 'M002',
    name: 'Chính sách Bảo mật Thông tin & PDPA',
    owner: 'HR-L&OD',
    duration: '45 phút đọc',
    category: 'Policy',
    level: 'Bắt buộc',
    subtitle: 'Các quy định về bảo vệ dữ liệu cá nhân, xử lý thông tin khách hàng và nội bộ theo tiêu chuẩn PDPA.',
    thumbnail: '/assets/images/hero/hero-05.jpg',
    icon: '/assets/icons/security.png',
    status: 'Đang hoạt động',
    updated: '01/03/2026',
    steps: [
      { title: 'Phân loại dữ liệu', desc: 'Dữ liệu được phân thành 3 cấp: Công khai, Nội bộ và Bí mật. Mỗi cấp có quy tắc lưu trữ, chia sẻ và tiêu hủy khác nhau.' },
      { title: 'Quy tắc xử lý dữ liệu khách hàng', desc: 'Chỉ thu thập dữ liệu khi có mục đích cụ thể và được sự đồng ý. Không chia sẻ cho bên thứ ba khi chưa có hợp đồng DPA.', note: 'Vi phạm có thể dẫn đến phạt hành chính và kỷ luật nội bộ.' },
      { title: 'Xử lý sự cố rò rỉ dữ liệu', desc: 'Phát hiện → Báo cáo ngay cho IT Security trong 1 giờ → Đánh giá mức độ → Thông báo cho các bên liên quan → Lập báo cáo sự cố.' },
      { title: 'Quyền của chủ thể dữ liệu', desc: 'Quyền truy cập, chỉnh sửa, xóa và phản đối xử lý. Phải phản hồi yêu cầu trong 30 ngày làm việc.' },
    ],
    images: [
      { url: '/assets/images/hero/hero-05.jpg',   caption: 'Bảo mật dữ liệu' },
      { url: '/assets/images/hero/hero-06.jpg',   caption: 'Phân loại dữ liệu' },
      { url: '/assets/images/promo/promo-04.jpg', caption: 'Quy trình xử lý vi phạm' },
    ],
    videoUrl: '',
    resources: [
      { name: 'PDPA Policy v2.1.pdf', type: 'pdf', size: '890 KB', url: '#' },
      { name: 'Data Classification Guide.pdf', type: 'pdf', size: '320 KB', url: '#' },
      { name: 'Slide PDPA Training.pptx', type: 'pptx', size: '5.4 MB', url: '#' },
    ]
  },
  {
    id: 'M003',
    name: 'An toàn Lao động & Phòng cháy Chữa cháy',
    owner: 'HR-L&OD',
    duration: '25 phút đọc',
    category: 'Safety',
    level: 'Bắt buộc',
    subtitle: 'Quy định về an toàn tại nơi làm việc, sơ tán khẩn cấp và phòng ngừa cháy nổ.',
    thumbnail: '/assets/images/hero/hero-07.jpg',
    icon: '/assets/icons/securityshield.png',
    status: 'Đang hoạt động',
    updated: '10/01/2026',
    steps: [
      { title: 'Quy định an toàn tại văn phòng', desc: 'Không để vật cản lối thoát hiểm. Không sạc thiết bị qua đêm tại bàn làm việc. Báo ngay khi phát hiện thiết bị điện có dấu hiệu hư hỏng.' },
      { title: 'Quy trình sơ tán khẩn cấp', desc: 'Khi nghe còi báo động: dừng mọi hoạt động, tắt thiết bị, di chuyển theo sơ đồ thoát hiểm đến điểm tập trung tại bãi đỗ xe B1.', note: 'Sơ đồ thoát hiểm dán tại cạnh cửa chính mỗi tầng và trong thang máy.' },
      { title: 'Sử dụng bình chữa cháy', desc: 'Nhớ quy tắc PASS: Pull (rút chốt) → Aim (hướng vòi) → Squeeze (bóp cò) → Sweep (quét ngang). Chỉ dùng khi đám cháy nhỏ, không che lối thoát.' },
      { title: 'Báo cáo tai nạn & sự cố', desc: 'Mọi tai nạn dù nhỏ phải báo cáo trong ngày cho Admin. Điền form báo cáo sự cố và nộp HR trong 24 giờ.' },
    ],
    images: [
      { url: '/assets/images/hero/hero-07.jpg',   caption: 'Vị trí bình chữa cháy' },
      { url: '/assets/images/hero/hero-08.jpg',   caption: 'Sơ đồ thoát hiểm tầng 3' },
      { url: '/assets/images/promo/promo-06.jpg', caption: 'Cửa thoát hiểm' },
    ],
    videoUrl: '',
    resources: [
      { name: 'Nội quy An toàn Lao động.pdf', type: 'pdf', size: '560 KB', url: '#' },
      { name: 'Sơ đồ Thoát hiểm.pdf', type: 'pdf', size: '2.1 MB', url: '#' },
      { name: 'Slide PCCC Training.pptx', type: 'pptx', size: '8.7 MB', url: '#' },
    ]
  },
  {
    id: 'M004',
    name: 'Quy trình Phê duyệt Chi phí & Thanh toán',
    owner: 'HR-L&OD',
    duration: '20 phút đọc',
    category: 'Process',
    level: 'Theo phòng ban',
    subtitle: 'Hướng dẫn đề xuất, phê duyệt và hoàn ứng chi phí công tác, mua sắm và chi phí vận hành.',
    thumbnail: '/assets/images/hero/hero-09.jpg',
    icon: '/assets/icons/money.png',
    status: 'Đang hoạt động',
    updated: '20/02/2026',
    steps: [
      { title: 'Đề xuất chi phí', desc: 'Điền form Đề xuất Chi phí (EF-001) trên hệ thống. Đính kèm báo giá hoặc hóa đơn ước tính. Gửi trước ít nhất 5 ngày làm việc so với ngày cần tiền.' },
      { title: 'Quy trình phê duyệt theo mức', desc: 'Dưới 5 triệu: Manager trực tiếp. 5–50 triệu: Manager + Department Head. Trên 50 triệu: Manager + Dept Head + CFO.', note: 'Chi phí khẩn cấp có thể xin phê duyệt bằng miệng/chat trước, form hoàn thiện sau trong 24h.' },
      { title: 'Hoàn ứng sau chi tiêu', desc: 'Nộp hóa đơn VAT gốc kèm form Thanh toán (PT-002) cho Finance trong 5 ngày làm việc sau khi chi. Quá hạn sẽ chuyển vào kỳ thanh toán sau.' },
      { title: 'Chi phí không hợp lệ', desc: 'Hóa đơn không có VAT, chi phí cá nhân, chi phí không có phê duyệt trước sẽ không được hoàn ứng.' },
    ],
    images: [
      { url: '/assets/images/hero/hero-09.jpg',   caption: 'Form đề xuất chi phí' },
      { url: '/assets/images/promo/promo-08.jpg', caption: 'Quy trình phê duyệt' },
    ],
    videoUrl: '',
    resources: [
      { name: 'Form Đề xuất Chi phí EF-001.xlsx', type: 'doc', size: '48 KB', url: '#' },
      { name: 'Form Thanh toán PT-002.xlsx', type: 'doc', size: '52 KB', url: '#' },
      { name: 'Chính sách Chi phí 2026.pdf', type: 'pdf', size: '430 KB', url: '#' },
      { name: 'Slide Finance Process.pptx', type: 'pptx', size: '4.1 MB', url: '#' },
    ]
  },
  {
    id: 'M005',
    name: 'Quy tắc Ứng xử & Đạo đức Nghề nghiệp',
    owner: 'HR-L&OD',
    duration: '35 phút đọc',
    category: 'Policy',
    level: 'Bắt buộc',
    subtitle: 'Tiêu chuẩn hành vi, ứng xử với đồng nghiệp, khách hàng và đối tác. Chính sách chống quấy rối và xung đột lợi ích.',
    thumbnail: '/assets/images/hero/hero-10.jpg',
    icon: '/assets/icons/chat.png',
    status: 'Đang hoạt động',
    updated: '05/04/2026',
    steps: [
      { title: 'Tiêu chuẩn hành vi tại nơi làm việc', desc: 'Tôn trọng đồng nghiệp bất kể cấp bậc, giới tính, tuổi tác. Giao tiếp chuyên nghiệp trong mọi kênh bao gồm email, chat và họp.' },
      { title: 'Chính sách chống quấy rối', desc: 'Mọi hình thức quấy rối — lời nói, hành động, hoặc trực tuyến — đều bị nghiêm cấm. Nạn nhân hoặc nhân chứng có thể báo cáo trực tiếp cho HR hoặc qua đường dây nóng ẩn danh.', note: 'Đường dây ẩn danh: hr-confidential@company.com | ext. 9999' },
      { title: 'Xung đột lợi ích', desc: 'Khai báo với HR nếu có quan hệ thân thiết với nhà cung cấp, khách hàng hoặc đối thủ. Không tham gia quyết định liên quan đến bên có quan hệ cá nhân.' },
      { title: 'Sử dụng tài sản công ty', desc: 'Thiết bị, phần mềm và hệ thống của công ty chỉ dùng cho mục đích công việc. Không cài phần mềm không được IT phê duyệt.' },
    ],
    images: [
      { url: '/assets/images/hero/hero-10.jpg',   caption: 'Môi trường làm việc đa dạng' },
      { url: '/assets/images/hero/hero-01.jpg',   caption: 'Giao tiếp chuyên nghiệp' },
      { url: '/assets/images/promo/promo-03.jpg', caption: 'Đạo đức nghề nghiệp' },
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    resources: [
      { name: 'Code of Conduct 2026.pdf', type: 'pdf', size: '1.3 MB', url: '#' },
      { name: 'Slide Ethics Training.pptx', type: 'pptx', size: '6.2 MB', url: '#' },
      { name: 'Form Khai báo Xung đột Lợi ích.pdf', type: 'pdf', size: '180 KB', url: '#' },
    ]
  },
];

var allModules      = [];
var activeCat       = 'all';
var currentModuleId = null;

// ════════════════════════════════════════
//  SUPABASE CONFIG
//  Điền URL và anon key sau khi tạo project
//  Supabase → Settings → API
// ════════════════════════════════════════
var SB_URL  = 'https://ufpsgmlpexpfcaybeula.supabase.co';
var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmcHNnbWxwZXhwZmNheWJldWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjQxMzIsImV4cCI6MjA5MjcwMDEzMn0.coJ9nVNGtS8qomQugZSH3htmZDNCmZdVOiti4IJfBlU';

function _sbReady() { return SB_URL && SB_URL.indexOf('YOUR_PROJECT') === -1; }

function _getSession() {
  if (!window._sessionId) {
    window._sessionId = 'sess_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
  return window._sessionId;
}

function _sbInsert(table, payload) {
  if (!_sbReady()) return;
  fetch(SB_URL + '/rest/v1/' + table, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'apikey':        SB_ANON,
      'Authorization': 'Bearer ' + SB_ANON,
      'Prefer':        'return=minimal'
    },
    body: JSON.stringify(payload)
  }).catch(function (e) { console.warn('[SB] insert failed:', e.message); });
}

function _detectSource() {
  var ref = document.referrer;
  if (!ref || ref.indexOf(location.hostname) !== -1) return 'direct';
  var searchEngines = ['google.', 'bing.', 'yahoo.', 'coccoc.', 'duckduckgo.', 'baidu.', 'yandex.'];
  for (var i = 0; i < searchEngines.length; i++) {
    if (ref.indexOf(searchEngines[i]) !== -1) return 'search';
  }
  return 'referral';
}

function trackPageView(moduleId, moduleName) {
  _sbInsert('page_views', { module_id: moduleId, module_name: moduleName, session_id: _getSession(), source: _detectSource() });
}

function trackQuizAttempt(moduleId, moduleName, score, total, pct) {
  _sbInsert('quiz_attempts', { module_id: moduleId, module_name: moduleName, score: score, total: total, pct: pct, passed: pct >= 75, session_id: _getSession() });
}

// ════════════════════════════════════════
//  INIT
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {

  // ── Theme ──
  var themeBtn  = document.getElementById('btn-theme');
  var themeIcon = document.getElementById('theme-icon');
  function applyTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeIcon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  applyTheme(localStorage.getItem('lms-theme') === 'dark');
  themeBtn.addEventListener('click', function () {
    var isDark = !document.body.classList.contains('dark');
    localStorage.setItem('lms-theme', isDark ? 'dark' : 'light');
    applyTheme(isDark);
  });

  // ── Mobile nav ──
  document.getElementById('nav-toggle').addEventListener('click', function () {
    document.getElementById('nav-links').classList.toggle('open');
    document.getElementById('nav-actions').classList.toggle('open');
  });

  // ── Nav scroll links ──
  document.querySelectorAll('[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      showPage('list');
      setTimeout(function () {
        var target = document.getElementById(link.dataset.scroll);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else showToast('Trang này đang được phát triển.', 'info');
      }, 50);
      document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
      document.getElementById('nav-links').classList.remove('open');
      document.getElementById('nav-actions').classList.remove('open');
    });
  });

  // ── Modals ──
  function openModal(id)  { document.getElementById(id).classList.add('open'); }
  function closeModal(id) { document.getElementById(id).classList.remove('open'); }
  document.getElementById('btn-login').addEventListener('click',    function () { openModal('modal-login'); });
  document.getElementById('btn-register').addEventListener('click', function () { openModal('modal-register'); });
  document.querySelectorAll('[data-close]').forEach(function (btn) {
    btn.addEventListener('click', function () { closeModal(btn.dataset.close); });
  });
  document.querySelectorAll('.modal-overlay').forEach(function (o) {
    o.addEventListener('click', function (e) { if (e.target === o) o.classList.remove('open'); });
  });
  document.getElementById('btn-do-login').addEventListener('click', function () {
    closeModal('modal-login'); showToast('Tính năng đăng nhập đang được phát triển.', 'info');
  });
  document.getElementById('btn-do-register').addEventListener('click', function () {
    closeModal('modal-register'); showToast('Tính năng đăng ký đang được phát triển.', 'info');
  });

  // ── Filter tabs ──
  document.getElementById('filter-tabs').addEventListener('click', function (e) {
    var tab = e.target.closest('.filter-tab');
    if (!tab) return;
    document.querySelectorAll('.filter-tab').forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
    activeCat = tab.dataset.cat;
    filterAndRender();
  });

  // ── Search ──
  document.getElementById('input-search').addEventListener('keyup', filterAndRender);

  // ── Card click ──
  document.getElementById('modules-grid').addEventListener('click', function (e) {
    var card = e.target.closest('.module-card[data-id]');
    if (card) openDetail(card.dataset.id);
  });

  // ── (mark-done removed — replaced by scroll tracker) ──
  (function () { // no-op block to avoid syntax gap
    void 0;
    showToast('Đã đánh dấu hoàn thành module!', 'success');
  });

  // ── Load modules from API ──
  loadModules();
});

// ════════════════════════════════════════
//  LOAD MODULES — fetch /data/modules.json, fallback sample
// ════════════════════════════════════════
function loadModules() {
  showSkeleton(true);

  // Load local JSON + Supabase CMS in parallel, merge results
  var fetchLocal = fetch('/data/modules.json')
    .then(function (r) { return r.ok ? r.json() : []; })
    .catch(function () { return []; });

  var fetchCms = _sbReady()
    ? fetch(SB_URL + '/rest/v1/modules_cms?select=id,data,active&order=created_at.asc', {
        headers: { 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON }
      })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        return rows
          .filter(function (r) { return r.active !== false; }) // hide inactive modules
          .map(function (r) { return JSON.parse(r.data || '{}'); });
      })
      .catch(function () { return []; })
    : Promise.resolve([]);

  Promise.all([fetchLocal, fetchCms])
    .then(function (results) {
      var localData = results[0];
      var cmsData   = results[1];

      // Start with local modules as base
      var merged = Array.isArray(localData) && localData.length ? localData.slice() : SAMPLE_MODULES.slice();

      // CMS modules override local by id, or append if new
      cmsData.forEach(function (cmsMod) {
        if (!cmsMod || !cmsMod.id) return;
        var idx = merged.findIndex(function (m) { return m.id === cmsMod.id; });
        if (idx >= 0) merged[idx] = cmsMod;   // override existing
        else merged.push(cmsMod);             // append new CMS module
      });

      allModules = merged.length ? merged : SAMPLE_MODULES;
      showSkeleton(false);
      renderModules(allModules);
      updateHeroCount();
    })
    .catch(function (err) {
      console.warn('loadModules error:', err.message);
      allModules = SAMPLE_MODULES;
      showSkeleton(false);
      renderModules(allModules);
      updateHeroCount();
    });
}

function updateHeroCount() {
  var el = document.getElementById('hero-module-count');
  if (el) el.textContent = allModules.length + ' modules đang hoạt động';
}

// ════════════════════════════════════════
//  PAGE NAVIGATION (SPA)
// ════════════════════════════════════════
function showPage(page) {
  var pageList   = document.getElementById('page-list');
  var pageDetail = document.getElementById('page-detail');
  if (page === 'list') {
    pageDetail.style.display = 'none';
    pageList.style.display   = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    pageList.style.display   = 'none';
    pageDetail.style.display = '';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

// ════════════════════════════════════════
//  FILTER + RENDER CARDS
// ════════════════════════════════════════
function filterAndRender() {
  var query = (document.getElementById('input-search').value || '').toLowerCase();
  var filtered = allModules.filter(function (m) {
    var matchCat  = activeCat === 'all' || m.category === activeCat;
    var matchText = !query
      || m.name.toLowerCase().includes(query)
      || m.owner.toLowerCase().includes(query)
      || (m.category  || '').toLowerCase().includes(query)
      || (m.subtitle  || '').toLowerCase().includes(query);
    return matchCat && matchText;
  });
  renderModules(filtered);
}

function renderModules(list) {
  var grid  = document.getElementById('modules-grid');
  var empty = document.getElementById('empty-state');

  if (!list.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    updateCount(0);
    return;
  }
  empty.style.display = 'none';

  var catClass     = { Policy:'badge-policy', Process:'badge-process', Safety:'badge-safety' };
  var avatarColors = { HR:'#7759d2', Legal:'#e5303f', Admin:'#f6c315', Finance:'#5ea12a' };
  var catGradient  = {
    Policy:  'linear-gradient(135deg,#ffeff4 0%,#fec8dc 100%)',
    Process: 'linear-gradient(135deg,#e5f9f2 0%,#a2e6ce 100%)',
    Safety:  'linear-gradient(135deg,#fff9d9 0%,#ffeb76 100%)'
  };
  // Icon lookup: module ID first, then category fallback
  var iconById = {
    M001: 'education.png',
    M002: 'security.png',
    M003: 'securityshield.png',
    M004: 'money.png',
    M005: 'chat.png'
  };
  var iconByCat = {
    Policy:  'data.png',
    Process: 'education.png',
    Safety:  'securityshield.png'
  };

  grid.innerHTML = list.map(function (m) {
    var dept     = (m.owner || '').split(' ')[0];
    var avatarBg = avatarColors[dept] || '#1c66bb';
    var initials = (m.owner || '??').split(' ').map(function (w) { return w[0]; }).slice(-2).join('').toUpperCase();
    var catCls   = catClass[m.category] || 'badge-cat';

    var iconFile = m.icon || iconById[m.id] || iconByCat[m.category];
    var thumbHtml;
    if (iconFile) {
      var iconSrc = iconFile.startsWith('/') ? iconFile : '/assets/icons/' + iconFile;
      var bg = catGradient[m.category] || 'linear-gradient(135deg,#ffeff4 0%,#fec8dc 100%)';
      thumbHtml = '<div class="card-thumb card-thumb--icon" style="background:' + bg + '">'
        + '<img src="' + iconSrc + '" alt="" loading="lazy">'
        + '<div class="card-thumb-badge"><span class="badge ' + catCls + '">' + m.category + '</span></div>'
        + '<div class="card-thumb-duration"><i class="fa-solid fa-clock"></i> ' + m.duration + '</div>'
        + '</div>';
    } else {
      thumbHtml = '<div class="card-thumb">'
        + '<img src="' + (m.thumbnail || '') + '" alt="' + m.name + '" loading="lazy" onerror="this.src=\'https://loremflickr.com/480/280/office\'">'
        + '<div class="card-thumb-overlay"></div>'
        + '<div class="card-thumb-badge"><span class="badge ' + catCls + '">' + m.category + '</span></div>'
        + '<div class="card-thumb-duration"><i class="fa-solid fa-clock"></i> ' + m.duration + '</div>'
        + '</div>';
    }

    return '<div class="module-card" data-id="' + m.id + '">'
      + thumbHtml
      + '<div class="card-body">'
      + '<div class="card-title">' + m.name + '</div>'
      + '<div class="card-desc">' + (m.subtitle || '') + '</div>'
      + '</div>'
      + '<div class="card-footer">'
      + '<div class="card-owner">'
      + '<div class="avatar" style="background:' + avatarBg + '">' + initials + '</div>'
      + '<span>' + m.owner + '</span>'
      + '</div>'
      + '<div class="card-updated"><i class="fa-solid fa-calendar-days" style="margin-right:4px;opacity:.5"></i>' + m.updated + '</div>'
      + '</div>'
      + '</div>';
  }).join('');

  updateCount(list.length);
}

function showSkeleton(show) {
  document.getElementById('skeleton-loader').style.display = show ? 'block' : 'none';
  document.getElementById('modules-grid').style.display    = show ? 'none'  : '';
}

function updateCount(n) {
  var el    = document.getElementById('courses-count');
  var count = (n !== undefined) ? n : allModules.length;
  el.textContent   = count + ' modules';
  el.style.display = count > 0 ? '' : 'none';
}

// ════════════════════════════════════════
//  DETAIL PAGE
// ════════════════════════════════════════
function openDetail(id) {
  var m = allModules.find(function (x) { return x.id === id; });
  if (!m) return;
  currentModuleId = id;
  trackPageView(m.id, m.name);

  document.getElementById('detail-bc').textContent       = m.name;
  document.getElementById('detail-title').textContent    = m.name;
  document.getElementById('detail-subtitle').textContent = m.subtitle || '';
  document.getElementById('detail-owner').textContent    = m.owner;
  document.getElementById('detail-updated').textContent  = m.updated;
  document.getElementById('detail-duration').textContent = m.duration;
  document.getElementById('detail-thumb').src            = m.thumbnail || '';

  var catClass = { Policy:'badge-policy', Process:'badge-process', Safety:'badge-safety' };
  var lvlClass = { 'Bắt buộc':'badge-level-adv', 'Theo phòng ban':'badge-level-mid', 'Tự nguyện':'badge-level-basic' };
  var stClass  = { 'Đang hoạt động':'badge-open', 'Sắp ra mắt':'badge-soon' };
  document.getElementById('detail-badges').innerHTML =
    '<span class="badge ' + (lvlClass[m.level] || 'badge-level-basic') + '">' + (m.level || '') + '</span> '
    + '<span class="badge ' + (catClass[m.category] || 'badge-cat') + '">' + m.category + '</span> '
    + '<span class="badge ' + (stClass[m.status] || 'badge-open') + '">' + m.status + '</span>';

  // Steps
  var stepsHtml = (m.steps || []).map(function (s, i) {
    return '<div class="process-step">'
      + '<div class="step-number">' + (i + 1) + '</div>'
      + '<div class="step-body">'
      + '<div class="step-title">' + s.title + '</div>'
      + '<div class="step-desc">' + s.desc + '</div>'
      + (s.note ? '<div class="step-note"><i class="fa-solid fa-circle-info"></i> ' + s.note + '</div>' : '')
      + '</div></div>';
  }).join('');
  document.getElementById('detail-steps').innerHTML = stepsHtml || '<p style="color:var(--text-tertiary);font-size:13px">Chưa có nội dung.</p>';

  // Related modules gallery
  var sectionImages  = document.getElementById('section-images');
  var relatedModules = allModules.filter(function (x) { return x.id !== m.id; });
  if (relatedModules.length) {
    var catGradientMap = {
      Policy:  'linear-gradient(135deg,#ffeff4 0%,#fec8dc 100%)',
      Process: 'linear-gradient(135deg,#e5f9f2 0%,#a2e6ce 100%)',
      Safety:  'linear-gradient(135deg,#fff9d9 0%,#ffeb76 100%)'
    };
    document.getElementById('detail-gallery').innerHTML = relatedModules.map(function (rel) {
      var icon = rel.icon || '/assets/icons/education.png';
      var bg   = catGradientMap[rel.category] || 'linear-gradient(135deg,#ffeff4 0%,#fec8dc 100%)';
      var catClass = { Policy:'badge-policy', Process:'badge-process', Safety:'badge-safety' };
      return '<div class="gallery-item gallery-item--module" onclick="openDetail(\'' + rel.id + '\')" style="cursor:pointer">'
        + '<div class="gallery-module-thumb" style="background:' + bg + '">'
        + '<img src="' + icon + '" alt="" loading="lazy">'
        + '</div>'
        + '<div class="gallery-module-info">'
        + '<span class="badge ' + (catClass[rel.category] || 'badge-cat') + '" style="font-size:10px;padding:2px 8px">' + rel.category + '</span>'
        + '<div class="gallery-caption">' + rel.name + '</div>'
        + '<div style="font-size:11px;color:var(--text-tertiary);margin-top:2px"><i class="fa-solid fa-clock" style="margin-right:4px"></i>' + rel.duration + '</div>'
        + '</div>'
        + '</div>';
    }).join('');
    sectionImages.style.display = '';
  } else {
    sectionImages.style.display = 'none';
  }

  // Video
  var videoEl      = document.getElementById('detail-video');
  var sectionVideo = document.getElementById('section-video');
  if (m.videoUrl) {
    videoEl.innerHTML = '<iframe src="' + m.videoUrl + '" allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>';
  } else {
    videoEl.innerHTML = '<div class="video-placeholder"><i class="fa-solid fa-circle-play"></i><p>Video chưa được cập nhật.</p></div>';
  }
  sectionVideo.style.display = '';

  // Resources
  var iconMap = { pdf:'fa-file-pdf', pptx:'fa-file-powerpoint', doc:'fa-file-excel', video:'fa-video' };
  var resHtml = (m.resources || []).map(function (r) {
    return '<div class="resource-item">'
      + '<div class="resource-icon ' + r.type + '"><i class="fa-solid ' + (iconMap[r.type] || 'fa-file') + '"></i></div>'
      + '<div class="resource-meta">'
      + '<div class="resource-name">' + r.name + '</div>'
      + '<div class="resource-size">' + r.size + '</div>'
      + '</div>'
      + '<a href="' + (r.url || '#') + '" class="resource-dl" title="Tải xuống" target="_blank"><i class="fa-solid fa-download"></i></a>'
      + '</div>';
  }).join('');
  document.getElementById('detail-resources').innerHTML = resHtml || '<p style="color:var(--text-tertiary);font-size:13px">Chưa có tài liệu.</p>';

  // Quiz
  renderQuiz(m.quiz || []);

  // Reset + build step tracker

  var trackerEl = document.getElementById('step-tracker');
  trackerEl.innerHTML = (m.steps || []).map(function (s, i) {
    return '<div class="step-dot-item" id="tracker-step-' + i + '" data-step="' + i + '" onclick="scrollToStep(' + i + ')">'
      + '<div class="step-dot"></div>'
      + '<div class="step-dot-label">' + s.title + '</div>'
      + '</div>';
  }).join('');

  showPage('detail');

  // Start scroll observer after render
  setTimeout(function () { setupScrollProgress(m.steps ? m.steps.length : 0); }, 120);
}

// ════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════
function showToast(message, type) {
  type = type || 'info';
  var icons = { success:'fa-circle-check', error:'fa-circle-xmark', info:'fa-circle-info' };
  var wrap  = document.getElementById('toast-wrap');
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = '<i class="fa-solid ' + icons[type] + '"></i><span>' + message + '</span>';
  wrap.appendChild(toast);
  requestAnimationFrame(function () { requestAnimationFrame(function () { toast.classList.add('show'); }); });
  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () { toast.remove(); }, 300);
  }, 3500);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToStep(idx) {
  var stepEls = document.querySelectorAll('#detail-steps .process-step');
  if (stepEls[idx]) {
    var top = stepEls[idx].getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
}

// ════════════════════════════════════════
//  QUIZ
// ════════════════════════════════════════
var quizState = {}; // { answered: bool[], score: number, total: number }

function renderQuiz(questions) {
  var wrap    = document.getElementById('quiz-wrap');
  var section = document.getElementById('section-quiz');
  if (!questions || !questions.length) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';

  quizState = { answered: new Array(questions.length).fill(false), score: 0, total: questions.length };

  var html = '<div class="quiz-intro">'
    + '<i class="fa-solid fa-lightbulb"></i>'
    + '<span>' + questions.length + ' câu hỏi · Chọn đáp án đúng để xem giải thích</span>'
    + '</div>';

  html += questions.map(function (q, qi) {
    var optHtml = q.options.map(function (opt, oi) {
      return '<button class="quiz-option" data-qi="' + qi + '" data-oi="' + oi + '" data-correct="' + q.correct + '" onclick="handleQuizOption(this,' + qi + ',' + oi + ',' + q.correct + ')">'
        + '<span class="quiz-option-label">' + String.fromCharCode(65 + oi) + '</span>'
        + '<span class="quiz-option-text">' + opt + '</span>'
        + '</button>';
    }).join('');

    return '<div class="quiz-card" id="quiz-card-' + qi + '">'
      + '<div class="quiz-q-num">Câu ' + (qi + 1) + '/' + questions.length + '</div>'
      + '<div class="quiz-question">' + q.question + '</div>'
      + '<div class="quiz-options" id="quiz-opts-' + qi + '">' + optHtml + '</div>'
      + '<div class="quiz-explanation" id="quiz-exp-' + qi + '" style="display:none">'
      + '<i class="fa-solid fa-circle-info"></i>'
      + '<span>' + q.explanation + '</span>'
      + '</div>'
      + '</div>';
  }).join('');

  html += '<div class="quiz-result" id="quiz-result" style="display:none">'
    + '<div class="quiz-result-icon" id="quiz-result-icon"></div>'
    + '<div class="quiz-result-score" id="quiz-result-score"></div>'
    + '<div class="quiz-result-msg" id="quiz-result-msg"></div>'
    + '<button class="btn btn-outline btn-sm" onclick="resetQuiz()"><i class="fa-solid fa-rotate-right"></i> Làm lại</button>'
    + '</div>';

  wrap.innerHTML = html;
}

function handleQuizOption(btn, qi, oi, correct) {
  if (quizState.answered[qi]) return; // already answered
  quizState.answered[qi] = true;

  var optsEl = document.getElementById('quiz-opts-' + qi);
  var expEl  = document.getElementById('quiz-exp-' + qi);

  // Disable all options in this question
  optsEl.querySelectorAll('.quiz-option').forEach(function (b) {
    b.disabled = true;
    var idx = parseInt(b.dataset.oi, 10);
    if (idx === correct)    b.classList.add('correct');
    else if (b === btn)     b.classList.add('wrong');
    else                    b.classList.add('dimmed');
  });

  // Show explanation
  expEl.style.display = 'flex';

  // Track score
  if (oi === correct) quizState.score++;

  // Check if all answered
  var allDone = quizState.answered.every(function (v) { return v; });
  if (allDone) {
    setTimeout(showQuizResult, 400);
  }
}

function showQuizResult() {
  var resultEl  = document.getElementById('quiz-result');
  var iconEl    = document.getElementById('quiz-result-icon');
  var scoreEl   = document.getElementById('quiz-result-score');
  var msgEl     = document.getElementById('quiz-result-msg');
  var s = quizState.score;
  var t = quizState.total;
  var pct = Math.round((s / t) * 100);

  if (pct === 100) {
    iconEl.innerHTML = '<i class="fa-solid fa-trophy" style="color:#f6c315"></i>';
    msgEl.textContent = 'Xuất sắc! Bạn nắm vững toàn bộ nội dung module.';
  } else if (pct >= 75) {
    iconEl.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#5ea12a"></i>';
    msgEl.textContent = 'Tốt lắm! Hãy xem lại phần bạn trả lời sai để củng cố thêm.';
  } else if (pct >= 50) {
    iconEl.innerHTML = '<i class="fa-solid fa-circle-half-stroke" style="color:#f6c315"></i>';
    msgEl.textContent = 'Khá ổn, nhưng nên đọc lại nội dung để hiểu sâu hơn.';
  } else {
    iconEl.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color:#e5303f"></i>';
    msgEl.textContent = 'Hãy đọc lại module này trước khi thử lại nhé.';
  }

  scoreEl.innerHTML = '<span class="quiz-score-num">' + s + '</span><span class="quiz-score-sep">/</span><span class="quiz-score-den">' + t + '</span><span class="quiz-score-pct">(' + pct + '%)</span>';
  resultEl.style.display = 'flex';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Track to Supabase
  var mod = allModules.find(function (x) { return x.id === currentModuleId; });
  if (mod) trackQuizAttempt(mod.id, mod.name, s, t, pct);
}

function resetQuiz() {
  var mod = allModules.find(function (x) { return x.id === currentModuleId; });
  if (mod) renderQuiz(mod.quiz || []);
}

// ════════════════════════════════════════
//  SCROLL READING TRACKER
// ════════════════════════════════════════
var scrollObserver = null;
var scrollHandler  = null;

function setupScrollProgress(totalSteps) {
  // Cleanup previous
  if (scrollObserver) { scrollObserver.disconnect(); scrollObserver = null; }
  if (scrollHandler)  { window.removeEventListener('scroll', scrollHandler); scrollHandler = null; }
  if (!totalSteps) return;

  var stepEls     = document.querySelectorAll('#detail-steps .process-step');
  var detailMain  = document.querySelector('.detail-main');
  var fillEl      = document.getElementById('detail-progress-fill');
  var labelEl     = document.getElementById('detail-progress-label');
  var currentIdx  = -1;

  function updateActive(idx) {
    if (idx === currentIdx) return;
    currentIdx = idx;
    stepEls.forEach(function (_, i) {
      var dot = document.getElementById('tracker-step-' + i);
      if (!dot) return;
      dot.className = 'step-dot-item' + (i === idx ? ' active' : '');
    });
    // Scroll active dot into view inside sidebar
    var activeDot = document.getElementById('tracker-step-' + idx);
    if (activeDot) activeDot.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // IntersectionObserver — detect which step is in view
  scrollObserver = new IntersectionObserver(function (entries) {
    // Find the topmost intersecting step
    var visible = [];
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        visible.push(Array.prototype.indexOf.call(stepEls, entry.target));
      }
    });
    if (visible.length) updateActive(Math.min.apply(null, visible));
  }, { threshold: 0.3, rootMargin: '-10% 0px -50% 0px' });

  stepEls.forEach(function (el) { scrollObserver.observe(el); });

  window.addEventListener('scroll', function(){}, { passive: true }); // keep passive hint
}
