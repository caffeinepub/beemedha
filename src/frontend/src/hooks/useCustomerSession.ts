import { useState, useEffect } from 'react';
import { useActor } from './useActor';

interface CustomerSession {
  sessionId: string;
  email: string;
  expiresAt: bigint;
}

const CUSTOMER_SESSION_KEY = 'customer_session';

export function useCustomerSession() {
  const { actor, isFetching } = useActor();
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CUSTOMER_SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const expiryTime = BigInt(parsed.expiresAt);
        const now = BigInt(Date.now()) * BigInt(1_000_000);

        if (expiryTime > now) {
          setSession({
            sessionId: parsed.sessionId,
            email: parsed.email,
            expiresAt: expiryTime,
          });
        } else {
          localStorage.removeItem(CUSTOMER_SESSION_KEY);
        }
      } catch (error) {
        console.error('Failed to load session:', error);
        localStorage.removeItem(CUSTOMER_SESSION_KEY);
      }
    }
  }, []);

  // Validate session with backend when actor is ready
  useEffect(() => {
    if (!actor || isFetching || !session) {
      return;
    }

    const validateSession = async () => {
      try {
        // Backend doesn't have session validation yet, so we assume valid if stored
        // In production: const isValid = await actor.isCustomerSessionValid(session.sessionId);
      } catch (error) {
        console.error('Session validation failed:', error);
        localStorage.removeItem(CUSTOMER_SESSION_KEY);
        setSession(null);
      }
    };

    validateSession();
  }, [actor, isFetching, session]);

  const login = async (email: string): Promise<void> => {
    if (!actor) {
      throw new Error('Actor not available');
    }

    setIsLoggingIn(true);
    try {
      // Backend doesn't have customer login yet, so we simulate it
      // In production: const sessionId = await actor.loginCustomerByEmail(email);
      
      const sessionId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000) * BigInt(1_000_000); // 7 days

      const newSession: CustomerSession = {
        sessionId,
        email,
        expiresAt,
      };

      // Store session
      localStorage.setItem(
        CUSTOMER_SESSION_KEY,
        JSON.stringify({
          sessionId,
          email,
          expiresAt: expiresAt.toString(),
        })
      );

      setSession(newSession);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(CUSTOMER_SESSION_KEY);
    setSession(null);
  };

  return {
    session,
    isAuthenticated: !!session,
    isLoggingIn,
    login,
    logout,
  };
}
