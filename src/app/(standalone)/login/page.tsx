import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Login } from '@/components/Login';

export const metadata: Metadata = {
  title: 'Login',
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
