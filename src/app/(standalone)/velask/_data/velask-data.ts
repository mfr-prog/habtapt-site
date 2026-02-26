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
  { value: '3', suffix: '', label: 'Apenas 3 unidades' },
  { value: '108–118', suffix: 'm²', label: 'Área bruta total' },
  { value: '3', suffix: 'min', label: 'Do metro · Campanhã' },
];

export const highlights = [
  { iconName: 'TreePine' as const, text: 'Jardins privados até 27,80 m²' },
  { iconName: 'Sun' as const, text: 'Exterior total (pátio + jardim) até 34,06 m²' },
  { iconName: 'Car' as const, text: 'Garagem privativa (R/C)' },
  { iconName: 'Layers' as const, text: 'Duplex com piso superior de 33,11 m²' },
];

export const benefits = [
  {
    iconName: 'Construction' as const,
    title: 'Reabilitação total',
    desc: 'Estrutura, instalações, acabamentos. 10 anos de garantia pelo construtor.',
  },
  {
    iconName: 'Key' as const,
    title: 'Entrega em 60 dias',
    desc: 'A estreiar em Abril de 2026. Condições de compra facilitadas.',
  },
  {
    iconName: 'ChefHat' as const,
    title: 'AC em todas as divisões + cozinha equipada',
    desc: 'Electrodomésticos incluídos. Sem mais gastos.',
  },
];

export const interiorFeatures = [
  { title: 'Cozinha', desc: 'Integrada com a sala, bancada em pedra escura e armários em carvalho. Luminosa e funcional, pensada para o dia-a-dia.' },
  { title: 'Sala', desc: 'Ampla e banhada por luz natural, com ripado em madeira a definir os ambientes. Um espaço fluido para viver e receber.' },
  { title: 'Suíte', desc: 'Parede em ripado de carvalho, pendentes de design e luz filtrada pelas cortinas. O refúgio mais elegante da casa.' },
  { title: 'Quartos', desc: 'Tranquilos e luminosos, com arrumação generosa e acabamentos cuidados em tons neutros e madeira.' },
  { title: 'Casas de banho', desc: 'Mármore branco, móvel suspenso em madeira e espelho circular. Materiais nobres com luz suave e envolvente.' },
  { title: 'Jardim privativo', desc: 'Relvado, deck em madeira e churrasqueira coberta com bancada. A extensão natural da casa ao ar livre.' },
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
      { label: 'Exterior', value: '33,11 m\u00B2' },
      { label: 'Anexo', value: '7,37 m\u00B2' },
      { label: 'Jardim', value: '23,85 m\u00B2' },
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
      'Alameda Shop & Spot (Continente, Fnac, Zara, cinema 7 salas NOS) — 5 min a pé',
      'Comércio de bairro (café, farmácia, padaria) — no bairro',
    ],
  },
  {
    icon: '\uD83C\uDFE5',
    title: 'Saúde',
    items: [
      'Hospital CUF Porto — 10 min de carro',
      'Hospital São João — 15 min de carro',
      'Farmácias no bairro',
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
  { num: '02', title: 'Zona de Campanhã', desc: 'Uma envolvente residencial consolidada, com vida de bairro e acessos rápidos ao resto do Porto.' },
  { num: '03', title: 'Parque de S. Roque', desc: 'Perto do portão principal do Parque de S. Roque — opção verde para caminhar e desligar do ritmo da cidade.' },
  { num: '04', title: 'Serviços do dia a dia', desc: 'Alameda Shop & Spot a 5 min a pé. Comércio de bairro (café, farmácia, padaria) na envolvente.' },
  { num: '05', title: 'Mobilidade e acessos', desc: 'Localização prática para circular entre centro, zona oriental e principais vias.' },
];

export const pricingRows = [
  { unit: 'A', floor: 'R/C', type: 'T1', area: '118,44', interior: '69,6', diferencial: 'Jardim + Garagem', price: '419.000', status: 'Disponível', typologyKey: 't1' },
  { unit: 'B', floor: 'Piso 1', type: 'T2', area: '106,78', interior: '66,3', diferencial: 'Jardim + Anexo', price: '399.000', status: 'Disponível', typologyKey: 't2' },
  { unit: 'C', floor: 'Piso 2 (Duplex)', type: 'T3', area: '108,67', interior: '66,3', diferencial: 'Duplex + Varanda', price: '449.000', status: 'Disponível', typologyKey: 't3' },
];

export const faqItems = [
  { q: 'Posso visitar o apartamento?', a: 'Sim. Agende uma visita através do formulário, WhatsApp ou email. Segunda a sexta, das 9h às 18h.' },
  { q: 'Os apartamentos têm cozinha equipada?', a: 'Sim. Todos os apartamentos são entregues com cozinha totalmente equipada.' },
  { q: 'Há possibilidade de financiamento bancário?', a: 'Sim. Os apartamentos são elegíveis para crédito habitação. Podemos encaminhá-lo para o nosso parceiro financeiro para uma simulação gratuita.' },
  { q: 'Qual a data de entrega?', a: 'A obra estará concluída em aproximadamente 60 dias. Contacte-nos para reservar já a sua fracção.' },
  { q: 'Qual a certificação energética?', a: 'A certificação energética está em processo de emissão. Disponível em breve.' },
  { q: 'Quem é a HABTA?', a: 'A HABTA é um grupo imobiliário de alta performance. O Velask é o nosso primeiro projecto de reabilitação em Porto — entregue com o mesmo rigor de processo que aplicamos a todos os nossos empreendimentos.' },
  { q: 'Posso fazer uma proposta diferente do preço?', a: 'Fale connosco. Analisamos cada situação individualmente.' },
];
