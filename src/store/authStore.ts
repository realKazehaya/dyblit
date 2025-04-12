import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database';

interface AuthState {
  profile: Profile | null;
  isAdmin: boolean;
  setProfile: (profile: Profile | null) => void;
  login: (freeFireId: string) => Promise<void>;
  logout: () => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  profile: null,
  isAdmin: false,

  setProfile: (profile) => {
    set({ 
      profile,
      isAdmin: profile?.free_fire_id === '999'
    });
  },

  login: async (freeFireId: string) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select()
        .eq('free_fire_id', freeFireId)
        .single();

      if (existingProfile) {
        set({ 
          profile: existingProfile,
          isAdmin: existingProfile.free_fire_id === '999'
        });
        return;
      }

      // Create new profile
      const { data: { user } } = await supabase.auth.signUp({
        email: `${freeFireId}@dyblit.temp`,
        password: `${freeFireId}${Date.now()}`,
      });

      if (!user) throw new Error('Failed to create user');

      const newProfile: Partial<Profile> = {
        id: user.id,
        free_fire_id: freeFireId,
        nickname: null,
        nickname_changes: 0,
        diamonds: 0,
      };

      const { data: profile, error } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (error) throw error;

      set({ 
        profile,
        isAdmin: profile.free_fire_id === '999'
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ profile: null, isAdmin: false });
  },

  updateNickname: async (nickname: string) => {
    const profile = get().profile;
    if (!profile || profile.nickname_changes >= 2) {
      throw new Error('Cannot update nickname');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        nickname,
        nickname_changes: profile.nickname_changes + 1,
      })
      .eq('id', profile.id)
      .select()
      .single();

    if (error) throw error;
    set({ profile: data });
  },
}));