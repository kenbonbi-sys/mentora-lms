# PRD — Mentora LMS: Compliance Training Portal

---

## 1. THÔNG TIN CHUNG (Meta Data)

| Trường | Nội dung |
|---|---|
| **Tên dự án** | Mentora LMS — Compliance Training Portal |
| **Tên sản phẩm** | Mentora |
| **Thương hiệu** | MoMo |
| **Người phụ trách (PM)** | HR-L&OD Team |
| **Trạng thái tài liệu** | ✅ Approved (Production-ready) |
| **Phiên bản hiện tại** | v1.0 — MVP Live |
| **Ngày cập nhật** | 30/04/2026 |
| **URL Production** | https://mentora-lms-tau.vercel.app |
| **Tech Lead** | — |
| **Design Lead** | — |
| **QA Lead** | — |
| **Thành viên cốt lõi** | HR-L&OD, IT/Dev Team |

---

## 2. VẤN ĐỀ VÀ MỤC ĐÍCH (Problem Statement & Purpose)

### Vấn đề

Hiện tại, quá trình đào tạo tuân thủ nội bộ tại MoMo đang gặp các điểm đau sau:

- **Phân tán công cụ**: Tài liệu chính sách nằm rải rác trên Google Drive, Sharepoint, và email — nhân viên không biết phiên bản nào là mới nhất.
- **Không có cơ chế xác nhận**: HR không thể biết nhân viên nào đã đọc và hiểu chính sách, dẫn đến rủi ro tuân thủ.
- **Trải nghiệm học tập đứt gãy**: Nhân viên phải tự tìm tài liệu, không có lộ trình học rõ ràng, không có phản hồi ngay sau khi học.
- **Thiếu dữ liệu cho HR**: Không có báo cáo ai đã hoàn thành module nào, tỷ lệ pass/fail quiz, điểm số trung bình để phục vụ audit nội bộ.
- **Onboarding kém hiệu quả**: Nhân viên mới không có nguồn học chuẩn hoá, phụ thuộc nhiều vào buddy/manager trực tiếp.

### Mục đích & Giải pháp

**Mentora LMS** là nền tảng học tập tuân thủ tập trung, cho phép:

- Nhân viên MoMo học các module chính sách, quy trình và an toàn lao động theo tiến độ cá nhân, bất cứ lúc nào, trên mọi thiết bị.
- HR-L&OD team quản lý nội dung đào tạo, theo dõi tiến độ học và xuất báo cáo tuân thủ.
- Hệ thống tự động hoá việc chứng nhận hoàn thành, giảm tải công việc thủ công cho HR.

**Tagline:** *"Làm Đúng từ đầu"*

---

## 3. CHÂN DUNG NGƯỜI DÙNG (User Personas)

### Persona 1 — Nhân viên (Learner)

| Thuộc tính | Chi tiết |
|---|---|
| **Tên đại diện** | Minh — Nhân viên kinh doanh, 2 năm kinh nghiệm |
| **Mục tiêu** | Hoàn thành đủ module bắt buộc, nắm rõ chính sách để tránh vi phạm |
| **Pain points** | Bận rộn — cần học nhanh, dễ tiếp thu; Không nhớ đã đọc tài liệu phiên bản nào |
| **Hành vi** | Học trên điện thoại lúc di chuyển, thích học theo từng module nhỏ |
| **Kỳ vọng** | Giao diện đẹp, tải nhanh, biết rõ mình còn phải học gì, có chứng chỉ để lưu |

### Persona 2 — Admin / HR-L&OD (Content Manager)

| Thuộc tính | Chi tiết |
|---|---|
| **Tên đại diện** | Linh — HR Specialist, phụ trách L&OD |
| **Mục tiêu** | Cập nhật nội dung đào tạo kịp thời, theo dõi tỷ lệ hoàn thành, xuất báo cáo cho ban lãnh đạo |
| **Pain points** | Tốn thời gian gửi email nhắc nhở thủ công; Không có số liệu để chứng minh hiệu quả đào tạo |
| **Hành vi** | Làm việc trên máy tính desktop, cần dashboard dễ đọc và export được dữ liệu |
| **Kỳ vọng** | CMS đơn giản để upload nội dung không cần biết code; Báo cáo tự động theo ngày/tuần/tháng |

