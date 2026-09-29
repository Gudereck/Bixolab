import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categorias } from './data/loja';

const slugsCategorias = categorias.map((c) => c.slug) as [string, ...string[]];

const produtos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/produtos' }),
  schema: ({ image }) =>
    z.object({
      nome: z.string(),
      categoria: z.enum(slugsCategorias),
      /** Ilustração usada enquanto a peça não tem fotos. */
      modelo: z.enum([
        'camiseta',
        'regata',
        'moletom',
        'moletom-careca',
        'bone',
        'caneca',
        'copo',
        'ecobag',
        'adesivos',
      ]),
      resumo: z.string(),
      /** Preço em reais. Deixe em branco para não exibir. */
      preco: z.number().positive().optional(),
      cores: z
        .array(z.object({ nome: z.string(), hex: z.string().regex(/^#[0-9a-fA-F]{6}$/) }))
        .min(1),
      tamanhos: z.array(z.string()).default(['Único']),
      /** Texto estampado na ilustração. Use "dino" para desenhar o mascote. */
      estampa: z.string().default('BIXO'),
      /** Fotos reais da peça (a primeira vira a capa). Substituem a ilustração. */
      fotos: z.array(image()).default([]),
      detalhes: z.array(z.string()).default([]),
      destaque: z.boolean().default(false),
      novidade: z.boolean().default(false),
      disponivel: z.boolean().default(true),
      ordem: z.number().default(100),
    }),
});

export const collections = { produtos };
