import React from 'react';

export interface User {
  id: string;
  discord_id: string;
  username: string;
  avatar_url: string | null;
  diamonds_balance: number;
  created_at: string;
  is_admin?: boolean;
}

export interface Reward {
  id: string;
  user_id: string;
  source: string;
  diamonds: number;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  free_fire_id: string;
  diamonds: number;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
}