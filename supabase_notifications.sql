-- ==============================================================================
-- OASIS: Notifications Schema & Realtime Setup
-- ==============================================================================
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'mention', 'follower', 'system')),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    content TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow users to view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to create notifications (e.g. liking someone's post, following someone)
CREATE POLICY "Authenticated users can create notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to update their own notifications (e.g. mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 5. Enable Realtime on notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
