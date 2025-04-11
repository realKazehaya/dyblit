/*
  # Initial schema for Free Fire Rewards platform

  1. New Tables
    - users
      - id (uuid, primary key)
      - discord_id (text, unique)
      - username (text)
      - avatar_url (text)
      - diamonds_balance (integer)
      - created_at (timestamp)
    
    - rewards
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - source (text)
      - diamonds (integer)
      - created_at (timestamp)
    
    - withdrawals
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - free_fire_id (text)
      - diamonds (integer)
      - status (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text UNIQUE NOT NULL,
  username text NOT NULL,
  avatar_url text,
  diamonds_balance integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Rewards table
CREATE TABLE rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  source text NOT NULL,
  diamonds integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rewards"
  ON rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Withdrawals table
CREATE TABLE withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  free_fire_id text NOT NULL,
  diamonds integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own withdrawals"
  ON withdrawals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawals"
  ON withdrawals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);