-- ════════════════════════════════════════════════════════
--  Mentora LMS — Supabase Database Setup
--  Chạy file này trong Supabase SQL Editor:
--  https://supabase.com/dashboard/project/[your-ref]/sql
-- ════════════════════════════════════════════════════════

-- 1. Enable UUID extension (thường đã có sẵn)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── page_views ───────────────────────────────────────────
--    Ghi lại mỗi lần user mở một module
CREATE TABLE IF NOT EXISTS public.page_views (
  id          uuid        DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id   text        NOT NULL,
  module_name text        NOT NULL,
  session_id  text,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Ai cũng có thể INSERT (tracking ẩn danh)
CREATE POLICY "pv_public_insert" ON public.page_views
  FOR INSERT WITH CHECK (true);

-- Chỉ admin (authenticated) mới có thể SELECT để xem analytics
CREATE POLICY "pv_auth_select" ON public.page_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── quiz_attempts ─────────────────────────────────────────
--    Ghi lại mỗi lần user hoàn thành quiz
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id          uuid        DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id   text        NOT NULL,
  module_name text        NOT NULL,
  score       int         NOT NULL,
  total       int         NOT NULL,
  pct         int         NOT NULL,
  passed      bool        NOT NULL,
  session_id  text,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qa_public_insert" ON public.quiz_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "qa_auth_select" ON public.quiz_attempts
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── modules_cms ───────────────────────────────────────────
--    Admin quản lý modules qua dashboard; main site đọc từ đây
CREATE TABLE IF NOT EXISTS public.modules_cms (
  id         text        PRIMARY KEY,        -- M006, M007...
  data       jsonb       NOT NULL,           -- toàn bộ module JSON
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.modules_cms ENABLE ROW LEVEL SECURITY;

-- Public SELECT — main site dùng anon key đọc modules mới
CREATE POLICY "mc_public_select" ON public.modules_cms
  FOR SELECT USING (true);

-- Chỉ admin mới được INSERT/UPDATE/DELETE
CREATE POLICY "mc_auth_write" ON public.modules_cms
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Trigger tự cập nhật updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_modules_cms_updated
  BEFORE UPDATE ON public.modules_cms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════
--  SAU KHI CHẠY SQL NÀY:
--  1. Vào Authentication > Users > "Invite user" hoặc "Add user"
--     để tạo tài khoản admin (email + password)
--  2. Copy Project URL và anon key từ Settings > API
--  3. Điền vào SUPABASE_URL và SUPABASE_ANON trong:
--     - script.js  (dòng ~170)
--     - admin/admin.js (dòng ~1)
-- ════════════════════════════════════════════════════════
