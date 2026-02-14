import { useState, useEffect } from 'react';
import { useActor } from './useActor';

interface CustomerSessionData {
  sessionId: string;
  email: string;
  expiresAt: number;
}

const STORAGE_KEY = 'customer_session';

export function useCustomerSession() {
  const { actor } = useActor();
  const [session, setSession] = useState<CustomerSessionData | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Load and validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored || !actor) {
        setIsValidating(false);
        return;
      }

      try {
        const data: CustomerSessionData = JSON.parse(stored);
        
        // Check expiry
        if (Date.now() > data.expiresAt) {
          localStorage.removeItem(STORAGE_KEY);
          setSession(null);
          setIsValidating(false);
          return;
        }

        // Validate with backend
        const isValid = await actor.isCustomerSessionValid(data.sessionId);
        if (isValid) {
          setSession(data);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          setSession(null);
        }
      } catch (error) {
        console.error('Session validation error:', error);
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [actor]);

  const login = async (email: string) => {
    if (!actor) throw new Error('Actor not available');
    
    setIsLoggingIn(true);
    try {
      const sessionId = await actor.loginCustomerByEmail(email);
      
      // 7 days expiry (matching backend CUSTOMER_SESSION_TIMEOUT)
      const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
      
      const sessionData: CustomerSessionData = {
        sessionId,
        email,
        expiresAt,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      setSession(sessionData);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  return {
    session,
    isAuthenticated: !!session,
    isValidating,
    isLoggingIn,
    login,
    logout,
  };
}
