'use client';

// AdminPanel v2.6 - 100% Conformidade Guardião Universal
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Users,
  Inbox,
  RefreshCw,
  Search,
  Download,
  TrendingUp,
  Clock,
  Filter,
  LayoutGrid,
  LayoutList,
  Building2,
  BookOpen,
  X,
  Check,
  Eye,
  Trash2,
  UserPlus,
  TrendingDown,
} from './icons';
import { toast } from 'sonner';
import { supabaseFetch } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AdminLayout } from './admin/AdminLayout';
import { MetricCard } from './admin/MetricCard';
import { ProjectsManager } from './admin/ProjectsManager';
import { InsightsManager } from './admin/InsightsManager';
import { TestimonialsManager } from './admin/TestimonialsManager';
import { AnimatedButton } from './primitives/AnimatedButton';
import { SkeletonDashboard, SkeletonTable } from './primitives/LoadingSkeleton';
import { colors, spacing, shadows, radius, typography } from '../utils/styles';
import { animations } from '../utils/animations';
import { designSystem } from './design-system';
import { LeadsPipeline } from './admin/LeadsPipeline';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  createdAt: string;
  timestamp: number;
  pipelineStage?: 'novo' | 'contato' | 'qualificado' | 'visita' | 'proposta' | 'negociacao' | 'ganho' | 'perdido';
  // Preferências do lead
  desiredLocations?: string[];
  maxBudget?: string;
  typology?: string;
  notes?: string;
}

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  timestamp: number;
}

interface Project {
  id: string;
  title: string;
  location: string;
  status: 'analysis' | 'renovation' | 'completed' | 'available';
  statusLabel: string;
  strategy: 'buy-hold' | 'fix-flip';
  image: string;
  roi: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  investment: string;
  timeline: string;
  timelinePhases?: string;
  description: string;
  highlights?: string;
  createdAt?: string;
  updatedAt?: string;
  timestamp?: number;
}

type InsightCategory = 'Investimento' | 'Regulamentação' | 'Sustentabilidade' | 'Mercado';

interface Insight {
  id: string;
  title: string;
  description: string;
  category: InsightCategory;
  readTime: string;
  icon: 'TrendingUp' | 'Building2' | 'Leaf' | 'BookOpen';
  iconColor: string;
  gradient: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  timestamp?: number;
}

