# 📘 HANDOVER GUIDE — Mentora LMS
### Tài liệu bàn giao dự án — Dành cho người tiếp nhận

> **Đọc cái này trước tiên.** Tài liệu này được viết dành riêng cho bạn — người có background OD/HR mạnh nhưng chưa quen với kỹ thuật. Không cần biết lập trình để đọc hiểu và vận hành hệ thống này.

---

## MỤC LỤC

1. [Mentora LMS là gì?](#1-mentora-lms-là-gì)
2. [Những tài khoản cần được bàn giao](#2-những-tài-khoản-cần-được-bàn-giao)
3. [Sơ đồ hệ thống — Cái gì kết nối với cái gì](#3-sơ-đồ-hệ-thống)
4. [Hướng dẫn vận hành hàng ngày](#4-hướng-dẫn-vận-hành-hàng-ngày)
5. [Hướng dẫn cập nhật nội dung](#5-hướng-dẫn-cập-nhật-nội-dung)
6. [Xử lý sự cố thường gặp](#6-xử-lý-sự-cố-thường-gặp)
7. [Hướng dẫn build từ đầu — Dành cho dự án mới](#7-hướng-dẫn-build-từ-đầu)

---

## 1. Mentora LMS là gì?

**Mentora LMS** là một website đào tạo nội bộ — nơi nhân viên vào học các module về chính sách, quy trình và an toàn lao động.

### Hình dung đơn giản như này:

```
Nhân viên mở điện thoại/máy tính
        ↓
Vào website: mentora-lms-tau.vercel.app
        ↓
Chọn module → Đọc nội dung → Làm quiz → Nhận chứng chỉ
        ↓
HR (bạn) vào /admin → Xem báo cáo ai học gì, điểm bao nhiêu
```

### Website gồm 2 phần:

| Phần | Địa chỉ | Ai dùng |
|---|---|---|
| **Trang học** | `mentora-lms-tau.vercel.app` | Toàn bộ nhân viên |
| **Trang quản trị** | `mentora-lms-tau.vercel.app/admin` | Chỉ HR/Admin |

---

## 2. Những tài khoản cần được bàn giao

Dự án này chạy nhờ **3 dịch vụ bên ngoài**. Bạn cần được bàn giao quyền truy cập vào cả 3:

### 2.1 GitHub — Nơi lưu toàn bộ code
- **Trang web:** github.com
- **Vai trò:** Kho lưu trữ toàn bộ file của website (giống Google Drive nhưng cho code)
- **Link repo:** `github.com/kenbonbi-sys/mentora-lms`
- **Cần làm:** Nhận quyền "Collaborator" hoặc được transfer repo về tài khoản của bạn

> 💡 **Giải thích:** GitHub giống như "kho nguồn" — mọi thay đổi cho website đều được lưu ở đây trước, sau đó tự động cập nhật lên web.

### 2.2 Vercel — Nơi website đang chạy
- **Trang web:** vercel.com
- **Vai trò:** "Nhà" của website — Vercel đọc code từ GitHub và biến nó thành website thật
- **Cần làm:** Nhận quyền truy cập project hoặc import lại về tài khoản Vercel của bạn
- **Miễn phí:** Gói Free của Vercel đủ dùng hoàn toàn

> 💡 **Giải thích:** Vercel giống như "máy chủ" — nó giữ website luôn online 24/7. Mỗi khi bạn thay đổi gì trên GitHub, Vercel tự động cập nhật website trong vòng ~1 phút.

### 2.3 Supabase — Database (cơ sở dữ liệu)
- **Trang web:** supabase.com
- **Vai trò:** Lưu trữ dữ liệu analytics (ai xem gì, quiz điểm bao nhiêu) và tài khoản admin
- **Cần làm:** Nhận quyền truy cập project Supabase, hoặc được cấp email/password admin mới
- **Miễn phí:** Gói Free đủ dùng cho quy mô nội bộ

> 💡 **Giải thích:** Supabase giống như "tủ hồ sơ điện tử" — nó ghi lại mọi hoạt động học tập để bạn xem báo cáo.

### Checklist bàn giao tài khoản:

- [ ] GitHub: Nhận quyền truy cập repo `mentora-lms`
- [ ] Vercel: Nhận quyền truy cập project (hoặc email/password account)
- [ ] Supabase: Nhận email + password đăng nhập admin trang `/admin`
- [ ] Supabase: Nhận Project URL và Anon Key (dùng khi cần cấu hình lại)

---

## 3. Sơ đồ hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    BẠN (HR Admin)                        │
│                                                         │
│  Muốn cập nhật nội dung  →  Chỉnh sửa file trên GitHub │
│  Muốn xem báo cáo        →  Vào /admin trên website    │
└───────────────────┬─────────────────────────────────────┘
                    │ tự động deploy
                    ▼
┌───────────────────────────────┐      ┌──────────────────┐
│         VERCEL                │◄────►│    GITHUB        │
│   (Website đang chạy)         │      │  (Kho code)      │
│   mentora-lms-tau.vercel.app  │      │                  │
└───────────────────────────────┘      └──────────────────┘
                    │
                    │ ghi/đọc dữ liệu
                    ▼
┌───────────────────────────────┐
│         SUPABASE              │
│   (Database — Báo cáo)        │
│   Lưu: quiz results, views    │
└───────────────────────────────┘
```

**Quy trình khi bạn muốn cập nhật nội dung:**
1. Bạn chỉnh sửa file nội dung trên GitHub
2. GitHub tự báo cho Vercel biết
3. Vercel tự cập nhật website (~60 giây)
4. Nhân viên vào web thấy nội dung mới ngay

---

## 4. Hướng dẫn vận hành hàng ngày

### 4.1 Đăng nhập trang Admin

1. Mở trình duyệt, vào: `mentora-lms-tau.vercel.app/admin`
2. Nhập email và password admin (được bàn giao)
3. Nhấn **Đăng nhập**

**Bạn sẽ thấy 4 tab:**

| Tab | Dùng để làm gì |
|---|---|
| **Dashboard** | Xem tổng quan: bao nhiêu lượt xem, điểm quiz trung bình, tỷ lệ pass |
| **Modules** | Quản lý nội dung: thêm/sửa/xóa module đào tạo |
| **Activity** | Xem log chi tiết: ai vào lúc mấy giờ, làm quiz điểm bao nhiêu |
| **Announcements** | Đăng thông báo banner lên trang chủ |

---

### 4.2 Xem báo cáo học tập

**Bước 1:** Vào tab **Dashboard**

**Bước 2:** Chọn mốc thời gian:
- `7 ngày` — Tuần vừa rồi
- `30 ngày` — Tháng vừa rồi
- `90 ngày` — Quý vừa rồi
- `Tất cả` — Toàn bộ lịch sử

**Bước 3:** Đọc 4 chỉ số chính:

| Chỉ số | Ý nghĩa |
|---|---|
| **Lượt xem** | Bao nhiêu lần module được mở ra xem |
| **Lượt làm quiz** | Bao nhiêu lần quiz được thực hiện |
| **Điểm trung bình** | Điểm TB của tất cả các lần làm quiz |
| **Tỷ lệ đạt** | % số lần làm quiz đạt ≥75 điểm |

**Bước 4:** Xuất báo cáo → Nhấn nút **Export CSV** → File Excel tải về máy

---

### 4.3 Đăng thông báo cho nhân viên

1. Vào tab **Announcements**
2. Nhấn **Tạo thông báo mới**
3. Nhập nội dung thông báo
4. Chọn loại:
   - 🔵 **Info** — Thông tin thông thường
   - 🟡 **Warning** — Cảnh báo, lưu ý
   - 🟢 **Success** — Tin vui, hoàn thành
   - 🔴 **Danger** — Quan trọng, khẩn cấp
5. Nhấn **Lưu** → Thông báo xuất hiện ngay trên trang chủ của nhân viên

---

### 4.4 Thêm module đào tạo mới (qua Admin UI)

1. Vào tab **Modules**
2. Nhấn **Tạo module mới**
3. Điền thông tin:
   - **Tên module:** Ví dụ "Quy trình Báo cáo Sự cố"
   - **Danh mục:** Policy / Process / Safety
   - **Cấp độ:** Bắt buộc / Theo phòng ban
   - **Thời lượng:** Ví dụ "20 phút đọc"
4. Thêm các **Bước nội dung** (Steps):
   - Nhấn "Thêm bước"
   - Nhập tiêu đề bước + nội dung chi tiết + ghi chú (nếu có)
5. Thêm **Câu hỏi Quiz**:
   - Nhấn "Thêm câu hỏi"
   - Nhập câu hỏi → 4 lựa chọn → chọn đáp án đúng → nhập giải thích
6. Nhấn **Lưu** → Module xuất hiện ngay trên trang học

> ⚠️ **Lưu ý:** Module mới sẽ ở trạng thái **Draft** (chưa hiển thị với nhân viên). Bạn cần đổi sang **Published** để nhân viên thấy.

---

## 5. Hướng dẫn cập nhật nội dung

Có **2 cách** cập nhật nội dung:

| Cách | Dùng khi nào | Khó không? |
|---|---|---|
| **Qua Admin UI** | Thêm/sửa module đơn giản | ⭐ Dễ — không cần biết code |
| **Qua GitHub** | Chỉnh sửa nâng cao, thêm ảnh/icon | ⭐⭐ Trung bình — cần làm quen GitHub |

### Cách 1: Sửa nội dung qua Admin UI
Xem mục 4.4 ở trên.

### Cách 2: Sửa file nội dung trực tiếp trên GitHub

File chứa toàn bộ nội dung module: **`data/modules.json`**

**Bước 1:** Vào GitHub → Tìm repo `mentora-lms`

**Bước 2:** Click vào thư mục `data` → Click vào file `modules.json`

**Bước 3:** Nhấn biểu tượng bút chì ✏️ (Edit this file) ở góc phải

**Bước 4:** Chỉnh sửa nội dung. Cấu trúc mỗi module như sau:

```json
{
  "id": "M006",
  "name": "Tên module của bạn",
  "category": "Policy",
  "level": "Bắt buộc",
  "duration": "15 phút đọc",
  "steps": [
    {
      "title": "Bước 1: Tiêu đề bước",
      "desc": "Nội dung chi tiết của bước này...",
      "note": "Lưu ý quan trọng (có thể để trống)"
    }
  ],
  "quiz": [
    {
      "question": "Câu hỏi của bạn là gì?",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "correct": 0,
      "explanation": "Giải thích tại sao đáp án A đúng"
    }
  ]
}
```

> 💡 `"correct": 0` nghĩa là đáp án đúng là lựa chọn đầu tiên (A). `"correct": 1` là B, v.v.

**Bước 5:** Kéo xuống cuối trang → Nhấn **Commit changes**

**Bước 6:** Nhập mô tả ngắn (ví dụ: "Cập nhật nội dung module M001") → Nhấn **Commit changes**

**Bước 7:** Chờ ~60 giây → Website tự cập nhật ✅

---

## 6. Xử lý sự cố thường gặp

### ❓ "Website không vào được"
**Kiểm tra:** Vào `vercel.com` → Đăng nhập → Xem project có đang **Running** không
- Nếu có lỗi đỏ → Chụp màn hình lỗi → Liên hệ developer hỗ trợ
- Nếu bình thường → Thử xóa cache trình duyệt (Ctrl+Shift+Delete)

### ❓ "Tôi cập nhật nội dung rồi nhưng web chưa thấy thay đổi"
**Chờ 2-3 phút** → Vercel cần thời gian deploy
Nếu sau 5 phút vẫn chưa thấy:
1. Vào `vercel.com` → Xem tab **Deployments**
2. Deployment gần nhất có màu xanh lá ✅ là thành công
3. Nếu màu đỏ ❌ → Có lỗi trong file bạn chỉnh → Kiểm tra lại file JSON

### ❓ "Không đăng nhập được vào /admin"
1. Kiểm tra lại email/password (phân biệt chữ hoa/thường)
2. Thử "Quên mật khẩu" nếu có
3. Vào Supabase → Authentication → Users → Reset password cho tài khoản admin

### ❓ "Muốn thêm ảnh thumbnail cho module"
1. Chuẩn bị ảnh, đổi tên đơn giản (ví dụ: `module-06.png`)
2. Vào GitHub repo → Thư mục `images` (hoặc tạo mới nếu chưa có)
3. Nhấn **Add file** → **Upload files** → Kéo thả ảnh vào
4. Commit changes
5. Copy đường dẫn ảnh: `/images/module-06.png`
6. Dán vào trường `thumbnail` trong file `modules.json`

### ❓ "Báo cáo trống, không có dữ liệu"
- Dữ liệu chỉ ghi lại từ lúc Supabase được kết nối
- Dữ liệu học tập của nhân viên lưu trên **trình duyệt của họ** (localStorage) — Admin không thấy được dữ liệu cá nhân từng người, chỉ thấy aggregate (tổng hợp)
- Đây là giới hạn của V1 — V2 sẽ có user accounts để track cá nhân

---

## 7. Hướng dẫn build từ đầu

> **Dành cho:** Bạn muốn tự tay xây dựng một website LMS tương tự từ con số 0 cho dự án khác.
> **Thời gian ước tính:** 2-3 ngày nếu làm full-time, 1-2 tuần nếu làm part-time.
> **Không cần:** Biết lập trình từ trước.

---

### GIAI ĐOẠN 1 — Chuẩn bị công cụ (Ngày 1 — Buổi sáng)

#### Bước 1.1: Cài đặt Visual Studio Code (VS Code)
VS Code là "phần mềm soạn thảo code" — giống Microsoft Word nhưng dành cho code.

1. Vào: `code.visualstudio.com`
2. Nhấn **Download for Windows** (hoặc Mac)
3. Cài đặt bình thường như các phần mềm khác
4. Mở VS Code lên

#### Bước 1.2: Tạo tài khoản GitHub
1. Vào: `github.com`
2. Nhấn **Sign up**
3. Nhập email, tạo username và password
4. Xác nhận email

#### Bước 1.3: Tạo tài khoản Vercel
1. Vào: `vercel.com`
2. Nhấn **Sign Up**
3. Chọn **Continue with GitHub** (dùng tài khoản GitHub vừa tạo)
4. Xác nhận kết nối

#### Bước 1.4: Tạo tài khoản Supabase
1. Vào: `supabase.com`
2. Nhấn **Start your project**
3. Chọn **Sign in with GitHub**
4. Tạo **Organization** mới (đặt tên tổ chức của bạn)

#### Bước 1.5: Cài Git
Git là công cụ giúp "lưu lịch sử" và "đồng bộ" code lên GitHub.

1. Vào: `git-scm.com/downloads`
2. Tải phiên bản cho Windows/Mac
3. Cài đặt, giữ nguyên tất cả các tùy chọn mặc định
4. Mở **Terminal** (hoặc Command Prompt trên Windows):
   - Windows: Nhấn `Windows + R` → gõ `cmd` → Enter
   - Mac: Mở **Terminal** từ Applications
5. Gõ lệnh này để kiểm tra: `git --version`
6. Nếu hiện ra số phiên bản (ví dụ `git version 2.43.0`) → Thành công ✅

---

### GIAI ĐOẠN 2 — Lấy code về máy (Ngày 1 — Buổi chiều)

#### Bước 2.1: Fork (sao chép) repo Mentora về tài khoản của bạn

1. Vào: `github.com/kenbonbi-sys/mentora-lms`
2. Nhấn nút **Fork** ở góc trên bên phải
3. Chọn tài khoản GitHub của bạn
4. Nhấn **Create fork**
5. Bây giờ bạn có một bản copy riêng tại: `github.com/[username-của-bạn]/mentora-lms`

#### Bước 2.2: Tải code về máy tính

1. Trên trang GitHub repo của bạn, nhấn nút **Code** (màu xanh)
2. Copy đường dẫn HTTPS (dạng: `https://github.com/username/mentora-lms.git`)
3. Mở Terminal/Command Prompt
4. Gõ lệnh (thay bằng đường dẫn của bạn):
```
git clone https://github.com/[username-của-bạn]/mentora-lms.git
```
5. Enter → Code được tải về thư mục `mentora-lms` trên máy bạn

#### Bước 2.3: Mở project trong VS Code

1. Mở VS Code
2. **File** → **Open Folder**
3. Tìm thư mục `mentora-lms` vừa tải về
4. Nhấn **Select Folder**
5. Bạn sẽ thấy cây thư mục bên trái với các file như `index.html`, `styles.css`, v.v.

---

### GIAI ĐOẠN 3 — Cấu hình Database (Ngày 2 — Buổi sáng)

#### Bước 3.1: Tạo project Supabase mới

1. Vào `supabase.com` → Đăng nhập
2. Nhấn **New Project**
3. Đặt tên project (ví dụ: `my-lms`)
4. Tạo Database Password (lưu lại cẩn thận!)
5. Chọn Region gần nhất: **Southeast Asia (Singapore)**
6. Nhấn **Create new project** → Chờ ~2 phút

#### Bước 3.2: Tạo các bảng dữ liệu

Sau khi project tạo xong:

1. Nhấn vào **SQL Editor** (biểu tượng </> ở menu trái)
2. Nhấn **New query**
3. Copy và dán đoạn SQL sau vào ô trống:

```sql
-- Bảng lưu lượt xem module
CREATE TABLE page_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id text,
  module_name text,
  session_id text,
  source text DEFAULT 'direct',
  created_at timestamptz DEFAULT now()
);

-- Bảng lưu kết quả quiz
CREATE TABLE quiz_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id text,
  module_name text,
  score integer,
  total integer,
  pct integer,
  passed boolean,
  session_id text,
  created_at timestamptz DEFAULT now()
);

-- Bảng lưu chi tiết từng câu trả lời
CREATE TABLE quiz_answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id text,
  question_index integer,
  selected_option integer,
  correct_answer integer,
  session_id text,
  created_at timestamptz DEFAULT now()
);

-- Bảng thông báo
CREATE TABLE announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message text NOT NULL,
  type text DEFAULT 'info',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Cho phép đọc công khai (không cần đăng nhập)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON page_views FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON quiz_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON quiz_answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON announcements FOR ALL USING (true) WITH CHECK (true);
```

4. Nhấn **Run** (hoặc Ctrl+Enter)
5. Thấy "Success. No rows returned" → Thành công ✅

#### Bước 3.3: Lấy thông tin kết nối Supabase

1. Vào **Project Settings** (biểu tượng bánh răng ở menu trái dưới cùng)
2. Chọn **API**
3. Copy 2 thông tin sau (lưu vào Notepad):
   - **Project URL** — dạng: `https://abcdefgh.supabase.co`
   - **anon public key** — chuỗi dài khoảng 200 ký tự

#### Bước 3.4: Tạo tài khoản Admin

1. Vào **Authentication** → **Users**
2. Nhấn **Invite user** (hoặc **Add user**)
3. Nhập email admin của bạn
4. Set password
5. Ghi nhớ email + password này — đây là thông tin đăng nhập vào `/admin`

#### Bước 3.5: Cập nhật thông tin kết nối vào code

1. Trong VS Code, tìm file `admin/admin.js`
2. Dùng Ctrl+F để tìm từ `supabaseUrl` hoặc `supabase.co`
3. Thay thế URL và key cũ bằng thông tin Supabase project của bạn:

```javascript
const SUPABASE_URL = 'https://[project-của-bạn].supabase.co';
const SUPABASE_ANON_KEY = '[anon-key-của-bạn]';
```

4. Làm tương tự trong `script.js` nếu có

---

### GIAI ĐOẠN 4 — Tùy chỉnh nội dung (Ngày 2 — Buổi chiều)

#### Bước 4.1: Đổi tên thương hiệu

Trong VS Code, mở file `index.html`:
- Tìm "Mentora" → Thay bằng tên LMS của bạn
- Tìm "MoMo" → Thay bằng tên công ty của bạn
- Thay file logo: Đặt file logo vào thư mục `images/`, đổi tên thành `momo-logo.png` (hoặc cập nhật đường dẫn trong HTML)

#### Bước 4.2: Cập nhật nội dung module

Mở file `data/modules.json`:
- Xóa hoặc chỉnh sửa 5 module mẫu hiện có
- Thêm các module thực tế của tổ chức bạn theo cấu trúc đã hướng dẫn ở Mục 5

#### Bước 4.3: Điều chỉnh màu sắc thương hiệu (tùy chọn)

Mở file `styles.css`, tìm dòng:
```css
--accent: #a50064;
```
Thay `#a50064` bằng màu brand của công ty bạn (mã hex màu).

---

### GIAI ĐOẠN 5 — Đưa website lên mạng (Ngày 3)

#### Bước 5.1: Lưu các thay đổi lên GitHub

Mở Terminal, di chuyển vào thư mục project:
```
cd mentora-lms
```

Sau đó chạy 3 lệnh này theo thứ tự:
```
git add .
git commit -m "Cập nhật nội dung và thông tin công ty"
git push
```

Nhập username và password GitHub khi được hỏi.

> ✅ Code đã lên GitHub!

#### Bước 5.2: Kết nối GitHub với Vercel

1. Vào `vercel.com` → Đăng nhập
2. Nhấn **Add New Project**
3. Nhấn **Import** bên cạnh repo `mentora-lms`
4. Giữ nguyên tất cả cài đặt mặc định
5. Nhấn **Deploy**
6. Chờ ~2 phút → Website của bạn live tại địa chỉ Vercel cấp!

#### Bước 5.3: Đặt tên miền tùy chỉnh (tùy chọn)

Nếu bạn muốn địa chỉ đẹp hơn (ví dụ: `training.companycủabạn.com`):
1. Trong Vercel → Project settings → **Domains**
2. Nhấn **Add Domain**
3. Nhập tên miền → Làm theo hướng dẫn cấu hình DNS

---

### GIAI ĐOẠN 6 — Kiểm tra và ra mắt

#### Checklist trước khi thông báo cho nhân viên:

- [ ] Vào website → Thấy tên công ty và logo đúng
- [ ] Click vào 1 module → Đọc được nội dung
- [ ] Làm thử quiz → Thấy phản hồi đúng/sai
- [ ] Nhấn "Đánh dấu hoàn thành" → Stats cập nhật
- [ ] Vào `/admin` → Đăng nhập được bằng email admin
- [ ] Admin Dashboard → Thấy dữ liệu (có thể trống nếu chưa ai dùng)
- [ ] Thử Export CSV → File tải về được
- [ ] Kiểm tra trên điện thoại → Giao diện hiển thị đẹp

---

## Liên hệ hỗ trợ kỹ thuật

Khi gặp vấn đề không tự giải quyết được, hãy cung cấp cho người hỗ trợ:

1. **Mô tả vấn đề** — Bạn đang làm gì thì gặp lỗi?
2. **Chụp màn hình** — Màn hình hiển thị gì?
3. **Lỗi console** — Mở trình duyệt → Nhấn F12 → Tab Console → Chụp màn hình nếu có chữ đỏ
4. **Thời điểm xảy ra** — Lỗi sau khi bạn làm gì?

---

*Tài liệu này được tạo tự động từ project Mentora LMS.*
*Cập nhật lần cuối: 30/04/2026*
