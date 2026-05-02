# 📋 BACKLOG — Mentora LMS

> **Cập nhật:** 02/05/2026
> **Mục đích:** Inventory toàn bộ tính năng đang có trong hệ thống. Dùng để track tiến độ, plan v2, và onboard người mới.
>
> **Quy ước trạng thái:**
> - ✅ Đã làm xong (production-ready)
> - 🟡 Đã làm nhưng cần polish / có known issue
> - 🚧 Đang làm dở
> - 📌 Idea / chưa làm

---

## 1. LEARNER PORTAL (`index.html`, `script.js`, `styles.css`)

### 1.1 Navigation & Layout
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.1.1 | Sticky navbar với logo MoMo | ✅ | `lms-nav` — backdrop blur, height 68px |
| 1.1.2 | Hamburger pill button "MENU" ở **góc trái** (brandbook style) | ✅ | Mới đổi vị trí — pink solid pill, dễ thấy |
| 1.1.3 | Full-screen menu overlay (2 cột: Tổng Quan + Modules) | ✅ | Pink gradient bg, Trust Display 32px |
| 1.1.4 | Quick filter category từ menu (Policy/Process/Safety) | ✅ | Click → jump tới list + auto select tab |
| 1.1.5 | Reading progress bar (top) | ✅ | Width = scroll % |
| 1.1.6 | Footer với logo + copyright | ✅ | |
| 1.1.7 | Toast notifications (success/error/info) | ✅ | Bottom-right slide-in |

### 1.2 Hero Section
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.2.1 | "Làm Đúng từ đầu" headline | ✅ | "Làm Đúng" dùng MoMo Signature font, accent pink |
| 1.2.2 | Promo box eyebrow ("NẮM VỮNG QUY TRÌNH") | ✅ | Diagonal stripes pattern |
| 1.2.3 | CTA buttons (Xem Modules + Hướng dẫn sử dụng) | ✅ | |
| 1.2.4 | Hero blob image (rounded organic shape) | ✅ | |
| 1.2.5 | Animated decorative circles | ✅ | floatDeco keyframe |
| 1.2.6 | Floating module count card | ✅ | "X modules đang hoạt động" |

### 1.3 Module List
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.3.1 | Module card grid responsive (auto-fill) | ✅ | min 300px |
| 1.3.2 | Filter tabs với sliding indicator | ✅ | Tất cả / Policy / Process / Safety |
| 1.3.3 | Search box (real-time filter) | ✅ | |
| 1.3.4 | Skeleton loader khi đang load | ✅ | Shimmer animation |
| 1.3.5 | Empty state khi không có kết quả | ✅ | |
| 1.3.6 | Done badge (✓) trên card đã hoàn thành | ✅ | Top-right corner |
| 1.3.7 | Card hover effect (translateY + shadow) | ✅ | |
| 1.3.8 | Card shows: thumbnail, badge category, duration, owner, last updated | ✅ | |

### 1.4 Module Detail Page
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.4.1 | Layout 3 cột: TOC trái \| Content \| Sidebar phải | ✅ | 240px / 1fr / 280px |
| 1.4.2 | Breadcrumb back navigation | ✅ | |
| 1.4.3 | Detail header (title, subtitle, badges, owner, duration, updated) | ✅ | Title 40px Trust Display |
| 1.4.4 | "Đánh dấu hoàn thành" button | ✅ | Persist localStorage |
| 1.4.5 | "Chia sẻ" button (Web Share API + clipboard fallback) | ✅ | |
| 1.4.6 | Completion note (Chưa hoàn thành / Đã hoàn thành) | ✅ | |

### 1.5 TOC Sidebar (left) — vừa upgrade
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.5.1 | Auto-build từ `.detail-section` titles | ✅ | |
| 1.5.2 | Scroll-spy active link (IntersectionObserver) | ✅ | |
| 1.5.3 | Smooth scroll khi click | ✅ | |
| 1.5.4 | **Nested step checkpoints** dưới "Nội dung & Quy trình" | ✅ | Mới merge từ "Nội dung bài" sidebar |
| 1.5.5 | Active dot với pink ring khi scroll qua step | ✅ | |
| 1.5.6 | Sticky position khi scroll | ✅ | |

