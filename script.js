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
    prerequisites: [],
    hotspotImage: '/assets/images/hero/hero-02.jpg',
    hotspots: [
      { x: 18, y: 28, label: 'Bước 1: Chuẩn bị', description: 'HR gửi welcome email, IT chuẩn bị tài khoản và thiết bị trước ngày nhân viên vào.' },
      { x: 52, y: 52, label: 'Bước 2: Ngày đầu tiên', description: 'Check-in lúc 8:30, nhận badge tạm, orientation với manager và tour văn phòng.' },
      { x: 80, y: 30, label: 'Bước 3: Tuần 1', description: 'Đào tạo hệ thống nội bộ, hoàn thành các module LMS bắt buộc trong 7 ngày.' }
    ],
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
    prerequisites: ['M001'],
    hotspotImage: '', hotspots: [],
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
    prerequisites: ['M001'],
    hotspotImage: '/assets/images/hero/hero-07.jpg',
    hotspots: [
      { x: 22, y: 35, label: 'Lối thoát hiểm', description: 'Cửa thoát hiểm chính nằm đầu hành lang, luôn giữ thông thoáng, không được khóa trong giờ làm việc.' },
      { x: 68, y: 25, label: 'Bình chữa cháy', description: 'Kiểm tra định kỳ 6 tháng/lần. Báo ngay cho Security nếu phát hiện bình hỏng hoặc hết hạn.' },
      { x: 45, y: 65, label: 'Điểm tập trung', description: 'Khi có báo động, tập trung tại sân trước tòa nhà. Không quay lại trong khi chưa có lệnh an toàn.' }
    ],
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
    prerequisites: ['M002', 'M003'],
    hotspotImage: '', hotspots: [],
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
    prerequisites: ['M002'],
    hotspotImage: '', hotspots: [],
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
var currentQuizData = [];  // store current quiz questions for per-question tracking
var _answeredKeys   = new Set(); // dedup quiz_answers inserts: "moduleId-qi" per session
var filterMotionTimer = null;
var filterMotionCleanupTimer = null;

// Category icon map — for badge accessibility (color + icon, not color alone)
var CAT_ICONS = { Policy: 'fa-file-shield', Process: 'fa-diagram-project', Safety: 'fa-triangle-exclamation' };

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
    return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch];
  });
}

function escAttr(value) {
  return esc(value);
}

function safeUrl(value, fallback, opts) {
  fallback = fallback || '';
  opts = opts || {};
  var raw = String(value == null ? '' : value).trim();
  if (!raw) return fallback;
  if (raw === '#') return opts.allowHash ? '#' : fallback;

  try {
    var parsed = new URL(raw, window.location.origin);
    var isLocal = parsed.origin === window.location.origin;
    var localOk = (opts.localPrefixes || []).some(function (prefix) {
      return parsed.pathname.indexOf(prefix) === 0;
    }) || (opts.localFiles || []).indexOf(parsed.pathname) >= 0;

    if (isLocal && localOk) return parsed.pathname + parsed.search + parsed.hash;
    if (opts.allowHttps && parsed.protocol === 'https:') return parsed.href;
  } catch (err) {}

  return fallback;
}

function safeImageUrl(value, fallback) {
  return safeUrl(value, fallback || '', {
    allowHttps: true,
    localPrefixes: ['/assets/'],
    localFiles: ['/hero-bg.png', '/hero.png']
  });
}

function safeResourceUrl(value) {
  return safeUrl(value, '#', {
    allowHash: true,
    allowHttps: true,
    localPrefixes: ['/assets/', '/fonts/', '/data/'],
    localFiles: ['/hero-bg.png', '/hero.png']
  });
}

function safeVideoUrl(value) {
  var raw = String(value == null ? '' : value).trim();
  if (!raw) return '';
  try {
    var parsed = new URL(raw);
    var allowedHost = parsed.hostname === 'www.youtube.com' || parsed.hostname === 'www.youtube-nocookie.com';
    if (parsed.protocol === 'https:' && allowedHost && parsed.pathname.indexOf('/embed/') === 0) {
      return parsed.href;
    }
  } catch (err) {}
  return '';
}

function safeResourceType(value) {
  return ({ pdf:true, pptx:true, doc:true, video:true })[value] ? value : 'doc';
}

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
//  ANNOUNCEMENT BANNER
// ════════════════════════════════════════
function loadAnnouncement() {
  if (!_sbReady()) return;
  fetch(SB_URL + '/rest/v1/announcements?select=id,message,type&active=eq.true&order=created_at.desc&limit=1', {
    headers: { 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON }
  })
  .then(function (r) { return r.ok ? r.json() : []; })
  .then(function (rows) {
    if (!rows || !rows.length) return;
    var ann = rows[0];
    if (localStorage.getItem('lms-ann-' + ann.id)) return;
    window._announcementId = ann.id;
    document.getElementById('announcement-text').textContent = ann.message;
    var banner = document.getElementById('announcement-banner');
    banner.className = 'announcement-banner ann-' + (ann.type || 'info');
    banner.style.display = '';
  })
  .catch(function () {});
}

function dismissAnnouncement() {
  if (window._announcementId) localStorage.setItem('lms-ann-' + window._announcementId, '1');
  document.getElementById('announcement-banner').style.display = 'none';
}

// ════════════════════════════════════════
//  READING PROGRESS BAR
// ════════════════════════════════════════
function updateReadingProgress() {
  var bar = document.getElementById('reading-progress-bar');
  if (!bar) return;
  var pageDetail = document.getElementById('page-detail');
  if (!pageDetail || pageDetail.style.display === 'none') {
    bar.style.width = '0%';
    return;
  }
  var total = document.documentElement.scrollHeight - window.innerHeight;
  var pct   = total > 0 ? Math.min(100, Math.round((window.scrollY / total) * 100)) : 0;
  bar.style.width = pct + '%';
}

// ════════════════════════════════════════
//  MARK AS DONE
// ════════════════════════════════════════
function markDone() {
  if (!currentModuleId) return;
  var key  = 'lms-done-' + currentModuleId;
  var done = !!localStorage.getItem(key);
  if (done) {
    localStorage.removeItem(key);
    updateDoneBtn(false);
    showToast('Đã bỏ đánh dấu hoàn thành', 'info');
  } else {
    localStorage.setItem(key, '1');
    updateDoneBtn(true);
    showToast('Đã đánh dấu hoàn thành!', 'success');
  }
  filterAndRender(); // update cards
  updateStatsStrip();
  renderAiRecommend();
}

function isDone(id) { return !!localStorage.getItem('lms-done-' + id); }

function updateDoneBtn(done) {
  var btn = document.getElementById('btn-mark-done');
  var note = document.getElementById('detail-completion-note');
  if (!btn) return;
  if (done) {
    btn.className   = 'btn btn-sm btn-success-outline';
    btn.setAttribute('aria-pressed', 'true');
    if (note) {
      note.className = 'detail-completion-note done';
      note.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Đã hoàn thành</span>';
    }
    btn.innerHTML   = '<i class="fa-solid fa-circle-check"></i> Đã hoàn thành';
  } else {
    btn.className   = 'btn btn-sm btn-outline';
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML   = '<i class="fa-regular fa-circle-check"></i> Đánh dấu hoàn thành';
    if (note) {
      note.className = 'detail-completion-note';
      note.innerHTML = '<i class="fa-regular fa-circle"></i><span>Chưa hoàn thành</span>';
    }
  }
}