---

## 4. MỤC TIÊU VÀ CHỈ SỐ THÀNH CÔNG (Goals & Success Metrics)

### Mục tiêu kinh doanh

| # | Mục tiêu | Thời hạn |
|---|---|---|
| 1 | 100% nhân viên mới (onboarding) hoàn thành module M001 trong tuần đầu làm việc | Q3/2026 |
| 2 | ≥ 80% nhân viên toàn công ty hoàn thành ít nhất 3/5 module bắt buộc | Q4/2026 |
| 3 | Giảm 70% thời gian HR dành cho việc theo dõi tuân thủ thủ công | Q4/2026 |

### KPIs (Chỉ số đo lường)

| KPI | Định nghĩa | Target |
|---|---|---|
| **Module Completion Rate** | % học viên hoàn thành toàn bộ nội dung + quiz | ≥ 75% |
| **Quiz Pass Rate** | % lượt làm quiz đạt ngưỡng ≥ 75 điểm | ≥ 80% |
| **Average Quiz Score** | Điểm trung bình toàn bộ quiz attempts | ≥ 80/100 |
| **Time-to-Complete** | Thời gian TB để hoàn thành 1 module (phút) | ≤ 45 phút |
| **7-Day Retention** | % học viên quay lại học sau 7 ngày | ≥ 40% |
| **Admin Report Lead Time** | Thời gian từ request đến khi có báo cáo | ≤ 5 phút (tự động) |

---

## 5. YÊU CẦU CHỨC NĂNG & USER STORIES (Functional Requirements)

### A. MUST-HAVE ✅ (MVP — Đã triển khai)

#### 5.1 Module Learning System

**User Story:** *"Là một nhân viên, tôi muốn xem nội dung module theo từng bước có cấu trúc để dễ nắm bắt và không bỏ sót thông tin quan trọng."*

| Acceptance Criteria | Chi tiết |
|---|---|
| Mỗi module hiển thị | Tiêu đề, mô tả, thời lượng, danh mục, cấp độ (Bắt buộc / Theo phòng ban) |
| Nội dung module | Steps có tiêu đề + mô tả + ghi chú, hỗ trợ video, ảnh, tài liệu đính kèm |
| Tài nguyên hỗ trợ | PDF, PPTX, DOC với tên file và dung lượng |
| Trạng thái hoàn thành | Lưu tự động vào localStorage khi nhấn "Đánh dấu hoàn thành" |

---

**User Story:** *"Là một nhân viên, tôi muốn lọc và tìm kiếm module theo danh mục để nhanh chóng tìm thấy nội dung cần học."*

| Acceptance Criteria | Chi tiết |
|---|---|
| Filter tabs | Tất cả / Policy / Process / Safety — không cần reload trang |
| Tìm kiếm | Real-time theo tên module, không cần nhấn Enter |
| Module count | Hiển thị số lượng module theo từng danh mục |

---

#### 5.2 Quiz & Assessment System

**User Story:** *"Là một nhân viên, tôi muốn làm bài kiểm tra sau khi học để xác nhận tôi đã hiểu nội dung và nhận phản hồi ngay lập tức."*

| Acceptance Criteria | Chi tiết |
|---|---|
| Câu hỏi | Trắc nghiệm 1 đáp án đúng trong 4 lựa chọn |
| Phản hồi | Highlight đáp án đúng/sai + giải thích ngay sau khi chọn |
| Tiến trình | Thanh progress bar hiển thị câu hiện tại / tổng số câu |
| Ngưỡng đạt | ≥ 75% tổng điểm |
| Lưu điểm | Kết quả lưu vào localStorage, hiển thị điểm lần gần nhất |

---

#### 5.3 Progress & Statistics Dashboard

