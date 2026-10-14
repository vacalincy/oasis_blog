-- ==============================================================================
-- OASIS: Complete Database Setup & Permissions (RLS Policies)
-- ==============================================================================
-- Run this in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. PROFILES TABLE: Ensure columns and public read access
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS country TEXT;

ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


-- 2. POSTS TABLE: Ensure all users (and visitors) can see published posts
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;

-- Clean up existing select policies to prevent conflicts
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can view own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can only select own posts" ON public.posts;
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can delete own posts" ON public.posts;

-- ANYONE (authenticated and anonymous) can see published posts
CREATE POLICY "Anyone can view published posts"
ON public.posts FOR SELECT
USING (status = 'published');

-- Authors can also see their own drafts
CREATE POLICY "Authors can view own posts"
ON public.posts FOR SELECT
TO authenticated
USING (auth.uid() = author_id);

-- Authors can insert new posts
CREATE POLICY "Users can create posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts"
ON public.posts FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Authors can delete their own posts
CREATE POLICY "Authors can delete own posts"
ON public.posts FOR DELETE
TO authenticated
USING (auth.uid() = author_id);


-- 3. NOTIFICATIONS TABLE
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

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);


-- 4. LIKES & COMMENTS
ALTER TABLE IF EXISTS public.likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view likes" ON public.likes;
DROP POLICY IF EXISTS "Users can toggle likes" ON public.likes;
DROP POLICY IF EXISTS "Users can insert likes" ON public.likes;
DROP POLICY IF EXISTS "Users can delete likes" ON public.likes;

CREATE POLICY "Anyone can view likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can insert likes" ON public.likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete likes" ON public.likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE IF EXISTS public.comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
DROP POLICY IF EXISTS "Users can insert comments" ON public.comments;

CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert comments" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);


-- 5. FOLLOWS
ALTER TABLE IF EXISTS public.follows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view follows" ON public.follows;
DROP POLICY IF EXISTS "Users can manage follows" ON public.follows;
DROP POLICY IF EXISTS "Users can insert follows" ON public.follows;
DROP POLICY IF EXISTS "Users can delete follows" ON public.follows;

CREATE POLICY "Anyone can view follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can insert follows" ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete follows" ON public.follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);


-- ==============================================================================
-- 6. RPC: SECURE ACCOUNT DELETION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete user's public posts and comments
  DELETE FROM public.posts WHERE author_id = v_user_id;
  DELETE FROM public.comments WHERE user_id = v_user_id;
  DELETE FROM public.likes WHERE user_id = v_user_id;
  DELETE FROM public.notifications WHERE user_id = v_user_id;
  DELETE FROM public.follows WHERE follower_id = v_user_id OR following_id = v_user_id;
  
  -- Delete user profile
  DELETE FROM public.profiles WHERE id = v_user_id;
  
  -- Delete from auth.users (cascades all auth identities and sessions)
  DELETE FROM auth.users WHERE id = v_user_id;
END;
$$;


-- ==============================================================================
-- 7. CONTACT MESSAGES TABLE
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

-- ==============================================================================
-- 10. QR CODE LOGINS (Instant Mobile Scan Login)
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

