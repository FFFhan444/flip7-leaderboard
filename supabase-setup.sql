-- Flip 7 Leaderboard Database Setup
-- Run this in your Supabase SQL Editor

-- Create the players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  wins INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for a simple public app)
-- For a more secure app, you'd want to add authentication
CREATE POLICY "Allow all operations" ON players
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable realtime for the players table
ALTER PUBLICATION supabase_realtime ADD TABLE players;
