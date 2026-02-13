import { RouterProvider, createRouter, createRoute, createRootRoute, createHashHistory } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import CertificationsPage from './pages/CertificationsPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
import AdminLogoPage from './pages/admin/AdminLogoPage';
import AdminAccessPage from './pages/admin/AdminAccessPage';
import AdminRouteGuard from './components/admin/AdminRouteGuard';

const rootRoute = createRootRoute({
  component: SiteLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: ProductDetailPage,
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news',
  component: NewsPage,
});

const newsDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news/$updateId',
  component: NewsDetailPage,
});

const certificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/certifications',
  component: CertificationsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLoginPage,
});

const ownerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner',
  component: () => (
    <AdminRouteGuard>
      <AdminDashboardPage />
    </AdminRouteGuard>
  ),
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: () => (
    <AdminRouteGuard>
      <AdminProductsPage />
    </AdminRouteGuard>
  ),
});

const adminNewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/news',
  component: () => (
    <AdminRouteGuard>
      <AdminNewsPage />
    </AdminRouteGuard>
  ),
});

const adminLogoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/logo',
  component: () => (
    <AdminRouteGuard>
      <AdminLogoPage />
    </AdminRouteGuard>
  ),
});

const adminAccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/access',
  component: () => (
    <AdminRouteGuard>
      <AdminAccessPage />
    </AdminRouteGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  productsRoute,
  productDetailRoute,
  newsRoute,
  newsDetailRoute,
  certificationsRoute,
  contactRoute,
  termsRoute,
  adminRoute,
  ownerRoute,
  adminProductsRoute,
  adminNewsRoute,
  adminLogoRoute,
  adminAccessRoute,
]);

const hashHistory = createHashHistory();

const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
