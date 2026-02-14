import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import { useIsAdminRoute } from '../../hooks/useIsAdminRoute';

export default function SiteLayout() {
  const isAdminRoute = useIsAdminRoute();

  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
