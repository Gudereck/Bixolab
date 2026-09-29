import { getCollection, type CollectionEntry } from 'astro:content';

export type Produto = CollectionEntry<'produtos'>;

export async function listarProdutos() {
  const produtos = await getCollection('produtos');
  return produtos.sort((a, b) => a.data.ordem - b.data.ordem || a.data.nome.localeCompare(b.data.nome));
}

export const formatarPreco = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
