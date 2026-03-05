'use client';

// AdminPanel v2.6 - 100% Conformidade Guardião Universal
import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  Mail,
  MessageSquare,
  Users,
  Inbox,
  RefreshCw,
  Search,
  Download,
  TrendingUp,
  Clock,
  LayoutGrid,
  LayoutList,
  Building2,
  BookOpen,
  UserPlus,
  TrendingDown,
  BarChart3,
  Home,
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
import { SkeletonDashboard, SkeletonTable } from './primitives/LoadingSkeleton';
import { colors, spacing, radius, typography } from '../utils/styles';
import { designSystem } from './design-system';
import { LeadsPipeline } from './admin/LeadsPipeline';
import { ControloManager } from './admin/ControloManager';
import { UnitsManager } from './admin/UnitsManager';
import { FollowupsTab } from './admin/FollowupsTab';
import { ContactsView } from './admin/ContactsView';
import { SubscribersView } from './admin/SubscribersView';
import type { Project } from '@/types/project';
import type { Contact, Followup, Subscriber, Insight } from './admin/types';
import { logError } from '../utils/error-logger';

export function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'contacts' | 'leads' | 'followups' | 'subscribers' | 'projects' | 'units' | 'insights' | 'testimonials' | 'controlo'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [unitsCount, setUnitsCount] = useState(0);
  const [pendingFollowups, setPendingFollowups] = useState<Followup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedInterest, setSelectedInterest] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactStatus, setContactStatus] = useState<{ [key: string]: 'pending' | 'attended' }>({});

  const pendingFollowupsCount = pendingFollowups.length;

  const overdueCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return pendingFollowups.filter((f) => f.dueDate < today).length;
  }, [pendingFollowups]);

  const urgentFollowups = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return [...pendingFollowups]
      .sort((a, b) => {
        const aOverdue = a.dueDate < today ? 0 : a.dueDate === today ? 1 : 2;
        const bOverdue = b.dueDate < today ? 0 : b.dueDate === today ? 1 : 2;
        if (aOverdue !== bOverdue) return aOverdue - bOverdue;
        return a.dueDate.localeCompare(b.dueDate);
      })
      .slice(0, 5);
  }, [pendingFollowups]);

  // Browser tab badge
  useEffect(() => {
    document.title = overdueCount > 0 ? `(${overdueCount}) HABTA Admin` : 'HABTA Admin';
    return () => { document.title = 'HABTA Admin'; };
  }, [overdueCount]);

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

  const fetchUnitsCount = async () => {
    try {
      const response = await supabaseFetch('units', { method: 'GET' }, 1, true);
      if (response.ok) {
        const data = await response.json();
        setUnitsCount(data.count || 0);
      }
    } catch {
      // Silently fail - count stays at 0
    }
  };

  const fetchPendingFollowups = async () => {
    try {
      const response = await supabaseFetch('followups/pending', {}, 1, true);
      if (response.ok) {
        const data = await response.json();
        setPendingFollowups(data.followups || []);
      }
    } catch {
      // Silently fail
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchSubscribers();
    fetchProjects();
    fetchInsights();
    fetchTestimonialsCount();
    fetchUnitsCount();
    fetchPendingFollowups();
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
        logError(data.error || 'Erro na resposta', { component: 'AdminPanel', action: 'deleteSubscriber', metadata: { data } });
        toast.error(data.error || 'Erro ao excluir assinante');
      }
    } catch (error) {
      logError(error, { component: 'AdminPanel', action: 'deleteSubscriber' });
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
      color: subscriberGrowth >= 0 ? 'success' as const : 'warning' as const,
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
      <AdminLayout notificationCount={pendingFollowupsCount} urgentFollowups={urgentFollowups} contacts={contacts} onNotificationClick={() => setActiveTab('followups')}>
        <SkeletonDashboard />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout notificationCount={pendingFollowupsCount} urgentFollowups={urgentFollowups} contacts={contacts} onNotificationClick={() => setActiveTab('followups')}>
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
        {/* Clean Tabs with ARIA - Segmented Control */}
        <div
          role="tablist"
          aria-label="Seleção de dados administrativos"
          style={{
            display: 'flex',
            overflowX: 'auto',
            flexWrap: 'nowrap',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            padding: '2px',
            gap: '2px',
            background: colors.gray[50],
            borderRadius: radius.lg,
            margin: spacing[3],
            borderBottom: `1px solid ${colors.gray[200]}`,
            alignItems: 'center',
          }}
        >
          {[
            { id: 'contacts' as const, label: 'Contatos', icon: Mail, count: contacts.length },
            { id: 'leads' as const, label: 'Leads', icon: Users, count: contacts.length },
            { id: 'followups' as const, label: 'Follow-ups', icon: Clock, count: pendingFollowupsCount },
            { id: 'subscribers' as const, label: 'Newsletter', icon: Inbox, count: subscribers.length },
            { id: 'projects' as const, label: 'Projetos', icon: Building2, count: projects.length },
            { id: 'units' as const, label: 'Unidades', icon: Home, count: unitsCount },
            { id: 'insights' as const, label: 'Insights', icon: BookOpen, count: insights.length },
            { id: 'testimonials' as const, label: 'Depoimentos', icon: MessageSquare, count: testimonialsCount },
            { id: 'controlo' as const, label: 'Controlo', icon: BarChart3, count: 0 },
          ].flatMap((tab, index) => {
            const tabElement = (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing[2],
                  padding: `${spacing[2]} ${spacing[4]}`,
                  background: activeTab === tab.id
                    ? designSystem.helpers.hexToRgba(colors.primary, 0.08)
                    : 'transparent',
                  border: 'none',
                  borderRadius: radius.md,
                  color: activeTab === tab.id ? colors.primary : colors.gray[500],
                  fontWeight: activeTab === tab.id ? typography.fontWeight.bold : typography.fontWeight.medium,
                  fontSize: typography.fontSize.sm,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
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
            );

            // Add dividers after Follow-ups (index 2) and Depoimentos (index 7)
            if (index === 2 || index === 7) {
              return [
                tabElement,
                <div
                  key={`divider-${index}`}
                  aria-hidden="true"
                  style={{
                    width: '1px',
                    height: '24px',
                    background: colors.gray[200],
                    flexShrink: 0,
                    margin: '0 4px',
                  }}
                />,
              ];
            }

            return [tabElement];
          })}
        </div>

        {/* Compact Toolbar - Only for contacts and subscribers */}
        {activeTab !== 'projects' && activeTab !== 'units' && activeTab !== 'insights' && activeTab !== 'testimonials' && activeTab !== 'leads' && activeTab !== 'controlo' && activeTab !== 'followups' && (
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
          style={{ padding: (activeTab === 'projects' || activeTab === 'units' || activeTab === 'insights' || activeTab === 'testimonials' || activeTab === 'controlo' || activeTab === 'followups') ? spacing[6] : spacing[4] }}
        >
          {isLoading ? (
            <SkeletonTable rows={5} />
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'contacts' ? (
                <ContactsView contacts={filteredContacts} viewMode={viewMode} selectedContact={selectedContact} onSelectContact={setSelectedContact} onRefresh={fetchContacts} />
              ) : activeTab === 'leads' ? (
                <LeadsPipeline contacts={contacts} onRefresh={fetchContacts} />
              ) : activeTab === 'followups' ? (
                <FollowupsTab contacts={contacts} onRefresh={() => { fetchContacts(); fetchPendingFollowups(); }} />
              ) : activeTab === 'subscribers' ? (
                <SubscribersView
                  subscribers={filteredSubscribers}
                  viewMode={viewMode}
                  onDelete={handleDeleteSubscriber}
                />
              ) : activeTab === 'projects' ? (
                <ProjectsManager projects={projects} onRefresh={fetchProjects} isLoading={isLoading} />
              ) : activeTab === 'units' ? (
                <UnitsManager onRefresh={fetchUnitsCount} />
              ) : activeTab === 'insights' ? (
                <InsightsManager insights={insights} onRefresh={fetchInsights} isLoading={isLoading} />
              ) : activeTab === 'testimonials' ? (
                <TestimonialsManager onRefresh={fetchTestimonialsCount} />
              ) : (
                <ControloManager />
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