// ════════════════════════════════════════
//  SHARE MODULE
// ════════════════════════════════════════
function shareModule() {
  if (!currentModuleId) return;
  var url = window.location.origin + window.location.pathname + '?module=' + currentModuleId;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function () { showToast('Đã copy link module!', 'success'); });
  } else {
    var inp = document.createElement('input');
    inp.value = url; document.body.appendChild(inp); inp.select();
    document.execCommand('copy'); inp.remove();
    showToast('Đã copy link module!', 'success');
  }
}

// ════════════════════════════════════════
//  PERSONAL NOTES
// ════════════════════════════════════════
var _notesTimer = null;
function loadNotes(id) {
  var ta = document.getElementById('notes-textarea');
  if (ta) ta.value = localStorage.getItem('lms-notes-' + id) || '';
  document.getElementById('notes-saved').textContent = '';
}
function saveNotes() {
  if (!currentModuleId) return;
  var ta = document.getElementById('notes-textarea');
  if (!ta) return;
  localStorage.setItem('lms-notes-' + currentModuleId, ta.value);
  var el = document.getElementById('notes-saved');
  if (el) { el.textContent = 'Đã lưu ✓'; setTimeout(function () { el.textContent = ''; }, 2000); }
}
function clearNotes() {
  var ta = document.getElementById('notes-textarea');
  if (!ta || !ta.value) return;
  if (!confirm('Xóa toàn bộ ghi chú cho module này?')) return;
  ta.value = '';
  if (currentModuleId) localStorage.removeItem('lms-notes-' + currentModuleId);
}

// ════════════════════════════════════════
//  COMPLETION CERTIFICATE
// ════════════════════════════════════════
var _certScore = 0; var _certTotal = 0;
function showCertificate(score, total) {
  _certScore = score; _certTotal = total;
  var mod = allModules.find(function (m) { return m.id === currentModuleId; });
  document.getElementById('cert-module-name').textContent  = mod ? mod.name : '';
  document.getElementById('cert-score-display').textContent = 'Kết quả: ' + score + '/' + total + ' (' + Math.round((score / total) * 100) + '%)';
  document.getElementById('cert-date').textContent = 'Ngày ' + new Date().toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
  document.getElementById('cert-name-input').value = localStorage.getItem('lms-cert-name') || '';
  document.getElementById('cert-learner-name').textContent = localStorage.getItem('lms-cert-name') || 'Học viên';
  document.getElementById('modal-certificate').classList.add('open'); // use .open for proper fade-in animation
}

// ════════════════════════════════════════
//  USAGE GUIDE — 5-step user journey
// ════════════════════════════════════════
var _guideStep = 0;
var _GUIDE_STEPS = [
  {
    icon: 'fa-graduation-cap',
    color: '#a50064',
    bg: 'linear-gradient(135deg,#ffeff4 0%,#fec8dc 100%)',
    eyebrow: 'BƯỚC 1 / 5',
    title: 'Chào mừng đến Mentora LMS',
    desc: 'Hệ thống đào tạo nội bộ MoMo — nơi bạn nắm vững chính sách, quy trình và tiêu chuẩn nghề nghiệp. Không cần cài đặt, học ngay trên trình duyệt.',
    features: [
      { icon: 'fa-mobile-screen-button', text: 'Học mọi lúc, mọi nơi — máy tính hoặc điện thoại' },
      { icon: 'fa-chart-line',           text: 'Tiến độ được lưu tự động theo phiên' },
      { icon: 'fa-shield-halved',        text: 'Dành riêng cho nhân viên nội bộ MoMo' },
    ]
  },
  {
    icon: 'fa-layer-group',
    color: '#7759d2',
    bg: 'linear-gradient(135deg,#f0ecff 0%,#d4c8f8 100%)',
    eyebrow: 'BƯỚC 2 / 5',
    title: 'Chọn Module để bắt đầu',
    desc: 'Tất cả module được chia theo 3 danh mục rõ ràng. Dùng bộ lọc hoặc thanh tìm kiếm để tìm nhanh nội dung phù hợp.',
    features: [
      { icon: 'fa-file-shield',          text: 'Policy — chính sách, quy định nội bộ' },
      { icon: 'fa-diagram-project',      text: 'Process — quy trình & thủ tục làm việc' },
      { icon: 'fa-triangle-exclamation', text: 'Safety — an toàn lao động & PCCC' },
      { icon: 'fa-magnifying-glass',     text: 'Tìm kiếm theo tên hoặc từ khóa' },
    ]
  },
  {
    icon: 'fa-book-open-reader',
    color: '#0891b2',
    bg: 'linear-gradient(135deg,#e0f7fc 0%,#b2ebf2 100%)',
    eyebrow: 'BƯỚC 3 / 5',
    title: 'Đọc nội dung từng bước',
    desc: 'Mỗi module được trình bày theo từng bước tuần tự — rõ ràng, có trọng tâm. Thanh tiến trình bên phải giúp bạn luôn biết đang ở đâu.',
    features: [
      { icon: 'fa-list-check',     text: 'Quy trình chia bước — dễ theo và ghi nhớ' },
      { icon: 'fa-circle-play',    text: 'Video hướng dẫn thực tế (nếu có)' },
      { icon: 'fa-paperclip',      text: 'Tài liệu PDF / PPTX để tải về' },
      { icon: 'fa-note-sticky',    text: 'Ghi chú cá nhân — tự lưu, không mất khi tắt tab' },
    ]
  },
  {
    icon: 'fa-circle-question',
    color: '#5ea12a',
    bg: 'linear-gradient(135deg,#e5f9f2 0%,#a2e6ce 100%)',
    eyebrow: 'BƯỚC 4 / 5',
    title: 'Kiểm tra kiến thức',
    desc: 'Cuối mỗi module có bài quiz trắc nghiệm. Mỗi câu hỏi hiển thị giải thích ngay sau khi bạn chọn — dù đúng hay sai.',
    features: [
      { icon: 'fa-bullseye',        text: 'Cần đạt ≥ 75% để qua bài và nhận chứng chỉ' },
      { icon: 'fa-lightbulb',       text: 'Giải thích chi tiết cho từng đáp án' },
      { icon: 'fa-rotate-right',    text: 'Làm lại không giới hạn số lần' },
      { icon: 'fa-circle-check',    text: 'Đạt quiz → tự động đánh dấu module hoàn thành' },
    ]
  },
  {
    icon: 'fa-trophy',
    color: '#c07c00',
    bg: 'linear-gradient(135deg,#fffbea 0%,#fde68a 100%)',
    eyebrow: 'BƯỚC 5 / 5',
    title: 'Nhận thành quả của bạn',
    desc: 'Hoàn thành quiz với kết quả tốt → nhận chứng chỉ cá nhân có thể in. Chia sẻ link module để đồng nghiệp cùng học.',
    features: [
      { icon: 'fa-certificate',    text: 'Chứng chỉ hoàn thành — nhập tên và in trực tiếp' },
      { icon: 'fa-circle-check',   text: 'Badge ✓ xuất hiện trên card module đã học xong' },
      { icon: 'fa-share-nodes',    text: 'Copy link module chia sẻ cho đồng nghiệp' },
      { icon: 'fa-envelope',       text: 'Câu hỏi thêm: liên hệ HR-L&OD qua email nội bộ' },
    ]
  },
];

