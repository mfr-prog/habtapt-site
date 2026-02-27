'use client';

import React, { useMemo } from 'react';
import { Target, TrendingUp, TrendingDown, Users, Eye } from '../../icons';
import { colors, spacing, radius, typography } from '../../../utils/styles';
import { designSystem } from '../../design-system';
import { MetricCard } from '../MetricCard';
import type { ControloUnit, ControloTargets, ControloWeeklyLog, ControloKPI, KPIStatus } from '../ControloManager';

interface KPIDashboardProps {
  units: ControloUnit[];
  targets: ControloTargets | null;
  weeklyLogs: ControloWeeklyLog[];
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

function computeKPIs(
  units: ControloUnit[],
  targets: ControloTargets | null,
  logs: ControloWeeklyLog[]
): ControloKPI[] {
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return units.map((unit) => {
    const unitLogs = logs.filter((l) => l.unitId === unit.id);

    // Last 14 days
    const logs14d = unitLogs.filter((l) => new Date(l.weekStart) >= fourteenDaysAgo);
    const qualifiedLeads14d = logs14d.reduce((sum, l) => sum + (l.qualifiedLeads || 0), 0);
    const visits14d = logs14d.reduce((sum, l) => sum + (l.visitsDone || 0), 0);
    const totalLeads14d = logs14d.reduce((sum, l) => sum + (l.totalLeads || 0), 0);

    // Last 30 days
    const logs30d = unitLogs.filter((l) => new Date(l.weekStart) >= thirtyDaysAgo);
    const proposals30d = logs30d.reduce((sum, l) => sum + (l.proposalsCount || 0), 0);

    // Conversions
    const leadToVisitRate = totalLeads14d > 0 ? (visits14d / totalLeads14d) * 100 : 0;
    const visitToProposalRate = visits14d > 0 ? (proposals30d / visits14d) * 100 : 0;

    // Best offer
    const bestOffer = unitLogs.length > 0
      ? Math.max(...unitLogs.map((l) => l.bestProposal || 0))
      : 0;

    // Gap vs ASK
    const gapVsAsk = unit.askPrice > 0 && bestOffer > 0
      ? ((bestOffer - unit.askPrice) / unit.askPrice) * 100
      : 0;

    // Status based on targets
    let status: KPIStatus = 'SEM_DADOS';
    if (unitLogs.length > 0 && targets) {
      let metCount = 0;
      if (qualifiedLeads14d >= (targets.qualifiedLeads14d || 0)) metCount++;
      if (visits14d >= (targets.visits14d || 0)) metCount++;
      if (proposals30d >= (targets.proposals30d || 0)) metCount++;

      if (metCount === 3) status = 'MANTER';
      else if (metCount >= 1) status = 'VIGIAR';
      else status = 'REDUZIR';
    } else if (unitLogs.length > 0 && !targets) {
      status = 'VIGIAR';
    }

    return {
      unitId: unit.id,
      unitCode: unit.code,
      askPrice: unit.askPrice,
      qualifiedLeads14d,
      visits14d,
      proposals30d,
      leadToVisitRate: Math.round(leadToVisitRate * 10) / 10,
      visitToProposalRate: Math.round(visitToProposalRate * 10) / 10,
      bestOffer,
      gapVsAsk: Math.round(gapVsAsk * 10) / 10,
      status,
    };
  });
}

const statusConfig: Record<KPIStatus, { label: string; color: string; bg: string }> = {
  MANTER: { label: 'MANTER', color: colors.success, bg: designSystem.helpers.hexToRgba(colors.success, 0.1) },
  VIGIAR: { label: 'VIGIAR', color: colors.warning, bg: designSystem.helpers.hexToRgba(colors.warning, 0.1) },
  REDUZIR: { label: 'REDUZIR', color: colors.error, bg: designSystem.helpers.hexToRgba(colors.error, 0.1) },
  SEM_DADOS: { label: 'SEM DADOS', color: colors.gray[500], bg: colors.gray[100] },
};

export function KPIDashboard({ units, targets, weeklyLogs }: KPIDashboardProps) {
  const kpis = useMemo(() => computeKPIs(units, targets, weeklyLogs), [units, targets, weeklyLogs]);

  const formatCurrency = (v: number) =>
    v > 0 ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v) : '—';

  // Summary metrics
  const totalLeads = kpis.reduce((s, k) => s + k.qualifiedLeads14d, 0);
  const totalVisits = kpis.reduce((s, k) => s + k.visits14d, 0);
  const totalProposals = kpis.reduce((s, k) => s + k.proposals30d, 0);
  const bestOverallOffer = kpis.length > 0 ? Math.max(...kpis.map((k) => k.bestOffer)) : 0;

  if (units.length === 0) {
    return (
      <p style={{ color: colors.gray[500], fontSize: typography.fontSize.sm, padding: spacing[4] }}>
        Adicione unidades no Setup para ver os KPIs.
      </p>
    );
  }

  return (
    <div>
      {/* Summary cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: spacing[4],
        marginBottom: spacing[6],
      }}>
        <MetricCard title="Leads Qualificados (14d)" value={totalLeads} icon={Users} color="primary" />
        <MetricCard title="Visitas (14d)" value={totalVisits} icon={Eye} color="secondary" />
        <MetricCard title="Propostas (30d)" value={totalProposals} icon={Target} color="success" />
        <MetricCard title="Melhor Oferta" value={bestOverallOffer > 0 ? formatCurrency(bestOverallOffer) : '—'} icon={TrendingUp} color="warning" />
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

      {/* KPI Table */}
      <div style={{ overflowX: 'auto' }}>
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
            {kpis.map((kpi) => {
              const sc = statusConfig[kpi.status];
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
                      background: sc.bg,
                      color: sc.color,
                    }}>
                      {sc.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
