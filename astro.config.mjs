import { defineConfig } from 'astro/config';

// `SITE_URL` e `BASE_PATH` vêm do workflow do GitHub Pages
// (.github/workflows/pages.yml). Sem eles, vale o endereço da Vercel na raiz.
// Trocar pelo domínio definitivo quando existir (usado em canonical e sitemap).
export default defineConfig({
  site: process.env.SITE_URL || 'https://aurea.vercel.app',
  base: process.env.BASE_PATH || '/',
});
