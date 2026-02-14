import { useState, useEffect } from 'react';
import { useActor } from './useActor';

const ADMIN_SESSION_KEY = 'beemedha_admin_session';

export function useAdminSession() {
  const { actor } = useActor();
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem(ADMIN_SESSION_KEY);
  });
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  // Validate session on mount and when actor changes
  useEffect(() => {
    const validateSession = async () => {
      if (!actor || !sessionId) {
        setIsValid(false);
        setIsValidating(false);
        if (sessionId) {
          // Clear invalid session from storage
          localStorage.removeItem(ADMIN_SESSION_KEY);
          setSessionId(null);
        }
        return;
      }

      try {
        const valid = await actor.validateAdminSession(sessionId);
        setIsValid(valid);
        if (!valid) {
          localStorage.removeItem(ADMIN_SESSION_KEY);
          setSessionId(null);
        }
      } catch (error) {
        console.error('Session validation error:', error);
        setIsValid(false);
        localStorage.removeItem(ADMIN_SESSION_KEY);
        setSessionId(null);
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [actor, sessionId]);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (!actor) throw new Error('Actor not available');

    try {
      const newSessionId = await actor.adminLogin(username, password);
      if (newSessionId) {
        localStorage.setItem(ADMIN_SESSION_KEY, newSessionId);
        setSessionId(newSessionId);
        setIsValid(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    if (actor && sessionId) {
      try {
        await actor.adminLogout(sessionId);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setSessionId(null);
    setIsValid(false);
  };

  return {
    sessionId,
    isValid,
    isValidating,
    login,
    logout,
  };
}
