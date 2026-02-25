import { designSystem } from '@/components/design-system';

const c = designSystem.colors;

// --- Image arrays per unit ---

const makeImages = (folder: string, count: number) =>
  Array.from({ length: count }, (_, i) => ({
    src: `/images/velask/${folder}/${i + 1}.jpeg`,
    alt: `VELASK Residence — ${folder.toUpperCase()} render ${i + 1}`,
  }));

export const t1Images = makeImages('t1', 13);
export const t2Images = makeImages('t2', 10);
export const t3Images = makeImages('t3', 17);
export const commonImages = makeImages('common', 9);

/** Map unit id → images */
export const unitImages: Record<string, { src: string; alt: string }[]> = {
  rc: t1Images,
  p1: t2Images,
  p2: t3Images,
};

// --- Gallery items (with images) ---

export const galleryItems = [
  { src: '/images/velask/t2/1.jpeg', alt: 'Cozinha integrada com bancada e zona de refeicoes' },
  { src: '/images/velask/t1/1.jpeg', alt: 'Sala com linhas limpas e solucoes de arrumacao' },
  { src: '/images/velask/t3/1.jpeg', alt: 'Quarto com linguagem contemporanea e luz natural' },
  { src: '/images/velask/t3/2.jpeg', alt: 'Zona social com escada e arrumacao integrada' },
  { src: '/images/velask/t3/3.jpeg', alt: 'Sotao: espaco extra com multiplos usos' },
  { src: '/images/velask/common/1.jpeg', alt: 'Casa de banho: revestimentos claros e movel suspenso' },
  { src: '/images/velask/common/9.jpeg', alt: 'Exterior: jardim com zona de lazer e apoio' },
];

// --- Counters, highlights, benefits, etc. (unchanged) ---

export const counters = [
  { value: '333,89', suffix: 'm\u00B2', label: 'Area bruta total (3 unidades)' },
  { value: '3', suffix: '', label: 'Pisos' },
  { value: '3', suffix: '', label: 'Apartamentos' },
];

export const highlights = [
  { icon: '\uD83C\uDF3F', text: 'Jardins privados ate 27,80 m\u00B2' },
  { icon: '\u2600\uFE0F', text: 'Exterior total (patio + jardim) ate 34,06 m\u00B2' },
  { icon: '\uD83D\uDE97', text: 'Garagem privativa (R/C)' },
  { icon: '\uD83C\uDFE0', text: 'Sotao 33,11 m\u00B2 (Duplex)' },
];

export const benefits = [
  'Apenas 3 unidades: mais privacidade, menos ruido de "condominio grande"',
  'Areas exteriores reais (nao "varandinhas")',
  'Tipologias complementares: da para escolher por estilo de vida (nao por "o que sobrou")',
];

export const interiorFeatures = [
  { title: 'Cozinha', desc: 'Linguagem contemporanea, bancada escura e integracao com a sala' },
  { title: 'Sala', desc: 'Possibilidade de separacao visual com elementos envidracados (conceito)' },
  { title: 'Quartos', desc: 'Ambientes simples com boa arrumacao' },
  { title: 'Casas de banho', desc: 'Revestimentos claros tipo pedra e moveis suspensos (conceito)' },
  { title: 'Duplex', desc: 'Escada com integracao estetica e area extra no piso superior (conceito)' },
];

