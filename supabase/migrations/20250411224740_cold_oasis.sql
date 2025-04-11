/*
  # Add admin field to users table

  1. Changes
    - Add is_admin boolean field to users table with default false
    - Add policy to allow admins to update withdrawal status
*/

-- Add is_admin field to users table
ALTER TABLE users ADD COLUMN is_admin boolean DEFAULT false;

-- Add policy for admins to update withdrawals
CREATE POLICY "Admins can update withdrawals"
  ON withdrawals
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Add policy for admins to view all withdrawals
CREATE POLICY "Admins can view all withdrawals"
  ON withdrawals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );