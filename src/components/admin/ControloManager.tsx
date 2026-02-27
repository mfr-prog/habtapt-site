'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Target, Calendar, BarChart3, Plus, Trash2, X } from '../icons';
import { toast } from 'sonner';
import { supabaseFetch } from '../../utils/supabase/client';
import { colors, spacing, radius, typography, shadows } from '../../utils/styles';
import { designSystem } from '../design-system';
import { SetupView } from './controlo/SetupView';
import { WeeklyLogView } from './controlo/WeeklyLogView';
import { KPIDashboard } from './controlo/KPIDashboard';
import { CompetitorsView } from './controlo/CompetitorsView';

// === Types ===
export interface ControloProject {
  id: string;
  label: string;
  timestamp: number;
}

export interface ControloUnit {
  id: string;
  projectId: string;
  code: string;
  floor: string;
  typology: string;
  areaGross: number;
  areaInterior: number;
  areaExterior: number;
  areaExtras: number;
  salesNotes: string;
  askPrice: number;
  minimumPrice: number;
  adjustmentStep: number;
  pricingNotes: string;
  timestamp: number;
}

export interface ControloTargets {
  id: string;
  projectId: string;
  qualifiedLeads14d: number;
  visits14d: number;
  proposals30d: number;
  timestamp: number;
}

export interface ControloReviewDate {
  id: string;
  projectId: string;
  date: string;
  type: 'weekly' | 'decision' | 'milestone';
  label: string;
  notes: string;
  timestamp: number;
}

export interface ControloWeeklyLog {
  id: string;
  projectId: string;
  unitId: string;
  weekStart: string;
  weekEnd: string;
  askPrice: number;
  totalLeads: number;
  qualifiedLeads: number;
  contacts: number;
  visitRequests: number;
  visitsDone: number;
  proposalsCount: number;
  bestProposal: number;
  avgProposals: number;
  mainObjection: string;
  decisionNextStep: string;
  timestamp: number;
}

export interface ControloCompetitor {
  id: string;
  projectId: string;
  date: string;
  portal: string;
  development: string;
  address: string;
  typology: string;
  area: number;
  price: number;
  pricePerM2: number;
  hasGarage: boolean;
  hasExterior: boolean;
  daysOnMarket: number;
  url: string;
  notes: string;
  timestamp: number;
}

export type KPIStatus = 'MANTER' | 'VIGIAR' | 'REDUZIR' | 'SEM_DADOS';

export interface ControloKPI {
  unitId: string;
  unitCode: string;
  askPrice: number;
  qualifiedLeads14d: number;
  visits14d: number;
  proposals30d: number;
  leadToVisitRate: number;
  visitToProposalRate: number;
  bestOffer: number;
  gapVsAsk: number;
  status: KPIStatus;
}

type SubTab = 'setup' | 'weekly' | 'kpi' | 'competitors';