function showGuide() {
  _guideStep = 0;
  var overlay = document.getElementById('modal-guide');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id        = 'modal-guide';
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal-box guide-box">'
      // Header: dots + close
      + '<div class="guide-header">'
      +   '<div class="guide-dots" id="guide-dots"></div>'
      +   '<button class="btn btn-ghost btn-icon guide-close-btn" id="guide-close"><i class="fa-solid fa-xmark"></i></button>'
      + '</div>'
      // Visual illustration area
      + '<div class="guide-visual" id="guide-visual"><i class="fa-solid fa-graduation-cap guide-visual-icon" id="guide-icon"></i></div>'
      // Animated content area
      + '<div class="guide-content" id="guide-content">'
      +   '<div class="guide-eyebrow" id="guide-eyebrow"></div>'
      +   '<div class="guide-title" id="guide-title"></div>'
      +   '<div class="guide-desc" id="guide-desc"></div>'
      +   '<ul class="guide-features" id="guide-features"></ul>'
      + '</div>'
      // Footer nav
      + '<div class="guide-footer">'
      +   '<button class="btn btn-ghost btn-sm" id="guide-prev"><i class="fa-solid fa-chevron-left"></i> Quay lại</button>'
      +   '<button class="btn btn-primary btn-sm" id="guide-next">Tiếp theo <i class="fa-solid fa-chevron-right"></i></button>'
      +   '<button class="btn btn-primary btn-sm" id="guide-start" style="display:none"><i class="fa-solid fa-rocket"></i> Bắt đầu học!</button>'
      + '</div>'
      + '</div>';
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.classList.remove('open'); });
    overlay.querySelector('#guide-close').addEventListener('click', function () { overlay.classList.remove('open'); });
    overlay.querySelector('#guide-prev').addEventListener('click', function () { _goGuideStep(-1); });
    overlay.querySelector('#guide-next').addEventListener('click', function () { _goGuideStep(1); });
    overlay.querySelector('#guide-start').addEventListener('click', function () {
      overlay.classList.remove('open');
      document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
      showToast('Chọn một module để bắt đầu! 🚀', 'success');
    });
    document.body.appendChild(overlay);
  }
  _renderGuideStep(0, 0);
  overlay.classList.add('open');
}

function _goGuideStep(dir) {
  var next = _guideStep + dir;
  if (next < 0 || next >= _GUIDE_STEPS.length) return;
  _renderGuideStep(next, dir);
}

function _renderGuideStep(idx, dir) {
  var step    = _GUIDE_STEPS[idx];
  var content = document.getElementById('guide-content');
  var visual  = document.getElementById('guide-visual');

  // Animate out
  content.style.transition = 'opacity .18s ease, transform .18s ease';
  content.style.opacity    = '0';
  content.style.transform  = 'translateX(' + (dir >= 0 ? '18px' : '-18px') + ')';

  setTimeout(function () {
    _guideStep = idx;

    // Update visual blob
    visual.style.background = step.bg;
    document.getElementById('guide-icon').className = 'fa-solid ' + step.icon + ' guide-visual-icon';
    document.getElementById('guide-icon').style.color = step.color;

    // Update dots
    var dotsEl = document.getElementById('guide-dots');
    dotsEl.innerHTML = _GUIDE_STEPS.map(function (_, i) {
      return '<span class="guide-dot' + (i === idx ? ' active' : '') + '"></span>';
    }).join('');

    // Update text
    document.getElementById('guide-eyebrow').textContent = step.eyebrow;
    document.getElementById('guide-title').textContent   = step.title;
    document.getElementById('guide-desc').textContent    = step.desc;

    // Update features
    document.getElementById('guide-features').innerHTML = step.features.map(function (f) {
      return '<li class="guide-feature">'
        + '<span class="guide-feat-icon"><i class="fa-solid ' + f.icon + '"></i></span>'
        + '<span>' + f.text + '</span>'
        + '</li>';
    }).join('');

    // Toggle buttons
    var isFirst = idx === 0;
    var isLast  = idx === _GUIDE_STEPS.length - 1;
    document.getElementById('guide-prev').style.visibility  = isFirst ? 'hidden' : '';
    document.getElementById('guide-next').style.display     = isLast  ? 'none'   : '';
    document.getElementById('guide-start').style.display    = isLast  ? ''       : 'none';

    // Animate in from opposite direction
    content.style.transition = 'none';
    content.style.transform  = 'translateX(' + (dir >= 0 ? '-18px' : '18px') + ')';
    content.offsetWidth; // force reflow
    content.style.transition = 'opacity .22s ease, transform .22s ease';
    content.style.opacity    = '1';
    content.style.transform  = 'translateX(0)';
  }, 185);
}
function applyCertName() {
  var name = document.getElementById('cert-name-input').value.trim() || 'Học viên';
  localStorage.setItem('lms-cert-name', name);
  document.getElementById('cert-learner-name').textContent = name;
  showToast('Đã cập nhật tên!', 'success');
}

// ════════════════════════════════════════
//  STREAK COUNTER
// ════════════════════════════════════════
function updateStreak() {
  var today = new Date().toISOString().slice(0, 10);
  var last  = localStorage.getItem('lms-streak-date');
  var count = parseInt(localStorage.getItem('lms-streak-count') || '0', 10);
  if (last === today) return; // already counted today
  var yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  count = (last === yesterday.toISOString().slice(0, 10)) ? count + 1 : 1;
  localStorage.setItem('lms-streak-date',  today);
  localStorage.setItem('lms-streak-count', String(count));
}
function getStreak() {
  return parseInt(localStorage.getItem('lms-streak-count') || '0', 10);
}

// ════════════════════════════════════════
//  LEARNER STATS STRIP
// ════════════════════════════════════════
function updateStatsStrip() {
  if (!allModules.length) return;
  var total     = allModules.length;
  var completed = allModules.filter(function(m) { return isDone(m.id); }).length;
  var pct       = Math.round((completed / total) * 100);
  var scores    = allModules.map(function(m) {
    var s = localStorage.getItem('lms-quiz-score-' + m.id);
    return s !== null ? parseFloat(s) : null;
  }).filter(function(s) { return s !== null; });
  var avgScore  = scores.length
    ? Math.round(scores.reduce(function(a,b){return a+b;},0) / scores.length) + '%'
    : '—';

  var el = document.getElementById('stats-strip');
  if (!el) return;
  document.getElementById('strip-completed').textContent     = completed;
  document.getElementById('strip-total').textContent         = total;
  document.getElementById('strip-avg-score').textContent     = avgScore;
  document.getElementById('strip-streak').textContent        = getStreak();
  document.getElementById('strip-progress-label').textContent = pct + '%';
  var fill = document.getElementById('strip-progress-fill');
  var bar  = el.querySelector('[role="progressbar"]');
  if (fill) fill.style.width = pct + '%';
  if (bar)  bar.setAttribute('aria-valuenow', pct);

  // Streak color boost (gamification)
  var streakEl = document.getElementById('strip-streak');
  var streak   = getStreak();
  if (streakEl) {
    streakEl.style.color = streak >= 7 ? '#f6c315' : streak >= 3 ? '#a50064' : '';
  }
}

