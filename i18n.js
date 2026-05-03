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
      'hero.exploreCta':  'KHÁM PHÁ NGAY',
      'hero.imgPlaceholder': 'Hình ảnh sẽ được cập nhật',

      'pm.eyebrow':       'Performance Management',
      'pm.title':         'Quy trình <span class="sig">tổng quan</span>',
      'pm.subtitle':      'Ba giai đoạn chính trong chu kỳ Quản lý Hiệu quả Công việc tại MoMo',
      'pm.m1.title':      'Thiết lập Mục tiêu (Goal Setting)',
      'pm.m1.desc':       'Giai đoạn giúp nhân viên và quản lý thống nhất mục tiêu, kỳ vọng và tiêu chí thành công. Giúp nhân viên hiểu rõ ưu tiên công việc, đóng góp của mình vào mục tiêu chung và có cơ sở minh bạch cho đánh giá sau này.',
      'pm.m2.title':      'Đánh giá giữa năm (Mid-year Review)',
      'pm.m2.desc':       'Cột mốc để ghi nhận nỗ lực, nhìn lại tiến độ và xác định những điểm có thể làm tốt hơn. Đây là cơ hội để điều chỉnh mục tiêu, ưu tiên và cách làm phù hợp với thực tế.',
      'pm.m3.title':      'Đánh giá cuối năm (Year-end Review)',
      'pm.m3.desc':       'Giai đoạn tổng kết thành tựu, ghi nhận đóng góp và làm cơ sở cho các quyết định tưởng thưởng. Đồng thời, đây là thời điểm định hướng phát triển cho chu kỳ tiếp theo.',
      'pm.cf':            'Xuyên suốt quá trình này, MoMoers được khuyến khích thực hành văn hóa <span class="sig">Cho</span> và <span class="sig">Nhận Phản hồi</span> liên tục',
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
      'journey.subtitle': 'Chọn vai trò của bạn để được gợi ý các module nên học',
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
      'sup.lnod.tag':     'Liên hệ LnOD',

      'lib.empty':        'Không tìm thấy chủ đề nào.',
      'common.back':      'Quay lại',
      'footer.brand':     'Mentora LMS · Compliance Training',
      'footer.copy':      '© 2026 Mentora LMS — Compliance Training Portal',

      // Journey: employee
      'j.emp.intro.h':    'Vai trò Nhân viên',
      'j.emp.intro.p':    'Tham gia đầy đủ chu kỳ Quản lý Hiệu quả Công việc — từ thiết lập mục tiêu đến đánh giá cuối năm — và xây dựng thói quen phản hồi liên tục.',
      'j.emp.m1.t':       'Thiết lập mục tiêu hiệu quả',
      'j.emp.m1.d':       'Cách viết và đặt mục tiêu cá nhân SMART, gắn với mục tiêu team.',
      'j.emp.m2.t':       'Self-assessment giữa năm',
      'j.emp.m2.d':       'Cách tự đánh giá tiến độ và đề xuất điều chỉnh mục tiêu.',
      'j.emp.m3.t':       'Đánh giá cuối năm',
      'j.emp.m3.d':       'Chuẩn bị nội dung tự đánh giá và minh chứng cho chu kỳ kết thúc.',
      'j.emp.m4.t':       'Cho và nhận phản hồi',
      'j.emp.m4.d':       'Kỹ năng nhận phản hồi và hành động sau phản hồi.',
      // Journey: manager
      'j.mgr.intro.h':    'Vai trò Quản lý trực tiếp',
      'j.mgr.intro.p':    'Định hướng team, cascade mục tiêu, đánh giá nhân viên và xây dựng văn hóa phản hồi trong nhóm.',
      'j.mgr.m1.t':       'Cascade mục tiêu cho team',
      'j.mgr.m1.d':       'Cách kéo mục tiêu công ty xuống thành mục tiêu cá nhân.',
      'j.mgr.m2.t':       'Hướng dẫn nhân viên thiết lập mục tiêu',
      'j.mgr.m2.d':       'Coach nhân viên để mục tiêu rõ ràng, đo lường được.',
      'j.mgr.m3.t':       'Đánh giá giữa năm & cuối năm',
      'j.mgr.m3.d':       'Quy trình đánh giá nhân viên, calibration với cấp trên.',
      'j.mgr.m4.t':       'Cho phản hồi hiệu quả',
      'j.mgr.m4.d':       'Kỹ năng giao phản hồi mang tính xây dựng và thúc đẩy.',
      // Journey: senior
      'j.sen.intro.h':    'Vai trò Quản lý cấp 2',
      'j.sen.intro.p':    'Đảm bảo chất lượng mục tiêu, calibration công bằng và theo dõi performance của nhiều team.',
      'j.sen.m1.t':       'Review chất lượng mục tiêu',
      'j.sen.m1.d':       'Đảm bảo mục tiêu của các team align với chiến lược chung.',
      'j.sen.m2.t':       'Calibration session',
      'j.sen.m2.d':       'Quy trình hiệu chuẩn kết quả đánh giá giữa các quản lý.',
      'j.sen.m3.t':       'Theo dõi team performance',
      'j.sen.m3.d':       'Nhận diện rủi ro performance và can thiệp kịp thời.',
      'j.sen.m4.t':       'Coaching cho quản lý cấp 1',
      'j.sen.m4.d':       'Hỗ trợ quản lý trực tiếp trong việc đánh giá và phản hồi.',
      // Journey: HOD
      'j.hod.intro.h':    'Vai trò Trưởng đơn vị / HOD',
      'j.hod.intro.p':    'Governance toàn bộ chu kỳ và xây dựng văn hóa Performance trong đơn vị.',
      'j.hod.m1.t':       'Tổng quan quy trình PM',
      'j.hod.m1.d':       'Bức tranh tổng thể về Performance Management tại MoMo.',
      'j.hod.m2.t':       'Governance & policy',
      'j.hod.m2.d':       'Trách nhiệm của HOD trong việc đảm bảo tính nhất quán và công bằng.',
      'j.hod.m3.t':       'Vai trò trong văn hóa Performance',
      'j.hod.m3.d':       'Dẫn dắt và lan tỏa văn hóa phản hồi liên tục trong đơn vị.',
      'j.hod.m4.t':       'Talent review & succession',
      'j.hod.m4.d':       'Sử dụng kết quả đánh giá để phát triển và kế hoạch hóa nhân sự.',

      // Drawer
      'drawer.eyebrow':   'Chủ đề',
      'drawer.empty':     'Module cho chủ đề này đang được cập nhật. Hãy quay lại sau nhé!',

      // FAQ
      'faq.title':        'Câu hỏi thường gặp',
      'faq.q1':           'Quy trình Quản lý Hiệu quả Công việc tại MoMo gồm mấy giai đoạn?',
      'faq.a1':           'Gồm 3 giai đoạn chính: Goal Setting (đầu chu kỳ), Mid-year Review (giữa chu kỳ) và Year-end Review (cuối chu kỳ). Xuyên suốt 3 giai đoạn là văn hóa Cho và nhận phản hồi liên tục (Continuous Feedback).',
      'faq.q2':           'Tôi cần làm gì khi mới bắt đầu chu kỳ đánh giá?',
      'faq.a2':           'Bạn cần thiết lập mục tiêu cá nhân (cascade từ mục tiêu team), trao đổi và thống nhất với quản lý trực tiếp, sau đó nhập lên hệ thống HRM trước deadline được công bố.',
      'faq.q3':           'Self-assessment được làm khi nào?',
      'faq.a3':           'Self-assessment thực hiện ở 2 thời điểm: giữa năm (Mid-year Review) để đánh giá tiến độ và cuối năm (Year-end Review) để tổng kết kết quả. Hướng dẫn chi tiết có trong các module tương ứng.',
      'faq.q4':           'Nếu gặp lỗi đăng nhập hệ thống HRM thì liên hệ ai?',
      'faq.a4':           'Mọi vấn đề kỹ thuật về hệ thống HRM (đăng nhập, lỗi giao diện, mất quyền truy cập) hãy liên hệ bộ phận IT. Câu hỏi về quy trình hoặc cách viết mục tiêu thì liên hệ LnOD.',
      'faq.q5':           'Tôi có thể chỉnh sửa mục tiêu sau khi đã thiết lập không?',
      'faq.a5':           'Có. Mục tiêu có thể được điều chỉnh trong kỳ Mid-year Review nếu có thay đổi lớn về phạm vi công việc. Mọi điều chỉnh cần được thống nhất với quản lý trực tiếp và cập nhật trên hệ thống HRM.',
      'faq.q6':           'Phản hồi liên tục (Continuous Feedback) là gì?',
      'faq.a6':           'Là văn hóa cho và nhận phản hồi xuyên suốt cả năm — không chỉ tại các kỳ đánh giá chính thức. Mục đích giúp cải thiện hiệu quả công việc nhanh hơn và xây dựng mối quan hệ tin cậy giữa nhân viên và quản lý.',

      'journey.tabsAria': 'Chọn vai trò',

      // Detail page
      'detail.bc':            'Chi tiết Module',
      'detail.updated':       'Cập nhật:',
      'detail.share':         'Chia sẻ',
      'detail.markDone':      'Đánh dấu hoàn thành',
      'detail.notDone':       'Chưa hoàn thành',
      'detail.toc':           'Mục lục',
      'detail.contentTitle':  'Nội dung & Quy trình',
      'detail.hotspot':       'Sơ đồ tương tác',
      'detail.related':       'Bài viết liên quan',
      'detail.video':         'Video hướng dẫn',
      'detail.quiz':          'Kiểm tra kiến thức',
      'detail.attachments':   'Tài liệu đính kèm',
      'detail.notes':         'Ghi chú cá nhân',
      'detail.notesPh':       'Ghi chú của bạn về module này...',

      // Map page
      'map.bc':           'Lộ trình học tập',
      'map.title':        'Lộ trình <span class="sig">học tập</span>',
      'map.subtitle':     'Khám phá mối liên hệ giữa các module và lộ trình học tối ưu của bạn.',
      'map.done':         'Đã hoàn thành',
      'map.available':    'Sẵn sàng học',
      'map.locked':       'Chưa mở khóa',

      // Toasts
      'toast.unmarkedDone': 'Đã bỏ đánh dấu hoàn thành',
      'toast.markedDone':   'Đã đánh dấu hoàn thành!',
      'toast.copied':       'Đã copy link module!',
      'toast.pickModule':   'Chọn một module để bắt đầu! 🚀',
      'toast.nameUpdated':  'Đã cập nhật tên!',
      'toast.wip':          'Trang này đang được phát triển.',
      'toast.modNotFound':  'Không tìm thấy module "{id}". Link có thể đã hết hạn.',

      // Detail dynamic strings
      'detail.doneNote':  'Đã hoàn thành',
      'detail.saved':     'Đã lưu ✓',
      'detail.videoTbd':  'Video chưa được cập nhật.',

      // Quiz result
      'quiz.r1':   'Xuất sắc! Bạn nắm vững toàn bộ nội dung module.',
      'quiz.r2':   'Tốt lắm! Hãy xem lại phần bạn trả lời sai để củng cố thêm.',
      'quiz.r3':   'Khá ổn, nhưng nên đọc lại nội dung để hiểu sâu hơn.',
      'quiz.r4':   'Hãy đọc lại module này trước khi thử lại nhé.',
      'quiz.cert': 'Nhận chứng chỉ',

      // Hero modules count
      'hero.modulesActive': 'modules đang hoạt động'
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
      'hero.exploreCta':  'EXPLORE NOW',
      'hero.imgPlaceholder': 'Image to be added',

      'pm.eyebrow':       'Performance Management',
      'pm.title':         'Process <span class="sig">overview</span>',
      'pm.subtitle':      'Three key milestones in the Performance Management cycle at MoMo',
      'pm.m1.title':      'Goal Setting',
      'pm.m1.desc':       'A phase where employees and managers align on goals, expectations and success criteria — giving everyone a clear, transparent basis for later reviews.',
      'pm.m2.title':      'Mid-year Review',
      'pm.m2.desc':       'A checkpoint to acknowledge effort, assess progress and identify opportunities to do better. An opportunity to adjust goals, priorities and ways of working.',
      'pm.m3.title':      'Year-end Review',
      'pm.m3.desc':       'A phase to summarise achievements, recognise contributions and inform reward decisions. Also the time to set the direction for the next cycle.',
      'pm.cf':            'Throughout this process, MoMoers are encouraged to practise a culture of <span class="sig">Give</span> &amp; <span class="sig">Receive Feedback</span> continuously',
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
      'journey.subtitle': 'Select your role to get module recommendations tailored for you',
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
      'sup.lnod.tag':     'Contact LnOD',

      'lib.empty':        'No topics found.',
      'common.back':      'Back',
      'footer.brand':     'Mentora LMS · Compliance Training',
      'footer.copy':      '© 2026 Mentora LMS — Compliance Training Portal',

      // Journey: employee
      'j.emp.intro.h':    'Employee role',
      'j.emp.intro.p':    'Engage in the full Performance Management cycle — from goal setting to year-end review — and build a habit of continuous feedback.',
      'j.emp.m1.t':       'Set effective goals',
      'j.emp.m1.d':       'How to write SMART personal goals aligned with the team\'s direction.',
      'j.emp.m2.t':       'Mid-year self-assessment',
      'j.emp.m2.d':       'How to self-evaluate progress and propose goal adjustments.',
      'j.emp.m3.t':       'Year-end review',
      'j.emp.m3.d':       'Prepare self-assessment notes and evidence for the closing cycle.',
      'j.emp.m4.t':       'Give & receive feedback',
      'j.emp.m4.d':       'Skills for receiving feedback and acting on it.',
      // Journey: manager
      'j.mgr.intro.h':    'Direct manager role',
      'j.mgr.intro.p':    'Steer the team, cascade goals, evaluate staff and foster a feedback culture within the group.',
      'j.mgr.m1.t':       'Cascade team goals',
      'j.mgr.m1.d':       'How to translate company goals into individual objectives.',
      'j.mgr.m2.t':       'Coach goal-setting',
      'j.mgr.m2.d':       'Coach employees to write clear, measurable goals.',
      'j.mgr.m3.t':       'Mid-year & year-end review',
      'j.mgr.m3.d':       'Review process for employees and calibration with senior management.',
      'j.mgr.m4.t':       'Give effective feedback',
      'j.mgr.m4.d':       'Deliver constructive feedback that drives growth.',
      // Journey: senior
      'j.sen.intro.h':    'Senior manager role',
      'j.sen.intro.p':    'Ensure goal quality, fair calibration and oversee performance across multiple teams.',
      'j.sen.m1.t':       'Goal quality review',
      'j.sen.m1.d':       'Ensure team goals align with overall strategy.',
      'j.sen.m2.t':       'Calibration session',
      'j.sen.m2.d':       'Process to harmonise rating outcomes across managers.',
      'j.sen.m3.t':       'Track team performance',
      'j.sen.m3.d':       'Spot performance risks early and intervene in time.',
      'j.sen.m4.t':       'Coaching for line managers',
      'j.sen.m4.d':       'Support direct managers in evaluating and giving feedback.',
      // Journey: HOD
      'j.hod.intro.h':    'Head of Department role',
      'j.hod.intro.p':    'Govern the whole cycle and build a Performance culture within the department.',
      'j.hod.m1.t':       'PM process overview',
      'j.hod.m1.d':       'The big picture of Performance Management at MoMo.',
      'j.hod.m2.t':       'Governance & policy',
      'j.hod.m2.d':       'HOD responsibility for ensuring consistency and fairness.',
      'j.hod.m3.t':       'Role in performance culture',
      'j.hod.m3.d':       'Lead and spread a continuous feedback culture in the department.',
      'j.hod.m4.t':       'Talent review & succession',
      'j.hod.m4.d':       'Use review outcomes to develop and plan workforce succession.',

      // Drawer
      'drawer.eyebrow':   'Topic',
      'drawer.empty':     'Modules for this topic are being prepared. Please check back soon!',

      // FAQ
      'faq.title':        'Frequently asked questions',
      'faq.q1':           'How many phases does MoMo\'s Performance Management process have?',
      'faq.a1':           'Three key phases: Goal Setting (start), Mid-year Review (midpoint) and Year-end Review (closing). Continuous Feedback runs throughout all three.',
      'faq.q2':           'What should I do at the start of a review cycle?',
      'faq.a2':           'Set your personal goals (cascaded from your team\'s goals), discuss and align with your direct manager, then enter them in the HRM system before the published deadline.',
      'faq.q3':           'When are self-assessments done?',
      'faq.a3':           'Self-assessment happens twice: at mid-year (Mid-year Review) to gauge progress, and at year-end (Year-end Review) to summarise outcomes. Detailed guidance is in the corresponding modules.',
      'faq.q4':           'Who do I contact for HRM system login issues?',
      'faq.a4':           'For any technical issue with the HRM system (login, UI errors, lost access), contact IT. For questions about process or how to write goals, contact LnOD.',
      'faq.q5':           'Can I edit goals after I\'ve set them?',
      'faq.a5':           'Yes. Goals can be adjusted during Mid-year Review if there\'s a major change in scope. Any change must be agreed with your direct manager and updated in HRM.',
      'faq.q6':           'What is Continuous Feedback?',
      'faq.a6':           'A culture of giving and receiving feedback throughout the year — not just at formal review windows. It speeds up performance improvements and builds trust between employees and managers.',

      'journey.tabsAria': 'Select role',

      // Detail page
      'detail.bc':            'Module detail',
      'detail.updated':       'Updated:',
      'detail.share':         'Share',
      'detail.markDone':      'Mark as completed',
      'detail.notDone':       'Not completed',
      'detail.toc':           'Table of contents',
      'detail.contentTitle':  'Content & Process',
      'detail.hotspot':       'Interactive diagram',
      'detail.related':       'Related articles',
      'detail.video':         'Video guide',
      'detail.quiz':          'Knowledge check',
      'detail.attachments':   'Attachments',
      'detail.notes':         'Personal notes',
      'detail.notesPh':       'Your notes about this module...',

      // Map page
      'map.bc':           'Learning journey',
      'map.title':        'Learning <span class="sig">journey</span>',
      'map.subtitle':     'Explore how modules connect and find your optimal learning path.',
      'map.done':         'Completed',
      'map.available':    'Ready to learn',
      'map.locked':       'Locked',

      // Toasts
      'toast.unmarkedDone': 'Marked as not completed',
      'toast.markedDone':   'Marked as completed!',
      'toast.copied':       'Module link copied!',
      'toast.pickModule':   'Pick a module to begin! 🚀',
      'toast.nameUpdated':  'Name updated!',
      'toast.wip':          'This page is under development.',
      'toast.modNotFound':  'Module "{id}" not found. The link may have expired.',

      // Detail dynamic strings
      'detail.doneNote':  'Completed',
      'detail.saved':     'Saved ✓',
      'detail.videoTbd':  'Video not yet available.',

      // Quiz result
      'quiz.r1':   'Excellent! You\'ve mastered the module content.',
      'quiz.r2':   'Great work! Review the questions you missed to lock it in.',
      'quiz.r3':   'Not bad — re-read the content to deepen understanding.',
      'quiz.r4':   'Please review this module before trying again.',
      'quiz.cert': 'Get certificate',

      // Hero modules count
      'hero.modulesActive': 'active modules'
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
    // Notify listeners (e.g. script.js) to re-render dynamic strings
    try { document.dispatchEvent(new CustomEvent('mentora:langchange', { detail: { lang: lang } })); } catch (e) {}
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

  function t(key, fallback) {
    var lang = getLang();
    var d = dict[lang] || dict[DEFAULT_LANG];
    return (d && d[key] != null) ? d[key] : (fallback != null ? fallback : key);
  }

  // Expose for debugging / external use
  window.MentoraI18n = { setLang: setLang, getLang: getLang, apply: apply, t: t };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
