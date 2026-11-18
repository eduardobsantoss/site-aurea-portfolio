# Portfólio da Aurea

Site institucional e portfólio da Aurea, marca de criação de sites para negócios locais de Uberaba (MG), em várias páginas. Objetivo: mostrar os trabalhos e levar o visitante a chamar no WhatsApp. Publicado no GitHub Pages (`https://eduardobsantoss.github.io/site-aurea-portfolio/`) por `.github/workflows/pages.yml` a cada push na `main`; depois vai para a Vercel ou domínio próprio.

## Stack

- Astro 7, sem framework de UI. CSS puro em `src/styles/global.css` e nos `<style>` dos componentes.
- Poppins via `@fontsource/poppins` (400, 500, 600 e 500 itálico).
- Lenis para scroll suave.
- `npm run dev` (porta 4321), `npm run build`. Exige Node 22.23.4 ou mais novo.

## Mapa do projeto

| O quê | Arquivo |
|---|---|
| Textos, menu, serviços, projetos, FAQ, contatos | `src/data/site.ts` |
| Tokens, grão, grade de projetos, cabeçalhos de seção e de página | `src/styles/global.css` |
| Navbar e menu do celular, chamada de contato, rodapé, cursor, Lenis, animações de entrada, play das capas | `src/layouts/Base.astro` |
| Capa de projeto (vídeo com pôster) e cartão de projeto | `src/components/Capa.astro`, `Projeto.astro` |
| Logo e monograma (SVG inline, `currentColor`) | `src/components/Logo.astro`, `Monograma.astro` |
| Prefixo do `base` nos links internos | `src/lib/rota.ts` |

Páginas:

| Rota | Arquivo | Conteúdo |
|---|---|---|
| `/` | `src/pages/index.astro` | Hero, projeto em destaque (o primeiro de `projetos`), painel da marca, demais projetos, lista de serviços |
| `/projetos` | `src/pages/projetos/index.astro` | Todos os projetos |
| `/projetos/<slug>` | `src/pages/projetos/[slug].astro` | Capa, ficha, texto sobre o cliente, segunda imagem, próximo projeto |
| `/servicos` | `src/pages/servicos.astro` | Serviços (cartões empilhados no desktop), diferenciais, dúvidas (`#duvidas`) |
| `/contato` | `src/pages/contato.astro` | Botão do WhatsApp e lista de canais |

Há também `src/pages/404.astro`.

Vídeos das capas: só o cartão largo (`toca="sozinho"`) toca ao entrar na tela; os demais tocam com mouse ou foco em cima (em tela de toque, ao entrar na tela). O botão fixo `.pausa-videos` para e retoma todos. As capas ficam acima da granulação geral (`z-index` 41 contra 40); a navbar fica em 50.

Toda página termina com a chamada de contato e o rodapé de `Base.astro` (a de contato usa `semChamada`). Não há página "Sobre": falta conteúdo real para ela.

Capas dos projetos: vídeo em `public/projetos/<slug>.mp4`, pôster em `src/assets/projetos/<slug>.jpg` e segunda imagem opcional em `<slug>-2.jpg`. Para regravar ou incluir um projeto, acrescente o site na lista de `scripts/gravar-capas.mjs` e rode `node scripts/gravar-capas.mjs <pasta-temporária> . <slug>` e depois `node scripts/gerar-imagens-capas.mjs <pasta-temporária> .` (usa o Edge instalado, sem dependências). O site da Realium não aceita rolagem por script; a capa dele mostra só o topo.

## Caminhos internos

No GitHub Pages o site fica em `/site-aurea-portfolio/`, não na raiz. Todo link ou arquivo interno passa por `rota('/caminho')` (de `src/lib/rota.ts`); nunca escrever `href="/..."` direto. O workflow passa `SITE_URL` e `BASE_PATH` para o `astro.config.mjs`; sem essas variáveis o build sai na raiz, como antes. Para testar localmente como no Pages: `BASE_PATH=/site-aurea-portfolio npm run build && npm run preview`.

## Identidade (não inventar fora disto)

Paleta oficial, já em variáveis CSS:

| Variável | Hex | Uso |
|---|---|---|
| `--purpura` | `#3E00F9` | Cor principal: seções de destaque, CTA |
| `--violeta` | `#5758FF` | Apoio: cartões, gradientes |
| `--lima` | `#DDF500` | Destaque: grifos, botões, cursor |
| `--piche` | `#0F0F0F` | Texto e fundo escuro |
| `--chumbo` | `#262626` | Cartões sobre escuro |
| `--branco` | `#FFFFFF` | Fundo claro |

- Lima nunca como texto sobre branco (sem contraste). Funciona sobre piche e púrpura.
- Fonte única: Poppins. Hierarquia só por tamanho e peso.
- Linguagem da marca: gradiente granulado de púrpura para lima, palavras-chave grifadas em lima e itálico, tudo em minúsculas no logo.
- Frases da marca: "sua ideia. nosso código. seu futuro." (hero atual), "Criando o futuro hoje", "Não criamos qualquer tecnologia. Criamos soluções que transformam o seu mundo, do jeito que você visualiza."
- Logo: os SVGs atuais são um redesenho provisório feito a partir de um print. Não alterar a geometria sem pedido do Eduardo; serão trocados pelos originais. (O canto do primeiro "a" já foi corrigido a pedido dele.)
- Contatos: o WhatsApp e o e-mail do site são os do Eduardo, porque o número e a caixa de e-mail da Aurea estão inativos.

## Referência de design

Estrutura e movimento inspirados em https://cuberto.com/: base clara e escura alternando, seções que sobem como folhas de cantos arredondados, botões em pílula, cursor em ponto com `mix-blend-mode`, tipografia grande e fluida, capas de projeto em vídeo. É referência de princípios, não cópia: nada de textos, gradiente de triângulos ou fonte deles.

## Regras de trabalho

- Tom dos textos: português direto, conversa de dono para dono, sem jargão técnico nem de vendas.
- Não inventar depoimentos, números, clientes ou resultados. Sem dado real, a seção não existe.
- Itens marcados com `RASCUNHO` em `site.ts` ainda precisam de revisão do Eduardo.
- Respeitar `prefers-reduced-motion` (já tratado em `Base.astro`) e manter o site utilizável sem JS.
- Mobile primeiro: a maior parte do público abre pelo celular.
- Antes de propor direção visual nova, consultar a Taste Library (colar aqui o trecho do `CLAUDE-SNIPPET.md`).

## Pendências

1. Revisar os textos `RASCUNHO` em `site.ts`: serviços, diferenciais, FAQ e o campo `sobre` de cada projeto (escrito a partir do que o site do cliente diz).
2. Páginas de projeto: acrescentar o que a Aurea fez em cada um (escopo, decisões, resultado), quando o Eduardo passar. Hoje só descrevem o cliente.
3. Página "Sobre", quando houver conteúdo real (história, quem faz, fotos).
4. Seção de depoimentos, quando houver depoimentos reais.
5. Trocar o logo provisório pelos arquivos originais.
6. Conferir num celular de verdade e no desktop com mouse (cursor, hovers, animações, vídeos das capas); a revisão foi feita por emulação em 1440×900 e 375×812.
7. Quando houver domínio: ajustar `site` em `astro.config.mjs` (ou um `CNAME` no Pages, com `BASE_PATH` vazio).
8. Imagem de compartilhamento (`og:image`): ainda não existe.