export function ControloManager() {
  const [projects, setProjects] = useState<ControloProject[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [subTab, setSubTab] = useState<SubTab>('setup');
  const [units, setUnits] = useState<ControloUnit[]>([]);
  const [targets, setTargets] = useState<ControloTargets | null>(null);
  const [reviews, setReviews] = useState<ControloReviewDate[]>([]);
  const [weeklyLogs, setWeeklyLogs] = useState<ControloWeeklyLog[]>([]);
  const [competitors, setCompetitors] = useState<ControloCompetitor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New project modal state
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectId, setNewProjectId] = useState('');
  const [newProjectLabel, setNewProjectLabel] = useState('');
  const [isSavingProject, setIsSavingProject] = useState(false);

  // Fetch controlo projects list
  const fetchProjects = useCallback(async () => {
    try {
      const res = await supabaseFetch('controlo/projects', {}, 1, true);
      const data = await res.json();
      if (res.ok && data.projects) {
        setProjects(data.projects);
        // Auto-select first project if none selected
        if (!projectId && data.projects.length > 0) {
          setProjectId(data.projects[0].id);
        }
      }
    } catch {
      console.error('Erro ao carregar projetos de controlo');
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const fetchAll = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const [unitsRes, targetsRes, reviewsRes, logsRes, compsRes] = await Promise.all([
        supabaseFetch(`controlo/units?projectId=${projectId}`, {}, 1, true),
        supabaseFetch(`controlo/targets?projectId=${projectId}`, {}, 1, true),
        supabaseFetch(`controlo/reviews?projectId=${projectId}`, {}, 1, true),
        supabaseFetch(`controlo/weeklylogs?projectId=${projectId}`, {}, 1, true),
        supabaseFetch(`controlo/competitors?projectId=${projectId}`, {}, 1, true),
      ]);

      const [unitsData, targetsData, reviewsData, logsData, compsData] = await Promise.all([
        unitsRes.json(),
        targetsRes.json(),
        reviewsRes.json(),
        logsRes.json(),
        compsRes.json(),
      ]);

      if (unitsRes.ok) setUnits(unitsData.units || []);
      if (targetsRes.ok) setTargets(targetsData.targets || null);
      if (reviewsRes.ok) setReviews(reviewsData.reviews || []);
      if (logsRes.ok) setWeeklyLogs(logsData.weeklylogs || []);
      if (compsRes.ok) setCompetitors(compsData.competitors || []);
    } catch {
      toast.error('Erro ao carregar dados de controlo');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreateProject = async () => {
    const slug = newProjectId.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const label = newProjectLabel.trim();
    if (!slug || !label) {
      toast.error('ID e nome são obrigatórios');
      return;
    }
    setIsSavingProject(true);
    try {
      const res = await supabaseFetch('controlo/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: slug, label }),
      }, 1, true);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao criar projeto');
        return;
      }
      toast.success(`Projeto "${label}" criado`);
      setShowNewProject(false);
      setNewProjectId('');
      setNewProjectLabel('');
      await fetchProjects();
      setProjectId(slug);
    } catch {
      toast.error('Erro ao criar projeto');
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Tem a certeza que deseja eliminar este projeto de controlo?')) return;
    try {
      const res = await supabaseFetch(`controlo/projects/${id}`, { method: 'DELETE' }, 1, true);
      if (!res.ok) {
        toast.error('Erro ao eliminar projeto');
        return;
      }
      toast.success('Projeto eliminado');
      const remaining = projects.filter((p) => p.id !== id);
      setProjects(remaining);
      if (projectId === id) {
        setProjectId(remaining.length > 0 ? remaining[0].id : '');
      }
    } catch {
      toast.error('Erro ao eliminar projeto');
    }
  };

  const subTabs: { id: SubTab; label: string; icon: React.ElementType }[] = [
    { id: 'setup', label: 'Setup', icon: Settings },
    { id: 'weekly', label: 'Registo Semanal', icon: Calendar },
    { id: 'kpi', label: 'KPIs', icon: Target },
    { id: 'competitors', label: 'Concorrência', icon: BarChart3 },
  ];

  // Empty state: no projects yet
  if (projects.length === 0 && !isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[8],
        gap: spacing[4],
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: colors.gray[100],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <BarChart3 size={28} color={colors.gray[400]} />
        </div>
        <h3 style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.gray[700],
          margin: 0,
        }}>
          Nenhum projeto de controlo
        </h3>
        <p style={{
          fontSize: typography.fontSize.sm,
          color: colors.gray[500],
          textAlign: 'center',
          margin: 0,
          maxWidth: 360,
        }}>
          Crie um projeto para começar a monitorizar unidades, registos semanais e KPIs.
        </p>

        {!showNewProject ? (
          <button
            onClick={() => setShowNewProject(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              padding: `${spacing[3]} ${spacing[5]}`,
              background: colors.primary,
              color: colors.white,
              border: 'none',
              borderRadius: radius.md,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            Novo Projeto
          </button>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[3],
            padding: spacing[5],
            background: colors.white,
            border: `1px solid ${colors.gray[200]}`,
            borderRadius: radius.lg,
            boxShadow: shadows.sm,
            width: '100%',
            maxWidth: 400,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: typography.fontWeight.semibold, fontSize: typography.fontSize.sm }}>
                Novo Projeto
              </span>
              <button onClick={() => setShowNewProject(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={16} color={colors.gray[500]} />
              </button>
            </div>
            <input
              placeholder="ID / slug (ex: velask)"
              value={newProjectId}
              onChange={(e) => setNewProjectId(e.target.value)}
              style={{
                padding: `${spacing[2]} ${spacing[3]}`,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: radius.md,
                fontSize: typography.fontSize.sm,
              }}
            />
            <input
              placeholder="Nome (ex: Velask)"
              value={newProjectLabel}
              onChange={(e) => setNewProjectLabel(e.target.value)}
              style={{
                padding: `${spacing[2]} ${spacing[3]}`,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: radius.md,
                fontSize: typography.fontSize.sm,
              }}
            />
            <button
              onClick={handleCreateProject}
              disabled={isSavingProject}
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                background: colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: radius.md,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                cursor: isSavingProject ? 'not-allowed' : 'pointer',
                opacity: isSavingProject ? 0.6 : 1,
              }}
            >
              {isSavingProject ? 'A criar...' : 'Criar Projeto'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Header: Project selector + New Project */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[4],
        flexWrap: 'wrap',
        gap: spacing[3],
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          <label
            htmlFor="project-select"
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[700],
            }}
          >
            Projeto:
          </label>
          <select
            id="project-select"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              borderRadius: radius.md,
              border: `1px solid ${colors.gray[300]}`,
              fontSize: typography.fontSize.sm,
              color: colors.gray[900],
              background: colors.white,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>

          <button
            onClick={() => handleDeleteProject(projectId)}
            title="Eliminar projeto selecionado"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              background: 'transparent',
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: radius.md,
              cursor: 'pointer',
              color: colors.gray[500],
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          {isLoading && (
            <span style={{ fontSize: typography.fontSize.xs, color: colors.gray[500] }}>
              A carregar...
            </span>
          )}

          {!showNewProject ? (
            <button
              onClick={() => setShowNewProject(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2]} ${spacing[3]}`,
                background: colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: radius.md,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
                cursor: 'pointer',
              }}
            >
              <Plus size={14} />
              Novo Projeto
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              padding: `${spacing[2]} ${spacing[3]}`,
              background: colors.white,
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: radius.md,
            }}>
              <input
                placeholder="ID (slug)"
                value={newProjectId}
                onChange={(e) => setNewProjectId(e.target.value)}
                style={{
                  width: 100,
                  padding: `${spacing[1]} ${spacing[2]}`,
                  border: `1px solid ${colors.gray[200]}`,
                  borderRadius: radius.sm,
                  fontSize: typography.fontSize.xs,
                }}
              />
              <input
                placeholder="Nome"
                value={newProjectLabel}
                onChange={(e) => setNewProjectLabel(e.target.value)}
                style={{
                  width: 120,
                  padding: `${spacing[1]} ${spacing[2]}`,
                  border: `1px solid ${colors.gray[200]}`,
                  borderRadius: radius.sm,
                  fontSize: typography.fontSize.xs,
                }}
              />
              <button
                onClick={handleCreateProject}
                disabled={isSavingProject}
                style={{
                  padding: `${spacing[1]} ${spacing[2]}`,
                  background: colors.primary,
                  color: colors.white,
                  border: 'none',
                  borderRadius: radius.sm,
                  fontSize: typography.fontSize.xs,
                  cursor: isSavingProject ? 'not-allowed' : 'pointer',
                  opacity: isSavingProject ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {isSavingProject ? '...' : 'Criar'}
              </button>
              <button
                onClick={() => { setShowNewProject(false); setNewProjectId(''); setNewProjectLabel(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
              >
                <X size={14} color={colors.gray[500]} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-tabs */}
      <div
        role="tablist"
        aria-label="Sub-secções do controlo"
        style={{
          display: 'flex',
          borderBottom: `1px solid ${colors.gray[200]}`,
          marginBottom: spacing[5],
          gap: spacing[1],
        }}
      >
        {subTabs.map((tab) => {
          const isActive = subTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[3]} ${spacing[4]}`,
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? `2px solid ${colors.primary}` : '2px solid transparent',
                color: isActive ? colors.primary : colors.gray[600],
                fontWeight: isActive ? typography.fontWeight.bold : typography.fontWeight.medium,
                fontSize: typography.fontSize.sm,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab content */}
      {projectId && (
        <>
          {subTab === 'setup' && (
            <SetupView
              projectId={projectId}
              units={units}
              targets={targets}
              reviews={reviews}
              onRefresh={fetchAll}
            />
          )}
          {subTab === 'weekly' && (
            <WeeklyLogView
              projectId={projectId}
              units={units}
              weeklyLogs={weeklyLogs}
              onRefresh={fetchAll}
            />
          )}
          {subTab === 'kpi' && (
            <KPIDashboard
              units={units}
              targets={targets}
              weeklyLogs={weeklyLogs}
            />
          )}
          {subTab === 'competitors' && (
            <CompetitorsView
              projectId={projectId}
              competitors={competitors}
              onRefresh={fetchAll}
            />
          )}
        </>
      )}
    </div>
  );
}
