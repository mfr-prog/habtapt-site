'use client';

import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, LogIn } from './icons';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Logo } from './Logo';
import { AuthCard } from './primitives/AuthCard';
import { FormField } from './primitives/FormField';
import { AnimatedButton } from './primitives/AnimatedButton';
import { colors, spacing, radius } from '../utils/styles';
import { animations } from '../utils/animations';
import { designSystem } from './design-system';
import { createClient } from '@/lib/supabase/client';

export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({ email: '', password: '' });

    // Validation
    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email é obrigatório' }));
      return;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Password é obrigatória' }));
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrors({ email: '', password: 'Email ou password inválidos' });
        toast.error('Email ou password inválidos.');
      } else {
        toast.success('Login realizado com sucesso!');
        router.push('/admin');
        router.refresh();
      }
    } catch {
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="HABTA"
      subtitle="Faça login para acessar o painel administrativo"
      backRoute="home"
    >
      {/* Logo & Icon Header */}
      <div style={{ textAlign: 'center', marginBottom: spacing[10] }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: radius['2xl'],
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            marginBottom: spacing[6],
            boxShadow: `0 12px 28px ${designSystem.helpers.hexToRgba(colors.primary, 0.3)}`,
          }}
        >
          <Shield size={40} style={{ color: colors.white }} />
        </motion.div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[3],
            marginBottom: spacing[2],
          }}
        >
          <Logo variant="black" size={100} />
        </div>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}
      >
        <FormField
          id="email"
          label="Email"
          type="email"
          icon={Mail}
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isLoading}
          autoComplete="email"
        />

        <FormField
          id="password"
          label="Senha"
          type="password"
          icon={Lock}
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
          showPasswordToggle
          autoComplete="current-password"
        />

        <AnimatedButton
          type="submit"
          variant="primary"
          size="lg"
          icon={LogIn}
          isLoading={isLoading}
          fullWidth
        >
          {isLoading ? 'Autenticando...' : 'Entrar no Painel'}
        </AnimatedButton>
      </form>

    </AuthCard>
  );
}
