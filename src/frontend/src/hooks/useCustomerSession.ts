import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import type { CustomerIdentifier } from '../backend';

const CUSTOMER_SESSION_KEY = 'beemedha_customer_session';

export function useCustomerSession() {
  const { actor } = useActor();
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem(CUSTOMER_SESSION_KEY);
  });
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerIdentifier | null>(null);

  // Validate session on mount and when actor changes
  useEffect(() => {
    const validateSession = async () => {
      if (!actor || !sessionId) {
        setIsValid(false);
        setCustomerInfo(null);
        setIsValidating(false);
        return;
      }

      try {
        const valid = await actor.validateCustomerSession(sessionId);
        setIsValid(valid);
        
        if (valid) {
          const info = await actor.getCustomerSessionInfo(sessionId);
          setCustomerInfo(info);
        } else {
          localStorage.removeItem(CUSTOMER_SESSION_KEY);
          setSessionId(null);
          setCustomerInfo(null);
        }
      } catch (error) {
        console.error('Session validation error:', error);
        setIsValid(false);
        setCustomerInfo(null);
        localStorage.removeItem(CUSTOMER_SESSION_KEY);
        setSessionId(null);
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [actor, sessionId]);

  const requestOTP = async (identifier: CustomerIdentifier): Promise<boolean> => {
    if (!actor) throw new Error('Actor not available');

    try {
      return await actor.customerRequestOTP(identifier);
    } catch (error) {
      console.error('Request OTP error:', error);
      return false;
    }
  };

  const verifyOTP = async (identifier: CustomerIdentifier, otp: string): Promise<boolean> => {
    if (!actor) throw new Error('Actor not available');

    try {
      const newSessionId = await actor.customerVerifyOTP(identifier, otp);
      if (newSessionId) {
        localStorage.setItem(CUSTOMER_SESSION_KEY, newSessionId);
        setSessionId(newSessionId);
        setIsValid(true);
        setCustomerInfo(identifier);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return false;
    }
  };

  const logout = async () => {
    if (actor && sessionId) {
      try {
        await actor.customerLogout(sessionId);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem(CUSTOMER_SESSION_KEY);
    setSessionId(null);
    setIsValid(false);
    setCustomerInfo(null);
  };

  return {
    sessionId,
    isValid,
    isValidating,
    customerInfo,
    requestOTP,
    verifyOTP,
    logout,
  };
}
