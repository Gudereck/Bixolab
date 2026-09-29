export const loja = {
  nome: 'Bixo Lab',
  slogan: 'Bixo hoje, lenda amanhã.',
  descricao:
    'Camisetas, moletons, bonés, canecas e acessórios universitários. Escolha a peça e peça pelo WhatsApp.',
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

export interface Categoria {
  slug: string;
  nome: string;
  descricao: string;
  /** Modelo usado na ilustração do card da categoria. */
  modelo: Modelo;
  cor: string;
}

export const categorias: Categoria[] = [
  {
    slug: 'camisetas',
    nome: 'Camisetas',
    descricao: 'Clássicas, oversized e regatas para o dia a dia no campus.',
    modelo: 'camiseta',
    cor: '#1d4a33',
  },
  {
    slug: 'moletons',
    nome: 'Moletons',
    descricao: 'Com ou sem capuz, para a aula das 7h e o rolê depois.',
    modelo: 'moletom',
    cor: '#2e3430',
  },
  {
    slug: 'bones',
    nome: 'Bonés',
    descricao: 'Dad hats bordados com o dino e outras artes da casa.',
    modelo: 'bone',
    cor: '#ede3cc',
  },
  {
    slug: 'canecas-e-copos',
    nome: 'Canecas & Copos',
    descricao: 'Para o café da madrugada de prova e para a festa da turma.',
    modelo: 'caneca',
    cor: '#f7f5ef',
  },
  {
    slug: 'acessorios',
    nome: 'Acessórios',
    descricao: 'Ecobags, adesivos e outros detalhes para levar a Bixo junto.',
    modelo: 'ecobag',
    cor: '#e9dfc8',
  },
];

export const categoriaPorSlug = (slug: string) => categorias.find((c) => c.slug === slug);