### 1.6 Content Blocks (renderer)
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.6.1 | Process step block (số thứ tự + title + desc + note) | ✅ | Note dùng accent border |
| 1.6.2 | Text block (paragraphs) | ✅ | |
| 1.6.3 | Checklist block | ✅ | Green check icons |
| 1.6.4 | Image block (with caption, italic) | ✅ | |
| 1.6.5 | Inline video block (YouTube/Vimeo embed) | ✅ | 16:9 aspect |
| 1.6.6 | Callout block (info/warning/tip/danger) | ✅ | 4 variants với màu MoMo |
| 1.6.7 | Hotspot diagram (image + clickable pins + popup) | ✅ | Pin pulse animation |

### 1.7 Quiz System
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.7.1 | Multiple-choice (4 options) | ✅ | |
| 1.7.2 | Per-question feedback (correct/wrong) | ✅ | Inline labels "Đúng" / "Chưa đúng" |
| 1.7.3 | Explanation hiển thị sau khi answer | ✅ | Pink gradient card |
| 1.7.4 | Quiz progress bar (X/Y) | ✅ | |
| 1.7.5 | Final score card (điểm + % + msg) | ✅ | |
| 1.7.6 | Pass threshold = 75% | ✅ | |
| 1.7.7 | Send `track-quiz` to Supabase | ✅ | |

### 1.8 Right Sidebar
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.8.1 | Tài liệu đính kèm (PDF/PPTX/DOC/Video icons) | ✅ | Download button per item |
| 1.8.2 | Empty state khi không có tài liệu | ✅ | |
| 1.8.3 | Ghi chú cá nhân (textarea, auto-save localStorage) | ✅ | "Đã lưu" indicator |
| 1.8.4 | Clear notes button | ✅ | |
| 1.8.5 | ~~Step tracker (Nội dung bài)~~ → moved to TOC | ✅ | Vừa merge sang TOC sidebar |

### 1.9 Knowledge Map (page riêng)
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.9.1 | Lộ trình học dạng node graph | ✅ | Grid layout với SVG arrows |
| 1.9.2 | 3 trạng thái: Done / Available / Locked | ✅ | Border + badge khác nhau |
| 1.9.3 | Prerequisite arrows giữa modules | ✅ | SVG path |
| 1.9.4 | Click vào node → mở detail (nếu unlocked) | ✅ | |
| 1.9.5 | Legend giải thích states | ✅ | |

### 1.10 Engagement & Gamification
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.10.1 | Streak counter (số ngày liên tục) | ✅ | localStorage |
| 1.10.2 | AI recommendation banner ("Gợi ý tiếp theo") | ✅ | Suggest module dựa trên streak/progress |
| 1.10.3 | Announcement banner (4 types: info/warning/success/danger) | ✅ | Top of page, dismissable |
| 1.10.4 | Completion certificate modal | ✅ | Logo + tên user + module + ngày + nút In |
| 1.10.5 | Custom name input cho certificate | ✅ | |
| 1.10.6 | Print certificate (CSS @media print) | ✅ | |
| 1.10.7 | User journey guide (5-step onboarding modal) | ✅ | Dots indicator, prev/next |
| 1.10.8 | Stats strip widgets | ✅ | |

### 1.11 Tracking (gửi lên Supabase trực tiếp)
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.11.1 | Track page view khi mở module | ✅ | + source (direct/referrer) |
| 1.11.2 | Track quiz attempt (score, pct, passed) | ✅ | |
| 1.11.3 | Track per-question answer | ✅ | quiz_answers table |
| 1.11.4 | Session ID (per browser session) | ✅ | |

