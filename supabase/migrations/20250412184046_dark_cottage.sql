/*
  # Initial Schema for Dyblit

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `free_fire_id` (text, unique)
      - `nickname` (text)
      - `nickname_changes` (int, default: 0)
      - `diamonds` (int, default: 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `withdrawals`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `amount` (int)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `promocodes`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `diamonds` (int)
      - `max_uses` (int)
      - `current_uses` (int)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)
    
    - `promocode_uses`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `promocode_id` (uuid, references promocodes)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Special policies for admin user (ID: 999)
*/

-- Create tables
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  free_fire_id text UNIQUE NOT NULL,
  nickname text,
  nickname_changes int DEFAULT 0,
  diamonds int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) NOT NULL,
  amount int NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_amount CHECK (amount >= 100 AND amount % 100 = 0),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed'))
);

CREATE TABLE promocodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  diamonds int NOT NULL,
  max_uses int NOT NULL,
  current_uses int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE TABLE promocode_uses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) NOT NULL,
  promocode_id uuid REFERENCES promocodes(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, promocode_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE promocodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promocode_uses ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for withdrawals
CREATE POLICY "Users can read their own withdrawals"
  ON withdrawals FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can create their own withdrawals"
  ON withdrawals FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Admin can read and update all withdrawals
CREATE POLICY "Admin can read all withdrawals"
  ON withdrawals FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.free_fire_id = '999'
  ));

CREATE POLICY "Admin can update all withdrawals"
  ON withdrawals FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.free_fire_id = '999'
  ));

-- Policies for promocodes
CREATE POLICY "Anyone can read active promocodes"
  ON promocodes FOR SELECT
  TO authenticated
  USING (current_uses < max_uses AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admin can manage promocodes"
  ON promocodes FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.free_fire_id = '999'
  ));

-- Policies for promocode uses
CREATE POLICY "Users can read their own promocode uses"
  ON promocode_uses FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can create their own promocode uses"
  ON promocode_uses FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Functions
CREATE OR REPLACE FUNCTION check_withdrawal_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = NEW.profile_id
    AND diamonds >= NEW.amount
  ) THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  
  UPDATE profiles
  SET diamonds = diamonds - NEW.amount
  WHERE id = NEW.profile_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_promocode_use()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM promocode_uses
    WHERE profile_id = NEW.profile_id
    AND promocode_id = NEW.promocode_id
  ) THEN
    RAISE EXCEPTION 'Promocode already used';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM promocodes
    WHERE id = NEW.promocode_id
    AND current_uses < max_uses
    AND (expires_at IS NULL OR expires_at > now())
  ) THEN
    RAISE EXCEPTION 'Promocode invalid or expired';
  END IF;
  
  UPDATE promocodes
  SET current_uses = current_uses + 1
  WHERE id = NEW.promocode_id;
  
  UPDATE profiles
  SET diamonds = diamonds + (
    SELECT diamonds FROM promocodes WHERE id = NEW.promocode_id
  )
  WHERE id = NEW.profile_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER check_withdrawal_balance
  BEFORE INSERT ON withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION check_withdrawal_balance();

CREATE TRIGGER check_promocode_use
  BEFORE INSERT ON promocode_uses
  FOR EACH ROW
  EXECUTE FUNCTION check_promocode_use();