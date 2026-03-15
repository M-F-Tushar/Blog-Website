import type { Session, User } from '@supabase/supabase-js';
import { getSupabaseClient, supabase } from '../supabase/client';

const ADMIN_EMAIL = import.meta.env.PUBLIC_ADMIN_EMAIL;
const LOCAL_ADMIN_EMAIL = import.meta.env.PUBLIC_LOCAL_ADMIN_EMAIL || 'admin@local.dev';
const LOCAL_ADMIN_PASSWORD = import.meta.env.PUBLIC_LOCAL_ADMIN_PASSWORD || 'admin12345';
const LOCAL_AUTH_STORAGE_KEY = 'local-admin-session';
const LOCAL_AUTH_EVENT = 'local-admin-auth-change';
const ADMIN_USERS_TABLE = 'admin_users' as const;

interface AuthSignInResult {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
}

const canUseLocalAuth = (): boolean => {
  if (supabase || typeof window === 'undefined') return false;
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
};

const createLocalSession = (email: string): Session =>
  ({
    access_token: 'local-dev-access-token',
    refresh_token: 'local-dev-refresh-token',
    expires_in: 60 * 60 * 24 * 7,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    token_type: 'bearer',
    user: {
      id: 'local-admin-user',
      app_metadata: {},
      user_metadata: { role: 'admin', local: true },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email,
      role: 'authenticated',
    },
  }) as Session;

const readLocalSession = (): Session | null => {
  if (!canUseLocalAuth()) return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
};

const writeLocalSession = (session: Session | null) => {
  if (!canUseLocalAuth()) return;
  if (session) {
    window.localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(LOCAL_AUTH_STORAGE_KEY);
  }
  window.dispatchEvent(new CustomEvent(LOCAL_AUTH_EVENT, { detail: session }));
};

const isAuthorizedAdminEmail = (email?: string | null): boolean => {
  return !ADMIN_EMAIL || email === ADMIN_EMAIL;
};

const getAdminRegistryStatus = async (userId?: string | null): Promise<boolean> => {
  if (!userId || !supabase) return false;

  const client = getSupabaseClient();
  const { data, error } = await client
    .from(ADMIN_USERS_TABLE)
    .select('user_id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw new Error(
      'Admin access is not configured in Supabase. Apply the latest schema or migration so public.admin_users exists.'
    );
  }

  return Boolean(data);
};

const resolveAdminAccess = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  if (canUseLocalAuth()) return true;
  if (!isAuthorizedAdminEmail(user.email)) return false;
  return getAdminRegistryStatus(user.id);
};

export const authService = {
  // Sign in with email and password (admin-only when PUBLIC_ADMIN_EMAIL is set)
  async signIn(email: string, password: string): Promise<AuthSignInResult> {
    if (canUseLocalAuth()) {
      if (email !== LOCAL_ADMIN_EMAIL || password !== LOCAL_ADMIN_PASSWORD) {
        throw new Error('Invalid local admin credentials');
      }

      const session = createLocalSession(email);
      writeLocalSession(session);
      return {
        session,
        user: session.user,
        isAdmin: true,
      };
    }

    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY environment variables.'
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const isAdmin = await resolveAdminAccess(data.user ?? null);

    if (!isAdmin) {
      await supabase.auth.signOut();
      throw new Error('Access denied. This account is not authorized for the admin panel.');
    }

    return {
      session: data.session,
      user: data.user,
      isAdmin,
    };
  },

  // Sign out
  async signOut() {
    if (canUseLocalAuth()) {
      writeLocalSession(null);
      return;
    }

    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    if (canUseLocalAuth()) return readLocalSession();

    if (!supabase) return null;
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Get current user
  async getCurrentUser() {
    if (canUseLocalAuth()) return readLocalSession()?.user ?? null;

    if (!supabase) return null;
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async isAdmin(user: User | null) {
    return resolveAdminAccess(user);
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    if (canUseLocalAuth()) {
      const handler = (event: Event) => {
        const customEvent = event as CustomEvent<Session | null>;
        callback(customEvent.detail ? 'SIGNED_IN' : 'SIGNED_OUT', customEvent.detail ?? null);
      };

      window.addEventListener(LOCAL_AUTH_EVENT, handler);

      return {
        data: {
          subscription: {
            unsubscribe: () => window.removeEventListener(LOCAL_AUTH_EVENT, handler),
          },
        },
      };
    }

    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  },
};
