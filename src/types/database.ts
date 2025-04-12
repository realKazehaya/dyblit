export interface Profile {
  id: string;
  free_fire_id: string;
  nickname: string | null;
  nickname_changes: number;
  diamonds: number;
  created_at: string;
  updated_at: string;
}

export interface Withdrawal {
  id: string;
  profile_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Promocode {
  id: string;
  code: string;
  diamonds: number;
  max_uses: number;
  current_uses: number;
  created_at: string;
  expires_at: string | null;
}

export interface PromocodeUse {
  id: string;
  profile_id: string;
  promocode_id: string;
  created_at: string;
}