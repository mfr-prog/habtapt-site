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
  Plus,
  TrendingDown,
  BarChart3,
  Save,
  Edit,
  CheckCircle,
  AlertCircle,
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
import { AnimatedButton } from './primitives/AnimatedButton';
import { SkeletonDashboard, SkeletonTable } from './primitives/LoadingSkeleton';
import { colors, spacing, shadows, radius, typography } from '../utils/styles';
import { animations } from '../utils/animations';
import { designSystem } from './design-system';
import { LeadsPipeline } from './admin/LeadsPipeline';
import { ControloManager } from './admin/ControloManager';
import { UnitsManager } from './admin/UnitsManager';
import { FollowupsTab } from './admin/FollowupsTab';
import type { Project } from '@/types/project';

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
  leadNumber?: number;
  // Preferências do lead
  desiredLocations?: string[];
  maxBudget?: string;
  typology?: string;
  notes?: string;
}

type FollowupType = 'call' | 'email' | 'whatsapp' | 'meeting' | 'task';
type FollowupPriority = 'low' | 'medium' | 'high' | 'urgent';
type FollowupStatus = 'pending' | 'completed' | 'skipped' | 'cancelled';
type FollowupOutcome = 'answered' | 'no_answer' | 'voicemail' | 'interested' | 'not_interested' | 'meeting_booked' | 'sent' | 'replied' | 'rescheduled';

interface Followup {
  id: string;
  contactId: string;
  title: string;
  type: FollowupType;
  dueDate: string;
  dueTime?: string | null;
  priority: FollowupPriority;
  notes?: string;
  status: FollowupStatus;
  outcome?: FollowupOutcome | null;
  outcomeNotes?: string | null;
  completedAt?: string | null;
  createdAt: string;
  timestamp: number;
}

const FOLLOWUP_TYPES: { value: FollowupType; label: string }[] = [
  { value: 'call', label: 'Chamada' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'meeting', label: 'Reunião' },
  { value: 'task', label: 'Tarefa' },
];

const FOLLOWUP_PRIORITIES: { value: FollowupPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Baixa', color: '#6B7280' },
  { value: 'medium', label: 'Média', color: '#F59E0B' },
  { value: 'high', label: 'Alta', color: '#F97316' },
  { value: 'urgent', label: 'Urgente', color: '#EF4444' },
];

const FOLLOWUP_OUTCOMES: { value: FollowupOutcome; label: string }[] = [
  { value: 'answered', label: 'Atendeu' },
  { value: 'no_answer', label: 'Sem resposta' },
  { value: 'voicemail', label: 'Voicemail' },
  { value: 'interested', label: 'Interessado' },
  { value: 'not_interested', label: 'Sem interesse' },
  { value: 'meeting_booked', label: 'Reunião marcada' },
  { value: 'sent', label: 'Enviado' },
  { value: 'replied', label: 'Respondeu' },
  { value: 'rescheduled', label: 'Reagendado' },
];

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  timestamp: number;
}

// Project type is imported from @/types/project (see imports above)

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

