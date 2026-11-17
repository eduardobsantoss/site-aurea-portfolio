// Conteúdo do site em um só lugar. Textos marcados com RASCUNHO precisam de revisão.

export const contato = {
  // Número no formato internacional, só dígitos (ex.: 5534999999999). Vazio = botão cai no Instagram.
  whatsapp: '5534999860869',
  whatsappVisivel: '(34) 9 9986-0869',
  mensagemWhatsapp: 'Oi! Vi o site da Aurea e queria conversar sobre um projeto.',
  instagram: 'https://www.instagram.com/estudioaurea.co/', // URL completa do perfil
  instagramVisivel: '@estudioaurea.co',
  behance: 'https://www.behance.net/gallery/214768927/Aurea',
  email: 'barbosa.eduardosan@gmail.com',
  cidade: 'Uberaba, MG',
};

export const linkWhatsapp = contato.whatsapp
  ? `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(contato.mensagemWhatsapp)}`
  : '';

// Botão principal de contato: o rótulo diz para onde ele leva de verdade.
export const acaoContato = linkWhatsapp
  ? { url: linkWhatsapp, rotulo: 'Chamar no WhatsApp' }
  : contato.instagram
    ? { url: contato.instagram, rotulo: 'Chamar no Instagram' }
    : { url: contato.behance, rotulo: 'Ver a Aurea no Behance' };

// Canais, na ordem em que aparecem no rodapé e na página de contato.
export const canais = [
  { nome: 'WhatsApp', url: linkWhatsapp, visivel: contato.whatsappVisivel },
  { nome: 'Instagram', url: contato.instagram, visivel: contato.instagramVisivel },
  { nome: 'E-mail', url: contato.email && `mailto:${contato.email}`, visivel: contato.email },
  { nome: 'Behance', url: contato.behance, visivel: 'Aurea no Behance' },
].filter((c) => c.url);

export const menu = [
  { nome: 'Projetos', url: '/projetos' },
  { nome: 'Serviços', url: '/servicos' },
  { nome: 'Contato', url: '/contato' },
];

// `id` vira a âncora em /servicos#<id>, usada pelos links da página inicial.
export const servicos = [
  {
    id: 'site-institucional',
    titulo: 'Site institucional',
    texto:
      'O endereço do seu negócio na internet: quem você é, o que faz e como falar com você, num site rápido e que funciona bem no celular.',
  },
  {
    id: 'landing-page',
    titulo: 'Landing page',
    texto:
      'Uma página com um objetivo só: vender um serviço, divulgar um evento ou captar contatos de uma campanha.',
  },
  {
    id: 'identidade-visual',
    titulo: 'Identidade visual',
    texto:
      'Logo, cores e tipografia pensados junto com o site, para a marca ter a mesma cara em todo lugar.',
  },
  {
    id: 'manutencao',
    titulo: 'Manutenção e suporte',
    texto:
      'Depois que o site vai ao ar a gente continua por perto: atualizações de conteúdo, ajustes e acompanhamento.',
  },
];

// O primeiro da lista é o projeto em destaque da página inicial.
// Capa: vídeo em public/projetos/<slug>.mp4 e imagem em src/assets/projetos/<slug>.jpg (pôster e reserva).
// Segunda imagem (página do projeto): src/assets/projetos/<slug>-2.jpg.
// RASCUNHO: "sobre" descreve o cliente a partir do que o próprio site dele diz; confirmar e, se quiser,
// acrescentar o que a Aurea fez em cada projeto (isso não foi inventado aqui).
export const projetos = [
  {
    slug: 'acervatio',
    nome: 'Acervatio',
    area: 'Gestão de pontos e milhas',
    resumo: 'Site institucional',
    url: 'https://acervatio.com.br/',
    sobre:
      'A Acervatio cuida de cartões, pontos, milhas e benefícios de viagem como patrimônio, da estratégia de acúmulo até a viagem acontecer.',
  },
  {
    slug: 'soraya-batista',
    nome: 'Soraya Batista',
    area: 'Fisioterapia',
    resumo: 'Site institucional',
    url: 'https://sorayabatistafisio.com.br/',
    sobre:
      'Soraya Batista é fisioterapeuta em Uberaba, com atuação em coluna vertebral, lesões ortopédicas e performance para a longevidade.',
  },
  {
    slug: 'realium',
    nome: 'Realium Home Design',
    area: 'Móveis planejados',
    resumo: 'Site institucional',
    url: 'https://realium.com.br/',
    sobre: 'A Realium Home Design projeta e produz móveis planejados em Araxá.',
  },
  {
    slug: 'pacepoint',
    nome: 'PacePoint',
    area: 'Eventos de corrida',
    resumo: 'Site com calendário de eventos',
    url: 'https://pacepoint.com.br/Home',
    sobre:
      'A PacePoint faz cronometragem e organização de corridas em Uberaba e região, com inscrições online e resultados em tempo real.',
  },
];

export const diferenciais = [
  // RASCUNHO
  { titulo: 'Feito sob medida', texto: 'Nada de template genérico. Cada site parte do seu negócio e do seu cliente.' },
  { titulo: 'Rápido no celular', texto: 'A maior parte das visitas vem do telefone, então é lá que o site precisa brilhar.' },
  { titulo: 'Conversa direta', texto: 'Você fala com quem faz o site, sem intermediário e sem termo técnico desnecessário.' },
  { titulo: 'Do início ao ar', texto: 'A gente orienta domínio e hospedagem e cuida da configuração até a publicação.' },
];

export const faq = [
  // RASCUNHO: respostas escritas a partir do que já é prática da Aurea; revisar antes de publicar.
  {
    pergunta: 'Quanto tempo leva para o site ficar pronto?',
    resposta: 'Depende do tamanho do projeto. Na primeira conversa a gente combina um prazo e as etapas de entrega.',
  },
  {
    pergunta: 'Preciso já ter domínio e hospedagem?',
    resposta:
      'Não. Domínio e hospedagem ficam no seu nome, e a gente orienta a contratação e faz toda a configuração.',
  },
  {
    pergunta: 'Como funciona o pagamento?',
    resposta: 'Metade no início do projeto e metade na entrega, via Pix.',
  },
  {
    pergunta: 'E depois que o site estiver no ar?',
    resposta: 'A gente oferece manutenção para atualizar conteúdo e fazer ajustes sempre que você precisar.',
  },
];
