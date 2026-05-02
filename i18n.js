/* ══════════════════════════════════════════════════════════════════
   I18N — Bilingual VI / EN support for Mentora LMS landing page
   - Translations are in `dict` keyed by `section.key`
   - Apply: walk DOM, look for [data-i18n], swap text; [data-i18n-placeholder] swaps placeholder
   - Persists choice in localStorage('mentora-lang'); defaults to 'vi'
   - Toggle UI: .lang-btn buttons inside #lang-toggle
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORAGE_KEY = 'mentora-lang';
  var DEFAULT_LANG = 'vi';

  var dict = {
    vi: {
      'nav.menu':         'Menu',
      'menu.col1':        'Tổng Quan',
      'menu.col2':        'Modules',
      'menu.home':        'Trang chủ',
      'menu.support':     'Tài nguyên hỗ trợ',
      'menu.allModules':  'Tất cả modules',

      'hero.title':       'Quy trình Quản lý<br>Hiệu quả Công việc<br><span class="hero-h1-sig">tại MoMo</span>',
      'hero.desc':        'Nơi tổng hợp hướng dẫn về quy trình, vai trò và cách thực hiện Quản lý Hiệu quả Công việc tại MoMo.',
      'hero.imgPlaceholder': 'Hình ảnh sẽ được cập nhật',

      'pm.eyebrow':       'Performance Management',
      'pm.title':         'Quy trình tổng quan',
      'pm.subtitle':      'Ba giai đoạn chính trong chu kỳ Quản lý Hiệu quả Công việc tại MoMo',
      'pm.m1.title':      'Goal Setting',
      'pm.m1.desc':       'Thiết lập mục tiêu và kế hoạch làm việc cho chu kỳ đánh giá',
      'pm.m2.title':      'Mid-year Review',
      'pm.m2.desc':       'Đánh giá tiến độ và điều chỉnh mục tiêu giữa chu kỳ',
      'pm.m3.title':      'Year-end Review',
      'pm.m3.desc':       'Đánh giá hiệu quả cuối năm và lập kế hoạch chu kỳ tiếp theo',
      'pm.cf':            'Cho và nhận phản hồi liên tục',
      'pm.cfEn':          'Continuous Feedback',

      'lib.eyebrow':      'Thư viện',
      'lib.title':        'Thư viện học tập',
      'lib.subtitle':     'Chọn một chủ đề để xem các hướng dẫn chi tiết bên trong',
      'lib.searchPh':     'Tìm chủ đề...',
      'lib.rolesAll':     'Toàn bộ nhân sự',
      'lib.rolesEmpMgr':  'Nhân viên · Quản lý',
      'lib.count2':       '2 module',
      'lib.count3':       '3 module',
      'lib.c1.title':     'Quy trình tổng quan',
      'lib.c1.desc':      'Bức tranh tổng thể về quy trình Quản lý Hiệu quả Công việc tại MoMo.',
      'lib.c1.roles':     'Toàn bộ nhân sự',
      'lib.c1.count':     '2 module',
      'lib.c2.title':     'Hướng dẫn Thiết lập mục tiêu',
      'lib.c2.desc':      'Cách thiết lập, cascade và viết mục tiêu hiệu quả cho cả nhân viên và quản lý.',
      'lib.c3.title':     'Hướng dẫn Đánh giá giữa năm',
      'lib.c3.desc':      'Self-assessment, đánh giá tiến độ và điều chỉnh mục tiêu giữa chu kỳ.',
      'lib.c4.title':     'Hướng dẫn Đánh giá cuối năm',
      'lib.c4.desc':      'Chuẩn bị nội dung, đánh giá hiệu quả cuối năm và phản hồi cho nhân viên.',
      'lib.c5.title':     'Hướng dẫn về hệ thống HRM',
      'lib.c5.desc':      'Cách sử dụng hệ thống HRM để thực hiện các bước trong chu kỳ đánh giá.',
      'lib.c6.title':     'Văn hóa phản hồi hiệu quả',
      'lib.c6.desc':      'Cách cho, nhận phản hồi và vai trò của quản lý trong việc thúc đẩy văn hóa phản hồi.',

      'cta.learn':        'Học ngay',

      'journey.eyebrow':  'Lộ trình',
      'journey.title':    'Lộ trình học tập theo vai trò',
      'journey.subtitle': 'Chọn vai trò để xem các nội dung học tập phù hợp với bạn',
      'role.employee':    'Nhân viên',
      'role.manager':     'Quản lý trực tiếp',
      'role.senior':      'Quản lý cấp 2',
      'role.hod':         'Trưởng đơn vị / HOD',

      'sup.eyebrow':      'Hỗ trợ',
      'sup.title':        'Bạn cần hỗ trợ?',
      'sup.subtitle':     'Tham khảo FAQ hoặc liên hệ trực tiếp với đầu mối phù hợp',
      'sup.faq.label':    'FAQ',
      'sup.faq.title':    'Câu hỏi thường gặp',
      'sup.faq.desc':     'Tìm câu trả lời nhanh cho các thắc mắc phổ biến về quy trình và hệ thống.',
      'sup.it.label':     'Hỗ trợ hệ thống',
      'sup.it.desc':      'Lỗi hệ thống HRM, đăng nhập, tài khoản hoặc bất kỳ vấn đề kỹ thuật nào.',
      'sup.it.tag':       'Liên hệ IT',
      'sup.lnod.label':   'Hỗ trợ quy trình',
      'sup.lnod.desc':    'Câu hỏi về quy trình Performance Management, mục tiêu, đánh giá và phản hồi.',
      'sup.lnod.tag':     'Liên hệ LnOD'
    },
    en: {
      'nav.menu':         'Menu',
      'menu.col1':        'Overview',
      'menu.col2':        'Modules',
      'menu.home':        'Home',
      'menu.support':     'Support resources',
      'menu.allModules':  'All modules',

      'hero.title':       'Performance<br>Management Process<br><span class="hero-h1-sig">at MoMo</span>',
      'hero.desc':        'A central hub for guidance on the process, roles and how to do Performance Management at MoMo.',
      'hero.imgPlaceholder': 'Image to be added',

      'pm.eyebrow':       'Performance Management',
      'pm.title':         'Process overview',
      'pm.subtitle':      'Three key milestones in the Performance Management cycle at MoMo',
      'pm.m1.title':      'Goal Setting',
      'pm.m1.desc':       'Set goals and work plans for the upcoming review cycle',
      'pm.m2.title':      'Mid-year Review',
      'pm.m2.desc':       'Review progress and adjust goals mid-cycle',
      'pm.m3.title':      'Year-end Review',
      'pm.m3.desc':       'Evaluate year-end performance and plan the next cycle',
      'pm.cf':            'Give & receive feedback continuously',
      'pm.cfEn':          'Continuous Feedback',

      'lib.eyebrow':      'Library',
      'lib.title':        'Learning library',
      'lib.subtitle':     'Pick a topic to explore detailed guides inside',
      'lib.searchPh':     'Search topics...',
      'lib.rolesAll':     'All employees',
      'lib.rolesEmpMgr':  'Employees · Managers',
      'lib.count2':       '2 modules',
      'lib.count3':       '3 modules',
      'lib.c1.title':     'Process overview',
      'lib.c1.desc':      'The big picture of MoMo\'s Performance Management process.',
      'lib.c1.roles':     'All employees',
      'lib.c1.count':     '2 modules',
      'lib.c2.title':     'Goal Setting guide',
      'lib.c2.desc':      'How to set, cascade and write effective goals for both employees and managers.',
      'lib.c3.title':     'Mid-year Review guide',
      'lib.c3.desc':      'Self-assessment, progress review and mid-cycle goal adjustments.',
      'lib.c4.title':     'Year-end Review guide',
      'lib.c4.desc':      'Prepare materials, assess year-end performance and give feedback.',
      'lib.c5.title':     'HRM system guide',
      'lib.c5.desc':      'How to use the HRM system to execute each step of the review cycle.',
      'lib.c6.title':     'Effective feedback culture',
      'lib.c6.desc':      'How to give & receive feedback and the manager\'s role in driving feedback culture.',

      'cta.learn':        'Start learning',

      'journey.eyebrow':  'Journey',
      'journey.title':    'Learning journey by role',
      'journey.subtitle': 'Select your role to see the learning content tailored for you',
      'role.employee':    'Employee',
      'role.manager':     'Direct manager',
      'role.senior':      'Senior manager',
      'role.hod':         'Head of Department',

      'sup.eyebrow':      'Support',
      'sup.title':        'Need help?',
      'sup.subtitle':     'Browse the FAQ or reach out directly to the right contact',
      'sup.faq.label':    'FAQ',
      'sup.faq.title':    'Frequently asked questions',
      'sup.faq.desc':     'Find quick answers to common questions about the process and system.',
      'sup.it.label':     'System support',
      'sup.it.desc':      'HRM system errors, login, account or any technical issues.',
      'sup.it.tag':       'Contact IT',
      'sup.lnod.label':   'Process support',
      'sup.lnod.desc':    'Questions about Performance Management process, goals, reviews and feedback.',
      'sup.lnod.tag':     'Contact LnOD'
    }
  };

  function getLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && dict[saved]) return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (!dict[lang]) return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.setAttribute('lang', lang);
    apply(lang);
    updateToggleUI(lang);
  }

  function apply(lang) {
    var t = dict[lang] || dict[DEFAULT_LANG];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t[key];
      if (val == null) return;
      if (el.getAttribute('data-i18n-html') === 'true') {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var val = t[key];
      if (val != null) el.setAttribute('placeholder', val);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      var val = t[key];
      if (val != null) el.setAttribute('aria-label', val);
    });
  }

  function updateToggleUI(lang) {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function init() {
    var current = getLang();
    document.documentElement.setAttribute('lang', current);
    apply(current);
    updateToggleUI(current);

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-btn');
      if (!btn) return;
      var lang = btn.dataset.lang;
      if (lang && lang !== getLang()) setLang(lang);
    });
  }

  // Expose for debugging / external use
  window.MentoraI18n = { setLang: setLang, getLang: getLang, apply: apply };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
