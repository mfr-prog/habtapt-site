'use client';

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Users, Eye, BarChart3 } from '../../icons';
import { colors, spacing, radius, typography } from '../../../utils/styles';
import { designSystem } from '../../design-system';
import { MetricCard } from '../MetricCard';
import { supabaseFetch } from '../../../utils/supabase/client';
import type { ControloUnit, ControloTargets, KPIStatus } from '../ControloManager';

interface KPIDashboardProps {
  projectId: string;
  units: ControloUnit[];
  targets: ControloTargets | null;
}

interface AutoKPIs {
  totalLeads14d: number;
  qualifiedLeads14d: number;
  visits14d: number;
  proposals30d: number;
  bestOffer: number;
  leadsByStage: Record<string, number>;
  leadToVisitRate: number;
  visitToProposalRate: number;
  status: string;
  totalContacts: number;
  perUnit: {
    unitId: string;
    unitCode: string;
    askPrice: number;
    totalLeads14d: number;
    qualifiedLeads14d: number;
    visits14d: number;
    proposals30d: number;
    bestOffer: number;
    gapVsAsk: number;
    leadToVisitRate: number;
    visitToProposalRate: number;
    status: string;
  }[];
}

const thStyle: React.CSSProperties = {
  padding: `${spacing[2]} ${spacing[3]}`, textAlign: 'left',
  fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold,
  color: colors.gray[500], textTransform: 'uppercase', letterSpacing: typography.letterSpacing.wide,
  borderBottom: `1px solid ${colors.gray[200]}`, whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: `${spacing[2]} ${spacing[3]}`, fontSize: typography.fontSize.sm,
  color: colors.gray[800], borderBottom: `1px solid ${colors.gray[100]}`,
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  MANTER: { label: 'MANTER', color: colors.success, bg: designSystem.helpers.hexToRgba(colors.success, 0.1) },
  VIGIAR: { label: 'VIGIAR', color: colors.warning, bg: designSystem.helpers.hexToRgba(colors.warning, 0.1) },
  REDUZIR: { label: 'REDUZIR', color: colors.error, bg: designSystem.helpers.hexToRgba(colors.error, 0.1) },
  SEM_DADOS: { label: 'SEM DADOS', color: colors.gray[500], bg: colors.gray[100] },
};

const STAGE_LABELS: Record<string, string> = {
  novo: 'Novo Lead',
  contato: 'Contato Inicial',
  qualificado: 'Qualificado',
  visita: 'Visita Agendada',
  proposta: 'Proposta Enviada',
  negociacao: 'Negociação',
  ganho: 'Fechado • Ganho',
  perdido: 'Fechado • Perdido',
};

const STAGE_COLORS: Record<string, string> = {
  novo: colors.gray[400],
  contato: colors.primary,
  qualificado: colors.secondary,
  visita: colors.warning,
  proposta: colors.info,
  negociacao: colors.warning,
  ganho: colors.success,
  perdido: colors.error,
};

