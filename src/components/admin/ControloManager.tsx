'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Target, Calendar, BarChart3 } from '../icons';
import { toast } from 'sonner';
import { supabaseFetch } from '../../utils/supabase/client';
import { colors, spacing, radius, typography, shadows } from '../../utils/styles';
import { designSystem } from '../design-system';
import { SetupView } from './controlo/SetupView';
import { WeeklyLogView } from './controlo/WeeklyLogView';
import { KPIDashboard } from './controlo/KPIDashboard';
import { CompetitorsView } from './controlo/CompetitorsView';

// === Types ===
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

// Hardcoded projects list (extensible)
const PROJECTS = [
  { id: 'velask', label: 'Velask' },
];

type SubTab = 'setup' | 'weekly' | 'kpi' | 'competitors';

export function ControloManager() {
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const [subTab, setSubTab] = useState<SubTab>('setup');
  const [units, setUnits] = useState<ControloUnit[]>([]);
  const [targets, setTargets] = useState<ControloTargets | null>(null);
  const [reviews, setReviews] = useState<ControloReviewDate[]>([]);
  const [weeklyLogs, setWeeklyLogs] = useState<ControloWeeklyLog[]>([]);
  const [competitors, setCompetitors] = useState<ControloCompetitor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = useCallback(async () => {
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

  const subTabs: { id: SubTab; label: string; icon: React.ElementType }[] = [
    { id: 'setup', label: 'Setup', icon: Settings },
    { id: 'weekly', label: 'Registo Semanal', icon: Calendar },
    { id: 'kpi', label: 'KPIs', icon: Target },
    { id: 'competitors', label: 'Concorrência', icon: BarChart3 },
  ];

  return (
    <div>
      {/* Header: Project selector */}
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
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>

        {isLoading && (
          <span style={{ fontSize: typography.fontSize.xs, color: colors.gray[500] }}>
            A carregar...
          </span>
        )}
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
    </div>
  );
}
