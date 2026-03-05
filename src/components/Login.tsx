'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, LogIn, Key } from './icons';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  // MFA state
  const [mfaMode, setMfaMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [mfaError, setMfaError] = useState('');

  useEffect(() => {
    if (searchParams.get('mfa') === 'required') {
      setMfaMode(true);
    }
  }, [searchParams]);

  const handleMfaSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMfaError('');

    if (!otpCode || otpCode.length !== 6) {
      setMfaError('Introduza o código de 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp?.[0];

      if (!totpFactor) {
        setMfaError('Fator MFA não encontrado. Contacte o administrador.');
        setIsLoading(false);
        return;
      }

      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });

      if (challengeError || !challenge) {
        setMfaError('Erro ao iniciar verificação MFA. Tente novamente.');
        setIsLoading(false);
        return;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code: otpCode,
      });

      if (verifyError) {
        setMfaError('Código inválido. Tente novamente.');
        toast.error('Código MFA inválido.');
      } else {
        toast.success('Verificação MFA concluída!');
        router.push('/admin');
        router.refresh();
      }
    } catch {
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

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
        // Check if MFA is required after successful login
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal && aal.nextLevel === 'aal2' && aal.currentLevel === 'aal1') {
          setMfaMode(true);
          toast.info('Verificação MFA necessária.');
          setIsLoading(false);
          return;
        }

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

  // MFA Verification View
  if (mfaMode) {
    return (
      <AuthCard
        title="HABTA"
        subtitle="Verificação de autenticação multifator"
        backRoute="home"
      >
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
            <Key size={40} style={{ color: colors.white }} />
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

          <p
            style={{
              color: colors.gray[600],
              fontSize: '0.875rem',
              marginTop: spacing[4],
            }}
          >
            Introduza o código de 6 dígitos da sua aplicação de autenticação.
          </p>
        </div>

        <form
          onSubmit={handleMfaSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}
        >
          <FormField
            id="otp-code"
            label="Código MFA"
            type="text"
            icon={Key}
            placeholder="000000"
            value={otpCode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtpCode(val);
            }}
            error={mfaError}
            disabled={isLoading}
            autoComplete="one-time-code"
          />

          <AnimatedButton
            type="submit"
            variant="primary"
            size="lg"
            icon={Shield}
            isLoading={isLoading}
            fullWidth
          >
            {isLoading ? 'Verificando...' : 'Verificar Código'}
          </AnimatedButton>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="HABTA"
      subtitle="Faça login para aceder ao painel administrativo"
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
          placeholder="Insira o seu email"
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
          placeholder="Insira a sua senha"
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
