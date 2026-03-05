# Sistema de Badges - HABTA Portfolio

## Visão Geral
Sistema centralizado de badges para exibição de status e estratégias de investimento nos projetos do portfólio HABTA.

## Status Disponíveis

### 1. Em Andamento (in-progress)
- **Valor no DB**: `in-progress`
- **Label**: "Em Andamento"
- **Cor**: Laranja/Accent (#B8956A)
- **Uso**: Projetos em fase de reforma/reabilitação

### 2. Disponível (available)
- **Valor no DB**: `available`
- **Label**: "Disponível"
- **Cor**: Dourado/Secondary (#B8956A)
- **Uso**: Projetos disponíveis para venda/aluguel

### 3. Vendido (sold)
- **Valor no DB**: `sold`
- **Label**: "Vendido"
- **Cor**: Verde/Success
- **Uso**: Projetos já vendidos ou concluídos

**NOTA**: O status antigo "completed" foi removido. Todos os projetos marcados como "completed" são automaticamente convertidos para "sold" (Vendido) pelo sistema.

## Estratégias de Investimento

### 1. Fix & Flip (fix-flip)
- **Valor no DB**: `fix-flip`
- **Label**: "Fix & Flip"
- **Cor**: Dourado/Secondary (#B8956A)
- **Background**: 12% de opacidade
- **Uso**: Compra, reforma e revenda rápida

### 2. Buy & Hold (buy-hold)
- **Valor no DB**: `buy-hold`
- **Label**: "Buy & Hold"
- **Cor**: Azul Petróleo/Primary (#1A3E5C)
- **Background**: 12% de opacidade
- **Uso**: Compra para investimento de longo prazo

### 3. Alojamento Local (alojamento-local)
- **Valor no DB**: `alojamento-local`
- **Label**: "Alojamento Local"
- **Cor**: Accent (#B8956A)
- **Background**: 12% de opacidade
- **Uso**: Propriedades para aluguel de curta temporada

### 4. Rent-to-Rent (rent-to-rent)
- **Valor no DB**: `rent-to-rent`
- **Label**: "Rent-to-Rent"
- **Cor**: Roxo (#8b5cf6)
- **Background**: 12% de opacidade
- **Uso**: Subaluguel de propriedades

### 5. Desenvolvimento (desenvolvimento)
- **Valor no DB**: `desenvolvimento`
- **Label**: "Desenvolvimento"
- **Cor**: Ciano (#0891b2)
- **Background**: 12% de opacidade
- **Uso**: Projetos de desenvolvimento imobiliário

### 6. Co-Investimento (co-investimento)
- **Valor no DB**: `co-investimento`
- **Label**: "Co-Investimento"
- **Cor**: Vermelho (#e11d48)
- **Background**: 12% de opacidade
- **Uso**: Investimentos em parceria

## Implementação

### Componentes
- **StatusBadge**: `/components/primitives/Badge.tsx`
- **StrategyBadge**: `/components/primitives/Badge.tsx`

### Uso no Frontend
```tsx
import { StatusBadge, StrategyBadge } from '../components/primitives/Badge';

// Status Badge
<StatusBadge status={project.status} size="md" />

// Strategy Badge
<StrategyBadge strategy={project.strategy} size="md" />
```

### Edição no Painel Admin
O painel admin (`/components/admin/ProjectsManager.tsx`) permite:

1. **Selecionar Status**: Dropdown com todas as opções de status
   - Ao mudar o status, o `statusLabel` é atualizado automaticamente

2. **Selecionar Estratégia**: Dropdown com todas as estratégias disponíveis

3. **Editar Label do Status**: Campo customizável para alterar a exibição do status

## Layout na Página de Detalhes

### Desktop & Mobile
```
┌─────────────────────────────────────┐
│                                     │
│  [À Venda]     [DISPONÍVEL] [BUY&HOLD]│
│                                     │
│         IMAGEM DO PROJETO           │
│                                     │
└─────────────────────────────────────┘
```

- **Esquerda**: Badge "À Venda" (se `forSale = true`)
- **Direita**: Status + Estratégia

## Campos no Banco de Dados

```typescript
interface Project {
  status: 'in-progress' | 'available' | 'sold';
  statusLabel: string; // Ex: "Disponível", "Vendido", "Em Andamento"
  strategy: 'buy-hold' | 'fix-flip' | 'alojamento-local' | 'rent-to-rent' | 'desenvolvimento' | 'co-investimento';
  forSale: boolean; // Exibe badge "À Venda"
  salePrice: string | null; // Preço de venda
  portalLink: string | null; // Link para anúncio externo
  brochureLink: string | null; // Link para brochura PDF
}
```

## Mapeamento Automático
O sistema faz mapeamento automático de status antigos para os novos padrões:
- `analysis` → `in-progress` (Em Andamento)
- `renovation` → `in-progress` (Em Andamento)
- `completed` → `sold` (Vendido)

**IMPORTANTE**: A migração é automática e transparente. Quando qualquer projeto com status antigo é carregado, ele é automaticamente convertido e salvo com o novo status.

## Design System
Todas as cores vêm do design system centralizado:
- `/components/design-system.ts`
- Cores inline seguem o padrão do Guardião Universal
- Zero duplicação de componentes

## Checklist de Validação
- ✅ Badges visíveis em todas as páginas de portfólio
- ✅ Status e estratégia editáveis no painel admin
- ✅ Cores seguem paleta HABTA
- ✅ Responsivo mobile e desktop
- ✅ Animações suaves (Motion)
- ✅ Acessibilidade garantida
- ✅ Fallback para valores desconhecidos
