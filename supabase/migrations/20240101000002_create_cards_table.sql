-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  last4 TEXT,
  color TEXT DEFAULT 'bg-zinc-900',
  balance NUMERIC DEFAULT 0,
  type TEXT CHECK (type IN ('debit', 'credit', 'cash', 'savings')) DEFAULT 'debit',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cards" ON cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cards" ON cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards" ON cards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cards" ON cards FOR DELETE USING (auth.uid() = user_id);

-- Add card_id to transactions
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS card_id UUID REFERENCES cards(id) ON DELETE SET NULL;

-- Migration Data (Function to be called explicitly or run once)
-- We will use a DO block to migrate existing data for existing users
DO $$
DECLARE
    user_record RECORD;
    new_card_id UUID;
BEGIN
    FOR user_record IN SELECT id, current_balance FROM profiles
    LOOP
        -- Check if user already has a card (to avoid duplicates if run multiple times without reset)
        IF NOT EXISTS (SELECT 1 FROM cards WHERE user_id = user_record.id) THEN
            -- Create Default Card
            INSERT INTO cards (user_id, name, balance, type, color)
            VALUES (user_record.id, 'Main Account', COALESCE(user_record.current_balance, 0), 'debit', 'bg-[#9AD93D]')
            RETURNING id INTO new_card_id;

            -- Link existing transactions to this card
            UPDATE transactions
            SET card_id = new_card_id
            WHERE user_id = user_record.id AND card_id IS NULL;
        END IF;
    END LOOP;
END $$;