// ════════════════════════════════════════
//  INIT
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {

  // ── Streak — counted on every daily visit ──
  updateStreak();

  // ── Mobile drawer ──
  function openDrawer() {
    document.getElementById('mobile-drawer').classList.add('open');
    document.getElementById('drawer-overlay').classList.add('active');
    document.body.classList.add('drawer-open');
    document.getElementById('nav-toggle').setAttribute('aria-label', 'Đóng menu');
  }
  function closeDrawer() {
    document.getElementById('mobile-drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('active');
    document.body.classList.remove('drawer-open');
    document.getElementById('nav-toggle').setAttribute('aria-label', 'Mở menu');
  }
  window.openDrawer = openDrawer;
  window.closeDrawer = closeDrawer;

  document.getElementById('nav-toggle').addEventListener('click', function () {
    var isOpen = document.getElementById('mobile-drawer').classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  // ── Theme ──
  var themeBtn  = document.getElementById('btn-theme');
  var themeIcon = document.getElementById('theme-icon');
  function _syncDrawerTheme(isDark) {
    var icon = document.getElementById('drawer-theme-icon');
    var label = document.getElementById('drawer-theme-label');
    if (!icon || !label) return;
    if (isDark) { icon.className = 'fa-solid fa-sun'; label.textContent = 'Giao diện sáng'; }
    else        { icon.className = 'fa-solid fa-moon'; label.textContent = 'Giao diện tối'; }
  }
  function applyTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeIcon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    themeIcon.setAttribute('aria-hidden', 'true');
    themeBtn.setAttribute('aria-label', dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
    _syncDrawerTheme(dark);
  }
  function toggleTheme() {
    var isDark = !document.body.classList.contains('dark');
    localStorage.setItem('lms-theme', isDark ? 'dark' : 'light');
    applyTheme(isDark);
  }
  window.toggleTheme = toggleTheme;
  applyTheme(localStorage.getItem('lms-theme') === 'dark');
  themeBtn.addEventListener('click', toggleTheme);

  // ── Nav scroll links (navbar + drawer) ──
  document.querySelectorAll('[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      closeDrawer();
      showPage('list');
      setTimeout(function () {
        var target = document.getElementById(link.dataset.scroll);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else showToast('Trang này đang được phát triển.', 'info');
      }, 50);
      document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });

  // ── Modals ──
  function openModal(id)  { document.getElementById(id).classList.add('open'); }
  function closeModal(id) { document.getElementById(id).classList.remove('open'); }
  document.querySelectorAll('[data-close]').forEach(function (btn) {
    btn.addEventListener('click', function () { closeModal(btn.dataset.close); });
  });
  document.querySelectorAll('.modal-overlay').forEach(function (o) {
    o.addEventListener('click', function (e) { if (e.target === o) o.classList.remove('open'); });
  });

  // ── ESC key closes any open modal ──
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-overlay.open').forEach(function (m) {
      m.classList.remove('open');
    });
  });

  // ── Filter tabs ──
  var filterTabs = document.getElementById('filter-tabs');
  filterTabs.addEventListener('click', function (e) {
    var tab = e.target.closest('.filter-tab');
    if (!tab) return;
    activateFilterTab(tab);
  });
  filterTabs.addEventListener('keydown', function (e) {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(e.key) < 0) return;
    var tabs = Array.prototype.slice.call(filterTabs.querySelectorAll('.filter-tab'));
    var current = document.activeElement.closest('.filter-tab') || filterTabs.querySelector('.filter-tab.active');
    var idx = Math.max(0, tabs.indexOf(current));
    if (e.key === 'ArrowRight') idx = (idx + 1) % tabs.length;
    if (e.key === 'ArrowLeft') idx = (idx - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') idx = 0;
    if (e.key === 'End') idx = tabs.length - 1;
    e.preventDefault();
    tabs[idx].focus();
    activateFilterTab(tabs[idx]);
  });
  activateFilterTab(filterTabs.querySelector('.filter-tab.active'), true);
  window.addEventListener('resize', function () { syncFilterTabIndicator(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { syncFilterTabIndicator(); }).catch(function () {});
  }

  // ── Search ──
  document.getElementById('input-search').addEventListener('keyup', filterAndRender);

  // ── Card click ──
  document.getElementById('modules-grid').addEventListener('click', function (e) {
    var card = e.target.closest('.module-card[data-id]');
    if (card) openDetail(card.dataset.id);
  });
  document.getElementById('modules-grid').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var card = e.target.closest('.module-card[data-id]');
    if (!card) return;
    e.preventDefault();
    openDetail(card.dataset.id);
  });

  // ── Reading progress bar ──
  window.addEventListener('scroll', updateReadingProgress, { passive: true });

  // ── Notes auto-save ──
  var notesEl = document.getElementById('notes-textarea');
  if (notesEl) {
    notesEl.addEventListener('input', function () {
      clearTimeout(_notesTimer);
      _notesTimer = setTimeout(saveNotes, 800);
    });
  }

  // ── Announcement ──
  loadAnnouncement();

  // ── Load modules, then check URL param ──
  loadModules();
  setTimeout(function () {
    var params = new URLSearchParams(window.location.search);
    var mid    = params.get('module');
    if (!mid) return;
    var tryOpen = function (attempts) {
      var m = allModules.find(function (x) { return x.id === mid; });
      if (m) {
        openDetail(mid);
      } else if (attempts > 0) {
        setTimeout(function () { tryOpen(attempts - 1); }, 300);
      } else {
        // Module not found after all retries — show helpful message
        showToast('Không tìm thấy module "' + mid + '". Link có thể đã hết hạn.', 'error');
        // Clean URL so user isn't confused on refresh
        window.history.replaceState({}, '', window.location.pathname);
      }
    };
    tryOpen(10);
  }, 200);
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
    ? fetch(SB_URL + '/rest/v1/modules_cms?select=id,data,status,sort_order&order=sort_order.asc,created_at.asc', {
        headers: { 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON }
      })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        return rows
          .filter(function (r) {
            // Only show published modules; fall back to active check for legacy rows
            if (r.status) return r.status === 'published';
            return r.active !== false;
          })
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
      updateStatsStrip();
      renderAiRecommend();
    })
    .catch(function (err) {
      console.warn('loadModules error:', err.message);
      allModules = SAMPLE_MODULES;
      showSkeleton(false);
      renderModules(allModules);
      updateHeroCount();
      updateStatsStrip();
      renderAiRecommend();
    });
}

function updateHeroCount() {
  var el = document.getElementById('hero-module-count');
  if (el) el.textContent = allModules.length + ' modules đang hoạt động';
}

// ════════════════════════════════════════
//  AI RECOMMENDATION
// ════════════════════════════════════════
function getAiRecommendation() {
  var undone = allModules.filter(function (m) { return !isDone(m.id); });
  if (!undone.length) return null;

  var completedCats = {};
  allModules.forEach(function (m) {
    if (isDone(m.id)) completedCats[m.category] = (completedCats[m.category] || 0) + 1;
  });

  var scored = undone.map(function (m) {
    var score = 50;
    score += (completedCats[m.category] || 0) * 20;          // boost same category streak
    if (!localStorage.getItem('lms-quiz-score-' + m.id)) score += 15; // never attempted
    var unmet = (m.prerequisites || []).filter(function (pid) { return !isDone(pid); }).length;
    score -= unmet * 40;                                      // penalise locked prereqs
    score += Math.min(getStreak(), 5) * 2;                    // streak momentum
    return { m: m, score: score };
  });
  scored.sort(function (a, b) { return b.score - a.score; });
  return scored[0] ? scored[0].m : null;
}

function renderAiRecommend() {
  var banner = document.getElementById('ai-recommend-banner');
  if (!banner || !allModules.length) return;
  var rec = getAiRecommendation();
  if (!rec) { banner.style.display = 'none'; return; }

  var completedCount = allModules.filter(function (m) { return isDone(m.id); }).length;
  var doneSameCat    = allModules.filter(function (x) { return isDone(x.id) && x.category === rec.category; }).length;
  var reason;
  if (doneSameCat > 0)            reason = 'Bạn đang học tốt nhóm ' + rec.category + ' — tiếp tục chuỗi này';
  else if (completedCount === 0)  reason = 'Module đề xuất để bắt đầu lộ trình của bạn';
  else if (getStreak() >= 3)      reason = 'Bạn đang có streak ' + getStreak() + ' ngày — duy trì đà học!';
  else                            reason = 'Module phù hợp với tiến độ hiện tại của bạn';

  banner.style.display = '';
  banner.innerHTML =
    '<div class="ai-recommend-icon"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i></div>'
    + '<div class="ai-recommend-body">'
    + '<div class="ai-recommend-label">✦ Gợi ý tiếp theo</div>'
    + '<div class="ai-recommend-name">' + esc(rec.name || '') + '</div>'
    + '<div class="ai-recommend-reason">' + esc(reason) + ' · ' + esc(rec.duration || '') + '</div>'
    + '</div>'
    + '<button class="btn btn-primary btn-sm ai-recommend-btn" onclick="openDetail(\'' + escAttr(rec.id || '') + '\')">'
    + '<i class="fa-solid fa-arrow-right"></i> Học ngay'
    + '</button>';
}