**User Story:** *"Là một nhân viên, tôi muốn thấy tổng quan tiến độ học tập của mình ngay trên trang chủ để biết mình còn phải làm gì."*

| Acceptance Criteria | Chi tiết |
|---|---|
| Stats Strip | Số module hoàn thành / Điểm TB quiz / Streak (ngày liên tiếp) / % tổng tiến độ |
| Progress bar | Thanh trực quan cho tổng tiến độ toàn bộ module |
| Module card | Badge "Đã hoàn thành" hiển thị trên card sau khi đánh dấu |
| Gamification | Streak tăng khi học ít nhất 1 module mỗi ngày |

---

#### 5.4 Certificate Generation

**User Story:** *"Là một nhân viên, tôi muốn tải chứng chỉ hoàn thành sau khi xong toàn bộ module để lưu hồ sơ và chứng minh với HR."*

| Acceptance Criteria | Chi tiết |
|---|---|
| Nhập tên | Modal cho phép nhập tên học viên (lưu localStorage) |
| Nội dung chứng chỉ | Tên học viên, danh sách module hoàn thành, ngày cấp, logo MoMo |
| Tải xuống | Nút in/export chứng chỉ |

---

#### 5.5 Admin Dashboard & CMS

**User Story:** *"Là một HR Specialist, tôi muốn đăng nhập vào trang quản trị để xem báo cáo học tập và cập nhật nội dung mà không cần nhờ IT."*

| Tab | Tính năng |
|---|---|
| **Dashboard** | KPI cards (Lượt xem, Quiz attempts, Điểm TB, Pass rate) + Biểu đồ traffic + Heatmap |
| **Modules** | Danh sách module + trạng thái Draft/Published/Hidden + CRUD |
| **Activity** | Log hoạt động học viên real-time |
| **Announcements** | Tạo và quản lý banner thông báo |

---

**User Story:** *"Là một HR Specialist, tôi muốn tạo module đào tạo mới trong vòng 30 phút bằng công cụ có sẵn, không cần biết code."*

| Acceptance Criteria | Chi tiết |
|---|---|
| Form cơ bản | Tên, danh mục, cấp độ, thumbnail, icon, thời lượng |
| Step editor | Thêm/xóa/sắp xếp bước nội dung |
| Quiz builder | Thêm câu hỏi + 4 lựa chọn + đáp án đúng + giải thích |
| Publish control | Toggle Published / Draft / Hidden |

---

**User Story:** *"Là một HR Specialist, tôi muốn xuất báo cáo dữ liệu ra file CSV để đính kèm vào báo cáo tuân thủ nội bộ."*

| Acceptance Criteria | Chi tiết |
|---|---|
| Export button | Nút "Export CSV" trên Dashboard tab |
| Nội dung file | Lượt xem, quiz attempts, điểm số, tỷ lệ pass |
| Filter thời gian | 7 ngày / 30 ngày / 90 ngày / Tất cả |

---

#### 5.6 Announcement System

**User Story:** *"Là một HR Specialist, tôi muốn gửi thông báo lên banner trang chủ để toàn bộ nhân viên thấy ngay khi vào học."*

| Acceptance Criteria | Chi tiết |
|---|---|
| Loại thông báo | Info / Warning / Success / Danger (màu semantic) |
| Dismiss | Học viên có thể đóng banner |
| Quản lý | Bật/tắt từ admin panel |

---

### B. SHOULD-HAVE 📋 (Đã triển khai — Nâng cao)

#### 5.7 Knowledge Map — Bản đồ Kiến thức

**User Story:** *"Là một nhân viên, tôi muốn thấy sơ đồ module và mối liên hệ tiên quyết để học đúng thứ tự và hiệu quả hơn."*

| Acceptance Criteria | Chi tiết |
|---|---|
| Sơ đồ | SVG interactive: nodes (module) + edges (dependency) |
| Trạng thái node | ✅ Đã hoàn thành / 🔵 Có thể học / 🔒 Bị khóa |
| Interaction | Click node → mở detail module |
| Legend | Giải thích 3 trạng thái |

