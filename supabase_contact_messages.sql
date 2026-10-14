-- ==============================================================================
-- OASIS: Contact Messages Table & Policies
-- ==============================================================================
-- Run this in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Users can view their own contact messages" ON public.contact_messages;

-- Anyone (both visitors and authenticated users) can submit a contact message
CREATE POLICY "Anyone can insert contact messages"
ON public.contact_messages FOR INSERT
TO public
WITH CHECK (true);

-- Authenticated users can see their own messages if logged in
CREATE POLICY "Users can view their own contact messages"
ON public.contact_messages FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
