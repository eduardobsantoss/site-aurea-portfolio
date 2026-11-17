# site-aurea-portfolio

Portfólio da Aurea. Astro, uma página, pronto para a Vercel.

## Rodar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/
```

## Onde mexer

| O quê | Arquivo |
|---|---|
| Textos, serviços, projetos, FAQ, contatos | `src/data/site.ts` |
| Cores, tipografia, espaçamentos | `src/styles/global.css` |
| Estrutura da página | `src/pages/index.astro` |
| Logo e monograma | `src/components/Logo.astro`, `Monograma.astro` |
| Scroll suave, cursor, animações de entrada | `src/layouts/Base.astro` |

## Pendências

- Preencher WhatsApp, Instagram e e-mail em `src/data/site.ts`.
- Revisar os textos marcados com `RASCUNHO`.
- Gravar as capas em vídeo dos projetos (`public/projetos/<slug>.mp4`) e preencher as URLs.
- Trocar o logo provisório pelos arquivos originais quando chegarem.
- Depoimentos de clientes (seção ainda não existe; não inventar).
- Ajustar `site` em `astro.config.mjs` quando houver domínio.

## Publicar na Vercel

Importar o repositório na Vercel; ela detecta Astro sozinha (build `astro build`, saída `dist`).
