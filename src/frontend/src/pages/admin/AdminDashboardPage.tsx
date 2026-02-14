import { useState } from 'react';
import { usePageMeta } from '../../hooks/usePageMeta';
import AdminAccessGate from '../../components/admin/AdminAccessGate';
import AdminShell from '../../components/admin/dashboard/AdminShell';
import DashboardSection from '../../components/admin/dashboard/sections/DashboardSection';
import StoreSettingsSection from '../../components/admin/dashboard/sections/StoreSettingsSection';
import ProductsSection from '../../components/admin/dashboard/sections/ProductsSection';
import OrdersSection from '../../components/admin/dashboard/sections/OrdersSection';
import CustomersSection from '../../components/admin/dashboard/sections/CustomersSection';

export type AdminSection = 'dashboard' | 'store-settings' | 'products' | 'orders' | 'customers';

export default function AdminDashboardPage() {
  usePageMeta('Admin Dashboard', 'Manage your website content and settings');
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection onNavigate={setActiveSection} />;
      case 'store-settings':
        return <StoreSettingsSection />;
      case 'products':
        return <ProductsSection />;
      case 'orders':
        return <OrdersSection />;
      case 'customers':
        return <CustomersSection />;
      default:
        return <DashboardSection onNavigate={setActiveSection} />;
    }
  };

  return (
    <AdminAccessGate>
      <AdminShell activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderSection()}
      </AdminShell>
    </AdminAccessGate>
  );
}
