import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, removeItem, StorageKeys } from '@/services/storage';
import type { UserProfile } from '@/types/userProfile';
import { userProfileService } from '@/services/userProfileService';

interface UserAuthUser {
  id: string;
  email: string;
}

interface UserAuthContextType {
  user: UserAuthUser | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, extra?: { company?: string; phone?: string }) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    try {
      const p = await userProfileService.getProfile(userId);
      setProfile(p);
    } catch {
      // Profile may not exist yet
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const authUser = { id: session.user.id, email: session.user.email || '' };
          setUser(authUser);
          await loadProfile(session.user.id);
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            const authUser = { id: session.user.id, email: session.user.email || '' };
            setUser(authUser);
            await loadProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
          }
        });

        setIsLoading(false);
        return () => subscription.unsubscribe();
      } else {
        const stored = getItem<UserAuthUser>(StorageKeys.USER_AUTH);
        if (stored) {
          setUser(stored);
          const p = getItem<UserProfile>(StorageKeys.USER_PROFILE);
          if (p) setProfile(p);
        }
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    extra?: { company?: string; phone?: string }
  ): Promise<{ error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, company: extra?.company, phone: extra?.phone } },
      });

      if (error) return { error: error.message };

      if (data.user) {
        const authUser = { id: data.user.id, email: data.user.email || '' };
        setUser(authUser);
        await loadProfile(data.user.id);
      }

      return {};
    }

    // localStorage fallback
    const id = `local-${Date.now()}`;
    const authUser: UserAuthUser = { id, email };
    setItem(StorageKeys.USER_AUTH, authUser);
    setUser(authUser);

    const newProfile: UserProfile = {
      id,
      email,
      fullName,
      company: extra?.company || null,
      phone: extra?.phone || null,
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setItem(StorageKeys.USER_PROFILE, newProfile);
    setProfile(newProfile);

    return {};
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) return { error: error.message };

      if (data.user) {
        const authUser = { id: data.user.id, email: data.user.email || '' };
        setUser(authUser);
        await loadProfile(data.user.id);
      }

      return {};
    }

    // localStorage fallback: accept any credentials
    const stored = getItem<UserAuthUser>(StorageKeys.USER_AUTH);
    if (stored && stored.email === email) {
      setUser(stored);
      const p = getItem<UserProfile>(StorageKeys.USER_PROFILE);
      if (p) setProfile(p);
      return {};
    }

    return { error: 'Invalid credentials' };
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      removeItem(StorageKeys.USER_AUTH);
    }
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}
