-- ============================================================
-- FILM DATABASE — Align existing Supabase DB with current app
-- Run this once in the Supabase SQL Editor if the DB was created
-- before Super8 / expanded exposure-count support.
-- ============================================================

-- Cameras now support Super8.
ALTER TABLE cameras
  DROP CONSTRAINT IF EXISTS cameras_format_check;

ALTER TABLE cameras
  ADD CONSTRAINT cameras_format_check
  CHECK (format IN ('35mm', '120', 'Super8'));

-- Films now support Super8.
ALTER TABLE films
  DROP CONSTRAINT IF EXISTS films_format_check;

ALTER TABLE films
  ADD CONSTRAINT films_format_check
  CHECK (format IN ('35mm', '120', 'Super8'));

-- num_photos stores exposures for photo formats and fps for Super8.
-- 35mm: 14/24/36, 120: 4/6/12, Super8: 9/18/24.
ALTER TABLE films
  DROP CONSTRAINT IF EXISTS films_num_photos_check;

ALTER TABLE films
  ADD CONSTRAINT films_num_photos_check
  CHECK (num_photos IN ('4', '6', '9', '12', '14', '18', '24', '36'));