export function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'contacts' | 'leads' | 'subscribers' | 'projects' | 'insights' | 'testimonials'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedInterest, setSelectedInterest] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactStatus, setContactStatus] = useState<{ [key: string]: 'pending' | 'attended' }>({});

  // Auth check (backup do middleware)
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Acesso negado. Por favor, faça login.');
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  // Fetch data
  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await supabaseFetch('contacts');

      const data = await response.json();

      if (response.ok) {
        setContacts(data.contacts || []);
      } else {
        toast.error('Erro ao carregar contatos');
      }
    } catch (error) {
      toast.error('Erro de conexão');
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const response = await supabaseFetch('subscribers');

      const data = await response.json();

      if (response.ok) {
        setSubscribers(data.subscribers || []);
      } else {
        toast.error('Erro ao carregar subscritos');
      }
    } catch (error) {
      toast.error('Erro de conexão');
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await supabaseFetch('projects');

      const data = await response.json();

      if (response.ok) {
        setProjects(data.projects || []);
      } else {
        toast.error('Erro ao carregar projetos');
      }
    } catch (error) {
      toast.error('Erro de conexão');
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const response = await supabaseFetch('insights');

      const data = await response.json();

      if (response.ok) {
        setInsights(data.insights || []);
      } else {
        toast.error('Erro ao carregar insights');
      }
    } catch (error) {
      toast.error('Erro de conexão');
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const fetchTestimonialsCount = async () => {
    try {
      const response = await supabaseFetch('testimonials', { method: 'GET' }, 1, true);
      if (response.ok) {
        const data = await response.json();
        setTestimonialsCount(data.count || 0);
      }
    } catch {
      // Silently fail - count stays at 0
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchSubscribers();
    fetchProjects();
    fetchInsights();
    fetchTestimonialsCount();
  }, []);

  // Filtered and sorted data
  const filteredContacts = useMemo(() => {
    let filtered = contacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInterest =
        selectedInterest === 'all' || contact.interest === selectedInterest;
      const matchesPeriod =
        selectedPeriod === 'all' ||
        (selectedPeriod === 'today' && new Date(contact.createdAt).toDateString() === new Date().toDateString()) ||
        (selectedPeriod === '7days' && Date.now() - contact.timestamp < 7 * 24 * 60 * 60 * 1000) ||
        (selectedPeriod === '30days' && Date.now() - contact.timestamp < 30 * 24 * 60 * 60 * 1000);
      return matchesSearch && matchesInterest && matchesPeriod;
    });

    return filtered.sort((a, b) =>
      sortOrder === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );
  }, [contacts, searchTerm, sortOrder, selectedInterest, selectedPeriod]);

  const filteredSubscribers = useMemo(() => {
    let filtered = subscribers.filter((sub) =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) =>
      sortOrder === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );
  }, [subscribers, searchTerm, sortOrder]);

  // Export CSV
  const exportToCSV = () => {
    const data = activeTab === 'contacts' ? filteredContacts : filteredSubscribers;

    if (data.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    const headers =
      activeTab === 'contacts'
        ? ['Nome', 'Email', 'Telefone', 'Interesse', 'Mensagem', 'Data']
        : ['Email', 'Data de Inscrição'];

    const csvContent = [
      headers.join(','),
      ...data.map((item) => {
        if (activeTab === 'contacts') {
          const c = item as Contact;
          return `\"${c.name}\",\"${c.email}\",\"${c.phone}\",\"${c.interest}\",\"${c.message}\",\"${c.createdAt}\"`;
        } else {
          const s = item as Subscriber;
          return `\"${s.email}\",\"${s.subscribedAt}\"`;
        }
      }),
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `habta-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Dados exportados com sucesso!');
  };

  // Delete subscriber
  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!confirm(`Tem certeza que deseja excluir o assinante ${email}?`)) {
      return;
    }

    try {
      const response = await supabaseFetch(`subscribers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();

        // Atualizar o estado local removendo o subscriber
        setSubscribers(prev => {
          const updated = prev.filter(sub => sub.id !== id);
          return updated;
        });
        
        toast.success('Assinante excluído com sucesso!');
      } else {
        const data = await response.json();
        console.error('[AdminPanelNew] ❌ Erro na resposta:', data);
        toast.error(data.error || 'Erro ao excluir assinante');
      }
    } catch (error) {
      console.error('[AdminPanelNew] ❌ Erro de conexão ao excluir assinante:', error);
      toast.error('Erro de conexão ao excluir assinante');
    }
  };

  // Interest options
  const interestOptions = Array.from(new Set(contacts.map((c) => c.interest))).sort();

  // Subscriber metrics
  const subscribersThisWeek = subscribers.filter(
    (s) => Date.now() - s.timestamp < 7 * 24 * 60 * 60 * 1000
  ).length;

  const subscribersLastWeek = subscribers.filter(
    (s) => {
      const lastWeekStart = Date.now() - 14 * 24 * 60 * 60 * 1000;
      const lastWeekEnd = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return s.timestamp >= lastWeekStart && s.timestamp < lastWeekEnd;
    }
  ).length;

  const subscriberGrowth = subscribersLastWeek > 0
    ? Math.round(((subscribersThisWeek - subscribersLastWeek) / subscribersLastWeek) * 100)
    : subscribersThisWeek > 0 ? 100 : 0;

  // Metrics
  const metrics = activeTab === 'subscribers' ? [
    {
      title: 'Total Subscritos',
      value: subscribers.length,
      icon: Users,
      color: 'secondary' as const,
    },
    {
      title: 'Novos esta semana',
      value: subscribersThisWeek,
      icon: UserPlus,
      color: 'success' as const,
      trend: { value: Math.abs(subscriberGrowth), isPositive: subscriberGrowth >= 0 },
    },
    {
      title: 'Crescimento',
      value: `${subscriberGrowth >= 0 ? '+' : ''}${subscriberGrowth}%`,
      icon: subscriberGrowth >= 0 ? TrendingUp : TrendingDown,
      color: subscriberGrowth >= 0 ? 'success' as const : 'error' as const,
    },
    {
      title: 'Projetos',
      value: projects.length,
      icon: Building2,
      color: 'primary' as const,
    },
    {
      title: 'Insights',
      value: insights.length,
      icon: BookOpen,
      color: 'secondary' as const,
    },
  ] : [
    {
      title: 'Total Contatos',
      value: contacts.length,
      icon: Mail,
      color: 'primary' as const,
    },
    {
      title: 'Leads em Pipeline',
      value: contacts.length,
      icon: Users,
      color: 'secondary' as const,
    },
    {
      title: 'Subscritos',
      value: subscribers.length,
      icon: Users,
      color: 'secondary' as const,
    },
    {
      title: 'Projetos',
      value: projects.length,
      icon: Building2,
      color: 'primary' as const,
    },
    {
      title: 'Insights',
      value: insights.length,
      icon: BookOpen,
      color: 'secondary' as const,
    },
    {
      title: 'Novos (7d)',
      value: contacts.filter(
        (c) => Date.now() - c.timestamp < 7 * 24 * 60 * 60 * 1000
      ).length,
      icon: TrendingUp,
      color: 'success' as const,
    },
  ];

  if (isInitialLoad) {
    return (
      <AdminLayout>
        <SkeletonDashboard />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Compact Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: spacing[4],
          marginBottom: spacing[6],
        }}
      >
        {metrics.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} delay={index * 0.05} />
        ))}
      </div>

      {/* Data Table */}
      <div
        style={{
          background: colors.white,
          borderRadius: radius.lg,
          border: `1px solid ${colors.gray[200]}`,
          overflow: 'hidden',
        }}
      >
        {/* Clean Tabs with ARIA */}
        <div
          role="tablist"
          aria-label="Seleção de dados administrativos"
          style={{
            display: 'flex',
            borderBottom: `1px solid ${colors.gray[200]}`,
            background: colors.white,
          }}
        >
          {[
            { id: 'contacts' as const, label: 'Contatos', icon: Mail, count: contacts.length },
            { id: 'leads' as const, label: 'Leads', icon: Users, count: contacts.length },
            { id: 'subscribers' as const, label: 'Newsletter', icon: Inbox, count: subscribers.length },
            { id: 'projects' as const, label: 'Projetos', icon: Building2, count: projects.length },
            { id: 'insights' as const, label: 'Insights', icon: BookOpen, count: insights.length },
            { id: 'testimonials' as const, label: 'Depoimentos', icon: MessageSquare, count: testimonialsCount },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
                padding: `${spacing[3]} ${spacing[4]}`,
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${colors.primary}` : '2px solid transparent',
                color: activeTab === tab.id ? colors.primary : colors.gray[600],
                fontWeight: activeTab === tab.id ? typography.fontWeight.bold : typography.fontWeight.medium,
                fontSize: typography.fontSize.sm,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <tab.icon size={18} aria-hidden="true" />
              <span>{tab.label}</span>
              <span
                aria-label={`${tab.count} itens`}
                style={{
                  padding: `${spacing[1]} ${spacing[2]}`,
                  background: activeTab === tab.id
                    ? designSystem.helpers.hexToRgba(colors.primary, 0.1)
                    : colors.gray[100],
                  color: activeTab === tab.id ? colors.primary : colors.gray[600],
                  borderRadius: radius.md,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.bold,
                  minWidth: '24px',
                  textAlign: 'center',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Compact Toolbar - Only for contacts and subscribers */}
        {activeTab !== 'projects' && activeTab !== 'insights' && activeTab !== 'testimonials' && activeTab !== 'leads' && (
          <div
            style={{
              padding: `${spacing[3]} ${spacing[4]}`,
              borderBottom: `1px solid ${colors.gray[200]}`,
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing[3],
              alignItems: 'center',
              justifyContent: 'space-between',
              background: colors.gray[50],
            }}
          >
          {/* Search with A11Y */}
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '180px', maxWidth: '400px' }}>
            <label htmlFor="admin-search" className="sr-only">
              Buscar contatos e subscritos
            </label>
            <Search
              size={16}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: spacing[3],
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.gray[400],
                pointerEvents: 'none',
              }}
            />
            <input
              id="admin-search"
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Campo de busca"
              style={{
                width: '100%',
                padding: `${spacing[2]} ${spacing[3]} ${spacing[2]} ${spacing[10]}`,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: radius.md,
                fontSize: typography.fontSize.sm,
                outline: 'none',
                transition: 'all 0.2s',
                background: colors.white,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.gray[300];
              }}
            />
          </div>

          {/* Actions with A11Y */}
          <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
            {activeTab === 'contacts' && (
              <>
                {interestOptions.length > 0 && (
                  <div>
                    <label htmlFor="interest-filter" className="sr-only">
                      Filtrar por interesse
                    </label>
                    <select
                      id="interest-filter"
                      value={selectedInterest}
                      onChange={(e) => setSelectedInterest(e.target.value)}
                      aria-label="Filtrar contatos por área de interesse"
                      style={{
                        padding: `${spacing[2]} ${spacing[3]}`,
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: radius.md,
                        fontSize: typography.fontSize.sm,
                        color: colors.gray[700],
                        outline: 'none',
                        cursor: 'pointer',
                        background: colors.white,
                      }}
                    >
                      <option value="all">Todos interesses</option>
                      {interestOptions.map((interest) => (
                        <option key={interest} value={interest}>
                          {interest}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label htmlFor="period-filter" className="sr-only">
                    Filtrar por período
                  </label>
                  <select
                    id="period-filter"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as 'all' | 'today' | '7days' | '30days')}
                    aria-label="Filtrar contatos por período de tempo"
                    style={{
                      padding: `${spacing[2]} ${spacing[3]}`,
                      border: `1px solid ${colors.gray[300]}`,
                      borderRadius: radius.md,
                      fontSize: typography.fontSize.sm,
                      color: colors.gray[700],
                      outline: 'none',
                      cursor: 'pointer',
                      background: colors.white,
                    }}
                  >
                    <option value="all">Todos períodos</option>
                    <option value="today">Hoje</option>
                    <option value="7days">Últimos 7 dias</option>
                    <option value="30days">Últimos 30 dias</option>
                  </select>
                </div>
              </>
            )}

            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              aria-label={`Ordenar por ${sortOrder === 'newest' ? 'mais antigos' : 'mais recentes'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[1],
                padding: `${spacing[2]} ${spacing[3]}`,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: radius.md,
                fontSize: typography.fontSize.sm,
                color: colors.gray[700],
                background: colors.white,
                cursor: 'pointer',
                fontWeight: typography.fontWeight.medium,
              }}
            >
              {sortOrder === 'newest' ? <TrendingUp size={14} aria-hidden="true" /> : <Clock size={14} aria-hidden="true" />}
              <span className="hidden lg:inline">
                {sortOrder === 'newest' ? 'Recentes' : 'Antigos'}
              </span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              aria-label={`Alternar para visualização em ${viewMode === 'list' ? 'grade' : 'lista'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[1],
                padding: `${spacing[2]} ${spacing[3]}`,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: radius.md,
                fontSize: typography.fontSize.sm,
                color: colors.gray[700],
                background: colors.white,
                cursor: 'pointer',
                fontWeight: typography.fontWeight.medium,
              }}
            >
              {viewMode === 'list' ? <LayoutGrid size={14} aria-hidden="true" /> : <LayoutList size={14} aria-hidden="true" />}
            </button>

            <button
              onClick={() => {
                if (activeTab === 'contacts') fetchContacts();
                else if (activeTab === 'subscribers') fetchSubscribers();
                else if (activeTab === 'projects') fetchProjects();
                else if (activeTab === 'insights') fetchInsights();
              }}
              disabled={isLoading}
              aria-label="Recarregar dados"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[1],
                padding: `${spacing[2]} ${spacing[3]}`,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: radius.md,
                fontSize: typography.fontSize.sm,
                color: colors.gray[700],
                background: colors.white,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: typography.fontWeight.medium,
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <RefreshCw size={14} aria-hidden="true" style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
            </button>

            <button
              onClick={exportToCSV}
              aria-label="Exportar dados para CSV"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2]} ${spacing[4]}`,
                border: 'none',
                borderRadius: radius.md,
                fontSize: typography.fontSize.sm,
                color: colors.white,
                background: colors.primary,
                cursor: 'pointer',
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              <Download size={14} aria-hidden="true" />
              <span className="hidden md:inline">
                Exportar
              </span>
            </button>
          </div>
          </div>
        )}

        {/* Content with ARIA TabPanel */}
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          style={{ padding: (activeTab === 'projects' || activeTab === 'insights' || activeTab === 'testimonials') ? spacing[6] : spacing[4] }}
        >
          {isLoading ? (
            <SkeletonTable rows={5} />
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'contacts' ? (
                <ContactsView contacts={filteredContacts} viewMode={viewMode} />
              ) : activeTab === 'leads' ? (
                <LeadsPipeline contacts={contacts} onRefresh={fetchContacts} />
              ) : activeTab === 'subscribers' ? (
                <SubscribersView 
                  subscribers={filteredSubscribers} 
                  viewMode={viewMode}
                  onDelete={handleDeleteSubscriber}
                />
              ) : activeTab === 'projects' ? (
                <ProjectsManager projects={projects} onRefresh={fetchProjects} isLoading={isLoading} />
              ) : activeTab === 'insights' ? (
                <InsightsManager insights={insights} onRefresh={fetchInsights} isLoading={isLoading} />
              ) : (
                <TestimonialsManager onRefresh={fetchTestimonialsCount} />
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

// Contacts View
function ContactsView({
  contacts,
  viewMode,
}: {
  contacts: Contact[];
  viewMode: 'grid' | 'list';
}) {
  if (contacts.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          textAlign: 'center',
          padding: spacing[12],
          color: colors.gray[500],
        }}
      >
        <Inbox size={64} style={{ margin: '0 auto', marginBottom: spacing[4], opacity: 0.3 }} aria-hidden="true" />
        <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
          Nenhum contato encontrado
        </h3>
        <p style={{ fontSize: typography.fontSize.base }}>Os contatos aparecerão aqui quando forem enviados</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <motion.div
        variants={animations.staggerContainer}
        initial="initial"
        animate="animate"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: spacing[6],
        }}
      >
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            variants={animations.fadeInUp}
            style={{
              background: colors.white,
              border: `2px solid ${colors.gray[200]}`,
              borderRadius: radius.xl,
              padding: spacing[6],
              transition: 'all 0.2s',
            }}
            whileHover={{ y: -4, boxShadow: shadows.md }}
          >
            <div style={{ display: 'flex', alignItems: 'start', gap: spacing[3], marginBottom: spacing[4] }}>
              <div
                aria-hidden="true"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: radius.lg,
                  background: designSystem.helpers.hexToRgba(colors.primary, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mail size={24} style={{ color: colors.primary }} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.lg, color: colors.gray[900], marginBottom: spacing[1] }}>
                  {contact.name}
                </h4>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[500] }}>{contact.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                <Phone size={16} style={{ color: colors.gray[400] }} aria-hidden="true" />
                <span style={{ fontSize: typography.fontSize.sm, color: colors.gray[600] }}>{contact.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                <MessageSquare size={16} style={{ color: colors.gray[400] }} aria-hidden="true" />
                <span
                  style={{
                    fontSize: typography.fontSize.sm,
                    padding: `${spacing[1]} ${spacing[2]}`,
                    background: designSystem.helpers.hexToRgba(colors.secondary, 0.1),
                    color: colors.secondary,
                    borderRadius: radius.md,
                    fontWeight: typography.fontWeight.semibold,
                  }}
                >
                  {contact.interest}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                <Calendar size={16} style={{ color: colors.gray[400] }} aria-hidden="true" />
                <span style={{ fontSize: typography.fontSize.sm, color: colors.gray[500] }}>{contact.createdAt}</span>
              </div>
            </div>

            {contact.message && (
              <div
                style={{
                  marginTop: spacing[4],
                  padding: spacing[3],
                  background: colors.gray[50],
                  borderRadius: radius.md,
                  fontSize: typography.fontSize.sm,
                  color: colors.gray[600],
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                {contact.message}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // List view with A11Y
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: `0 ${spacing[2]}` }}>
        <caption className="sr-only">
          Lista de {contacts.length} contatos recebidos pelo formulário do site HABTA
        </caption>
        <thead>
          <tr>
            {['Nome', 'Email', 'Telefone', 'Interesse', 'Data'].map((header) => (
              <th
                key={header}
                scope="col"
                style={{
                  textAlign: 'left',
                  padding: spacing[3],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.gray[600],
                  textTransform: 'uppercase',
                  letterSpacing: typography.letterSpacing.wide,
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <motion.tr
              key={contact.id}
              variants={animations.fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.05 }}
              style={{
                background: colors.white,
                borderRadius: radius.lg,
              }}
              whileHover={{ backgroundColor: colors.gray[50] }}
            >
              <td style={{ padding: spacing[4], fontWeight: typography.fontWeight.semibold, color: colors.gray[900] }}>
                {contact.name}
              </td>
              <td style={{ padding: spacing[4], color: colors.gray[600] }}>{contact.email}</td>
              <td style={{ padding: spacing[4], color: colors.gray[600] }}>{contact.phone}</td>
              <td style={{ padding: spacing[4] }}>
                <span
                  style={{
                    padding: `${spacing[1]} ${spacing[3]}`,
                    background: designSystem.helpers.hexToRgba(colors.secondary, 0.1),
                    color: colors.secondary,
                    borderRadius: radius.md,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                  }}
                >
                  {contact.interest}
                </span>
              </td>
              <td style={{ padding: spacing[4], color: colors.gray[500], fontSize: typography.fontSize.sm }}>
                {contact.createdAt}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Subscribers View
function SubscribersView({
  subscribers,
  viewMode,
  onDelete,
}: {
  subscribers: Subscriber[];
  viewMode: 'grid' | 'list';
  onDelete: (id: string, email: string) => void;
}) {
  if (subscribers.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          textAlign: 'center',
          padding: spacing[12],
          color: colors.gray[500],
        }}
      >
        <Users size={64} style={{ margin: '0 auto', marginBottom: spacing[4], opacity: 0.3 }} aria-hidden="true" />
        <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
          Nenhum subscrito encontrado
        </h3>
        <p style={{ fontSize: typography.fontSize.base }}>As inscrições aparecerão aqui</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <motion.div
        variants={animations.staggerContainer}
        initial="initial"
        animate="animate"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: spacing[5],
        }}
      >
        {subscribers.map((sub) => (
          <motion.div
            key={sub.id}
            variants={animations.fadeInUp}
            style={{
              background: colors.white,
              border: `2px solid ${colors.gray[200]}`,
              borderRadius: radius.xl,
              padding: spacing[5],
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              transition: 'all 0.2s',
            }}
            whileHover={{ y: -4, boxShadow: shadows.md }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: radius.lg,
                background: designSystem.helpers.hexToRgba(colors.success, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Mail size={20} style={{ color: colors.success }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: typography.fontWeight.semibold, color: colors.gray[900], marginBottom: spacing[1], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {sub.email}
              </p>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[500] }}>{sub.subscribedAt}</p>
            </div>
            <button
              onClick={() => onDelete(sub.id, sub.email)}
              aria-label={`Excluir assinante ${sub.email}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[1],
                padding: `${spacing[2]} ${spacing[3]}`,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: radius.md,
                fontSize: typography.fontSize.sm,
                color: colors.gray[700],
                background: colors.white,
                cursor: 'pointer',
                fontWeight: typography.fontWeight.medium,
              }}
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: `0 ${spacing[2]}` }}>
        <caption className="sr-only">
          Lista de {subscribers.length} subscritos da newsletter HABTA
        </caption>
        <thead>
          <tr>
            {['Email', 'Data de Inscrição', 'Ações'].map((header) => (
              <th
                key={header}
                scope="col"
                style={{
                  textAlign: 'left',
                  padding: spacing[3],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.gray[600],
                  textTransform: 'uppercase',
                  letterSpacing: typography.letterSpacing.wide,
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subscribers.map((sub, index) => (
            <motion.tr
              key={sub.id}
              variants={animations.fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.05 }}
              style={{
                background: colors.white,
                borderRadius: radius.lg,
              }}
              whileHover={{ backgroundColor: colors.gray[50] }}
            >
              <td style={{ padding: spacing[4], fontWeight: typography.fontWeight.semibold, color: colors.gray[900] }}>
                {sub.email}
              </td>
              <td style={{ padding: spacing[4], color: colors.gray[500], fontSize: typography.fontSize.sm }}>
                {sub.subscribedAt}
              </td>
              <td style={{ padding: spacing[4] }}>
                <button
                  onClick={() => onDelete(sub.id, sub.email)}
                  aria-label={`Excluir assinante ${sub.email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[1],
                    padding: `${spacing[2]} ${spacing[3]}`,
                    border: `1px solid ${colors.gray[300]}`,
                    borderRadius: radius.md,
                    fontSize: typography.fontSize.sm,
                    color: colors.gray[700],
                    background: colors.white,
                    cursor: 'pointer',
                    fontWeight: typography.fontWeight.medium,
                  }}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}