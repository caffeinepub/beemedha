import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminSession } from '../../hooks/useAdminSession';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const navigate = useNavigate();
  const { isValid, isValidating } = useAdminSession();

  useEffect(() => {
    if (!isValidating && !isValid) {
      navigate({ to: '/admin', replace: true });
    }
  }, [isValid, isValidating, navigate]);

  // Show nothing while validating or redirecting
  if (isValidating || !isValid) {
    return null;
  }

  return <>{children}</>;
}
