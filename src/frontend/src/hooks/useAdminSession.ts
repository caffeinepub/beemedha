import { useState, useEffect, useRef } from 'react';

interface AdminSession {
  sessionId: string;
  expiresAt: bigint;
}

const ADMIN_SESSION_KEY = 'admin_session_id';
const ADMIN_SESSION_EXPIRY_KEY = 'admin_session_expiry';

export function useAdminSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasValidatedRef = useRef(false);

  // Load and validate session from localStorage on mount (one-time only)
  useEffect(() => {
    if (hasValidatedRef.current) return;
    hasValidatedRef.current = true;

    const storedSessionId = localStorage.getItem(ADMIN_SESSION_KEY);
    const storedExpiry = localStorage.getItem(ADMIN_SESSION_EXPIRY_KEY);

    if (storedSessionId && storedExpiry) {
      const expiryTime = BigInt(storedExpiry);
      const now = BigInt(Date.now()) * BigInt(1_000_000); // Convert to nanoseconds

      if (expiryTime > now) {
        setSessionId(storedSessionId);
        setIsAuthenticated(true);
      } else {
        // Session expired, clear it
        localStorage.removeItem(ADMIN_SESSION_KEY);
        localStorage.removeItem(ADMIN_SESSION_EXPIRY_KEY);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    
    setIsValidating(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoggingIn(true);
    try {
      // Backend doesn't have adminLogin yet, so we simulate it
      // In production, this would call actor.adminLogin(username, password)
      
      // For now, check credentials client-side (NOT SECURE - backend should validate)
      if (username === 'Thejas Kinnigoli' && password === '789852qwertyuiop') {
        const newSessionId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const expiresAt = BigInt(Date.now() + 24 * 60 * 60 * 1000) * BigInt(1_000_000); // 24 hours in nanoseconds

        // Store session
        localStorage.setItem(ADMIN_SESSION_KEY, newSessionId);
        localStorage.setItem(ADMIN_SESSION_EXPIRY_KEY, expiresAt.toString());
        
        setSessionId(newSessionId);
        setIsAuthenticated(true);
        return true;
      } else {
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
    hasValidatedRef.current = false;
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
