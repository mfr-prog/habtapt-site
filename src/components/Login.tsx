import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, User, LogIn } from './icons';
import { toast } from 'sonner';
import { useRouter } from './Router';
import { Logo } from './Logo';
import { AuthCard } from './primitives/AuthCard';
import { FormField } from './primitives/FormField';
import { AnimatedButton } from './primitives/AnimatedButton';
import { colors, spacing, radius } from '../utils/styles';
import { animations } from '../utils/animations';
import { designSystem } from './design-system';

export function Login() {
  const { navigate } = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({ username: '', password: '' });

    // Validation
    if (!username) {
      setErrors((prev) => ({ ...prev, username: 'Usuário é obrigatório' }));
      return;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Senha é obrigatória' }));
      return;
    }

    setIsLoading(true);

    // Simular validação (em produção, você conectaria ao Supabase Auth)
    setTimeout(() => {
      // Credenciais de exemplo (em produção, usar Supabase Auth)
      if (username === 'admin' && password === 'habta2024') {
        // Salvar token de autenticação
        sessionStorage.setItem('habta_admin_auth', 'true');
        sessionStorage.setItem('habta_admin_user', username);

        toast.success('Login realizado com sucesso!');
        setTimeout(() => navigate('admin'), 500);
      } else {
        setErrors({ username: '', password: 'Credenciais inválidas' });
        toast.error('Credenciais inválidas. Tente novamente.');
      }
      setIsLoading(false);
    }, 1000);
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
          id="username"
          label="Usuário"
          type="text"
          icon={User}
          placeholder="Digite seu usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
          disabled={isLoading}
          autoComplete="username"
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

      {/* Demo Credentials */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: spacing[8],
          padding: spacing[4],
          background: designSystem.helpers.hexToRgba(colors.secondary, 0.08),
          borderRadius: radius.lg,
          border: `1px solid ${designSystem.helpers.hexToRgba(colors.secondary, 0.2)}`,
        }}
      >
        <p
          style={{
            fontSize: '0.875rem',
            color: colors.gray[600],
            marginBottom: spacing[2],
            fontWeight: 600,
          }}
        >
          🔑 Credenciais de Demonstração
        </p>
        <div style={{ fontSize: '0.8125rem', color: colors.gray[500] }}>
          <p style={{ marginBottom: '4px' }}>
            <strong style={{ color: colors.gray[700] }}>Usuário:</strong> admin
          </p>
          <p>
            <strong style={{ color: colors.gray[700] }}>Senha:</strong> habta2024
          </p>
        </div>
      </motion.div>
    </AuthCard>
  );
}
