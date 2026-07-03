-- ============================================
-- RESPAWN PATROL - Add Verification Status & Images
-- ============================================

-- Add new columns to hunt_checks table
ALTER TABLE public.hunt_checks 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'SEM_PT',
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create enum type for verification statuses (optional, for documentation)
-- Status values: SEM_PT, COM_PT, ACABOU_PT, MATAMOS, FRAGUEI

-- Create point values reference (for documentation)
-- SEM_PT = +1, COM_PT = +2, ACABOU_PT = +2, MATAMOS = +8, FRAGUEI = +12

-- Update the get_ranking function to ensure it still works with new columns
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

-- Create index for status-based queries
CREATE INDEX IF NOT EXISTS idx_hunt_checks_status ON public.hunt_checks(status);

-- Enable storage bucket for images (this will be created via Supabase dashboard)
-- The bucket name will be 'verification-images'