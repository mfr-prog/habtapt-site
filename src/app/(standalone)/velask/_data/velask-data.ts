import { designSystem } from '@/components/design-system';

const c = designSystem.colors;

// --- Image arrays per unit ---

const makeImages = (folder: string, count: number) =>
  Array.from({ length: count }, (_, i) => ({
    src: `/images/velask/${folder}/${i + 1}.jpeg`,
    alt: `VELASK — ${folder.toUpperCase()} render ${i + 1}`,
  }));

export const t1Images = makeImages('t1', 13);
export const t2Images = makeImages('t2', 10);
export const t3Images = makeImages('t3', 17);
export const commonImages = makeImages('common', 9);

/** All images combined for the full gallery lightbox */
export const allImages = [...t2Images, ...t1Images, ...t3Images, ...commonImages];

/** Map unit id → images */
export const unitImages: Record<string, { src: string; alt: string }[]> = {
  rc: t1Images,
  p1: t2Images,
  p2: t3Images,
};

// --- Gallery items (curated selection with captions) ---

export const galleryItems = [
  { src: '/images/velask/t2/1.jpeg', alt: 'Cozinha integrada com bancada e zona de refeições', caption: 'Cozinha integrada' },
  { src: '/images/velask/t1/1.jpeg', alt: 'Sala com linhas limpas e soluções de arrumação', caption: 'Sala' },
  { src: '/images/velask/t3/1.jpeg', alt: 'Quarto com linguagem contemporânea e luz natural', caption: 'Quarto' },
  { src: '/images/velask/t3/2.jpeg', alt: 'Zona social com escada e arrumação integrada', caption: 'Zona social duplex' },
  { src: '/images/velask/t3/3.jpeg', alt: 'Piso superior duplex: espaço extra com múltiplos usos', caption: 'Piso superior duplex' },
  { src: '/images/velask/common/1.jpeg', alt: 'Casa de banho: revestimentos claros e móvel suspenso', caption: 'Casa de banho' },
  { src: '/images/velask/common/9.jpeg', alt: 'Exterior: jardim com zona de lazer e apoio', caption: 'Exterior' },
  { src: '/images/velask/t2/3.jpeg', alt: 'Sala de estar com acabamentos contemporâneos', caption: 'Sala T2' },
  { src: '/images/velask/t1/3.jpeg', alt: 'Interior luminoso com áreas abertas', caption: 'Interior T1' },
];

// --- Counters ---

export const counters = [
  { value: '3', suffix: '', label: 'Apartamentos' },
  { value: '353', suffix: 'm\u00B2', label: 'Área bruta total' },
  { value: '2026', suffix: '', label: 'Reabilitação completa' },
];

export const highlights = [
  { icon: '\uD83C\uDF3F', text: 'Jardins privados até 27,80 m\u00B2' },
  { icon: '\u2600\uFE0F', text: 'Exterior total (pátio + jardim) até 34,06 m\u00B2' },
  { icon: '\uD83D\uDE97', text: 'Garagem privativa (R/C)' },
  { icon: '\uD83C\uDFE0', text: 'Duplex com piso superior de 33,11 m\u00B2' },
];

export const benefits = [
  'Apenas 3 unidades: mais privacidade, menos ruído de "condomínio grande".',
  'Áreas exteriores reais (não "varandinhas").',
  'Tipologias complementares: dá para escolher por estilo de vida (não por "o que sobrou").',
];

export const interiorFeatures = [
  { title: 'Cozinha', desc: 'Linguagem contemporânea, bancada escura e integração com a sala.' },
  { title: 'Sala', desc: 'Possibilidade de separação visual com elementos envidraçados (conceito).' },
  { title: 'Quartos', desc: 'Ambientes simples com boa arrumação.' },
  { title: 'Casas de banho', desc: 'Revestimentos claros tipo pedra e móveis suspensos (conceito).' },
  { title: 'Duplex', desc: 'Escada com integração estética e área extra no piso superior (conceito).' },
];

