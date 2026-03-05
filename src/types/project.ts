/**
 * Tipos centralizados para Project
 * Superset unificado de todas as definicoes encontradas no codebase.
 * Campos opcionais (?) sao aqueles que nao existem em todas as definicoes.
 */

export type ProjectStatus = 'analysis' | 'in-progress' | 'available' | 'sold';

export type ProjectStatusFilter = ProjectStatus | 'all';

export type InvestmentStrategy =
  | 'buy-hold'
  | 'fix-flip'
  | 'alojamento-local'
  | 'rent-to-rent'
  | 'desenvolvimento'
  | 'co-investimento';

export interface Project {
  id: string;
  title: string;
  location: string;
  status: string;
  strategy: string;
  image: string;
  roi: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  description?: string;
  highlights?: string[] | string;

  // Preco e financeiros
  price?: string;
  investment?: string;
  salePrice?: string | null;
  forSale?: boolean;

  // Labels
  statusLabel?: string;

  // Timeline
  duration?: string;
  timeline?: string | Array<{ phase: string; duration: string; status: string }>;
  timelinePhases?: string;
  year?: string;

  // Links
  portalLink?: string | null;
  brochureLink?: string | null;
  landingPage?: string | null;

  // Tipo e classificacao
  type?: string;

  // Financials (bloco calculado pelo hook useProjectFetch)
  financials?: {
    acquisition?: string;
    renovation?: string;
    total?: string;
    sale?: string;
    profit?: string;
    roi?: string;
  };

  // Investimento
  estimatedRent?: string;
  grossYield?: string;
  netYield?: string;
  appreciationEstimate?: string;
  propertyType?: 'moradia' | 'investimento' | 'ambos';

  // Moradia
  neighborhood?: string;
  finishes?: string[];
  nearbyAmenities?: string[];
  lifestyle?: string;

  // Geral
  typology?: string;
  deliveryDate?: string;

  // Metadata (admin)
  createdAt?: string;
  updatedAt?: string;
  timestamp?: number;
}
