-- ============================================
-- RESPAWN PATROL - Complete Database Schema
-- ============================================

-- ============================================
-- 1. HUNTS TABLE
-- ============================================

-- Drop existing table if exists (for clean setup)
DROP TABLE IF EXISTS public.hunt_checks CASCADE;
DROP TABLE IF EXISTS public.access_codes CASCADE;
DROP TABLE IF EXISTS public.hunts CASCADE;

-- Create hunts table with all required columns
CREATE TABLE public.hunts (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 1,
    image_url TEXT,
    last_check TIMESTAMPTZ,
    updated_by TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cooldown_hours INTEGER DEFAULT 24
);

-- ============================================
-- 2. HUNT_CHECKS TABLE (Check-in history)
-- ============================================

CREATE TABLE public.hunt_checks (
    id BIGSERIAL PRIMARY KEY,
    hunt_id BIGINT NOT NULL REFERENCES public.hunts(id) ON DELETE CASCADE,
    player_name TEXT NOT NULL,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    points INTEGER NOT NULL DEFAULT 1
);

-- Index for faster ranking queries
CREATE INDEX idx_hunt_checks_player_name ON public.hunt_checks(player_name);
CREATE INDEX idx_hunt_checks_hunt_id ON public.hunt_checks(hunt_id);
CREATE INDEX idx_hunt_checks_checked_at ON public.hunt_checks(checked_at);

-- ============================================
-- 3. ACCESS_CODES TABLE
-- ============================================

CREATE TABLE public.access_codes (
    id BIGSERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    player_name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster code lookup
CREATE INDEX idx_access_codes_code ON public.access_codes(code);
CREATE INDEX idx_access_codes_is_active ON public.access_codes(is_active);

-- ============================================
-- 4. INSERT INITIAL HUNTS
-- ============================================

INSERT INTO public.hunts (name, priority, image_url, cooldown_hours) VALUES
('Livraria Gelo', 1, NULL, 6),
('Livraria Fogo', 1, NULL, 6),
('Livraria Terra', 1, NULL, 6),
('Livraria Energy', 1, NULL, 6),
('SW -DARK THAIS', 1, NULL, 24),
('SW - BRACHIO', 1, NULL, 24),
('TRUE AZURA', 1, NULL, 8),
('ISSAVI BRUXINHA', 1, NULL, 24),
('ISSAVI CACHOEIRA', 1, NULL, 24),
('ISSAVI SUL ESQUERDA', 1, NULL, 24),
('INGOL TERREO', 1, NULL, 12),
('INGOL -1-2', 1, NULL, 12),
('INGOL -3-4', 1, NULL, 12),
('MARAPUR NAGA', 1, NULL, 24),
('POI PLAGUESMITH', 1, NULL, 24),
('POI DARK TOTURER', 1, NULL, 24),
('INQUI', 1, NULL, 24),
('ELFO DE FOGO', 1, NULL, 24),
('ELFO DE GELO CASTELO', 1, NULL, 24),
('ELFO GELOFOGO DIVISA', 1, NULL, 24);

-- ============================================
-- 5. INSERT INITIAL ACCESS CODES
-- ============================================

INSERT INTO public.access_codes (code, player_name) VALUES
('BUFALO01', 'Bufalo'),
('TAMPA01', 'Tampa'),
('KNIGHT01', 'Sir Knight'),
('TESTE01', 'Teste');

-- ============================================
-- 6. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.hunts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hunt_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. CREATE RLS POLICIES
-- ============================================

-- Hunts policies
CREATE POLICY "Allow public read hunts" ON public.hunts
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public update hunts" ON public.hunts
FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Hunt checks policies
CREATE POLICY "Allow public read hunt_checks" ON public.hunt_checks
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public insert hunt_checks" ON public.hunt_checks
FOR INSERT TO anon WITH CHECK (true);

-- Access codes policies
CREATE POLICY "Allow public read access_codes" ON public.access_codes
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public update access_codes" ON public.access_codes
FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- ============================================
-- 8. CREATE HELPER FUNCTIONS
-- ============================================

-- Function to get ranking
CREATE OR REPLACE FUNCTION public.get_ranking()
RETURNS TABLE (
    player_name TEXT,
    total_points BIGINT,
    total_checks BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hc.player_name,
        SUM(hc.points) AS total_points,
        COUNT(*) AS total_checks
    FROM public.hunt_checks hc
    GROUP BY hc.player_name
    ORDER BY total_points DESC, total_checks DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a hunt is ready for verification
CREATE OR REPLACE FUNCTION public.is_hunt_ready(p_hunt_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    v_last_check TIMESTAMPTZ;
    v_cooldown INTEGER;
BEGIN
    SELECT last_check, cooldown_hours INTO v_last_check, v_cooldown
    FROM public.hunts WHERE id = p_hunt_id;
    
    IF v_last_check IS NULL THEN
        RETURN TRUE;
    END IF;
    
    RETURN NOW() >= v_last_check + (v_cooldown || ' hours')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. CREATE VIEWS FOR EASIER QUERIES
-- ============================================

-- View for hunts with status
CREATE OR REPLACE VIEW public.hunts_with_status AS
SELECT 
    h.*,
    CASE 
        WHEN h.last_check IS NULL THEN 'never_checked'
        WHEN NOW() >= h.last_check + (h.cooldown_hours || ' hours')::INTERVAL THEN 'ready'
        ELSE 'on_cooldown'
    END AS status,
    CASE 
        WHEN h.last_check IS NULL THEN NULL
        WHEN NOW() >= h.last_check + (h.cooldown_hours || ' hours')::INTERVAL THEN 0
        ELSE EXTRACT(EPOCH FROM (h.last_check + (h.cooldown_hours || ' hours')::INTERVAL - NOW())) / 3600
    END AS hours_remaining,
    CASE 
        WHEN h.last_check IS NULL THEN 999
        WHEN NOW() >= h.last_check + (h.cooldown_hours || ' hours')::INTERVAL THEN 0
        ELSE EXTRACT(EPOCH FROM (h.last_check + (h.cooldown_hours || ' hours')::INTERVAL - NOW()))
    END AS seconds_remaining
FROM public.hunts h;

-- ============================================
-- 10. GRANT PERMISSIONS
-- ============================================

GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;