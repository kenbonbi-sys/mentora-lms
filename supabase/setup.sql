-- Mentora LMS - Supabase Database Setup
-- Run this file in Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shared trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- page_views: anonymous traffic analytics
CREATE TABLE IF NOT EXISTS public.page_views (
  id          uuid        DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id   text        NOT NULL,
  module_name text        NOT NULL,
  session_id  text,
  source      text        DEFAULT 'direct',
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS source text DEFAULT 'direct';
UPDATE public.page_views SET source = 'direct' WHERE source IS NULL;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pv_public_insert" ON public.page_views;
CREATE POLICY "pv_public_insert" ON public.page_views
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "pv_auth_select" ON public.page_views;
CREATE POLICY "pv_auth_select" ON public.page_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- quiz_attempts: per-attempt quiz results
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

DROP POLICY IF EXISTS "qa_public_insert" ON public.quiz_attempts;
CREATE POLICY "qa_public_insert" ON public.quiz_attempts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "qa_auth_select" ON public.quiz_attempts;
CREATE POLICY "qa_auth_select" ON public.quiz_attempts
  FOR SELECT USING (auth.role() = 'authenticated');

-- quiz_answers: per-question analytics
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id             uuid        DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id      text        NOT NULL,
  question_index int         NOT NULL,
  question_text  text,
  is_correct     bool        NOT NULL,
  session_id     text,
  created_at     timestamptz DEFAULT now()
);
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qans_public_insert" ON public.quiz_answers;
CREATE POLICY "qans_public_insert" ON public.quiz_answers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "qans_auth_select" ON public.quiz_answers;
CREATE POLICY "qans_auth_select" ON public.quiz_answers
  FOR SELECT USING (auth.role() = 'authenticated');

-- modules_cms: admin-managed module content
CREATE TABLE IF NOT EXISTS public.modules_cms (
  id         text        PRIMARY KEY,
  data       jsonb       NOT NULL,
  status     text        DEFAULT 'published',
  sort_order int         DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.modules_cms ADD COLUMN IF NOT EXISTS status text DEFAULT 'published';
ALTER TABLE public.modules_cms ADD COLUMN IF NOT EXISTS sort_order int DEFAULT 0;
UPDATE public.modules_cms SET status = 'published' WHERE status IS NULL;
UPDATE public.modules_cms SET sort_order = 0 WHERE sort_order IS NULL;
ALTER TABLE public.modules_cms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mc_public_select" ON public.modules_cms;
CREATE POLICY "mc_public_select" ON public.modules_cms
  FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "mc_auth_insert" ON public.modules_cms;
CREATE POLICY "mc_auth_insert" ON public.modules_cms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "mc_auth_update" ON public.modules_cms;
CREATE POLICY "mc_auth_update" ON public.modules_cms
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "mc_auth_delete" ON public.modules_cms;
CREATE POLICY "mc_auth_delete" ON public.modules_cms
  FOR DELETE USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS trg_modules_cms_updated ON public.modules_cms;
CREATE TRIGGER trg_modules_cms_updated
  BEFORE UPDATE ON public.modules_cms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- announcements: learner-facing banner messages
CREATE TABLE IF NOT EXISTS public.announcements (
  id         uuid        DEFAULT uuid_generate_v4() PRIMARY KEY,
  message    text        NOT NULL,
  type       text        DEFAULT 'info',
  active     bool        DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ann_public_select_active" ON public.announcements;
CREATE POLICY "ann_public_select_active" ON public.announcements
  FOR SELECT USING (active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "ann_auth_insert" ON public.announcements;
CREATE POLICY "ann_auth_insert" ON public.announcements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "ann_auth_update" ON public.announcements;
CREATE POLICY "ann_auth_update" ON public.announcements
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "ann_auth_delete" ON public.announcements;
CREATE POLICY "ann_auth_delete" ON public.announcements
  FOR DELETE USING (auth.role() = 'authenticated');

-- site_settings: admin-controlled key-value flags for learner portal
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        text        PRIMARY KEY,
  value      text        NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for public learner portal)
DROP POLICY IF EXISTS "ss_public_select" ON public.site_settings;
CREATE POLICY "ss_public_select" ON public.site_settings
  FOR SELECT USING (true);

-- Only authenticated admins can insert/update/delete
DROP POLICY IF EXISTS "ss_auth_insert" ON public.site_settings;
CREATE POLICY "ss_auth_insert" ON public.site_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "ss_auth_update" ON public.site_settings;
CREATE POLICY "ss_auth_update" ON public.site_settings
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "ss_auth_delete" ON public.site_settings;
CREATE POLICY "ss_auth_delete" ON public.site_settings
  FOR DELETE USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS trg_site_settings_updated ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Default settings
INSERT INTO public.site_settings (key, value)
VALUES ('modules_section_visible', 'false')
ON CONFLICT (key) DO NOTHING;

-- After running this SQL:
-- 1. Create an admin user in Authentication > Users.
-- 2. Copy Project URL and anon key from Settings > API.
-- 3. Update SB_URL/SB_ANON in script.js and admin/admin.js.
-- 4. Run the site_settings block above to create the settings table.
--    Then use the Admin > Cài đặt trang tab to toggle the old modules section.
