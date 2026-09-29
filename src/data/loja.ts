export const loja = {
  nome: 'Bixo Lab',
  slogan: 'Bixo hoje, lenda amanhã.',
  descricao:
    'Camisetas e moletons de turma para Direito, Medicina, Engenharia e todos os cursos. Veja as peças e peça pelo WhatsApp.',
  desde: 2016,
  whatsapp: {
    numero: '5537991164812',
    exibicao: '(37) 99116-4812',
  },
  instagram: { usuario: '@bixolab', url: 'https://www.instagram.com/bixolab/' },
  email: 'contato@bixolab.com.br',
  endereco: {
    linha: 'Av. Antônio Neto, 2688',
    cidade: 'Divinópolis, MG',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Av.+Antonio+Neto,+2688,+Divin%C3%B3polis,+MG',
  },
  pedidosColetivos: 'https://forms.gle/UrhEj3qoyig9MP3t8',
} as const;

export type Modelo =
  | 'camiseta'
  | 'regata'
  | 'moletom'
  | 'moletom-careca'
  | 'bone'
  | 'caneca'
  | 'copo'
  | 'ecobag'
  | 'adesivos';

/** Nome do tipo de peça, para exibir no site. */
export const nomeModelo: Record<Modelo, string> = {
  camiseta: 'Camiseta',
  regata: 'Regata',
  moletom: 'Moletom',
  'moletom-careca': 'Moletom',
  bone: 'Boné',
  caneca: 'Caneca',
  copo: 'Copo',
  ecobag: 'Ecobag',
  adesivos: 'Adesivos',
};

export interface Curso {
  slug: string;
  nome: string;
  /** Texto curto que vai na estampa da ilustração do card. */
  estampa: string;
  cor: string;
  descricao: string;
}

/** Cursos com camisetas de turma. A ordem aqui é a ordem no site. */
export const cursos: Curso[] = [
  {
    slug: 'direito',
    nome: 'Direito',
    estampa: 'DIREITO',
    cor: '#7a1f2b',
    descricao: 'Camisetas e moletons de turma para quem vive entre códigos, júris e vade mecum.',
  },
  {
    slug: 'medicina',
    nome: 'Medicina',
    estampa: 'MEDICINA',
    cor: '#1f6e5a',
    descricao: 'Do primeiro ano ao internato: peças de turma para quem aguenta plantão.',
  },
  {
    slug: 'engenharia',
    nome: 'Engenharia',
    estampa: 'ENG',
    cor: '#1f3a68',
    descricao: 'Civil, mecânica, elétrica, produção: camisetas para calcular com estilo.',
  },
  {
    slug: 'psicologia',
    nome: 'Psicologia',
    estampa: 'PSICO',
    cor: '#4b3a78',
    descricao: 'Peças de turma para quem escuta, acolhe e ainda faz a melhor festa do campus.',
  },
  {
    slug: 'administracao',
    nome: 'Administração',
    estampa: 'ADM',
    cor: '#1d4a33',
    descricao: 'Camisetas de turma para quem já planeja a própria empresa desde o primeiro período.',
  },
  {
    slug: 'odontologia',
    nome: 'Odontologia',
    estampa: 'ODONTO',
    cor: '#6b2a5a',
    descricao: 'Peças de turma para o curso que tem o sorriso mais bonito da faculdade.',
  },
];

/** Peças que não são de um curso específico (bonés, canecas, acessórios…). */
export const colecaoBixo: Curso = {
  slug: 'colecao-bixo',
  nome: 'Coleção Bixo',
  estampa: 'BIXO',
  cor: '#e9b63b',
  descricao: 'Bonés, canecas, copos e acessórios com a cara da Bixo, para qualquer curso.',
};

/** Cursos + Coleção Bixo: tudo que pode ser filtrado no catálogo. */
export const colecoes: Curso[] = [...cursos, colecaoBixo];

export const colecaoPorSlug = (slug: string) => colecoes.find((c) => c.slug === slug);