export function KPIDashboard({ projectId, units, targets }: KPIDashboardProps) {
  const [kpis, setKpis] = useState<AutoKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    setIsLoading(true);
    (async () => {
      try {
        const res = await supabaseFetch(`controlo/auto-kpis?projectId=${projectId}`, {}, 1, true);
        const data = await res.json();
        if (res.ok && data.kpis) {
          setKpis(data.kpis);
        }
      } catch {
        console.error('Erro ao carregar auto-kpis');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [projectId]);

  const formatCurrency = (v: number) =>
    v > 0 ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v) : '—';

  if (isLoading) {
    return (
      <p style={{ color: colors.gray[500], fontSize: typography.fontSize.sm, padding: spacing[4] }}>
        A carregar KPIs do pipeline...
      </p>
    );
  }

  if (!kpis || kpis.totalContacts === 0) {
    return (
      <div style={{ padding: spacing[4], textAlign: 'center' }}>
        <p style={{ color: colors.gray[500], fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
          Nenhum lead associado a este projeto.
        </p>
        <p style={{ color: colors.gray[400], fontSize: typography.fontSize.xs }}>
          Associe leads a este projeto no tab Leads (editar lead → seleccionar Projeto).
        </p>
      </div>
    );
  }

  const sc = statusConfig[kpis.status] || statusConfig.SEM_DADOS;

  // Funnel data (ordered stages, excluding perdido)
  const funnelStages = ['novo', 'contato', 'qualificado', 'visita', 'proposta', 'negociacao', 'ganho'];
  const maxStageCount = Math.max(1, ...funnelStages.map((s) => kpis.leadsByStage[s] || 0));

  return (
    <div>
      {/* Global status badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[4] }}>
        <span style={{
          display: 'inline-block',
          padding: `${spacing[1]} ${spacing[3]}`,
          borderRadius: radius.md,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.bold,
          background: sc.bg,
          color: sc.color,
        }}>
          {sc.label}
        </span>
        <span style={{ fontSize: typography.fontSize.sm, color: colors.gray[500] }}>
          {kpis.totalContacts} leads no pipeline
        </span>
      </div>

      {/* Summary cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: spacing[4],
        marginBottom: spacing[6],
      }}>
        <MetricCard title="Leads Qualificados (14d)" value={kpis.qualifiedLeads14d} icon={Users} color="primary" />
        <MetricCard title="Visitas (14d)" value={kpis.visits14d} icon={Eye} color="secondary" />
        <MetricCard title="Propostas (30d)" value={kpis.proposals30d} icon={Target} color="success" />
        <MetricCard title="Melhor Oferta" value={kpis.bestOffer > 0 ? formatCurrency(kpis.bestOffer) : '—'} icon={TrendingUp} color="warning" />
      </div>

      {/* Conversion rates */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing[4],
        marginBottom: spacing[6],
      }}>
        <div style={{
          padding: spacing[4],
          background: colors.white,
          border: `1px solid ${colors.gray[200]}`,
          borderRadius: radius.lg,
        }}>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginBottom: spacing[1], textTransform: 'uppercase', fontWeight: typography.fontWeight.semibold }}>
            Lead → Visita
          </div>
          <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.primary }}>
            {kpis.leadToVisitRate}%
          </div>
        </div>
        <div style={{
          padding: spacing[4],
          background: colors.white,
          border: `1px solid ${colors.gray[200]}`,
          borderRadius: radius.lg,
        }}>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginBottom: spacing[1], textTransform: 'uppercase', fontWeight: typography.fontWeight.semibold }}>
            Visita → Proposta
          </div>
          <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.secondary }}>
            {kpis.visitToProposalRate}%
          </div>
        </div>
      </div>

      {!targets && (
        <div style={{
          padding: spacing[3],
          marginBottom: spacing[4],
          background: designSystem.helpers.hexToRgba(colors.warning, 0.1),
          borderRadius: radius.md,
          fontSize: typography.fontSize.sm,
          color: colors.warning,
          fontWeight: typography.fontWeight.semibold,
        }}>
          Defina metas no Setup para ver o status correto dos KPIs.
        </div>
      )}

      {/* Pipeline Funnel */}
      <div style={{ marginBottom: spacing[6] }}>
        <h4 style={{
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.bold,
          color: colors.gray[700],
          marginBottom: spacing[3],
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
        }}>
          <BarChart3 size={16} />
          Funil do Pipeline
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
          {funnelStages.map((stage) => {
            const count = kpis.leadsByStage[stage] || 0;
            const width = maxStageCount > 0 ? Math.max(4, (count / maxStageCount) * 100) : 4;
            const stageColor = STAGE_COLORS[stage] || colors.gray[400];
            return (
              <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                <div style={{
                  width: 120,
                  fontSize: typography.fontSize.xs,
                  color: colors.gray[600],
                  fontWeight: typography.fontWeight.medium,
                  flexShrink: 0,
                  textAlign: 'right',
                }}>
                  {STAGE_LABELS[stage] || stage}
                </div>
                <div style={{ flex: 1, position: 'relative', height: 24 }}>
                  <div style={{
                    width: `${width}%`,
                    height: '100%',
                    background: designSystem.helpers.hexToRgba(stageColor, 0.2),
                    borderRadius: radius.sm,
                    position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: spacing[2],
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.bold,
                      color: stageColor,
                    }}>
                      {count}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Perdido separately */}
          {(kpis.leadsByStage.perdido || 0) > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginTop: spacing[1], opacity: 0.6 }}>
              <div style={{ width: 120, fontSize: typography.fontSize.xs, color: colors.gray[500], textAlign: 'right' }}>
                Perdido
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.error, fontWeight: typography.fontWeight.bold }}>
                {kpis.leadsByStage.perdido}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Per-unit KPI Table */}
      {kpis.perUnit.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <h4 style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.bold,
            color: colors.gray[700],
            marginBottom: spacing[3],
          }}>
            KPIs por Unidade
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Unidade</th>
                <th style={thStyle}>Preço ASK</th>
                <th style={thStyle}>Leads 14d</th>
                <th style={thStyle}>Visitas 14d</th>
                <th style={thStyle}>Propostas 30d</th>
                <th style={thStyle}>Lead→Visita</th>
                <th style={thStyle}>Visita→Proposta</th>
                <th style={thStyle}>Melhor Oferta</th>
                <th style={thStyle}>Gap vs ASK</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {kpis.perUnit.map((kpi) => {
                const usc = statusConfig[kpi.status] || statusConfig.SEM_DADOS;
                return (
                  <tr key={kpi.unitId}>
                    <td style={{ ...tdStyle, fontWeight: typography.fontWeight.bold }}>{kpi.unitCode}</td>
                    <td style={tdStyle}>{formatCurrency(kpi.askPrice)}</td>
                    <td style={tdStyle}>{kpi.qualifiedLeads14d}</td>
                    <td style={tdStyle}>{kpi.visits14d}</td>
                    <td style={tdStyle}>{kpi.proposals30d}</td>
                    <td style={tdStyle}>{kpi.leadToVisitRate}%</td>
                    <td style={tdStyle}>{kpi.visitToProposalRate}%</td>
                    <td style={tdStyle}>{formatCurrency(kpi.bestOffer)}</td>
                    <td style={{
                      ...tdStyle,
                      color: kpi.gapVsAsk >= 0 ? colors.success : colors.error,
                      fontWeight: typography.fontWeight.semibold,
                    }}>
                      {kpi.gapVsAsk !== 0 ? `${kpi.gapVsAsk > 0 ? '+' : ''}${kpi.gapVsAsk}%` : '—'}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-block',
                        padding: `${spacing[1]} ${spacing[2]}`,
                        borderRadius: radius.md,
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.bold,
                        background: usc.bg,
                        color: usc.color,
                      }}>
                        {usc.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
