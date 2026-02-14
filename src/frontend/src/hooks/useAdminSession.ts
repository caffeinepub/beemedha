import { useState, useEffect } from 'react';
import { useActor } from './useActor';

interface AdminSession {
  sessionId: string;
  expiresAt: bigint;
}

const ADMIN_SESSION_KEY = 'admin_session_id';
const ADMIN_SESSION_EXPIRY_KEY = 'admin_session_expiry';

export function useAdminSession() {
  const { actor, isFetching } = useActor();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem(ADMIN_SESSION_KEY);
    const storedExpiry = localStorage.getItem(ADMIN_SESSION_EXPIRY_KEY);

    if (storedSessionId && storedExpiry) {
      const expiryTime = BigInt(storedExpiry);
      const now = BigInt(Date.now()) * BigInt(1_000_000); // Convert to nanoseconds

      if (expiryTime > now) {
        setSessionId(storedSessionId);
      } else {
        // Session expired, clear it
        localStorage.removeItem(ADMIN_SESSION_KEY);
        localStorage.removeItem(ADMIN_SESSION_EXPIRY_KEY);
      }
    }
    setIsValidating(false);
  }, []);

  // Validate session with backend when actor is ready
  useEffect(() => {
    if (!actor || isFetching || !sessionId) {
      if (!sessionId && !isFetching) {
        setIsAuthenticated(false);
        setIsValidating(false);
      }
      return;
    }

    const validateSession = async () => {
      try {
        setIsValidating(true);
        const isValid = await actor.isAdminSessionValid(sessionId);
        if (isValid) {
          setIsAuthenticated(true);
        } else {
          // Clear invalid session
          localStorage.removeItem(ADMIN_SESSION_KEY);
          localStorage.removeItem(ADMIN_SESSION_EXPIRY_KEY);
          setSessionId(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        // Clear invalid session
        localStorage.removeItem(ADMIN_SESSION_KEY);
        localStorage.removeItem(ADMIN_SESSION_EXPIRY_KEY);
        setSessionId(null);
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [actor, isFetching, sessionId]);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (!actor) {
      throw new Error('Actor not available');
    }

    setIsLoggingIn(true);
    try {
      const result = await actor.adminLogin(username, password);
      
      if (result.__kind__ === 'success') {
        const newSessionId = result.success;
        const expiresAt = BigInt(Date.now() + 24 * 60 * 60 * 1000) * BigInt(1_000_000); // 24 hours in nanoseconds

        // Store session
        localStorage.setItem(ADMIN_SESSION_KEY, newSessionId);
        localStorage.setItem(ADMIN_SESSION_EXPIRY_KEY, expiresAt.toString());
        
        setSessionId(newSessionId);
        setIsAuthenticated(true);
        return true;
      } else {
        console.error('Login failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    // Clear local session
    localStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(ADMIN_SESSION_EXPIRY_KEY);
    setSessionId(null);
    setIsAuthenticated(false);
  };

  return {
    sessionId,
    isAuthenticated,
    isValidating,
    isLoggingIn,
    login,
    logout,
  };
}