### 1.12 Design System (mới đại tu)
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 1.12.1 | MoMo brand fonts (Trust Display/Sans/Signature) | ✅ | Self-hosted /fonts/ |
| 1.12.2 | MoMo color palette (accent #a50064 + status colors) | ✅ | CSS custom props |
| 1.12.3 | Pink ambient gradient background | ✅ | radial-gradient body bg |
| 1.12.4 | Brandbook-inspired typography (40-72px headings) | ✅ | |
| 1.12.5 | shadcn-compatible token aliases | ✅ | --primary, --foreground, etc. |
| 1.12.6 | Reduced-motion media query | ✅ | Respect a11y |
| 1.12.7 | Forced-colors mode (Windows high contrast) | ✅ | |
| 1.12.8 | Light/dark theme toggle | ❌ Removed | Đã loại bỏ theo yêu cầu |

---

## 2. ADMIN DASHBOARD (`admin/`)

### 2.1 Authentication
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 2.1.1 | Supabase email/password login | ✅ | |
| 2.1.2 | Login error UI | ✅ | |
| 2.1.3 | Session persistence (Supabase auth) | ✅ | |
| 2.1.4 | Logout button | ✅ | |

### 2.2 Layout & Tabs
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 2.2.1 | 5 tabs: Overview / Modules / Journey / Activity / Announce | ✅ | |
| 2.2.2 | Compact 16:9 dashboard layout (no scroll) | ✅ | Vừa optimize |
| 2.2.3 | Day filter (7/30/90/all) | ✅ | Slicer pills |

### 2.3 Overview Dashboard
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 2.3.1 | 7 KPI cards (Views, Quiz, Avg Score, Pass Rate, E2E, Repeat, Weekly) | ✅ | |
| 2.3.2 | Sparkline charts trong mỗi KPI card | ✅ | Chart.js — fixed-height wrapper |
| 2.3.3 | Δ delta vs previous period | ✅ | Green/red arrow |
| 2.3.4 | Tabbed chart widget (Daily / Source / Hour heatmap) | ✅ | Tiết kiệm không gian |
| 2.3.5 | Funnel chart (Views → Quiz Attempts → Passes) | ✅ | Horizontal bar |
| 2.3.6 | Top 3 modules by views | ✅ | Green bars |
| 2.3.7 | Bottom 3 modules by pass rate | ✅ | Red bars |
| 2.3.8 | Modules table (clickable rows → drilldown) | ✅ | |
| 2.3.9 | Per-module drilldown panel (slide-in from right) | ✅ | 30-day daily chart + score distribution |

### 2.4 Modules CMS
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 2.4.1 | List view với status badges (Draft/Published) | ✅ | |
| 2.4.2 | Add new module button | ✅ | |
| 2.4.3 | Edit module modal | ✅ | |
| 2.4.4 | Delete module với confirm | ✅ | |
| 2.4.5 | Block editor — drag/drop blocks | ✅ | |
| 2.4.6 | Block types: text / checklist / image / video / callout / process-steps / quiz | ✅ | |
| 2.4.7 | Word upload (paste từ .docx) | ✅ | Auto convert sang blocks |
| 2.4.8 | Module preview modal (desktop/mobile toggle) | ✅ | |
| 2.4.9 | Toggle status Draft ↔ Published | ✅ | |

### 2.5 Journey Builder (Lộ trình)
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 2.5.1 | Drag-drop module order | ✅ | HTML5 DnD |
| 2.5.2 | Linear-lock toggle (sequential prereq) | ✅ | |
| 2.5.3 | Custom dependency editor | ✅ | |
| 2.5.4 | Live visual preview | ✅ | |

### 2.6 Activity Feed
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 2.6.1 | Feed gộp views + quiz attempts (sort theo thời gian) | ✅ | |
| 2.6.2 | Format relative time ("2 phút trước") | ✅ | |
| 2.6.3 | Filter theo loại hoạt động | 🟡 | Partial |

### 2.7 Announcements
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 2.7.1 | List announcements | ✅ | |
| 2.7.2 | Tạo mới (message + type + active) | ✅ | |
| 2.7.3 | Edit / Delete | ✅ | |
| 2.7.4 | 4 types: info / warning / success / danger | ✅ | |

### 2.8 Question Analysis
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 2.8.1 | Per-question correct % across all attempts | ✅ | Identify khó/dễ |
| 2.8.2 | Group by module + question index | ✅ | |

### 2.9 Export
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 2.9.1 | Export CSV (views + quiz attempts) | ✅ | |
| 2.9.2 | UTF-8 BOM cho Excel hiển thị tiếng Việt | ✅ | |

---

## 3. INFRASTRUCTURE & DATA

### 3.1 Deployment
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 3.1.1 | Vercel auto-deploy from GitHub master | ✅ | |
| 3.1.2 | SPA fallback rewrite (vercel.json) | ✅ | |
| 3.1.3 | Static asset caching | ✅ | |

### 3.2 Backend
| # | Tính năng | Trạng thái | Ghi chú |
|---|---|---|---|
| 3.2.1 | Vercel serverless `/api/modules` (Google Sheets) | ✅ | |
| 3.2.2 | Express server local dev (`server/server.js`) | ✅ | npm start / npm run dev |
| 3.2.3 | JSON file DB (`server/db.js`, atomic writes) | ✅ | Local only |
| 3.2.4 | JWT auth middleware | ✅ | Express only |

### 3.3 Database (Supabase)
| # | Bảng | Trạng thái | Ghi chú |
|---|---|---|---|
| 3.3.1 | `page_views` | ✅ | module_id, name, session_id, source, created_at |
| 3.3.2 | `quiz_attempts` | ✅ | score, total, pct, passed, session_id |
| 3.3.3 | `quiz_answers` | ✅ | question_index, selected, correct |
| 3.3.4 | `announcements` | ✅ | message, type, active |
| 3.3.5 | RLS policies (allow-all for MVP) | 🟡 | Cần tighten cho v2 |

### 3.4 Documentation
| # | File | Trạng thái |
|---|---|---|
| 3.4.1 | `README.md` | 📌 Chưa có |
| 3.4.2 | `PRD.md` (product spec, Vietnamese) | ✅ |
| 3.4.3 | `HANDOVER.md` (HR handover guide) | ✅ |
| 3.4.4 | `CLAUDE.md` (dev guide cho AI) | ✅ Mới tạo |
| 3.4.5 | `BACKLOG.md` (file này) | ✅ |
| 3.4.6 | `supabase/setup.sql` (DDL) | ✅ |

---

## 4. KNOWN ISSUES / TECH DEBT

| # | Vấn đề | Severity | Notes |
|---|---|---|---|
| 4.1 | Supabase URL + anon key hard-coded trong JS | 🟡 Low | Anon key public-safe nhưng nên dùng env trên Vercel |
| 4.2 | Không có user auth cho learner (anonymous tracking) | 🟡 Med | V2: cần user accounts |
| 4.3 | Express server và Vercel có 2 implementation song song | 🟡 Low | Express chỉ dùng local — KHÔNG sync với Supabase |
| 4.4 | RLS policies "Allow all" | 🔴 High (security) | Cần restrict trước khi mở rộng quy mô |
| 4.5 | Activity feed filter chưa hoàn chỉnh | 🟡 Low | |
| 4.6 | Không có rate limiting trên public Supabase endpoints | 🟡 Med | |

---

## 5. ROADMAP / IDEAS (chưa làm)

### 5.1 V2 — User Accounts
- 📌 Đăng ký/đăng nhập learner (Supabase Auth)
- 📌 Track per-user (thay vì session-based anonymous)
- 📌 Personal dashboard (modules đã/đang/chưa học)
- 📌 Email reminder (overdue modules)

### 5.2 V2 — Content
- 📌 Video upload trực tiếp (thay vì chỉ embed YouTube)
- 📌 Multi-language support (i18n)
- 📌 Required modules per role/department
- 📌 Module versioning & changelog

### 5.3 V2 — Analytics
- 📌 Cohort analysis (so sánh group)
- 📌 Time-to-complete histogram
- 📌 Quiz question difficulty score
- 📌 Email weekly digest cho HR
- 📌 Slack/Teams integration (đăng nhắc nhở)

### 5.4 V2 — Engagement
- 📌 Leaderboard (top learners)
- 📌 Badge system (collect achievements)
- 📌 Discussion comments mỗi module
- 📌 Bookmark/save module
- 📌 Quiz retry với câu hỏi khác

### 5.5 V2 — Admin
- 📌 Multi-admin với role-based access (HR / Manager / Viewer)
- 📌 Audit log (ai sửa gì, khi nào)
- 📌 Bulk import modules từ folder
- 📌 A/B test version của module

---

## 6. CHANGELOG (sessions gần đây)

### 02/05/2026
- ✅ Merge "Nội dung bài" step tracker vào TOC sidebar (nested under "Nội dung & Quy trình")
- ✅ Tạo `CLAUDE.md` cho future Claude Code sessions
- ✅ Tạo `BACKLOG.md` (file này)

### Trước đó (cùng phiên)
- ✅ Brandbook design adoption: hamburger pill bên trái, larger Trust Display typography, pink ambient bg
- ✅ Remove "Tài Nguyên" column từ menu overlay → 2-col grid
- ✅ Full-screen menu overlay (brandbook style) + module detail TOC sidebar với scroll-spy
- ✅ Remove light/dark mode toggle
- ✅ Compact 16:9 admin dashboard với tabbed charts
- ✅ Fix infinite resize loop của Chart.js sparklines (wrap canvas trong fixed-height div)
- ✅ Admin: sparklines, funnel chart, top/bottom modules, drilldown panel, 7 KPI cards
