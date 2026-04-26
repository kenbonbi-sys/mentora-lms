# PRD — Mentora LMS
## Compliance Training Portal · MoMo Internal

**Phiên bản:** 1.0  
**Ngày cập nhật:** 26/04/2026  
**Đội sản phẩm:** HR-L&OD  
**Trạng thái:** Production — deployed tại `https://mentora-lms-tau.vercel.app`

---

## 1. Tóm tắt sản phẩm

**Mentora LMS** là hệ thống quản lý đào tạo (Learning Management System) nội bộ của MoMo, được thiết kế để số hóa toàn bộ quy trình đào tạo tuân thủ (compliance training) — từ phân phối nội dung, kiểm tra kiến thức, đến theo dõi tiến độ và cấp chứng chỉ.

Hệ thống hoạt động hoàn toàn trên trình duyệt, không yêu cầu cài đặt phần mềm. Admin có thể tạo và phát hành module mới trong vài phút; learner có thể truy cập từ bất kỳ thiết bị nào có kết nối internet.

### Vấn đề cần giải quyết

| Vấn đề | Trạng thái trước | Giải pháp Mentora |
|---|---|---|
| Tài liệu đào tạo phân tán | File PDF gửi qua email, khó kiểm soát phiên bản | Module tập trung, cập nhật tức thì trên toàn bộ người dùng |
| Không biết ai đã đọc tài liệu | Không có tracking | Dashboard analytics real-time |
| Kiểm tra kiến thức thủ công | Form Google, chấm tay | Quiz tự động, kết quả tức thì |
| Chứng chỉ hoàn thành | In tay, mất thời gian | Tự động generate, nhân viên tự in |
| Không biết nội dung nào khó hiểu | Không có dữ liệu | Phân tích tỉ lệ sai từng câu hỏi |

---

## 2. Đối tượng sử dụng

### Learner (Người học)
- **Ai:** Toàn bộ nhân viên MoMo
- **Mục tiêu:** Học và nắm vững chính sách, quy trình, tiêu chuẩn nội bộ theo yêu cầu
- **Điểm đau:** Không có thời gian đọc tài liệu dài; cần biết mình đang học đến đâu; muốn có bằng chứng đã học

### Admin / L&OD Team
- **Ai:** HR-L&OD, Compliance Officer
- **Mục tiêu:** Tạo và phát hành module mới, theo dõi tiến độ toàn tổ chức, phân tích hiệu quả đào tạo
- **Điểm đau:** Không biết nội dung nào đang có vấn đề; không có dữ liệu để báo cáo lên ban lãnh đạo

---

## 3. Kiến trúc kỹ thuật

```
┌─────────────────────────────────────────┐
│           FRONTEND (Static)             │
│   HTML5 · CSS3 · Vanilla JavaScript     │
│   Deployed: Vercel (CDN global)         │
│                                         │
│  /index.html        ← Learner portal    │
│  /admin/index.html  ← Admin dashboard   │
│  /data/modules.json ← Static fallback   │
└──────────────┬──────────────────────────┘
               │ REST API (fetch)
               │ Supabase anon key
               ▼
┌─────────────────────────────────────────┐
│           BACKEND (Supabase)            │
│   PostgreSQL · Auth · REST API          │
│                                         │
│  page_views      ← traffic analytics   │
│  quiz_attempts   ← quiz results        │
│  quiz_answers    ← per-question data   │
│  modules_cms     ← CMS content         │
│  announcements   ← banner system       │
└─────────────────────────────────────────┘
```

### Stack lý do chọn

| Quyết định | Lý do |
|---|---|
| **Static HTML** (không dùng React/Vue) | Zero build pipeline — deploy trong 30 giây; không phụ thuộc npm ecosystem |
| **Vercel** | Free tier, CDN global, auto-deploy từ GitHub push |
| **Supabase** | PostgreSQL managed, Auth built-in, REST API miễn phí, không cần viết backend |
| **Vanilla JS** | Không có bundle size; chạy được mọi môi trường corporate (proxy, security policy) |
| **Chart.js** (CDN) | Thư viện chart nhẹ, không cần build step |

