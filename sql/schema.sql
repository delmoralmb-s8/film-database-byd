-- ============================================================
-- FILM DATABASE — Supabase Schema + RLS Policies
-- Run this in the Supabase SQL Editor
-- ============================================================

-- CAMERAS
CREATE TABLE IF NOT EXISTS cameras (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brand      TEXT NOT NULL,
  model      TEXT NOT NULL,
  format     TEXT NOT NULL CHECK (format IN ('35mm', '120')),
  type       TEXT NOT NULL CHECK (type IN ('p&s', 'SLR', 'TLR', 'Rangefinder')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cameras_rls" ON cameras FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- LENSES
CREATE TABLE IF NOT EXISTS lenses (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brand        TEXT NOT NULL,
  focal_length TEXT NOT NULL,
  max_aperture TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lenses_rls" ON lenses FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- FILMS
CREATE TABLE IF NOT EXISTS films (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  film_status    TEXT NOT NULL DEFAULT 'fresh'
                   CHECK (film_status IN ('fresh', 'cadufresh', 'rancio')),
  brand          TEXT NOT NULL,
  name           TEXT NOT NULL,
  type           TEXT NOT NULL CHECK (type IN ('color', 'bw', 'slide')),
  iso            INTEGER NOT NULL,
  format         TEXT NOT NULL CHECK (format IN ('35mm', '120')),
  camera_id      UUID REFERENCES cameras(id) ON DELETE SET NULL,
  lens_id        UUID REFERENCES lenses(id) ON DELETE SET NULL,
  current_status TEXT NOT NULL DEFAULT 'en_camara'
                   CHECK (current_status IN ('en_camara', 'en_revelado', 'finalizado', 'escaneado')),
  start_date     DATE,
  end_date       DATE,
  notes          TEXT,
  push_pull      TEXT NOT NULL DEFAULT 'no'
                   CHECK (push_pull IN ('no', '+1', '+2', '+3', '-1', '-2')),
  num_photos     TEXT CHECK (num_photos IN ('12', '24', '36')),
  lab            TEXT,
  city           TEXT,
  country        TEXT,
  photo_type     TEXT CHECK (photo_type IN (
                   'familia','amigos',
                   'paisaje','retrato','macro','boda',
                   'eventos','mascotas','estudio','producto',
                   'chile_mole','ex','otro')),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE films ENABLE ROW LEVEL SECURITY;
CREATE POLICY "films_rls" ON films FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- LOGS (accesos privados — solo visible desde el dashboard de Supabase)
CREATE TABLE IF NOT EXISTS logs (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  alias      TEXT,
  user_agent TEXT,
  location   TEXT,
  note       TEXT
);

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede insertar su propio log
CREATE POLICY "logs_insert" ON logs FOR INSERT
  TO authenticated WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER films_updated_at
  BEFORE UPDATE ON films
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
