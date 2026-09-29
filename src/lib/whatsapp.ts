import { loja } from '../data/loja';

/** Link do WhatsApp da loja com a mensagem já preenchida. */
export function linkWhatsApp(mensagem = 'Oi, Bixo Lab! Vim pelo site e queria fazer um pedido.') {
  return `https://wa.me/${loja.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
}

export function mensagemPedido(opcoes: {
  nome: string;
  cor?: string;
  tamanho?: string;
  url?: string;
}) {
  const linhas = [`Oi, Bixo Lab! Quero pedir: *${opcoes.nome}*`];
  if (opcoes.cor) linhas.push(`Cor: ${opcoes.cor}`);
  if (opcoes.tamanho && opcoes.tamanho !== 'Único') linhas.push(`Tamanho: ${opcoes.tamanho}`);
  if (opcoes.url) linhas.push(opcoes.url);
  return linhas.join('\n');
}