### Database Schema

```sql
-- Traffic analytics
CREATE TABLE page_views (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id  text,
  module_name text,
  session_id text,
  source     text DEFAULT 'direct',  -- 'direct' | 'search' | 'referral'
  created_at timestamptz DEFAULT now()
);

-- Quiz completion tracking
CREATE TABLE quiz_attempts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   text,
  module_name text,
  score       int,
  total       int,
  pct         int,
  passed      boolean,
  session_id  text,
  created_at  timestamptz DEFAULT now()
);

-- Per-question answer tracking
CREATE TABLE quiz_answers (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id      text,
  question_index int,
  question_text  text,
  is_correct     boolean,
  session_id     text,
  created_at     timestamptz DEFAULT now()
);

-- Content Management System
CREATE TABLE modules_cms (
  id         text PRIMARY KEY,
  data       jsonb,          -- full module JSON
  status     text DEFAULT 'published',  -- 'draft' | 'published' | 'hidden'
  sort_order int  DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Announcement banner
CREATE TABLE announcements (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message    text NOT NULL,
  type       text DEFAULT 'info',  -- 'info' | 'warning' | 'success' | 'danger'
  active     boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

---

## 4. Giai đoạn hình thành

### Phase 0 — Khởi đầu · `Initial commit`
> *"Cần một hệ thống để nhân viên đọc tài liệu compliance và kiểm tra kiến thức"*

**Bối cảnh:** HR-L&OD cần số hóa tài liệu đào tạo, vốn đang được phân phối qua email dưới dạng file PDF. Không có ngân sách mua LMS thương mại (Cornerstone, TalentLMS), không có team engineering riêng.

**Quyết định:** Build static site thuần — HTML + CSS + JS, deploy trên Vercel miễn phí, dùng Supabase làm database/backend. Không framework, không build tool.

**Deliverables Phase 0:**
- Trang danh sách module với card UI (filter theo danh mục, tìm kiếm)
- Trang chi tiết module (steps, video, tài liệu đính kèm)
- Quiz system cơ bản (trắc nghiệm, tự chấm điểm)
- 5 module mẫu: Onboarding, PDPA, An toàn lao động, Chống rửa tiền, Đạo đức nghề nghiệp
- Supabase tracking: `page_views` và `quiz_attempts`
- Deploy lên Vercel + GitHub
- Dark mode toggle

---

### Phase 1 — Analytics · `Add daily traffic chart + traffic source tracking`
> *"Chúng ta biết có người dùng, nhưng không biết bao nhiêu và từ đâu đến"*

**Bối cảnh:** Sau khi deploy, HR muốn có số liệu để báo cáo: bao nhiêu người đã xem, module nào được xem nhiều nhất, người dùng đến từ đâu.

**Deliverables Phase 1:**
- Admin dashboard với Supabase Auth (email/password)
- **4 stat cards:** Lượt xem · Lượt quiz · Điểm trung bình · Tỉ lệ đạt
- **Daily traffic line chart** (Chart.js) — 14 ngày gần nhất
- **Traffic source doughnut chart** — Direct / Search / Referral
  - Detection logic: phân tích `document.referrer` so với danh sách search engine domains
- Per-module breakdown table: views, quiz attempts, average score, pass rate
- Cột `source` được thêm vào `page_views` table

---

### Phase 2 — Advanced Analytics · `Add day filter, delta comparison, heatmap, CSV export, funnel`
> *"Cần so sánh được kỳ này với kỳ trước, và biết giờ nào người dùng hoạt động nhiều nhất"*

**Bối cảnh:** L&OD cần báo cáo hàng tuần/tháng/quý. Ban lãnh đạo muốn thấy xu hướng (tăng/giảm). Đội training muốn lên schedule push thông báo đúng giờ cao điểm.

**Deliverables Phase 2:**
- **Day filter pill buttons:** 7 ngày · 30 ngày · 90 ngày · Tất cả
- **Delta badges** (▲/▼ %) so sánh với kỳ trước tương đương
- **Hourly heatmap** (bar chart 24h) — xác định giờ cao điểm truy cập
- **Export CSV** — toàn bộ module stats với UTF-8 BOM (mở đúng tiếng Việt trong Excel)
- **Conversion funnel** per module: Xem → Làm quiz → Đạt
- Tất cả chart auto-refresh khi đổi day filter

---

### Phase 3 — Learner Experience · `Add reading progress, done badge, certificate...`
> *"Learner cần biết họ đang ở đâu trong quá trình học, và có bằng chứng đã hoàn thành"*

**Bối cảnh:** Feedback từ nhân viên: không biết đọc đến đâu rồi, đọc xong rồi cũng không có gì để ghi nhớ mình đã học. HR muốn nhân viên có thể tự print chứng chỉ nộp cho manager.

**Deliverables Phase 3:**

| Tính năng | Mô tả kỹ thuật |
|---|---|
| **Reading progress bar** | Fixed bar đầu trang, tính `scrollY / (scrollHeight - innerHeight)`, reset về 0 khi quay trang list |
| **Mark as Done** | Toggle button + localStorage key `lms-done-{id}` + green badge trên card |
| **Personal notes** | Textarea với debounce 800ms auto-save vào localStorage per module; flush ngay khi đổi module |
| **Completion certificate** | Modal với tên learner (nhập tay), `window.print()` + `@media print` CSS ẩn hết ngoài cert |
| **Share module link** | Copy `?module=ID` vào clipboard; graceful fallback nếu `clipboard API` không khả dụng |
| **Announcement banner** | Fetch `announcements` table (active=true), 4 type variants (info/warning/success/danger), dismiss lưu localStorage |
| **Per-question tracking** | Insert vào `quiz_answers` với `is_correct` per câu; dedup bằng `_answeredKeys` Set (chỉ ghi lần đầu/session) |
| **URL param deep link** | `?module=ID` → retry loop 10 lần × 300ms → graceful toast nếu không tìm thấy |

---

### Phase 4 — Content Management · `Add Draft/Published/Hidden status for modules`
> *"Admin cần workflow để tạo nội dung trước khi phát hành, và tạm ẩn module cần review"*

**Bối cảnh:** L&OD muốn chuẩn bị nội dung trước khi announce, cần cho compliance team review nội dung trước khi publish cho toàn bộ nhân viên. Đồng thời cần tạm ẩn module đang cập nhật.

**Deliverables Phase 4:**

| Tính năng | Mô tả |
|---|---|
| **Status system** | 3 trạng thái: `draft` (chưa publish) · `published` (hiện trên site) · `hidden` (tạm ẩn) |
| **Module builder** | Form tạo/sửa module trực tiếp trong admin: basic info + step builder (thêm/xóa bước) + quiz builder |
| **Sort order** | Kéo thứ tự module bằng nút ↑↓, swap `sort_order` value trong DB |
| **Preview** | Mở `/?module=ID` trong tab mới để xem trước trước khi publish |
| **Announcement manager** | Tạo · bật/tắt · xóa thông báo; 4 loại type; hiện danh sách đang active |
| **Question analysis** | Nhóm `quiz_answers` theo module+câu hỏi, tính `wrong_rate`, badge Khó/Trung bình/Dễ |
| **Activity feed** | Timeline 80 sự kiện gần nhất (page views + quiz attempts), format thời gian tương đối |

---

### Phase 5 — Quality & Polish · `Fix edge cases + Redesign user journey`
> *"Kiểm tra kỹ lại trước khi ra mắt chính thức với toàn bộ nhân viên"*

**Bối cảnh:** Trước khi broadcast link đến toàn bộ nhân viên, team thực hiện audit toàn bộ edge case, UX và data quality.

**Deliverables Phase 5:**

**Bug fixes:**
- `?module=ID` graceful fallback — retry 10 lần, toast + clean URL nếu không tìm thấy
- Notes debounce flush — lưu ghi chú ngay khi chuyển module, không mất data
- Reading progress bar null guard + reset khi về trang list
- Admin `loadCmsModules()` fallback query khi column `sort_order`/`status` chưa tồn tại
- `loadAnnouncements()` / `loadQuestionAnalysis()` friendly message khi table chưa tạo
- `moveModule()` guard khi column `sort_order` missing
- Certificate modal chuyển sang `.open` class (fade animation thay vì display:none toggle)
- ESC key đóng tất cả modal (site + admin)
- Quiz answer dedup — `_answeredKeys` Set ngăn duplicate insert khi learner làm lại
- Daily chart `displayDays` — bỏ Math.min(30) cap; 90 ngày hiện đúng 90 cột
- Xóa dead code: `fillEl`, `labelEl`, `scrollHandler`, no-op scroll listener

**UX improvements:**
- Xóa Login/Register button trên navbar (internal LMS, không cần user auth)
- Đổi tên tab admin "Thông báo" → "Thông báo & Phân tích"
- **User Journey Guide** — thay list đơn giản bằng 5-step interactive slideshow:
  - Progress pill dots (active dot animate thành 28px pill)
  - Slide transition: fade + translateX theo chiều di chuyển
  - Illustration riêng cho mỗi bước (icon lớn + gradient background)
  - "Bắt đầu học!" scroll đến danh sách module

---

## 5. Tính năng chi tiết

### 5.1 Learner Portal (`/`)

#### Module Discovery
- **Grid view** với card thumbnail (icon + gradient background theo category)
- **Category filter:** Tất cả · Policy · Process · Safety
- **Tìm kiếm real-time:** match theo tên, mô tả, owner, category
- **Done badge:** Badge xanh lá "Đã hoàn thành" trên card module đã qua quiz
- **Hero count:** Số module đang active cập nhật tự động

#### Module Detail
- **Breadcrumb navigation** + nút Quay lại
- **Header:** Tên · Mô tả · Owner · Ngày cập nhật · Thời lượng · Level badge · Category badge
- **Reading progress bar:** Fixed bar đầu trang (gradient pink), cập nhật theo scroll
- **Step-by-step content:** Quy trình chia bước với step number, tiêu đề, mô tả, ghi chú
- **Video section:** YouTube embed iframe (responsive 16:9), ẩn nếu không có video
- **Related modules gallery:** Các module cùng hệ thống, click để mở nhanh
- **Resource attachments:** Danh sách file PDF/PPTX với icon type và nút download

#### Sidebar
- **Tài liệu đính kèm** — download link
- **Step tracker** — dot timeline highlight step đang xem (IntersectionObserver)
- **Ghi chú cá nhân** — textarea auto-save (debounce 800ms), persist trong localStorage

#### Action buttons
- **Chia sẻ** — copy `?module=ID` URL vào clipboard
- **Đánh dấu hoàn thành** — toggle localStorage, cập nhật badge trên card

#### Quiz System
- Trắc nghiệm 4 đáp án (A/B/C/D)
- Instant feedback: highlight đúng/sai, giải thích ngay
- Không thể thay đổi câu đã trả lời
- Kết quả hiện sau khi hoàn thành tất cả câu
- **≥75%:** Hiện nút "Nhận chứng chỉ" + tự động mark as done
- **"Làm lại"** — reset quiz, không ghi duplicate vào Supabase

#### Certificate
- Modal với thông tin: Tên learner (nhập tay) · Tên module · Điểm số · Ngày
- `@media print` CSS — ẩn tất cả ngoại trừ certificate khi in
- Tên được lưu localStorage (`lms-cert-name`) cho lần sau

#### User Journey Guide
- Popup 5-step slideshow khi bấm "Hướng dẫn sử dụng"
- Progress dot animation · slide transition · illustration per step
- Step 5 → "Bắt đầu học!" scroll đến module grid

#### System
- **Announcement banner** — top of page, 4 màu theo type, dismiss lưu localStorage
- **Dark mode** — toggle ☀/🌙, persist localStorage
- **URL deep link** — `?module=ID` mở thẳng vào module, retry loop + graceful fallback
- **Traffic tracking** — anonymous session ID, detect source (direct/search/referral)

---

### 5.2 Admin Dashboard (`/admin`)

#### Authentication
- Supabase email/password (JWT session)
- Auto-check session khi load
- Logout xóa session

#### Tab: Tổng quan

**Filters & Actions:**
- Day filter: 7 · 30 · 90 ngày · Tất cả (mặc định 30)
- Export CSV (UTF-8 BOM, tương thích Excel)

**Stat Cards (với delta ▲/▼ so kỳ trước):**
- Lượt xem · Lượt làm quiz · Điểm trung bình · Tỉ lệ đạt (≥75%)

**Charts (Chart.js v4):**
- **Daily traffic line chart** — số cột = số ngày filter (7/30/90); "Tất cả" → 90 ngày gần nhất
- **Traffic source doughnut** — Direct / Search / Referral với legend tỉ lệ
- **Hourly heatmap bar chart** — 24 khung giờ, màu sắc intensity theo traffic

**Per-module stats table:**
- Cột: Module · Danh mục · Lượt xem · Lượt quiz · Điểm TB · Đạt quiz · Funnel
- **Conversion funnel mini:** Xem → % làm quiz → % đạt (màu good/med/low)

#### Tab: Modules

**CMS table columns:** ID · Tên · Danh mục · Cập nhật · Trạng thái · Thao tác nhanh · Actions

**Status workflow:**
```
[Draft] ──publish──▶ [Published] ──hide──▶ [Hidden]
   ▲                      │                    │
   └──────draft────────────┘◀────draft──────────┘