// ════════════════════════════════════════
//  INTERACTIVE HOTSPOTS
// ════════════════════════════════════════
function renderHotspots(m) {
  var section = document.getElementById('section-hotspot');
  var wrap    = document.getElementById('hotspot-wrap');
  if (!section || !wrap) return;
  if (!m.hotspotImage || !(m.hotspots && m.hotspots.length)) {
    section.style.display = 'none';
    return;
  }
  var imgSrc = safeImageUrl(m.hotspotImage, '');
  if (!imgSrc) { section.style.display = 'none'; return; }

  section.style.display = '';
  var pinsHtml = (m.hotspots || []).map(function (h, i) {
    return '<div class="hotspot-pin" id="hpin-' + i + '"'
      + ' style="left:' + h.x + '%;top:' + h.y + '%"'
      + ' tabindex="0" role="button" aria-label="' + escAttr(h.label || '') + '"'
      + ' onclick="toggleHotspotPin(event,' + i + ')"'
      + ' onkeydown="if(event.key===\'Enter\'||event.key===\' \'){toggleHotspotPin(event,' + i + ');event.preventDefault();}">'
      + '<div class="pin-dot"><i class="fa-solid fa-plus" aria-hidden="true"></i></div>'
      + '<div class="pin-popup" role="tooltip">'
      + '<div class="pin-label">' + esc(h.label || '') + '</div>'
      + '<div class="pin-desc">'  + esc(h.description || '') + '</div>'
      + '</div></div>';
  }).join('');

  wrap.innerHTML = '<img src="' + escAttr(imgSrc) + '" class="hotspot-img" alt="Sơ đồ tương tác" loading="lazy">'
    + pinsHtml;
}

function toggleHotspotPin(e, idx) {
  e.stopPropagation();
  var pin      = document.getElementById('hpin-' + idx);
  if (!pin) return;
  var wasActive = pin.classList.contains('active');
  document.querySelectorAll('.hotspot-pin').forEach(function (p) { p.classList.remove('active'); });
  if (!wasActive) pin.classList.add('active');
}

// ════════════════════════════════════════
//  KNOWLEDGE MAP
// ════════════════════════════════════════
function renderKnowledgeMap() {
  var nodesEl = document.getElementById('map-nodes');
  var svgEl   = document.getElementById('map-svg');
  if (!nodesEl || !svgEl || !allModules.length) return;

  var catCls = { Policy:'badge-policy', Process:'badge-process', Safety:'badge-safety' };

  nodesEl.innerHTML = allModules.map(function (m) {
    var done       = isDone(m.id);
    var prereqs    = m.prerequisites || [];
    var metPrereqs = prereqs.every(function (pid) { return isDone(pid); });
    var locked     = prereqs.length > 0 && !metPrereqs && !done;
    var state      = done ? 'done' : locked ? 'locked' : 'available';
    var icon       = safeImageUrl(m.icon || '/assets/icons/education.png', '/assets/icons/education.png');

    var stateHtml = done
      ? '<span class="map-node-state done"><i class="fa-solid fa-circle-check"></i> Hoàn thành</span>'
      : locked
        ? '<span class="map-node-state locked"><i class="fa-solid fa-lock"></i> Chưa mở</span>'
        : '<span class="map-node-state available"><i class="fa-solid fa-circle-play"></i> Sẵn sàng</span>';

    var clickAttrs = locked ? '' :
      ' onclick="openDetail(\'' + escAttr(m.id) + '\')" onkeydown="if(event.key===\'Enter\'){openDetail(\'' + escAttr(m.id) + '\');}"';

    return '<div class="map-node ' + state + '" id="mnode-' + escAttr(m.id) + '"'
      + (locked ? '' : ' role="button" tabindex="0"')
      + clickAttrs
      + ' data-id="' + escAttr(m.id) + '">'
      + (prereqs.length ? '<div class="map-prereq-tag">Có điều kiện</div>' : '')
      + '<div class="map-node-icon"><img src="' + escAttr(icon) + '" alt="" loading="lazy"></div>'
      + '<div class="map-node-name">' + esc(m.name || '') + '</div>'
      + '<div class="map-node-meta">'
      + '<span class="badge ' + (catCls[m.category] || 'badge-cat') + '" style="font-size:10px;padding:2px 7px">'
      + (CAT_ICONS[m.category] ? '<i class="fa-solid ' + CAT_ICONS[m.category] + '" aria-hidden="true"></i> ' : '')
      + esc(m.category || '') + '</span>'
      + stateHtml
      + '</div></div>';
  }).join('');

  // Draw SVG edges after layout settles
  setTimeout(function () { drawMapEdges(svgEl); }, 120);
}

function drawMapEdges(svgEl) {
  var wrapEl   = svgEl.parentElement;
  var wrapRect = wrapEl.getBoundingClientRect();
  if (!wrapRect.width) return;

  var lines = [];
  allModules.forEach(function (m) {
    (m.prerequisites || []).forEach(function (pid) {
      var fromEl = document.getElementById('mnode-' + pid);
      var toEl   = document.getElementById('mnode-' + m.id);
      if (!fromEl || !toEl) return;

      var fromR = fromEl.getBoundingClientRect();
      var toR   = toEl.getBoundingClientRect();
      var x1    = fromR.right  - wrapRect.left;
      var y1    = fromR.top    + fromR.height / 2 - wrapRect.top;
      var x2    = toR.left     - wrapRect.left;
      var y2    = toR.top      + toR.height  / 2 - wrapRect.top;
      var cx    = (x1 + x2) / 2;
      var done  = isDone(pid);
      var dc    = done ? ' done' : '';

      lines.push(
        '<path class="map-edge' + dc + '" d="M' + x1 + ',' + y1
        + ' C' + cx + ',' + y1 + ' ' + cx + ',' + y2 + ' ' + x2 + ',' + y2 + '"/>'
        + '<polygon class="map-arrowhead' + dc + '" points="'
        + x2 + ',' + y2 + ' '
        + (x2 - 8) + ',' + (y2 - 5) + ' '
        + (x2 - 8) + ',' + (y2 + 5) + '"/>'
      );
    });
  });

  svgEl.setAttribute('viewBox', '0 0 ' + wrapRect.width + ' ' + wrapRect.height);
  svgEl.style.height = wrapRect.height + 'px';
  svgEl.innerHTML    = lines.join('');
}