export const units = [
  {
    id: 'rc',
    tab: 'R/C \u2014 T1',
    title: 'T1 Garden Garage',
    area: '118,44 m\u00B2',
    summary: 'Jardim amplo + garagem privativa: a solucao "casa" dentro da cidade.',
    specs: [
      { label: 'Area bruta', value: '118,44 m\u00B2' },
      { label: 'Interior', value: '69,60 m\u00B2' },
      { label: 'Patio', value: '6,26 m\u00B2' },
      { label: 'Jardim', value: '27,80 m\u00B2' },
      { label: 'Garagem', value: '14,78 m\u00B2' },
      { label: 'Casas de banho', value: '2' },
    ],
    copy: [
      'No res-do-chao, o T1 foi desenhado para maximizar a ligacao a zona exterior. A area social integra sala e cozinha e abre caminho para um exterior pensado para refeicoes e lazer.',
      'A garagem privativa e um diferencial raro na zona \u2014 e resolve o "assunto" do estacionamento logo a partida.',
    ],
    cta: 'Quero visitar este T1',
    color: c.brand.primary,
  },
  {
    id: 'p1',
    tab: 'Piso 1 \u2014 T2',
    title: 'T2 Garden Annex',
    area: '106,78 m\u00B2',
    summary: 'Dois quartos, exterior completo e um anexo que da flexibilidade (arrumos/office/...).',
    specs: [
      { label: 'Area bruta', value: '106,78 m\u00B2' },
      { label: 'Interior', value: '66,30 m\u00B2' },
      { label: 'Patio', value: '6,26 m\u00B2' },
      { label: 'Varanda frente', value: '3,00 m\u00B2' },
      { label: 'Jardim', value: '23,85 m\u00B2' },
      { label: 'Anexo', value: '7,37 m\u00B2' },
      { label: 'Casas de banho', value: '2' },
    ],
    copy: [
      'O Piso 1 combina uma zona social aberta com dois quartos e circulacao simples. O jardim funciona como extensao real da casa \u2014 para quem quer exterior, mas prefere mais privacidade do que o res-do-chao.',
      'O anexo e a carta na manga: pode servir como arrumo, lavandaria organizada ou um pequeno escritorio \u2014 aquilo que normalmente falta num T2.',
    ],
    cta: 'Quero visitar este T2',
    color: c.brand.secondary,
  },
  {
    id: 'p2',
    tab: 'Piso 2 \u2014 T3 Duplex',
    title: 'T3 Duplex Attic',
    area: '108,67 m\u00B2',
    summary: 'Duplex com piso extra no sotao: espaco para familia + trabalho + lazer.',
    specs: [
      { label: 'Area bruta', value: '108,67 m\u00B2' },
      { label: 'Interior (piso base)', value: '66,30 m\u00B2' },
      { label: 'Varanda frente', value: '3,00 m\u00B2' },
      { label: 'Patio', value: '6,26 m\u00B2' },
      { label: 'Sotao', value: '33,11 m\u00B2' },
      { label: 'Casas de banho', value: '3' },
    ],
    copy: [
      'O duplex distribui a vida em dois niveis: no piso principal, zona social e quartos; no piso superior, uma area extra que pode virar sala intima, escritorio serio ou zona multiusos, com mais privacidade.',
      'Se queres um T3 mas nao queres monotonia, esta e a unidade com personalidade: o sotao muda completamente o jogo do espaco.',
    ],
    cta: 'Quero visitar este Duplex',
    color: '#0891b2',
  },
];

export const locationCards = [
  { num: '01', title: 'Transportes', desc: 'Paragens de autocarro como S. Crispim e Monte Aventino a cerca de 5 minutos a pe e estacao de metro Combatentes a ~15 minutos a pe.' },
  { num: '02', title: 'Zona das Antas', desc: 'Uma envolvente residencial consolidada, com vida de bairro e acessos rapidos ao resto do Porto.' },
  { num: '03', title: 'Parque de S. Roque', desc: 'Perto do portao principal do Parque de S. Roque \u2014 opcao verde para caminhar e desligar do ritmo da cidade.' },
  { num: '04', title: 'Servicos do dia a dia', desc: 'Supermercados, escolas, farmacias, ginasios e restauracao a curta distancia \u2014 conveniencia sem depender do carro.' },
  { num: '05', title: 'Mobilidade e acessos', desc: 'Localizacao pratica para circular entre centro, zona oriental e principais vias.' },
];

export const pricingRows = [
  { unit: 'A', floor: 'R/C', type: 'T1', area: '118,44', price: '419.000', status: 'Disponivel', typologyKey: 't1' },
  { unit: 'B', floor: 'Piso 1', type: 'T2', area: '106,78', price: '399.000', status: 'Disponivel', typologyKey: 't2' },
  { unit: 'C', floor: 'Piso 2 (Duplex)', type: 'T3', area: '108,67', price: '449.000', status: 'Disponivel', typologyKey: 't3' },
];

export const faqItems = [
  { q: 'As areas exteriores sao privativas?', a: 'Confirme na documentacao da propriedade horizontal. Na brochura indicamos o detalhe por unidade.' },
  { q: 'O que inclui a "area bruta" de cada unidade?', a: 'Cada unidade integra componentes diferentes (ex.: garagem, anexo, sotao). Por isso mostramos a decomposicao completa na brochura.' },
  { q: 'O sotao do duplex conta como area habitacional?', a: 'Depende do licenciamento e do pe-direito/condicoes. Esclarecemos isso no processo (e deve estar refletido no CPCV).' },
  { q: 'Ha garagem?', a: 'A unidade do R/C inclui garagem privativa.' },
  { q: 'Como posso agendar visita?', a: 'Clique em "Agendar visita" e indique o melhor dia/horario. Respondemos no proprio dia util.' },
];