```

**Module actions:**
- Xem trước (mở `/?module=ID` tab mới)
- Chỉnh sửa (mở modal builder)
- Thay đổi status (1-click)
- Sắp xếp thứ tự (↑↓ swap sort_order)
- Xóa (CMS-only modules)

**Module Builder modal:**
- Basic info: ID · Tên · Danh mục · Level · Thời lượng · Ngày CN · Trạng thái · Mô tả · Thumbnail · Icon · Video URL
- **Step builder:** Thêm/xóa bước, mỗi bước có: Tiêu đề · Nội dung · Ghi chú
- **Quiz builder:** Thêm/xóa câu hỏi, mỗi câu: Câu hỏi · 4 đáp án · Chọn đáp án đúng · Giải thích
- Module mới mặc định `draft`
- Save → upsert vào `modules_cms`

#### Tab: Hoạt động
- Timeline 80 sự kiện gần nhất
- Page view events: "Mở module [tên]"
- Quiz events: "Hoàn thành quiz [tên] — X/Y (Z%)" với badge Đạt/Chưa đạt
- Timestamp tương đối: "Vừa xong · X phút/giờ/ngày trước"

#### Tab: Thông báo & Phân tích

**Announcement manager:**
- Tạo thông báo: nhập nội dung + chọn type (Info/Warning/Success/Danger)
- Danh sách với toggle bật/tắt và xóa
- Thông báo active → hiện banner trên learner portal

**Question analysis table:**
- Cột: Module · Câu hỏi · Số lần trả lời · Tỉ lệ sai · Độ khó
- Sort: câu khó nhất (tỉ lệ sai cao) lên đầu
- Badge độ khó: Khó (≥70% sai) · Trung bình (40–70%) · Dễ (<40%)
- Friendly message nếu table `quiz_answers` chưa tạo

---

## 6. Data & Privacy

### Anonymous tracking
- Không thu thập tên, email hay bất kỳ PII nào của learner
- Mỗi session được gán một `session_id` ngẫu nhiên (`sess_` + timestamp36 + random)
- Session ID lưu trong `window._sessionId` (memory only, không persist)
- Traffic source detect từ `document.referrer` (không log URL đầy đủ)

### LocalStorage (client-only)
- `lms-done-{id}` — trạng thái hoàn thành per module
- `lms-notes-{id}` — ghi chú cá nhân per module
- `lms-cert-name` — tên learner cho certificate
- `lms-ann-{id}` — đã dismiss announcement
- `lms-theme` — light/dark preference

---

## 7. Deployment & Operations

### Workflow
```
Developer edits code locally
        │
        ▼