---

#### 5.8 Interactive Hotspots — Điểm Tương tác

**User Story:** *"Là nhân viên học về an toàn lao động, tôi muốn click vào điểm trên sơ đồ mặt bằng để xem hướng dẫn chi tiết từng khu vực."*

| Acceptance Criteria | Chi tiết |
|---|---|
| Pin overlay | Điểm đánh dấu trên ảnh với animation pulsing |
| Popup | Click pin → hiển thị tiêu đề + mô tả chi tiết |
| Multi-pin | Hỗ trợ nhiều hotspot trên 1 ảnh |
| Responsive | Hoạt động tốt trên mobile |

---

#### 5.9 AI Recommendation — Gợi ý Thông minh

**User Story:** *"Là một nhân viên, tôi muốn được gợi ý module tiếp theo phù hợp để không mất thời gian quyết định nên học gì."*

| Acceptance Criteria | Chi tiết |
|---|---|
| Vị trí | Banner hiển thị trên trang chủ, trên danh sách module |
| Thuật toán | Ưu tiên: cùng danh mục đang học + chưa từng thử + đủ prerequisites |
| Lý do gợi ý | Hiển thị context string giải thích tại sao gợi ý module này |
| Cập nhật | Tự động cập nhật sau mỗi lần hoàn thành module |

---

#### 5.10 Dark Mode & Accessibility

**User Story:** *"Là nhân viên làm việc tối, tôi muốn chuyển sang giao diện tối để không mỏi mắt."*

| Acceptance Criteria | Chi tiết |
|---|---|
| Toggle | Nút chuyển dark/light trên nav bar |
| Persistence | Lưu preference qua localStorage |
| Full coverage | Tất cả components hỗ trợ dark mode |
| WCAG | Đáp ứng WCAG 2.1 AA (contrast, ARIA, keyboard nav) |

---

### C. COULD-HAVE 🔮 (Phiên bản V2)

| # | Tính năng | Mô tả |
|---|---|---|
| C1 | **Learner Accounts** | Nhân viên tự đăng ký bằng email công ty |
| C2 | **SSO Integration** | Đăng nhập qua Google Workspace / Microsoft 365 |
| C3 | **Email Notifications** | Nhắc nhở tự động khi có module mới / deadline |
| C4 | **Compliance Deadlines** | Đặt deadline hoàn thành per module, cảnh báo nhân viên |
| C5 | **Learning Path Templates** | Lộ trình học theo vai trò (Nhân viên mới / Sales / Finance) |
| C6 | **RBAC Admin** | Phân quyền admin theo phòng ban |
| C7 | **PWA / Mobile App** | Cài app, hỗ trợ offline |
| C8 | **PDF Compliance Report** | Báo cáo tuân thủ PDF gửi tự động cho manager |
| C9 | **SCORM/xAPI Export** | Tích hợp với LMS lớn hơn |
| C10 | **Bulk User Import** | Import danh sách nhân viên qua Excel |

### D. WON'T-HAVE ❌ (Không làm)

| Tính năng | Lý do |
|---|---|
| Live streaming / Virtual Classroom | Không phải mục tiêu compliance training |
| VR/AR interactive training | Chi phí cao, ROI thấp với compliance |
| Social learning / learner feed | Không phù hợp với culture compliance nội bộ |
| Marketplace / Monetization | Tool nội bộ, không bán ra ngoài |

---

## 6. YÊU CẦU PHI CHỨC NĂNG (Non-Functional Requirements)

### Hiệu suất (Performance)

| Tiêu chí | Target |
|---|---|
| First Contentful Paint (FCP) | ≤ 1.5 giây |
| Time to Interactive (TTI) | ≤ 2 giây |
| Module content load | ≤ 1 giây |
| Quiz feedback response | ≤ 200ms |
| Concurrent users | ≥ 500 đồng thời |
| Uptime SLA | ≥ 99.5% / tháng |

### Bảo mật (Security)

