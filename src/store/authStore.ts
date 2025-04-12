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
      console.log('Checking for existing profile...');
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('free_fire_id', freeFireId)
        .single();

      console.log('Profile check response:', { existingProfile, profileError });

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.log('No existing profile found, will create new one');
        } else {
          console.error('Error checking existing profile:', profileError);
          throw new Error(`Database error: ${profileError.message}`);
        }
      }

      if (existingProfile) {
        console.log('Found existing profile:', existingProfile);
        
        // Try to sign in with existing credentials
        console.log('Signing in with existing account...');
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: `${freeFireId}@dyblit.temp`,
          password: `${freeFireId}${existingProfile.created_at}`,
        });

        if (signInError) {
          console.error('Error signing in:', signInError);
          throw new Error(`Authentication error: ${signInError.message}`);
        }

        set({ 
          profile: existingProfile,
          isAdmin: existingProfile.free_fire_id === '999'
        });
        console.log('Successfully logged in existing user');
        return;
      }

      // Create new user account
      console.log('Creating new user account...');
      const password = `${freeFireId}${Date.now()}`;
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: `${freeFireId}@dyblit.temp`,
        password,
      });

      if (signUpError || !user) {
        console.error('Error creating user account:', signUpError);
        throw new Error(`Failed to create account: ${signUpError?.message || 'Unknown error'}`);
      }

      console.log('User account created:', { id: user.id, email: user.email });

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
        throw new Error(`Failed to create profile: ${insertError?.message || 'Unknown error'}`);
      }

      console.log('Profile created successfully:', profile);
      set({ 
        profile,
        isAdmin: profile.free_fire_id === '999'
      });
      
      console.log('Login process completed successfully');
    } catch (error) {
      console.error('Login process failed:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      console.log('Starting logout process...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      console.log('Logout successful');
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