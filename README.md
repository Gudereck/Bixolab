# Bixo Lab — catálogo

Site-vitrine da Bixo Lab: as pessoas veem as peças e fazem o pedido pelo WhatsApp.
Feito com [Astro](https://astro.build) (site estático), CSS puro e [Three.js](https://threejs.org) no dino 3D da home.

## Rodando

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # checa tipos e gera o site em dist/
npm run preview  # serve o dist/ localmente
```

O `dist/` é HTML estático e pode ser publicado em qualquer hospedagem (Vercel, Netlify, Cloudflare Pages, GitHub Pages…).

## Páginas

| Rota | O que é |
| --- | --- |
| `/` | Vitrine: hero com o dino 3D, categorias, mais pedidos, como pedir, turmas, loja e dúvidas |
| `/catalogo` | Todas as peças |
| `/catalogo/<categoria>` | Peças de uma categoria |
| `/produto/<peça>` | Página da peça, com escolha de cor e tamanho e botão "Pedir no WhatsApp" |

## Cadastrando peças

Cada peça é um arquivo em `src/content/produtos/`. O nome do arquivo vira o link (`camiseta-classica-bixo.md` → `/produto/camiseta-classica-bixo`).

```md
---
nome: Camiseta Clássica Bixo
categoria: camisetas          # camisetas | moletons | bones | canecas-e-copos | acessorios
modelo: camiseta              # ilustração: camiseta | regata | moletom | moletom-careca | bone | caneca | copo | ecobag | adesivos
resumo: Frase curta que aparece no topo da página e na prévia do link.
preco: 79.9                   # opcional; sem preço, nada é exibido
cores:
  - { nome: Verde Bixo, hex: '#1d4a33' }
tamanhos: [P, M, G, GG]       # omita para "Único"
estampa: BIXO                 # texto da ilustração; use "dino" para o mascote
fotos: [./fotos/classica-1.jpg, ./fotos/classica-2.jpg]   # opcional; substitui a ilustração
detalhes: [Malha 100% algodão, Estampa em silk]           # opcional
destaque: true                # aparece em "Mais pedidos" na home
novidade: true                # selo "Novidade"
disponivel: false             # mostra "Esgotado"
ordem: 1                      # ordem no catálogo
---
Texto livre da peça (aparece abaixo do botão de pedido).
```

As fotos ficam ao lado dos arquivos (por exemplo `src/content/produtos/fotos/`) e são otimizadas automaticamente no build.
Enquanto uma peça não tem foto, o site desenha uma ilustração dela na cor escolhida.

Categorias, WhatsApp, endereço, Instagram e o link do formulário de pedidos coletivos ficam em `src/data/loja.ts`.

## Estrutura

```
src/
  content/produtos/   peças (Markdown)
  data/loja.ts        dados da loja e categorias
  components/         Header, Footer, cards, ilustrações (ProductMockup), Dino3D
  scripts/dino-cena.ts  cena Three.js do dino (carregada sob demanda)
  pages/              rotas
  styles/global.css   tokens de cor, tipografia e utilitários
```