| Tiêu chí | Spec |
|---|---|
| Authentication | Supabase Auth (JWT + session expiry) |
| Authorization | Admin routes được bảo vệ server-side |
| XSS Protection | Tất cả user input HTML-escape trước khi render |
| Transport | HTTPS bắt buộc (Vercel SSL/TLS enforced) |
| API Keys | Chỉ expose Supabase anon key (Row-Level Security) |
| Data Privacy | Không lưu PII nhạy cảm — chỉ session ID + module activity |

### Tính tương thích (Compatibility)

| Tiêu chí | Spec |
|---|---|
| Browsers | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Devices | Desktop, Tablet, Mobile (iOS 14+, Android 10+) |
| Layout | Mobile-First Responsive |
| Min screen width | 320px |
| Accessibility | WCAG 2.1 Level AA |

### Khả năng bảo trì (Maintainability)

- **Zero build pipeline** — HTML/CSS/JS thuần, deploy bằng `git push`
- **No framework lock-in** — Không bị breaking changes của React/Vue
- **CMS-driven content** — Nội dung quản lý qua Admin UI, không cần chỉnh code
- **Supabase managed DB** — Không cần quản lý server

---

## 7. PHẠM VI DỰ ÁN (Scope)

### Trong phạm vi V1 ✅

| Domain | Tính năng |
|---|---|
| Learner Portal | Browse, filter, search module; xem nội dung; quiz; tiến độ; certificate; notes; share |
| Visual Features | Knowledge Map, Hotspots, AI Recommendation, Dark Mode |
| Gamification | Streak, progress bar, completion badge |
| Admin CMS | Login, CRUD module, step editor, quiz builder, status toggle |
| Admin Analytics | Dashboard KPI, traffic chart, heatmap, activity log, CSV export |
| Announcements | Tạo và quản lý banner thông báo |

### Ngoài phạm vi V1 ❌

| Tính năng | Lý do loại khỏi V1 |
|---|---|
| User registration (nhân viên tự đăng ký) | Cần tích hợp HR system — phức tạp hơn MVP |
| SSO (Google/Microsoft) | Cần IT infra approval |
| Email notifications | Cần email service provider, thêm cost |
| Compliance deadlines per module | Cần user accounts trước |
| Mobile PWA | Web đã responsive, không cần gấp |
| Video self-hosting | YouTube embed đủ dùng cho V1 |
| Multi-language (i18n) | Toàn bộ content là tiếng Việt |
| Learner-to-learner messaging | Ngoài scope compliance |

---

## 8. TRẢI NGHIỆM NGƯỜI DÙNG & LUỒNG THIẾT KẾ (UX/UI & User Flow)

### Design System

| Thuộc tính | Giá trị |
|---|---|
| Brand Color | MoMo Pink `#a50064` (PANTONE 234 C) |
| Fonts | MoMo Trust Display (headings), MoMo Trust Sans (body), MoMo Signature (accent) |
| Design Language | shadcn/ui principles — semantic tokens, composition, accessibility-first |
| Component Style | Neomorphism cards + shadcn pill navigation |
| Status Colors | Green `#5ea12a` / Red `#e5303f` / Amber `#f6c315` / Blue `#1c66bb` |
| Dark Mode | Full support — CSS variable theming |

### User Flow A — Nhân viên (Happy Path)

```
1. Vào trang chủ (mentora-lms-tau.vercel.app)
   ↓
2. Xem Stats Strip → biết tiến độ hiện tại (X/5 module, điểm TB, streak)
   ↓
3. Đọc AI Recommendation Banner → gợi ý module tiếp theo
   ↓
4. Click vào Module Card → vào Detail Page
   ↓
5. Đọc nội dung từng Step → Xem Hotspot (nếu có) → Xem Video
   ↓
6. Làm Quiz → Nhận phản hồi tức thì per câu → Xem điểm tổng kết
   ↓
7. Nhấn "Đánh dấu hoàn thành" → Badge + Stats cập nhật
   ↓
8. AI Recommendation cập nhật → Gợi ý module mới
   ↓
9. Vào trang "Lộ trình" (Knowledge Map) → Thấy node nào available tiếp theo
   ↓
10. Khi hoàn thành đủ module → Tải Certificate
```