// ════════════════════════════════════════
//  PAGE NAVIGATION (SPA)
// ════════════════════════════════════════
function showPage(page) {
  var pageList   = document.getElementById('page-list');
  var pageDetail = document.getElementById('page-detail');
  var pageMap    = document.getElementById('page-map');
  // Hide all pages
  pageList.style.display   = 'none';
  pageDetail.style.display = 'none';
  if (pageMap) pageMap.style.display = 'none';

  if (page === 'list') {
    pageList.style.display = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateReadingProgress();
  } else if (page === 'map') {
    if (pageMap) {
      pageMap.style.display = '';
      window.scrollTo({ top: 0, behavior: 'instant' });
      renderKnowledgeMap();
    }
  } else {
    pageDetail.style.display = '';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function syncFilterTabIndicator(tab) {
  var tabs = document.getElementById('filter-tabs');
  if (!tabs) return;
  var active = tab || tabs.querySelector('.filter-tab.active') || tabs.querySelector('.filter-tab');
  if (!active) return;
  tabs.style.setProperty('--tab-indicator-x', active.offsetLeft + 'px');
  tabs.style.setProperty('--tab-indicator-w', active.offsetWidth + 'px');
}

function renderFilteredModulesWithMotion() {
  var grid = document.getElementById('modules-grid');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!grid || reduceMotion) {
    filterAndRender();
    return;
  }

  window.clearTimeout(filterMotionTimer);
  window.clearTimeout(filterMotionCleanupTimer);
  grid.classList.remove('is-filtering-in');
  grid.classList.add('is-filtering-out');

  filterMotionTimer = window.setTimeout(function () {
    filterAndRender();
    grid.classList.remove('is-filtering-out');
    grid.classList.add('is-filtering-in');
    filterMotionCleanupTimer = window.setTimeout(function () {
      grid.classList.remove('is-filtering-in');
    }, 260);
  }, 90);
}

function activateFilterTab(tab, skipRender) {
  if (!tab) return;
  var tabs = document.getElementById('filter-tabs');
  if (!tabs) return;
  var changed = activeCat !== tab.dataset.cat;

  tabs.querySelectorAll('.filter-tab').forEach(function (t) {
    var active = t === tab;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
    t.setAttribute('tabindex', active ? '0' : '-1');
  });

  activeCat = tab.dataset.cat || 'all';
  syncFilterTabIndicator(tab);
  tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });

  if (changed && !skipRender) renderFilteredModulesWithMotion();
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
    var searchValue = (document.getElementById('input-search').value || '').trim();
    var emptyText = empty.querySelector('p');
    if (emptyText) {
      emptyText.textContent = searchValue
        ? 'Không có module phù hợp với "' + searchValue + '".'
        : 'Chưa có module phù hợp với bộ lọc này.';
    }
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
    var catText  = esc(m.category || '');
    var duration = esc(m.duration || '');
    var iconHtml = CAT_ICONS[m.category] ? '<i class="fa-solid ' + CAT_ICONS[m.category] + '" aria-hidden="true"></i> ' : '';

    var iconFile = m.icon || iconById[m.id] || iconByCat[m.category];
    var thumbHtml;
    if (iconFile) {
      var iconRaw = String(iconFile || '');
      var iconSrc = safeImageUrl(iconRaw.indexOf('/') === 0 ? iconRaw : '/assets/icons/' + iconRaw, '/assets/icons/education.png');
      var bg = catGradient[m.category] || 'linear-gradient(135deg,#ffeff4 0%,#fec8dc 100%)';
      thumbHtml = '<div class="card-thumb card-thumb--icon" style="background:' + bg + '">'
        + '<img src="' + escAttr(iconSrc) + '" alt="" loading="lazy">'
        + '<div class="card-thumb-badge"><span class="badge ' + catCls + '">'
        + iconHtml
        + catText + '</span></div>'
        + '<div class="card-thumb-duration"><i class="fa-solid fa-clock"></i> ' + duration + '</div>'
        + '</div>';
    } else {
      var thumbSrc = safeImageUrl(m.thumbnail || '', '');
      thumbHtml = '<div class="card-thumb">'
        + '<img src="' + escAttr(thumbSrc) + '" alt="' + escAttr(m.name || '') + '" loading="lazy" onerror="this.src=\'https://loremflickr.com/480/280/office\'">'
        + '<div class="card-thumb-overlay"></div>'
        + '<div class="card-thumb-badge"><span class="badge ' + catCls + '">'
        + iconHtml
        + catText + '</span></div>'
        + '<div class="card-thumb-duration"><i class="fa-solid fa-clock"></i> ' + duration + '</div>'
        + '</div>';
    }

    var doneBadge = isDone(m.id) ? '<div class="card-done-badge"><i class="fa-solid fa-circle-check"></i> Đã hoàn thành</div>' : '';
    var done = isDone(m.id);
    var statusPill = done
      ? '<div class="card-status done"><i class="fa-solid fa-circle-check"></i> Đã hoàn thành</div>'
      : '<div class="card-status"><i class="fa-regular fa-circle"></i> Chưa học</div>';
    return '<div class="module-card" role="button" tabindex="0" aria-label="Open module ' + escAttr(m.name || m.id || '') + '" data-id="' + escAttr(m.id || '') + '">'
      + thumbHtml
      + doneBadge
      + '<div class="card-body">'
      + '<div class="card-title">' + esc(m.name || '') + '</div>'
      + '<div class="card-desc">' + esc(m.subtitle || '') + '</div>'
      + statusPill
      + '</div>'
      + '<div class="card-footer">'
      + '<div class="card-owner">'
      + '<div class="avatar" style="background:' + avatarBg + '">' + esc(initials) + '</div>'
      + '<span>' + esc(m.owner || '') + '</span>'
      + '</div>'
      + '<div class="card-updated"><i class="fa-solid fa-calendar-days" style="margin-right:4px;opacity:.5"></i>' + esc(m.updated || '') + '</div>'
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

  // Flush pending notes for previous module before switching
  if (_notesTimer) { clearTimeout(_notesTimer); _notesTimer = null; saveNotes(); }

  currentModuleId = id;
  trackPageView(m.id, m.name);

  document.getElementById('detail-bc').textContent       = m.name;
  document.getElementById('detail-title').textContent    = m.name;
  document.getElementById('detail-subtitle').textContent = m.subtitle || '';
  document.getElementById('detail-owner').textContent    = m.owner;
  document.getElementById('detail-updated').textContent  = m.updated;
  document.getElementById('detail-duration').textContent = m.duration;
  document.getElementById('detail-thumb').src            = safeImageUrl(m.thumbnail || '', '');

  var catClass = { Policy:'badge-policy', Process:'badge-process', Safety:'badge-safety' };
  var lvlClass = { 'Bắt buộc':'badge-level-adv', 'Theo phòng ban':'badge-level-mid', 'Tự nguyện':'badge-level-basic' };
  var stClass  = { 'Đang hoạt động':'badge-open', 'Sắp ra mắt':'badge-soon' };
  document.getElementById('detail-badges').innerHTML =
    '<span class="badge ' + (lvlClass[m.level] || 'badge-level-basic') + '">' + esc(m.level || '') + '</span> '
    + '<span class="badge ' + (catClass[m.category] || 'badge-cat') + '">'
    + (CAT_ICONS[m.category] ? '<i class="fa-solid ' + CAT_ICONS[m.category] + '" aria-hidden="true"></i> ' : '')
    + esc(m.category || '') + '</span> '
    + '<span class="badge ' + (stClass[m.status] || 'badge-open') + '">' + esc(m.status || '') + '</span>';

  // Content — prefer content_blocks (new format) over legacy steps
  var mainContentHtml;
  var stepsForTracker = [];
  var quizFromBlocks  = null;

  if (m.content_blocks && m.content_blocks.length > 0) {
    mainContentHtml = _renderContentBlocks(m.content_blocks, stepsForTracker);
    var quizBlock = null;
    for (var bi = 0; bi < m.content_blocks.length; bi++) {
      if (m.content_blocks[bi].type === 'quiz') { quizBlock = m.content_blocks[bi]; break; }
    }
    quizFromBlocks = quizBlock ? (quizBlock.data.questions || []) : [];
  } else {
    // Legacy rendering
    var stepIdx = 0;
    mainContentHtml = (m.steps || []).map(function (s, i) {
      stepsForTracker.push(s);
      return '<div class="process-step" data-step="' + i + '">'
        + '<div class="step-number">' + (i + 1) + '</div>'
        + '<div class="step-body">'
        + '<div class="step-title">' + esc(s.title || '') + '</div>'
        + '<div class="step-desc">' + esc(s.desc || '') + '</div>'
        + (s.note ? '<div class="step-note"><i class="fa-solid fa-circle-info"></i> ' + esc(s.note) + '</div>' : '')
        + '</div></div>';
    }).join('');
  }
  document.getElementById('detail-steps').innerHTML = mainContentHtml || '<p style="color:var(--text-tertiary);font-size:13px">Chưa có nội dung.</p>';

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
      var icon = safeImageUrl(rel.icon || '/assets/icons/education.png', '/assets/icons/education.png');
      var bg   = catGradientMap[rel.category] || 'linear-gradient(135deg,#ffeff4 0%,#fec8dc 100%)';
      var catClass = { Policy:'badge-policy', Process:'badge-process', Safety:'badge-safety' };
      return '<div class="gallery-item gallery-item--module" data-id="' + escAttr(rel.id || '') + '" onclick="openDetail(this.dataset.id)" style="cursor:pointer">'
        + '<div class="gallery-module-thumb" style="background:' + bg + '">'
        + '<img src="' + escAttr(icon) + '" alt="" loading="lazy">'
        + '</div>'
        + '<div class="gallery-module-info">'
        + '<span class="badge ' + (catClass[rel.category] || 'badge-cat') + '" style="font-size:10px;padding:2px 8px">'
        + (CAT_ICONS[rel.category] ? '<i class="fa-solid ' + CAT_ICONS[rel.category] + '" aria-hidden="true"></i> ' : '')
        + esc(rel.category || '') + '</span>'
        + '<div class="gallery-caption">' + esc(rel.name || '') + '</div>'
        + '<div style="font-size:11px;color:var(--text-tertiary);margin-top:2px"><i class="fa-solid fa-clock" style="margin-right:4px"></i>' + esc(rel.duration || '') + '</div>'
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
  var safeVideo = safeVideoUrl(m.videoUrl);
  if (safeVideo) {
    videoEl.innerHTML = '<iframe src="' + escAttr(safeVideo) + '" allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>';
  } else {
    videoEl.innerHTML = '<div class="video-placeholder"><i class="fa-solid fa-circle-play"></i><p>Video chưa được cập nhật.</p></div>';
  }
  sectionVideo.style.display = '';

  // Resources
  var iconMap = { pdf:'fa-file-pdf', pptx:'fa-file-powerpoint', doc:'fa-file-excel', video:'fa-video' };
  var resHtml = (m.resources || []).map(function (r) {
    var type = safeResourceType(r.type);
    var href = safeResourceUrl(r.url);
    r = Object.assign({}, r, { url: escAttr(href) });
    var actionHtml = href === '#'
      ? '<span class="resource-dl disabled" title="Tài liệu chưa sẵn sàng"><i class="fa-solid fa-lock"></i></span>'
      : '<a href="' + r.url + '" class="resource-dl" title="Tải xuống" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-download"></i></a>';
    return '<div class="resource-item">'
      + '<div class="resource-icon ' + type + '"><i class="fa-solid ' + (iconMap[type] || 'fa-file') + '"></i></div>'
      + '<div class="resource-meta">'
      + '<div class="resource-name">' + esc(r.name || '') + '</div>'
      + '<div class="resource-size">' + esc(r.size || '') + '</div>'
      + '</div>'
      + actionHtml
      + '</div>';
  }).join('');
  document.getElementById('detail-resources').innerHTML = resHtml || '<div class="resource-empty"><i class="fa-regular fa-folder-open"></i><span>Chưa có tài liệu đính kèm.</span></div>';

  // Hotspots
  renderHotspots(m);

  // Quiz — from blocks (new format) or legacy
  renderQuiz(quizFromBlocks !== null ? quizFromBlocks : (m.quiz || []));

  // Done button state + notes
  updateDoneBtn(isDone(id));
  loadNotes(id);

  // Build step tracker from stepsForTracker (populated above)
  var trackerEl = document.getElementById('step-tracker');
  trackerEl.innerHTML = stepsForTracker.map(function (s, i) {
    var stepTitle = esc(s.title || '');
    return '<div class="step-dot-item" id="tracker-step-' + i + '" data-step="' + i + '"'
      + ' role="listitem" tabindex="0"'
      + ' aria-label="Bước ' + (i + 1) + ': ' + stepTitle + '"'
      + ' onclick="scrollToStep(' + i + ')"'
      + ' onkeydown="if(event.key===\'Enter\'||event.key===\' \'){scrollToStep(' + i + ');event.preventDefault();}">'
      + '<div class="step-dot"></div>'
      + '<div class="step-dot-label">' + stepTitle + '</div>'
      + '</div>';
  }).join('');

  showPage('detail');

  // Start scroll observer
  setTimeout(function () { setupScrollProgress(stepsForTracker.length); }, 120);
}

