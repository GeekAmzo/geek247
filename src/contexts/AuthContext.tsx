import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, removeItem, StorageKeys } from '@/services/storage';
import type { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  loggedInAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple admin credentials for localStorage fallback
const ADMIN_CREDENTIALS = {
  email: 'admin@geek247.co.za',
  password: 'admin123',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        // Get initial session from Supabase
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            loggedInAt: new Date().toISOString(),
          });
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                loggedInAt: new Date().toISOString(),
              });
            } else {
              setUser(null);
            }
          }
        );

        setIsLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } else {
        // Fallback to localStorage
        const storedAuth = getItem<AuthUser>(StorageKeys.AUTH);
        if (storedAuth) {
          setUser(storedAuth);
        }
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          loggedInAt: new Date().toISOString(),
        });
        return true;
      }

      return false;
    }

    // Fallback to simple credential check
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const authUser: AuthUser = {
        id: 'local-admin',
        email,
        loggedInAt: new Date().toISOString(),
      };
      setItem(StorageKeys.AUTH, authUser);
      setUser(authUser);
      return true;
    }

    return false;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      removeItem(StorageKeys.AUTH);
    }
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
