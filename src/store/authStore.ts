import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database';

const NICKNAMES = [
  'ShadowWarrior',
  'PhoenixBlade',
  'DragonSlayer',
  'NightHawk',
  'StormRider',
  'FireFist',
  'IcePhoenix',
  'ThunderBolt',
  'StarLord',
  'DarkKnight',
];

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
      console.log('Starting login process for ID:', freeFireId);

      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('free_fire_id', freeFireId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error checking existing profile:', profileError);
        throw new Error('Failed to check existing profile');
      }

      if (existingProfile) {
        console.log('Found existing profile:', existingProfile);
        set({ 
          profile: existingProfile,
          isAdmin: existingProfile.free_fire_id === '999'
        });
        return;
      }

      console.log('Creating new user account...');
      // Create new user account
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: `${freeFireId}@dyblit.temp`,
        password: `${freeFireId}${Date.now()}`,
      });

      if (signUpError || !user) {
        console.error('Error creating user account:', signUpError);
        throw new Error('Failed to create user account');
      }

      console.log('User account created:', user);

      // Create new profile
      const randomNickname = NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];
      const newProfile: Partial<Profile> = {
        id: user.id,
        free_fire_id: freeFireId,
        nickname: randomNickname,
        nickname_changes: 0,
        diamonds: 0,
      };

      console.log('Creating new profile:', newProfile);
      const { data: profile, error: insertError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (insertError || !profile) {
        console.error('Error creating profile:', insertError);
        throw new Error('Failed to create profile');
      }

      console.log('Profile created successfully:', profile);
      set({ 
        profile,
        isAdmin: profile.free_fire_id === '999'
      });
    } catch (error) {
      console.error('Login process failed:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ profile: null, isAdmin: false });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
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