// ════════════════════════════════════════
//  CONTENT BLOCKS — Learner Renderer
// ════════════════════════════════════════
function _renderContentBlocks(blocks, stepsCollector) {
  var html = '';
  var stepGroupIdx = 0; // global step index across all steps blocks (for tracker)
  blocks.forEach(function (block) {
    var d = block.data || {};
    switch (block.type) {

      case 'text':
        if (d.content) {
          // Preserve newlines as paragraphs
          var paras = String(d.content).split('\n').filter(function(l){ return l.trim(); });
          html += '<div class="cb-text">' + paras.map(function(p){ return '<p>' + esc(p) + '</p>'; }).join('') + '</div>';
        }
        break;

      case 'steps':
        (d.items || []).forEach(function (s, i) {
          var gi = stepGroupIdx++;
          if (stepsCollector) stepsCollector.push(s);
          html += '<div class="process-step" data-step="' + gi + '">'
            + '<div class="step-number">' + (gi + 1) + '</div>'
            + '<div class="step-body">'
            + '<div class="step-title">' + esc(s.title || '') + '</div>'
            + '<div class="step-desc">' + esc(s.desc || '') + '</div>'
            + (s.note ? '<div class="step-note"><i class="fa-solid fa-circle-info"></i> ' + esc(s.note) + '</div>' : '')
            + '</div></div>';
        });
        break;

      case 'checklist':
        if (d.items && d.items.length) {
          html += '<div class="cb-checklist">';
          d.items.forEach(function (item) {
            html += '<div class="cb-checklist-item">'
              + '<i class="fa-regular fa-square-check"></i>'
              + '<span>' + esc(item.text || '') + '</span>'
              + '</div>';
          });
          html += '</div>';
        }
        break;

      case 'quiz':
        // Quiz is rendered separately via renderQuiz(); skip here
        break;

      case 'video':
        if (d.url) {
          var safeV = safeVideoUrl(d.url);
          html += '<div class="cb-video">';
          if (d.title) html += '<div class="cb-video-title">' + esc(d.title) + '</div>';
          if (safeV) {
            html += '<div class="cb-video-wrap"><iframe src="' + escAttr(safeV) + '" allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe></div>';
          }
          html += '</div>';
        }
        break;

      case 'image':
        if (d.url) {
          html += '<div class="cb-image">'
            + '<img src="' + escAttr(d.url) + '" alt="' + escAttr(d.caption || '') + '" loading="lazy">'
            + (d.caption ? '<div class="cb-image-caption">' + esc(d.caption) + '</div>' : '')
            + '</div>';
        }
        break;

      case 'file': {
        var iconMap2 = { pdf:'fa-file-pdf', pptx:'fa-file-powerpoint', doc:'fa-file-word', video:'fa-video' };
        var ftype = String(d.type || 'pdf');
        var fhref = d.url ? escAttr(d.url) : '#';
        html += '<div class="resource-item">'
          + '<div class="resource-icon ' + ftype + '"><i class="fa-solid ' + (iconMap2[ftype] || 'fa-file') + '"></i></div>'
          + '<div class="resource-meta">'
          + '<div class="resource-name">' + esc(d.name || '') + '</div>'
          + (d.size ? '<div class="resource-size">' + esc(d.size) + '</div>' : '')
          + '</div>'
          + (d.url ? '<a href="' + fhref + '" class="resource-dl" title="Tải xuống" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-download"></i></a>'
                   : '<span class="resource-dl disabled"><i class="fa-solid fa-lock"></i></span>')
          + '</div>';
        break;
      }

      case 'callout': {
        var cv = String(d.variant || 'info');
        var calloutIcons = { info:'fa-circle-info', warning:'fa-triangle-exclamation', tip:'fa-lightbulb', danger:'fa-circle-xmark' };
        html += '<div class="cb-callout cb-callout--' + cv + '">'
          + '<i class="fa-solid ' + (calloutIcons[cv] || 'fa-circle-info') + '"></i>'
          + '<div class="cb-callout-body">'
          + (d.title ? '<div class="cb-callout-title">' + esc(d.title) + '</div>' : '')
          + (d.text ? '<div class="cb-callout-text">' + esc(d.text) + '</div>' : '')
          + '</div></div>';
        break;
      }
    }
  });
  return html;
}