export const units = [
  {
    id: 'rc',
    tab: 'Fracção A \u2014 T1',
    title: 'T1 Garden Garage',
    area: '118,44 m\u00B2',
    summary: 'Jardim amplo + garagem privativa: a solução "casa" dentro da cidade.',
    specs: [
      { label: 'Área bruta', value: '118,44 m\u00B2' },
      { label: 'Interior', value: '69,60 m\u00B2' },
      { label: 'Pátio', value: '6,26 m\u00B2' },
      { label: 'Jardim', value: '27,80 m\u00B2' },
      { label: 'Garagem', value: '14,78 m\u00B2' },
      { label: 'Casas de banho', value: '2' },
    ],
    copy: [
      'No rés-do-chão, o T1 foi desenhado para maximizar a ligação à zona exterior. A área social integra sala e cozinha e abre caminho para um exterior pensado para refeições e lazer.',
      'A garagem privativa é um diferencial raro na zona — e resolve o "assunto" do estacionamento logo à partida.',
    ],
    cta: 'Quero visitar este T1',
    color: c.brand.primary,
  },
  {
    id: 'p1',
    tab: 'Fracção B \u2014 T2',
    title: 'T2 Garden Annex',
    area: '106,78 m\u00B2',
    summary: 'Dois quartos, exterior completo e um anexo que dá flexibilidade (arrumos/office/…).',
    specs: [
      { label: 'Área bruta', value: '106,78 m\u00B2' },
      { label: 'Interior', value: '66,30 m\u00B2' },
      { label: 'Pátio', value: '6,26 m\u00B2' },
      { label: 'Varanda frente', value: '3,00 m\u00B2' },
      { label: 'Jardim', value: '23,85 m\u00B2' },
      { label: 'Anexo', value: '7,37 m\u00B2' },
      { label: 'Casas de banho', value: '2' },
    ],
    copy: [
      'O Piso 1 combina uma zona social aberta com dois quartos e circulação simples. O jardim funciona como extensão real da casa — para quem quer exterior, mas prefere mais privacidade do que o rés-do-chão.',
      'O anexo é a carta na manga: pode servir como arrumo, lavandaria organizada ou um pequeno escritório — aquilo que normalmente falta num T2.',
    ],
    cta: 'Quero visitar este T2',
    color: c.brand.secondary,
  },
  {
    id: 'p2',
    tab: 'Fracção C \u2014 T3 Duplex',
    title: 'T3 Duplex',
    area: '108,67 m\u00B2',
    summary: 'Duplex com piso extra: espaço para família + trabalho + lazer.',
    specs: [
      { label: 'Área bruta', value: '108,67 m\u00B2' },
      { label: 'Interior (piso base)', value: '66,30 m\u00B2' },
      { label: 'Varanda frente', value: '3,00 m\u00B2' },
      { label: 'Pátio', value: '6,26 m\u00B2' },
      { label: 'Piso superior', value: '33,11 m\u00B2' },
      { label: 'Casas de banho', value: '3' },
    ],
    copy: [
      'O duplex distribui a vida em dois níveis: no piso principal, zona social e quartos; no piso superior, uma área extra que pode virar sala íntima, escritório sério ou zona multiusos, com mais privacidade.',
      'Se queres um T3 mas não queres monotonia, esta é a unidade com personalidade: o piso superior muda completamente o jogo do espaço.',
    ],
    cta: 'Quero visitar este Duplex',
    color: '#0891b2',
  },
];

// --- Location accordion data ---

export const locationAccordion = [
  {
    icon: '\uD83D\uDE87',
    title: 'Transportes',
    items: [
      'Metro Estádio do Dragão (A, B, E, F) — 3 min a pé',
      'Campanhã (comboio intermodal) — 10 min a pé',
      'Aeroporto via metro linha E — 25 min',
      'Aeroporto de carro — 15 min',
    ],
  },
  {
    icon: '\uD83D\uDED2',
    title: 'Comércio',
    items: [
      'Alameda Shop & Spot (Continente, Fnac, 7 salas NOS) — 5 min a pé',
      'Comércio de bairro (café, farmácia, padaria) — no bairro',
    ],
  },
  {
    icon: '\uD83C\uDFE5',
    title: 'Saúde',
    items: [
      'Hospital CUF Porto — 10 min de carro',
      'Hospital São João — 15 min de carro',
    ],
  },
  {
    icon: '\uD83C\uDFEB',
    title: 'Ensino',
    items: [
      'Escolas em Campanhã e Bonfim — bairro',
      'ISEP — 15 min',
      'Universidade do Porto — 20 min',
    ],
  },
];

export const locationCards = [
  { num: '01', title: 'Transportes', desc: 'Metro Estádio do Dragão a 3 min a pé. Campanhã (comboio intermodal) a 10 min. Aeroporto via metro linha E em 25 min.' },
  { num: '02', title: 'Zona das Antas', desc: 'Uma envolvente residencial consolidada, com vida de bairro e acessos rápidos ao resto do Porto.' },
  { num: '03', title: 'Parque de S. Roque', desc: 'Perto do portão principal do Parque de S. Roque — opção verde para caminhar e desligar do ritmo da cidade.' },
  { num: '04', title: 'Serviços do dia a dia', desc: 'Alameda Shop & Spot a 5 min a pé. Comércio de bairro (café, farmácia, padaria) na envolvente.' },
  { num: '05', title: 'Mobilidade e acessos', desc: 'Localização prática para circular entre centro, zona oriental e principais vias.' },
];

export const pricingRows = [
  { unit: 'A', floor: 'R/C', type: 'T1', area: '118,44', price: '419.000', status: 'Disponível', typologyKey: 't1' },
  { unit: 'B', floor: 'Piso 1', type: 'T2', area: '106,78', price: '399.000', status: 'Disponível', typologyKey: 't2' },
  { unit: 'C', floor: 'Piso 2 (Duplex)', type: 'T3', area: '108,67', price: '449.000', status: 'Disponível', typologyKey: 't3' },
];

export const faqItems = [
  { q: 'As áreas exteriores são privativas?', a: 'Confirme na documentação da propriedade horizontal. Na brochura indicamos o detalhe por unidade.' },
  { q: 'O que inclui a "área bruta" de cada unidade?', a: 'Cada unidade integra componentes diferentes (ex.: garagem, anexo, duplex). Por isso mostramos a decomposição completa na brochura.' },
  { q: 'O piso superior do duplex conta como área habitacional?', a: 'Depende do licenciamento e do pé-direito/condições. Esclarecemos isso no processo (e deve estar refletido no CPCV).' },
  { q: 'Há garagem?', a: 'A unidade do R/C inclui garagem privativa.' },
  { q: 'Como posso agendar visita?', a: 'Clique em "Agendar visita" e indique o melhor dia/horário. Respondemos no próprio dia útil.' },
];
