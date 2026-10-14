-- ==============================================================================
-- OASIS: QR Code Logins Table & Realtime Setup
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.qr_logins (
    session_id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'expired')),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now() + interval '5 minutes')
);

ALTER TABLE public.qr_logins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public full access to qr_logins" ON public.qr_logins;
CREATE POLICY "Public full access to qr_logins"
ON public.qr_logins FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Enable Supabase Realtime broadcast for qr_logins if publication exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.qr_logins;
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_qr_logins_status ON public.qr_logins(status);
CREATE INDEX IF NOT EXISTS idx_qr_logins_expires_at ON public.qr_logins(expires_at);