// ════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════
function showToast(message, type) {
  type = ({ success:true, error:true, info:true })[type] ? type : 'info';
  var icons = { success:'fa-circle-check', error:'fa-circle-xmark', info:'fa-circle-info' };
  var wrap  = document.getElementById('toast-wrap');
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = '<i class="fa-solid ' + icons[type] + '"></i><span>' + esc(message) + '</span>';
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

  currentQuizData = questions;
  quizState = { answered: new Array(questions.length).fill(false), score: 0, total: questions.length };

  var html = '<div class="quiz-intro">'
    + '<i class="fa-solid fa-lightbulb"></i>'
    + '<span id="quiz-progress-label">0/' + questions.length + ' câu đã trả lời</span>'
    + '<div class="quiz-progress" aria-hidden="true"><span class="quiz-progress-fill" id="quiz-progress-fill"></span></div>'
    + '</div>';

  html += questions.map(function (q, qi) {
    var options = Array.isArray(q.options) ? q.options : [];
    var correctIndex = parseInt(q.correct, 10);
    var correct = Number.isFinite(correctIndex) && correctIndex >= 0 && correctIndex < options.length ? correctIndex : 0;
    var optHtml = options.map(function (opt, oi) {
      return '<button class="quiz-option" data-qi="' + qi + '" data-oi="' + oi + '" data-correct="' + correct + '" onclick="handleQuizOption(this,' + qi + ',' + oi + ',' + correct + ')">'
        + '<span class="quiz-option-label">' + String.fromCharCode(65 + oi) + '</span>'
        + '<span class="quiz-option-text">' + esc(opt || '') + '</span>'
        + '</button>';
    }).join('');

    return '<div class="quiz-card" id="quiz-card-' + qi + '">'
      + '<div class="quiz-q-num">Câu ' + (qi + 1) + '/' + questions.length + '</div>'
      + '<div class="quiz-question">' + esc(q.question || '') + '</div>'
      + '<div class="quiz-options" id="quiz-opts-' + qi + '">' + optHtml + '</div>'
      + '<div class="quiz-explanation" id="quiz-exp-' + qi + '" style="display:none">'
      + '<i class="fa-solid fa-circle-info"></i>'
      + '<span>' + esc(q.explanation || '') + '</span>'
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
  updateQuizProgress();
}

function updateQuizProgress() {
  var label = document.getElementById('quiz-progress-label');
  var fill  = document.getElementById('quiz-progress-fill');
  if (!label || !fill || !quizState.total) return;
  var done = quizState.answered.filter(Boolean).length;
  var pct = Math.round((done / quizState.total) * 100);
  label.textContent = done + '/' + quizState.total + ' câu đã trả lời';
  fill.style.width = pct + '%';
}

function handleQuizOption(btn, qi, oi, correct) {
  if (quizState.answered[qi]) return; // already answered
  quizState.answered[qi] = true;

  var optsEl = document.getElementById('quiz-opts-' + qi);
  var expEl  = document.getElementById('quiz-exp-' + qi);
  var cardEl = document.getElementById('quiz-card-' + qi);

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
  var isCorrect = (oi === correct);
  if (isCorrect) quizState.score++;
  if (cardEl) cardEl.classList.add(isCorrect ? 'answered-correct' : 'answered-wrong');
  updateQuizProgress();

  // Track per-question to Supabase — only on FIRST attempt per session (prevents duplicates on "Làm lại")
  var answerKey = (currentModuleId || '') + '-' + qi;
  if (!_answeredKeys.has(answerKey)) {
    _answeredKeys.add(answerKey);
    var qText = currentQuizData[qi] ? currentQuizData[qi].question : '';
    _sbInsert('quiz_answers', { module_id: currentModuleId, question_index: qi, question_text: qText, is_correct: isCorrect, session_id: _getSession() });
  }

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

  // Persist best quiz score for learner stats strip
  if (currentModuleId) {
    var existing = parseFloat(localStorage.getItem('lms-quiz-score-' + currentModuleId) || '-1');
    if (pct > existing) localStorage.setItem('lms-quiz-score-' + currentModuleId, String(pct));
    updateStatsStrip();
  }

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

  // Certificate button when passing
  var certBtn = document.getElementById('quiz-cert-btn');
  if (pct >= 75) {
    if (!certBtn) {
      certBtn = document.createElement('button');
      certBtn.id = 'quiz-cert-btn';
      certBtn.className = 'btn btn-primary btn-sm';
      certBtn.innerHTML = '<i class="fa-solid fa-certificate"></i> Nhận chứng chỉ';
      certBtn.onclick = function () { showCertificate(s, t); };
      resultEl.appendChild(certBtn);
    }
    // Auto mark done
    if (!isDone(currentModuleId)) {
      localStorage.setItem('lms-done-' + currentModuleId, '1');
      updateDoneBtn(true);
      filterAndRender();
    }
  } else if (certBtn) { certBtn.remove(); }

  resultEl.style.display = 'flex';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Track to Supabase
  var mod = allModules.find(function (x) { return x.id === currentModuleId; });
  if (mod) trackQuizAttempt(mod.id, mod.name, s, t, pct);
}

function resetQuiz() {
  var mod = allModules.find(function (x) { return x.id === currentModuleId; });
  if (!mod) return;
  if (mod.content_blocks && mod.content_blocks.length > 0) {
    var qb = null;
    for (var i = 0; i < mod.content_blocks.length; i++) {
      if (mod.content_blocks[i].type === 'quiz') { qb = mod.content_blocks[i]; break; }
    }
    renderQuiz(qb ? (qb.data.questions || []) : []);
  } else {
    renderQuiz(mod.quiz || []);
  }
}

// ════════════════════════════════════════
//  SCROLL READING TRACKER
// ════════════════════════════════════════
var scrollObserver = null;

function setupScrollProgress(totalSteps) {
  // Cleanup previous observer
  if (scrollObserver) { scrollObserver.disconnect(); scrollObserver = null; }
  if (!totalSteps) return;

  var stepEls    = document.querySelectorAll('#detail-steps .process-step');
  var currentIdx = -1;

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
    var visible = [];
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        visible.push(Array.prototype.indexOf.call(stepEls, entry.target));
      }
    });
    if (visible.length) updateActive(Math.min.apply(null, visible));
  }, { threshold: 0.3, rootMargin: '-10% 0px -50% 0px' });

  stepEls.forEach(function (el) { scrollObserver.observe(el); });
}