// Contact Detail Modal
function ContactDetailModal({
  contact,
  onClose,
  onRefresh,
}: {
  contact: Contact;
  onClose: () => void;
  onRefresh?: () => void;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: contact.name || '',
    email: contact.email || '',
    phone: contact.phone || '',
    interest: contact.interest || '',
    notes: contact.notes || '',
    desiredLocations: (contact.desiredLocations || []).join(', '),
    maxBudget: contact.maxBudget || '',
    typology: contact.typology || '',
  });

  // Activity log
  const [activities, setActivities] = useState<{ id: string; date: string; channel: string; type: string; content: string; timestamp: number }[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [newActivity, setNewActivity] = useState({ date: new Date().toISOString().slice(0, 10), channel: '', type: '', content: '' });
  const CHANNELS = ['Telefone', 'Email', 'WhatsApp', 'Mensagem'];

  // Follow-ups state
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loadingFollowups, setLoadingFollowups] = useState(false);
  const [newFollowup, setNewFollowup] = useState({
    title: '',
    type: 'call' as FollowupType,
    dueDate: new Date().toISOString().slice(0, 10),
    dueTime: '',
    priority: 'medium' as FollowupPriority,
    notes: '',
  });
  const [completingFollowupId, setCompletingFollowupId] = useState<string | null>(null);
  const [completionText, setCompletionText] = useState('');

  const normalizeId = (id: string) => (id.startsWith('contact:') ? id.slice('contact:'.length) : id);

  const fetchFollowups = React.useCallback(async () => {
    setLoadingFollowups(true);
    try {
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizeId(contact.id))}/followups`, {}, 1, true);
      const data = await res.json();
      if (res.ok && data.followups) setFollowups(data.followups);
    } catch { setFollowups([]); }
    finally { setLoadingFollowups(false); }
  }, [contact.id]);

  useEffect(() => { fetchFollowups(); }, [fetchFollowups]);

  const handleAddFollowup = async () => {
    if (!newFollowup.title.trim() || !newFollowup.dueDate) { toast.error('Título e data são obrigatórios'); return; }
    try {
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizeId(contact.id))}/followups`, {
        method: 'POST',
        body: JSON.stringify({
          title: newFollowup.title.trim(),
          type: newFollowup.type,
          dueDate: newFollowup.dueDate,
          dueTime: newFollowup.dueTime || undefined,
          priority: newFollowup.priority,
          notes: newFollowup.notes.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('Erro ao criar follow-up');
      toast.success('Follow-up criado');
      setNewFollowup({ title: '', type: 'call', dueDate: new Date().toISOString().slice(0, 10), dueTime: '', priority: 'medium', notes: '' });
      fetchFollowups();
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Erro'); }
  };

  const TYPE_TO_CHANNEL: Record<FollowupType, string> = {
    call: 'Telefone',
    email: 'Email',
    whatsapp: 'WhatsApp',
    meeting: 'Telefone',
    task: 'Mensagem',
  };

  const handleCompleteFollowup = async (followupId: string) => {
    if (!completionText.trim()) { toast.error('Descreva o resultado'); return; }
    try {
      const contactId = normalizeId(contact.id);
      // 1. Complete follow-up
      const res = await supabaseFetch(`contacts/${encodeURIComponent(contactId)}/followups/${followupId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'completed', outcomeNotes: completionText.trim() }),
      });
      if (!res.ok) throw new Error('Erro ao concluir follow-up');

      // 2. Auto-create activity
      const fu = followups.find((f) => f.id === followupId);
      const channel = fu ? TYPE_TO_CHANNEL[fu.type] || 'Mensagem' : 'Mensagem';
      await supabaseFetch(`contacts/${encodeURIComponent(contactId)}/activities`, {
        method: 'POST',
        body: JSON.stringify({
          date: new Date().toISOString().slice(0, 10),
          channel,
          type: 'Follow-up',
          content: `FU: ${fu?.title || 'Follow-up'} — ${completionText.trim()}`,
        }),
      });

      toast.success('Follow-up concluído + atividade registada');
      setCompletingFollowupId(null);
      setCompletionText('');
      fetchFollowups();
      fetchActivities();
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Erro'); }
  };

  const handleDeleteFollowup = async (followupId: string) => {
    try {
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizeId(contact.id))}/followups/${followupId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao eliminar');
      toast.success('Follow-up eliminado');
      fetchFollowups();
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Erro'); }
  };

  const fetchActivities = React.useCallback(async () => {
    setLoadingActivities(true);
    try {
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizeId(contact.id))}/activities`, {}, 1, true);
      const data = await res.json();
      if (res.ok && data.activities) setActivities(data.activities);
    } catch { setActivities([]); }
    finally { setLoadingActivities(false); }
  }, [contact.id]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const handleAddActivity = async () => {
    if (!newActivity.channel || !newActivity.content.trim()) { toast.error('Canal e conteúdo são obrigatórios'); return; }
    try {
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizeId(contact.id))}/activities`, { method: 'POST', body: JSON.stringify(newActivity) });
      if (!res.ok) throw new Error('Erro ao criar atividade');
      toast.success('Atividade registada');
      setNewActivity({ date: new Date().toISOString().slice(0, 10), channel: '', type: '', content: '' });
      fetchActivities();
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Erro'); }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizeId(contact.id))}/activities/${activityId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao eliminar');
      toast.success('Atividade eliminada');
      fetchActivities();
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Erro'); }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        interest: form.interest.trim(),
        notes: form.notes.trim(),
        desiredLocations: form.desiredLocations.split(',').map(s => s.trim()).filter(Boolean),
        maxBudget: form.maxBudget.trim(),
        typology: form.typology.trim(),
      };
      const response = await supabaseFetch(`contacts/${encodeURIComponent(normalizeId(contact.id))}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || `Erro HTTP ${response.status}`);
      }
      toast.success('Contacto atualizado');
      setIsEditMode(false);
      onRefresh?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: spacing[3],
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: radius.md,
    fontSize: typography.fontSize.sm,
    outline: 'none',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block' as const,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[500],
    marginBottom: '4px',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[4],
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.white,
          borderRadius: radius.xl,
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: shadows.xl,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${spacing[5]} ${spacing[6]}`,
            borderBottom: `1px solid ${colors.gray[200]}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: radius.lg,
                background: designSystem.helpers.hexToRgba(colors.primary, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Mail size={22} style={{ color: colors.primary }} />
            </div>
            <div>
              <h3 style={{ fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.lg, color: colors.gray[900] }}>
                {isEditMode ? 'Editar Contacto' : contact.name}
              </h3>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[500] }}>
                {new Date(contact.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: spacing[2] }}>
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                aria-label="Editar contacto"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: radius.md,
                  border: 'none',
                  background: designSystem.helpers.hexToRgba(colors.primary, 0.1),
                  color: colors.primary,
                  cursor: 'pointer',
                }}
              >
                <Edit size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Fechar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: radius.md,
                border: 'none',
                background: colors.gray[100],
                color: colors.gray[600],
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: `${spacing[5]} ${spacing[6]}`, display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
          {isEditMode ? (
            <>
              <div>
                <label style={labelStyle}>Nome</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3] }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Telefone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Interesse</label>
                <input type="text" value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} style={inputStyle} />
              </div>

              {contact.message && (
                <div>
                  <label style={labelStyle}>Mensagem original</label>
                  <div style={{ padding: spacing[3], background: colors.gray[50], borderRadius: radius.md, border: `1px solid ${colors.gray[200]}`, fontSize: typography.fontSize.sm, color: colors.gray[600], maxHeight: '100px', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: typography.lineHeight.relaxed }}>
                    {contact.message}
                  </div>
                </div>
              )}

              <div style={{ borderTop: `1px solid ${colors.gray[200]}`, paddingTop: spacing[3] }}>
                <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.gray[500], textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: spacing[3] }}>
                  Preferências
                </div>
              </div>

              <div>
                <label style={labelStyle}>Localizações desejadas</label>
                <input type="text" value={form.desiredLocations} onChange={(e) => setForm({ ...form, desiredLocations: e.target.value })} placeholder="Ex: Lisboa, Cascais, Porto" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3] }}>
                <div>
                  <label style={labelStyle}>Valor máximo</label>
                  <input type="text" value={form.maxBudget} onChange={(e) => setForm({ ...form, maxBudget: e.target.value })} placeholder="Ex: €500.000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tipologia</label>
                  <input type="text" value={form.typology} onChange={(e) => setForm({ ...form, typology: e.target.value })} placeholder="Ex: T1, T2, T3" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Observações</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notas sobre o contacto" rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing[2], marginTop: spacing[2] }}>
                <button
                  onClick={() => setIsEditMode(false)}
                  style={{ padding: `${spacing[2]} ${spacing[4]}`, border: `1px solid ${colors.gray[300]}`, background: colors.white, color: colors.gray[700], borderRadius: radius.md, cursor: 'pointer', fontSize: typography.fontSize.sm }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing[1],
                    padding: `${spacing[2]} ${spacing[4]}`,
                    border: 'none',
                    background: colors.primary,
                    color: colors.white,
                    borderRadius: radius.md,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    fontWeight: typography.fontWeight.semibold,
                    fontSize: typography.fontSize.sm,
                    opacity: isSaving ? 0.6 : 1,
                  }}
                >
                  <Save size={16} />
                  {isSaving ? 'A salvar...' : 'Salvar'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                <Mail size={16} style={{ color: colors.gray[400], flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginBottom: '2px' }}>Email</p>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[900], fontWeight: typography.fontWeight.medium }}>{contact.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                <Phone size={16} style={{ color: colors.gray[400], flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginBottom: '2px' }}>Telefone</p>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[900], fontWeight: typography.fontWeight.medium }}>{contact.phone}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                <MessageSquare size={16} style={{ color: colors.gray[400], flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginBottom: '2px' }}>Interesse</p>
                  <span
                    style={{
                      display: 'inline-block',
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
                </div>
              </div>

              {contact.message && (
                <div>
                  <p style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginBottom: spacing[2] }}>Mensagem</p>
                  <div
                    style={{
                      padding: spacing[4],
                      background: colors.gray[50],
                      borderRadius: radius.lg,
                      border: `1px solid ${colors.gray[200]}`,
                      fontSize: typography.fontSize.sm,
                      color: colors.gray[700],
                      lineHeight: typography.lineHeight.relaxed,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {contact.message}
                  </div>
                </div>
              )}

              {/* Preferências (se existirem) */}
              {(contact.desiredLocations?.length || contact.maxBudget || contact.typology || contact.notes) && (
                <div style={{ borderTop: `1px solid ${colors.gray[200]}`, paddingTop: spacing[3] }}>
                  <p style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.gray[500], textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: spacing[3] }}>
                    Preferências
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
                    {contact.typology && (
                      <span style={{ padding: `${spacing[1]} ${spacing[2]}`, background: designSystem.helpers.hexToRgba(colors.primary, 0.08), color: colors.primary, borderRadius: radius.full, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold }}>
                        {contact.typology}
                      </span>
                    )}
                    {contact.maxBudget && (
                      <span style={{ padding: `${spacing[1]} ${spacing[2]}`, background: designSystem.helpers.hexToRgba(colors.success, 0.08), color: colors.success, borderRadius: radius.full, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold }}>
                        Máx: {contact.maxBudget}
                      </span>
                    )}
                    {(contact.desiredLocations || []).map((loc, i) => (
                      <span key={i} style={{ padding: `${spacing[1]} ${spacing[2]}`, background: colors.gray[100], color: colors.gray[700], borderRadius: radius.full, fontSize: typography.fontSize.xs }}>
                        {loc}
                      </span>
                    ))}
                  </div>
                  {contact.notes && (
                    <p style={{ marginTop: spacing[2], fontSize: typography.fontSize.sm, color: colors.gray[600], lineHeight: typography.lineHeight.relaxed }}>
                      {contact.notes}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* --- Registo de atividades (always visible) --- */}
          <div style={{ borderTop: `1px solid ${colors.gray[200]}`, marginTop: spacing[2], paddingTop: spacing[3] }}>
            <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.gray[500], textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: spacing[3] }}>
              Registo de atividades
            </div>

            {/* Nova atividade */}
            <div style={{ background: colors.gray[50], border: `1px solid ${colors.gray[200]}`, borderRadius: radius.md, padding: spacing[3], display: 'flex', flexDirection: 'column', gap: spacing[2], marginBottom: spacing[3] }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[2] }}>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Data</label>
                  <input type="date" value={newActivity.date} onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })} style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Canal</label>
                  <select value={newActivity.channel} onChange={(e) => setNewActivity({ ...newActivity, channel: e.target.value })} style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none', background: colors.white }}>
                    <option value="">— Selecionar —</option>
                    {CHANNELS.map((ch) => <option key={ch} value={ch}>{ch}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Tipo</label>
                <input type="text" value={newActivity.type} onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })} placeholder="Ex: Follow-up, Qualificação, Visita..." style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Resumo</label>
                <textarea value={newActivity.content} onChange={(e) => setNewActivity({ ...newActivity, content: e.target.value })} placeholder="Descreva a interação..." rows={2} style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleAddActivity} style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[1], padding: `${spacing[1]} ${spacing[3]}`, border: 'none', background: colors.primary, color: colors.white, borderRadius: radius.md, cursor: 'pointer', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
                  <UserPlus size={14} />
                  Adicionar
                </button>
              </div>
            </div>

            {/* Lista de atividades */}
            {loadingActivities ? (
              <div style={{ textAlign: 'center', color: colors.gray[400], fontSize: typography.fontSize.sm, padding: spacing[3] }}>A carregar...</div>
            ) : activities.length === 0 ? (
              <div style={{ textAlign: 'center', color: colors.gray[400], fontSize: typography.fontSize.sm, padding: spacing[3] }}>Nenhuma atividade registada</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                {activities.map((act) => (
                  <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[2], padding: spacing[2], border: `1px solid ${colors.gray[200]}`, borderRadius: radius.md, background: colors.white }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: '2px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: typography.fontSize.xs, color: colors.gray[500] }}>{act.date}</span>
                        <span style={{ padding: `1px ${spacing[2]}`, background: designSystem.helpers.hexToRgba(colors.primary, 0.1), color: colors.primary, borderRadius: radius.full, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold }}>{act.channel}</span>
                        {act.type && <span style={{ padding: `1px ${spacing[2]}`, background: designSystem.helpers.hexToRgba(colors.secondary, 0.1), color: colors.secondary, borderRadius: radius.full, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold }}>{act.type}</span>}
                      </div>
                      <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[700], lineHeight: typography.lineHeight.relaxed, whiteSpace: 'pre-wrap' }}>{act.content}</p>
                    </div>
                    <button type="button" onClick={() => handleDeleteActivity(act.id)} aria-label="Eliminar atividade" style={{ flexShrink: 0, border: 'none', background: 'none', color: colors.gray[400], cursor: 'pointer', padding: '2px' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- Follow-ups --- */}
          <div style={{ borderTop: `1px solid ${colors.gray[200]}`, marginTop: spacing[2], paddingTop: spacing[3] }}>
            <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.gray[500], textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: spacing[3] }}>
              Follow-ups
            </div>

            {/* Novo follow-up form */}
            <div style={{ background: colors.gray[50], border: `1px solid ${colors.gray[200]}`, borderRadius: radius.md, padding: spacing[3], display: 'flex', flexDirection: 'column', gap: spacing[2], marginBottom: spacing[3] }}>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Título</label>
                <input type="text" value={newFollowup.title} onChange={(e) => setNewFollowup({ ...newFollowup, title: e.target.value })} placeholder="Ex: Ligar para confirmar interesse" style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[2] }}>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Tipo</label>
                  <select value={newFollowup.type} onChange={(e) => setNewFollowup({ ...newFollowup, type: e.target.value as FollowupType })} style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none', background: colors.white }}>
                    {FOLLOWUP_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Prioridade</label>
                  <select value={newFollowup.priority} onChange={(e) => setNewFollowup({ ...newFollowup, priority: e.target.value as FollowupPriority })} style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none', background: colors.white }}>
                    {FOLLOWUP_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[2] }}>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Data</label>
                  <input type="date" value={newFollowup.dueDate} onChange={(e) => setNewFollowup({ ...newFollowup, dueDate: e.target.value })} style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Hora (opcional)</label>
                  <input type="time" value={newFollowup.dueTime} onChange={(e) => setNewFollowup({ ...newFollowup, dueTime: e.target.value })} style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleAddFollowup} style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[1], padding: `${spacing[1]} ${spacing[3]}`, border: 'none', background: colors.primary, color: colors.white, borderRadius: radius.md, cursor: 'pointer', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
                  <Plus size={14} />
                  Criar follow-up
                </button>
              </div>
            </div>

            {/* Lista de follow-ups */}
            {loadingFollowups ? (
              <div style={{ textAlign: 'center', color: colors.gray[400], fontSize: typography.fontSize.sm, padding: spacing[3] }}>A carregar...</div>
            ) : followups.length === 0 ? (
              <div style={{ textAlign: 'center', color: colors.gray[400], fontSize: typography.fontSize.sm, padding: spacing[3] }}>Nenhum follow-up registado</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                {followups.map((fu) => {
                  const today = new Date().toISOString().slice(0, 10);
                  const isOverdue = fu.status === 'pending' && fu.dueDate < today;
                  const isPending = fu.status === 'pending';
                  const priorityInfo = FOLLOWUP_PRIORITIES.find((p) => p.value === fu.priority);
                  const typeInfo = FOLLOWUP_TYPES.find((t) => t.value === fu.type);
                  return (
                    <div key={fu.id} style={{ display: 'flex', flexDirection: 'column', gap: spacing[1], padding: spacing[2], border: `1px solid ${isOverdue ? colors.error : colors.gray[200]}`, borderRadius: radius.md, background: isOverdue ? designSystem.helpers.hexToRgba(colors.error, 0.03) : colors.white }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[1] }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1], flex: 1, minWidth: 0 }}>
                          {fu.status === 'completed' ? (
                            <CheckCircle size={14} style={{ color: colors.success, flexShrink: 0 }} />
                          ) : isOverdue ? (
                            <AlertCircle size={14} style={{ color: colors.error, flexShrink: 0 }} />
                          ) : (
                            <Clock size={14} style={{ color: colors.warning, flexShrink: 0 }} />
                          )}
                          <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: fu.status === 'completed' ? colors.gray[400] : colors.gray[800], textDecoration: fu.status === 'completed' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {fu.title}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          {isPending && completingFollowupId !== fu.id && (
                            <button type="button" onClick={() => { setCompletingFollowupId(fu.id); setCompletionText(''); }} style={{ border: 'none', background: designSystem.helpers.hexToRgba(colors.success, 0.1), color: colors.success, borderRadius: radius.md, padding: '2px 6px', cursor: 'pointer', fontSize: '10px', fontWeight: typography.fontWeight.bold }}>
                              Concluir
                            </button>
                          )}
                          <button type="button" onClick={() => handleDeleteFollowup(fu.id)} aria-label="Eliminar follow-up" style={{ flexShrink: 0, border: 'none', background: 'none', color: colors.gray[400], cursor: 'pointer', padding: '2px' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1], flexWrap: 'wrap' }}>
                        <span style={{ padding: '1px 6px', background: designSystem.helpers.hexToRgba(colors.primary, 0.08), color: colors.primary, borderRadius: radius.full, fontSize: '10px', fontWeight: typography.fontWeight.semibold }}>{typeInfo?.label || fu.type}</span>
                        <span style={{ padding: '1px 6px', background: designSystem.helpers.hexToRgba(priorityInfo?.color || '#6B7280', 0.1), color: priorityInfo?.color || '#6B7280', borderRadius: radius.full, fontSize: '10px', fontWeight: typography.fontWeight.bold }}>{priorityInfo?.label || fu.priority}</span>
                        <span style={{ fontSize: '10px', color: isOverdue ? colors.error : colors.gray[500], fontWeight: isOverdue ? typography.fontWeight.bold : typography.fontWeight.medium }}>{fu.dueDate}{fu.dueTime ? ` ${fu.dueTime}` : ''}</span>
                        {fu.outcome && <span style={{ padding: '1px 6px', background: colors.gray[100], color: colors.gray[600], borderRadius: radius.full, fontSize: '10px' }}>{FOLLOWUP_OUTCOMES.find((o) => o.value === fu.outcome)?.label || fu.outcome}</span>}
                      </div>
                      {completingFollowupId === fu.id && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[1], marginTop: spacing[1], padding: spacing[2], background: colors.gray[50], borderRadius: radius.md }}>
                          <textarea
                            value={completionText}
                            onChange={(e) => setCompletionText(e.target.value)}
                            placeholder="Descreva o resultado..."
                            rows={2}
                            style={{ width: '100%', padding: spacing[1], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.xs, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                            autoFocus
                          />
                          <div style={{ display: 'flex', gap: spacing[1], justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => handleCompleteFollowup(fu.id)} style={{ border: 'none', background: colors.success, color: colors.white, borderRadius: radius.md, padding: `${spacing[1]} ${spacing[2]}`, cursor: 'pointer', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold }}>OK</button>
                            <button type="button" onClick={() => { setCompletingFollowupId(null); setCompletionText(''); }} style={{ border: 'none', background: 'none', color: colors.gray[400], cursor: 'pointer', padding: '2px' }}><X size={14} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Contacts View
function ContactsView({
  contacts,
  viewMode,
  selectedContact,
  onSelectContact,
  onRefresh,
}: {
  contacts: Contact[];
  viewMode: 'grid' | 'list';
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact | null) => void;
  onRefresh?: () => void;
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

  return (
    <>
      <AnimatePresence>
        {selectedContact && (
          <ContactDetailModal contact={selectedContact} onClose={() => onSelectContact(null)} onRefresh={onRefresh} />
        )}
      </AnimatePresence>

      {viewMode === 'grid' ? (
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
          {contacts.map((contact) => (
            <motion.div
              key={contact.id}
              variants={animations.fadeInUp}
              onClick={() => onSelectContact(contact)}
              style={{
                background: colors.white,
                border: `2px solid ${colors.gray[200]}`,
                borderRadius: radius.xl,
                padding: spacing[6],
                transition: 'all 0.2s',
                cursor: 'pointer',
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
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {contact.message}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: `0 ${spacing[2]}` }}>
            <caption className="sr-only">
              Lista de {contacts.length} contatos recebidos pelo formulário do site HABTA
            </caption>
            <thead>
              <tr>
                {['Nome', 'Email', 'Telefone', 'Interesse', 'Mensagem', 'Data'].map((header) => (
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
                  onClick={() => onSelectContact(contact)}
                  style={{
                    background: colors.white,
                    borderRadius: radius.lg,
                    cursor: 'pointer',
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
                  <td style={{ padding: spacing[4], color: colors.gray[500], fontSize: typography.fontSize.sm, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {contact.message || '—'}
                  </td>
                  <td style={{ padding: spacing[4], color: colors.gray[500], fontSize: typography.fontSize.sm }}>
                    {contact.createdAt}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
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