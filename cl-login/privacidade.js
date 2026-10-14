/* Privacidade e cookies — kit único dos sites Clicheart (LGPD).
 *
 * Carregar no <head>:  <script src="…/privacidade.js?v=…" data-sistema="painel"></script>  +  privacidade.css
 *   data-sistema = estoque | testform | painel | mockup | conferente | atendente | elearning | monitor | axon
 *   data-modo="publico" (página aberta ao público que não guarda nada, ex.: CNPJ): sem barra, só o aviso pelo link.
 *
 * Decisão do dono (13/10/2026, à noite): os sites são de uso interno e só guardam o necessário (login, segurança)
 * e preferências que ficam no próprio computador da pessoa (tema, filtros) — nada de estatística ou propaganda.
 * Por isso NÃO se pede permissão: a barra só AVISA no 1º acesso ("Saiba mais" / "Entendi") e o aviso completo de
 * cada site fica no link "Privacidade" (qualquer elemento com data-cl-privacidade abre a janela).
 * A ciência vale para todos os *.clicheart.com.br (cookie no domínio, 1 ano). Sem eval e sem estilo inline.
 */
(function () {
  'use strict';
  var VERSAO = '2';   // mudou o aviso de forma que todos precisem ver de novo? subir aqui
  var NOME = 'clicheart_privacidade';
  var CFG = (document.currentScript && document.currentScript.dataset) || {};
  var PUBLICO = CFG.modo === 'publico';

  // ── textos ──
  var NAV_SESSAO = 'A sessão de login, para você continuar conectado — termina quando você sai ou em até 8 horas.';
  var NAV_TEMA = 'O tema claro ou escuro que você escolheu.';
  var NAV_CIENCIA = 'O registro de que você já viu este aviso.';
  var CONTA = 'Sua conta: nome, e-mail e senha (guardada cifrada, ninguém consegue ler).';
  var FLUXO_VPS = 'Ficam num servidor contratado na Contabo, em data center na França, com cópia de segurança cifrada guardada por 14 dias.';
  var FLUXO_CF = 'A Cloudflare (EUA) protege o acesso ao site contra ataques.';
  var FLUXO_NADA = 'Nada é vendido nem repassado para propaganda.';
  var PRAZO_CONTA = 'Conta e registro de quem fez cada alteração: guardados enquanto a empresa precisar.';
  var DIREITOS = [
    'A Clicheart é a responsável por estes dados.',
    'Você pode pedir para ver, corrigir ou apagar o que não precisar ser guardado (LGPD, art. 18).',
    'Para isso, fale com o administrador do sistema ou com a gestão da Clicheart — o canal próprio da LGPD está sendo definido.',
    'Não usamos cookies de estatística nem de propaganda.',
  ];
  var SITES = {
    estoque: { nome: 'Estoque de chapas',
      navegador: [NAV_SESSAO, NAV_TEMA, NAV_CIENCIA],
      dados: [CONTA, 'Quem cadastrou, alterou ou apagou retalhos, perdas e contagens (registro de alterações).'],
      fluxo: [FLUXO_VPS, FLUXO_CF, FLUXO_NADA],
      prazo: [PRAZO_CONTA] },
    testform: { nome: 'Testform',
      navegador: [NAV_SESSAO, 'O rascunho da ficha que você está preenchendo, para não perder o que digitou.', 'A aba que estava aberta.', NAV_TEMA, NAV_CIENCIA],
      dados: [CONTA, 'Fichas de teste de impressão (empresa cliente, máquina, medidas) e as fotos dos testes.', 'Quem gravou cada ficha (registro de alterações).'],
      fluxo: [FLUXO_VPS, FLUXO_CF, FLUXO_NADA],
      prazo: [PRAZO_CONTA, 'Fichas e fotos: guardadas enquanto a empresa precisar.'] },
    painel: { nome: 'Painel de Gestão',
      navegador: [NAV_SESSAO, 'Filtros, período, relatório e página que você deixou abertos, para o painel abrir do mesmo jeito.', NAV_TEMA, NAV_CIENCIA],
      dados: [CONTA + ' E o que o seu perfil de acesso pode ver.',
        'Os números vêm do Power BI: faturamento por cliente, produtividade e não conformidades por operador (com o nome do colaborador).',
        'O painel não grava esses números: lê na hora e guarda por 5 minutos só na memória do servidor.'],
      fluxo: ['Os números vêm do Power BI (Microsoft).', FLUXO_VPS, FLUXO_CF, FLUXO_NADA],
      prazo: ['Conta: guardada enquanto a empresa precisar.', 'Números do Power BI: não ficam guardados no painel.'] },
    mockup: { nome: 'Mockup 3D',
      navegador: [NAV_SESSAO, NAV_TEMA, NAV_CIENCIA],
      dados: [CONTA, 'Registro técnico de cada entrada (conta e endereço IP), para segurança.',
        'A arte que você usa no mockup fica só no seu navegador — não é enviada ao servidor.'],
      fluxo: [FLUXO_VPS, FLUXO_CF, FLUXO_NADA],
      prazo: ['Conta: guardada enquanto a empresa precisar.', 'Registro técnico de entrada: some sozinho conforme entram registros novos.'] },
    conferente: { nome: 'Conferência de Arte',
      navegador: [NAV_SESSAO, NAV_TEMA, NAV_CIENCIA],
      dados: [CONTA, 'Os PDFs de arte enviados e os relatórios da conferência — podem conter dados que estejam impressos na arte.', 'Quem conferiu cada arquivo.'],
      fluxo: [FLUXO_VPS, FLUXO_CF, FLUXO_NADA],
      prazo: ['PDFs, relatórios e o histórico de quem conferiu: apagados sozinhos em 4 horas.', 'Conta: guardada enquanto a empresa precisar.'] },
    atendente: { nome: 'Atendente',
      navegador: [NAV_SESSAO, NAV_TEMA, NAV_CIENCIA],
      dados: [CONTA + ' E o registro das suas entradas.',
        'Os pedidos dos clientes: quem enviou, assunto, texto, anexos e o que foi lido para abrir a O.S.'],
      fluxo: ['A O.S. é aberta no Nucleus.', 'O assistente de IA (Anthropic, EUA) só é usado quando estiver ligado — hoje está desligado.', FLUXO_VPS, FLUXO_CF, FLUXO_NADA],
      prazo: ['Pedido do cliente, cobrança e histórico do atendimento: apagados sozinhos depois de 30 dias sem movimento — o que vale é a O.S. no Nucleus.',
        'Conta e registro de entradas: guardados enquanto a empresa precisar.'] },
    elearning: { nome: 'E-learning',
      navegador: [NAV_SESSAO, NAV_TEMA, NAV_CIENCIA],
      dados: [CONTA, 'O que você abriu para ler, por quanto tempo, e seus favoritos — para acompanhar o treinamento.'],
      fluxo: ['O assistente de IA (Anthropic, EUA) só funciona quando estiver ligado — hoje está desligado; a pergunta não é guardada.', FLUXO_VPS, FLUXO_CF, FLUXO_NADA],
      prazo: [PRAZO_CONTA, 'Leituras e favoritos: guardados enquanto a empresa precisar.'] },
    monitor: { nome: 'Monitor',
      navegador: ['A chave de leitura que você digitou para entrar — fica só neste navegador, até você sair.', NAV_TEMA, NAV_CIENCIA],
      dados: ['Nenhum dado pessoal: o painel mostra só se os sites e os fornecedores estão no ar.'],
      fluxo: ['O painel é servido pelo GitHub (EUA); a situação dos sites vem do vigia na Cloudflare.', FLUXO_NADA],
      prazo: ['A chave sai do navegador quando você clica em Sair.'] },
    axon: { nome: 'AXON',
      navegador: [NAV_SESSAO, 'A empresa ativa, o painel lateral, as seções recolhidas e o que você escolheu ver nos painéis de Produção e Gravação.', NAV_TEMA, NAV_CIENCIA],
      dados: [CONTA, 'Cadastro das empresas clientes e dos seus contatos (nome, e-mail, telefone), ordens de serviço, orçamentos e o registro de quem fez cada alteração — para produzir, cobrar e conferir.'],
      fluxo: [FLUXO_VPS, FLUXO_CF, FLUXO_NADA],
      prazo: ['O prazo de guarda destes dados ainda está sendo definido pela Clicheart; até lá, ficam guardados enquanto a empresa precisar.'] },
  };
  var GERAL = { nome: 'Sistemas Clicheart',
    navegador: [NAV_SESSAO, NAV_TEMA, NAV_CIENCIA],
    dados: [CONTA, 'O registro de quem fez cada alteração.'],
    fluxo: [FLUXO_VPS, FLUXO_CF, FLUXO_NADA],
    prazo: [PRAZO_CONTA] };
  var PUBLICO_CARTOES = [
    ['O que acontece com o que você digita', ['O CNPJ vai direto do seu navegador para a BrasilAPI (ou para a CNPJ.ws, se ela não responder), que devolvem os dados públicos da Receita Federal — inclusive nomes de sócios, que são públicos por lei.', 'Nada disso é guardado pela Clicheart.']],
    ['Cookies', ['Esta página não usa cookies nem guarda nada no seu navegador.', 'A Cloudflare protege o site contra ataques e pode registrar o endereço de acesso (IP) por pouco tempo, para segurança.']],
    ['Quem cuida e seus direitos', ['A Clicheart mantém esta consulta gratuita.', 'Você pode pedir para ver, corrigir ou apagar dados seus (LGPD, art. 18) falando com a Clicheart — o canal próprio da LGPD está sendo definido.']],
  ];

  function cartoesDoSite() {
    if (PUBLICO) return PUBLICO_CARTOES;
    var s = SITES[CFG.sistema] || GERAL;
    return [
      ['O que fica no seu navegador', s.navegador],
      ['Dados pessoais neste site', s.dados],
      ['De onde vêm e para onde vão', s.fluxo],
      ['Por quanto tempo', s.prazo],
      ['Quem cuida e seus direitos', DIREITOS],
    ];
  }
  function nomeDoSite() { return PUBLICO ? 'Consulta CNPJ' : (SITES[CFG.sistema] || GERAL).nome; }

  // ── ciência (o "Entendi") ──
  function jaViu() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + NOME + '=([^;]*)'));
    var v = m ? decodeURIComponent(m[1]) : '';
    if (!v) { try { v = localStorage.getItem(NOME) || ''; } catch (e) { v = ''; } }
    return new RegExp('^v' + VERSAO + '\\.ok\\.\\d{8}$').test(v);
  }
  function marcarVisto() {
    var h = new Date(), d = h.getFullYear() + ('0' + (h.getMonth() + 1)).slice(-2) + ('0' + h.getDate()).slice(-2);
    var v = 'v' + VERSAO + '.ok.' + d;
    var dominio = /(^|\.)clicheart\.com\.br$/.test(location.hostname) ? '; Domain=.clicheart.com.br' : '';
    document.cookie = NOME + '=' + v + '; Path=/; Max-Age=31536000; SameSite=Lax' + dominio + (location.protocol === 'https:' ? '; Secure' : '');
    try { localStorage.setItem(NOME, v); } catch (e) { /* sem armazenamento: vale o cookie */ }
  }

  // ── tela ──
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function botao(txt, cls, fn) { var b = el('button', 'clp-bt ' + (cls || ''), txt); b.type = 'button'; b.addEventListener('click', fn); return b; }

  var barra = null;
  function fecharBarra() { if (barra) { barra.remove(); barra = null; } }
  function entendi() { marcarVisto(); fecharBarra(); fecharJanela(); }
  function mostrarBarra() {
    if (barra || !document.body) return;
    barra = el('div', 'clp-barra');
    barra.setAttribute('role', 'region'); barra.setAttribute('aria-label', 'Privacidade e cookies');
    var dentro = el('div', 'clp-barra-dentro');
    var txt = el('div', 'clp-barra-txt');
    txt.appendChild(el('strong', 'clp-barra-tit', 'Privacidade e cookies'));
    txt.appendChild(el('span', 'clp-barra-p', 'Este site guarda só o necessário para funcionar (login e segurança) e suas preferências, como o tema e os filtros. Nada de estatística ou propaganda.'));
    dentro.appendChild(txt);
    var acoes = el('div', 'clp-acoes');
    acoes.appendChild(botao('Saiba mais', 'clp-sec', function () { abrirJanela(); }));
    acoes.appendChild(botao('Entendi', 'clp-pri', entendi));
    dentro.appendChild(acoes);
    barra.appendChild(dentro);
    document.body.appendChild(barra);
  }

  var janela = null;
  function fecharJanela() { if (janela) { janela.remove(); janela = null; } }
  function abrirJanela() {
    fecharJanela();
    janela = el('div', 'clp-fundo');
    var caixa = el('div', 'clp-janela');
    caixa.setAttribute('role', 'dialog'); caixa.setAttribute('aria-modal', 'true'); caixa.setAttribute('aria-labelledby', 'clpTit');
    var topo = el('div', 'clp-topo');
    var tt = el('div', 'clp-topo-txt');
    var tit = el('h2', 'clp-tit', 'Privacidade e cookies'); tit.id = 'clpTit';
    tt.appendChild(tit); tt.appendChild(el('p', 'clp-site', nomeDoSite() + ' · Clicheart'));
    topo.appendChild(tt);
    var x = botao('×', 'clp-x', function () { fecharJanela(); }); x.setAttribute('aria-label', 'Fechar');
    topo.appendChild(x);
    caixa.appendChild(topo);
    var grade = el('div', 'clp-grade');
    cartoesDoSite().forEach(function (c) {
      var card = el('section', 'clp-card');
      card.appendChild(el('h3', 'clp-sub', c[0]));
      var ul = el('ul', 'clp-lista');
      c[1].forEach(function (t) { ul.appendChild(el('li', null, t)); });
      card.appendChild(ul);
      grade.appendChild(card);
    });
    caixa.appendChild(grade);
    var acoes = el('div', 'clp-acoes clp-rodape-janela');
    if (PUBLICO) acoes.appendChild(botao('Fechar', 'clp-pri', function () { fecharJanela(); }));
    else acoes.appendChild(botao('Entendi', 'clp-pri', entendi));
    caixa.appendChild(acoes);
    janela.appendChild(caixa);
    janela.addEventListener('click', function (e) { if (e.target === janela) fecharJanela(); });
    document.body.appendChild(janela);
    x.focus();
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && janela) fecharJanela(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-cl-privacidade]');
    if (a) { e.preventDefault(); abrirJanela(); }
  });

  function iniciar() {
    var rod = document.querySelector('.cl-rodape');   // rodapé das telas de login padrão
    if (rod && !rod.querySelector('[data-cl-privacidade]')) {
      rod.appendChild(document.createTextNode(' · '));
      var a = el('a', 'clp-rodape-link', 'Privacidade e cookies'); a.href = '#'; a.setAttribute('data-cl-privacidade', '');
      rod.appendChild(a);
    }
    if (!PUBLICO && !jaViu()) mostrarBarra();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
  window.clPrivacidade = { abrir: abrirJanela, jaViu: jaViu };
})();
