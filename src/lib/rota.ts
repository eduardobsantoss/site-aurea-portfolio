// Prefixa caminhos internos com o `base` do Astro. No GitHub Pages o site
// fica em /<repositório>/; na Vercel (ou com domínio próprio), em /.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const rota = (caminho: string) => `${base}${caminho}` || '/';

/** Caminho da página atual sem o `base`, para comparar com as rotas do menu. */
export const semBase = (caminho: string) =>
  (base && caminho.startsWith(base) ? caminho.slice(base.length) : caminho).replace(/(.)\/$/, '$1') || '/';