### User Flow B — Admin (Tạo module mới)

```
1. Truy cập /admin → Login email/password
   ↓
2. Dashboard Tab → Xem KPIs + Charts + Heatmap
   ↓
3. Modules Tab → Nhấn "Tạo module mới"
   ↓
4. Nhập: Tên, Danh mục, Cấp độ, Thumbnail, Thời lượng
   ↓
5. Thêm Steps (Tiêu đề + Nội dung + Ghi chú)
   ↓
6. Thêm Quiz Questions (Câu hỏi + 4 lựa chọn + Đáp án đúng + Giải thích)
   ↓
7. Chọn Status: "Published" → Save
   ↓
8. Activity Tab → Theo dõi học viên truy cập
   ↓
9. Export CSV → Đính kèm vào báo cáo tuân thủ
```

### Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 640px` | Mobile — 1 cột, stacked layout, nav hamburger |
| `640–1024px` | Tablet — 2 cột grid |
| `> 1024px` | Desktop — 3 cột grid, detail sidebar hiển thị |

---

## 9. RỦI RO, GIẢ ĐỊNH & PHỤ THUỘC (Risks, Assumptions & Dependencies)

### Giả định (Assumptions)

| # | Giả định |
|---|---|
| A1 | Nhân viên MoMo có thể truy cập internet và trình duyệt hiện đại trong giờ làm việc |
| A2 | HR-L&OD đã có sẵn nội dung đào tạo (text, ảnh, video YouTube) — không cần công cụ sản xuất video |
| A3 | Chưa cần tích hợp HRMS (SAP, Workday) trong V1 |
| A4 | Số lượng nhân viên đồng thời không vượt quá 500 trong V1 |
| A5 | Dữ liệu học tập không cần audit trail pháp lý cấp cao (không cần SCORM compliance) |

### Sự phụ thuộc (Dependencies)

| Hệ thống | Phụ thuộc | Mức độ ảnh hưởng |
|---|---|---|
| **Supabase** | Backend DB + Authentication | 🔴 Cao — Admin không login, analytics mất |
| **Vercel** | Hosting & CDN | 🔴 Cao — Toàn bộ app không truy cập |
| **YouTube** | Video embedding | 🟡 Trung bình — Video không phát, nội dung khác vẫn học được |
| **Font Awesome CDN** | Icons | 🟢 Thấp — Fallback text label |
| **Google Fonts CDN** | JetBrains Mono | 🟢 Thấp — Fallback system monospace |

### Rủi ro & Giảm thiểu (Risks & Mitigation)

| Rủi ro | Mức độ | Giảm thiểu |
|---|---|---|
| **Nhân viên không có động lực tự học** | 🔴 Cao | Gamification (streak, certificate), announcement nhắc nhở định kỳ |
| **Dữ liệu mất khi clear localStorage** | 🟡 Trung bình | Cảnh báo khi dùng incognito; V2 cần user accounts |
| **Nội dung module lỗi thời** | 🟡 Trung bình | Quy trình review 3-6 tháng/lần, admin cập nhật real-time |
| **YouTube bị block trong mạng nội bộ** | 🟡 Trung bình | Self-host hoặc chuyển Vimeo trong V2 |
| **Supabase free tier limit** | 🟢 Thấp | Monitor usage; upgrade nếu vượt 50K rows / 500MB |
| **Admin account bị compromise** | 🟢 Thấp | Strong password + 2FA (Supabase support), IP whitelist |

---

## 10. KẾ HOẠCH PHÁT HÀNH & CỘT MỐC (Timeline & Milestones)

### Lịch sử phát triển V1 (Retrospective)

