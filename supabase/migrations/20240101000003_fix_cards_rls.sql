-- Ensure RLS is enabled
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can view own cards" ON cards;
DROP POLICY IF EXISTS "Users can insert own cards" ON cards;
DROP POLICY IF EXISTS "Users can update own cards" ON cards;
DROP POLICY IF EXISTS "Users can delete own cards" ON cards;

-- Re-create policies
CREATE POLICY "Users can view own cards" ON cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cards" ON cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards" ON cards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cards" ON cards FOR DELETE USING (auth.uid() = user_id);

-- Explicitly grant permissions to authenticated users
GRANT ALL ON cards TO authenticated;
GRANT ALL ON cards TO service_role;

-- Force Schema Cache Reload
NOTIFY pgrst, 'reload config';