git push → GitHub (kenbonbi-sys/mentora-lms)
        │
        ▼ (auto-trigger)
Vercel build (static, ~15 giây)
        │
        ▼
Live tại mentora-lms-tau.vercel.app
```

### Không có downtime khi deploy
Vercel dùng atomic deployment — URL cũ vẫn phục vụ request cho đến khi deploy mới hoàn tất 100%.

### Content update workflow
```
Admin mở /admin → Tab Modules
        │
        ▼
Tạo module mới → Status: Draft
        │
        ▼ (L&OD review, Compliance review)
Bấm "Publish" → Status: Published
        │
        ▼
Module xuất hiện ngay trên learner portal (không cần deploy lại)
```

---

## 8. Known Limitations & Roadmap

### Limitations hiện tại
| Item | Mô tả | Workaround |
|---|---|---|
| No user authentication | Learner không đăng nhập — không biết ai học ai | Tracking qua session ID (anonymous) |
| No progress sync across devices | LocalStorage không sync giữa thiết bị | — |
| No email notifications | Không gửi reminder cho learner chưa hoàn thành | Admin export CSV rồi gửi email thủ công |
| No Supabase RLS | Anon key public — cần setup RLS policies | Ưu tiên setup trước khi public rộng |
| Quiz randomization | Thứ tự câu hỏi cố định | Có thể add trong Phase 2 |

### Roadmap đề xuất (Phase 6+)

**P1 — Security:**
- [ ] Setup Supabase RLS policies cho tất cả tables
- [ ] Rate limiting cho `quiz_answers` insert

**P2 — Learner identity:**
- [ ] SSO với hệ thống nội bộ MoMo (nếu có API)
- [ ] Hoặc: email-based "magic link" (không cần password)
- [ ] Learning history per user

**P3 — Content:**
- [ ] Image upload trực tiếp trong admin (thay URL text)
- [ ] Rich text editor cho step content (thay textarea)
- [ ] Module categories mở rộng (ngoài Policy/Process/Safety)
- [ ] Prerequisite: module A phải hoàn thành trước khi mở module B

**P4 — Reporting:**
- [ ] Báo cáo xuất PDF cho ban lãnh đạo
- [ ] Dashboard embed cho HR portal
- [ ] Scheduled email report hàng tuần

---

## 9. Metrics thành công

| Metric | Mục tiêu 3 tháng |
|---|---|
| Module completion rate | ≥ 70% nhân viên bắt buộc hoàn thành module được assign |
| Quiz pass rate | ≥ 75% learner pass trong lần thứ nhất hoặc thứ hai |
| Admin adoption | L&OD publish ≥ 1 module mới/tháng |
| Time-to-publish | < 30 phút từ khi tạo module đến khi publish |
| Page load time | < 2 giây trên 4G (Vercel CDN) |

---

*Document này được tạo bởi AI assistant dựa trên codebase thực tế của dự án.*  
*Codebase: `github.com/kenbonbi-sys/mentora-lms` · Live: `mentora-lms-tau.vercel.app`*