| Phase | Deliverables | Trạng thái |
|---|---|---|
| **Phase 0 — Foundation** | Design system, DB schema, static skeleton, MoMo brand integration | ✅ Done |
| **Phase 1 — Core Learning** | Module browser, filter/search, detail page, reading progress bar | ✅ Done |
| **Phase 2 — Assessment** | Quiz system, instant feedback, score tracking, streak, certificate | ✅ Done |
| **Phase 3 — Admin CMS** | Login, module CRUD, step editor, quiz builder, announcements | ✅ Done |
| **Phase 4 — Analytics** | Dashboard KPI, traffic chart, heatmap, activity log, CSV export | ✅ Done |
| **Phase 5 — Advanced Features** | Knowledge Map, Interactive Hotspots, AI Recommendation, Dark Mode | ✅ Done |
| **Phase 6 — Design Polish** | shadcn/ui tokens, filter tabs redesign, modal animation, stats strip | ✅ Done |
| **🚀 V1.0 Launch** | **Production live** | ✅ **LIVE** |

### Roadmap V2 (Dự kiến)

| Milestone | Target | Key Features |
|---|---|---|
| **V2.0 — User Accounts** | Q3/2026 | Nhân viên đăng ký + SSO, dữ liệu persistent thực sự |
| **V2.1 — Notifications** | Q3/2026 | Email reminders, compliance deadline, push notifications |
| **V2.2 — Learning Paths** | Q4/2026 | Lộ trình học theo vai trò, mandatory curriculum theo phòng ban |
| **V2.3 — Reporting** | Q4/2026 | PDF compliance report, weekly email digest cho manager |
| **V3.0 — Scale** | Q1/2027 | SCORM export, HRMS integration, multi-company |

---

## PHỤ LỤC — Thông tin kỹ thuật

### Tech Stack

| Layer | Technology | Lý do chọn |
|---|---|---|
| Frontend | HTML5 + CSS3 + Vanilla JS | Không cần build pipeline, deploy instant, không bị framework lock-in |
| Charts | Chart.js | Lightweight, dễ tùy biến, free |
| Icons | Font Awesome 6 | Phong phú, free tier đủ dùng |
| Backend | Supabase (PostgreSQL) | Free tier, real-time, Auth built-in, no server management |
| Hosting | Vercel | Auto-deploy từ GitHub push, CDN toàn cầu |
| Design System | MoMo Brand + shadcn/ui principles | Đồng nhất brand, accessibility-first, semantic tokens |

### Supabase Database Schema

| Table | Mục đích |
|---|---|
| `page_views` | Track lượt xem module per session + source |
| `quiz_attempts` | Kết quả quiz (score, passed, module_id, timestamp) |
| `quiz_answers` | Chi tiết từng câu trả lời (cho question analytics) |
| `modules_cms` | Nội dung module từ Admin CMS |
| `announcements` | Thông báo admin broadcast |

### Module Data Schema (JSON)

```json
{
  "id": "M001",
  "name": "Quy trình Onboarding Nhân viên Mới",
  "category": "Process",
  "level": "Bắt buộc",
  "duration": "30 phút đọc",
  "prerequisites": [],
  "steps": [
    { "title": "string", "desc": "string", "note": "string" }
  ],
  "quiz": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "string"
    }
  ],
  "hotspotImage": "url",
  "hotspots": [
    { "x": 25, "y": 40, "label": "string", "description": "string" }
  ]
}
```

### localStorage Schema (Client-side)

| Key | Value | Mục đích |
|---|---|---|
| `lms-done-{id}` | `"1"` | Đánh dấu module đã hoàn thành |
| `lms-quiz-score-{id}` | `"85"` | Điểm quiz lần cuối |
| `lms-streak-date` | ISO date string | Ngày hoạt động gần nhất |
| `lms-streak-count` | `"3"` | Số ngày streak liên tiếp |
| `lms-notes-{id}` | text | Ghi chú của học viên per module |
| `lms-theme` | `"dark"\|"light"` | Theme preference |
| `lms-cert-name` | string | Tên học viên cho certificate |

---

*PRD này mô tả trạng thái V1.0 của Mentora LMS — Compliance Training Portal.*
*Cập nhật lần cuối: 30/04/2026 | Người phụ trách: HR-L&OD Team*
