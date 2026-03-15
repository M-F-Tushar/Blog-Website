import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const syncAuthState = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
    setIsAuthenticated(Boolean(nextSession));

    if (!nextSession?.user) {
      setIsAdmin(false);
      return;
    }

    try {
      setIsAdmin(await authService.isAdmin(nextSession.user));
    } catch {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    authService
      .getSession()
      .then((nextSession) => syncAuthState(nextSession))
      .catch(() => {
        setIsAdmin(false);
      })
      .finally(() => {
        setLoading(false);
      });

    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (_event, nextSession) => {
      await syncAuthState(nextSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [syncAuthState]);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.signIn(email, password);
      setSession(result.session);
      setUser(result.user);
      setIsAuthenticated(Boolean(result.session));
      setIsAdmin(result.isAdmin);
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign out failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isAuthenticated,
      isAdmin,
      signIn,
      signOut,
    }),
    [user, session, loading, isAuthenticated, isAdmin, signIn, signOut]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
