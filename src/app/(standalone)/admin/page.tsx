import type { Metadata } from 'next';
import { AdminPanel } from '@/components/AdminPanelNew';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false },
};

export default function AdminPage() {
  return <AdminPanel />;
}
