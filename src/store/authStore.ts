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

      // Validate Free Fire ID format
      if (!/^\d{4,11}$/.test(freeFireId)) {
        throw new Error('Free Fire ID must be between 4 and 11 digits');
      }

      // Generate email and password for this user
      const email = `${freeFireId}@dyblit.temp`;
      const password = `${freeFireId}${Date.now()}`;

      // Check if profile exists first
      console.log('Checking if profile exists...');
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('free_fire_id', freeFireId)
        .single();

      console.log('Profile check response:', { existingProfile, profileError });

      if (existingProfile) {
        console.log('Found existing profile, signing in...');
        const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
          email: `${existingProfile.id}@dyblit.temp`,
          password: `${existingProfile.free_fire_id}${existingProfile.created_at}`,
        });

        if (signInError) {
          console.error('Sign in error:', signInError);
          throw new Error('Failed to sign in');
        }

        console.log('Successfully signed in existing user');
        set({ 
          profile: existingProfile,
          isAdmin: existingProfile.free_fire_id === '999'
        });
        return;
      }

      // If profile doesn't exist, create new account
      console.log('No existing profile found, creating new account...');
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error('Error creating account:', signUpError);
        
        // If user already exists, try signing in
        if (signUpError.message.includes('already registered')) {
          console.log('User exists, attempting to sign in...');
          const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password: `${freeFireId}${Date.now()}`, // Use consistent password format
          });

          if (signInError) {
            console.error('Sign in error:', signInError);
            throw new Error('Failed to sign in');
          }
        } else {
          throw new Error('Failed to create account');
        }
      }

      if (!user) {
        throw new Error('No user returned after signup');
      }

      console.log('Created new account:', { userId: user.id });

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