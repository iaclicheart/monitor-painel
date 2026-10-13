/* Privacidade e cookies — kit único dos sites Clicheart (LGPD, 13/10/2026).
 *
 * Carregar no <head>, ANTES de qualquer script que grave preferência (tema-cedo.js, app):
 *   <script src="…/privacidade.js?v=…"></script>  +  <link rel="stylesheet" href="…/privacidade.css?v=…">
 *
 * O que faz:
 *  - Necessários (sempre): sessão de login, segurança, rascunho do que a pessoa está digitando e a própria
 *    escolha de privacidade. Nada disso depende de permissão.
 *  - Preferências (só com permissão): tema, filtros, página/aba aberta. Sem permissão o kit NÃO deixa gravar
 *    (localStorage/sessionStorage) e apaga o que já estava gravado. Estatística e publicidade: não existem.
 *  - A escolha vale para todos os *.clicheart.com.br (cookie no domínio) e dura 1 ano; mudar a qualquer hora
 *    pelo link "Privacidade" (qualquer elemento com data-cl-privacidade abre a janela).
 *  - Sem eval, sem estilo inline (funciona com CSP script-src/style-src 'self').
 */
(function () {
  'use strict';
  var VERSAO = '1';
  // data-modo="publico" na tag (página aberta ao público, sem login e sem nada guardado no navegador, ex.: CNPJ):
  // sem barra de cookies — só o aviso, aberto pelo link do rodapé.
  var CFG = (document.currentScript && document.currentScript.dataset) || {};
  var PUBLICO = CFG.modo === 'publico';
  var NOME = 'clicheart_privacidade';
  // chaves de PREFERÊNCIA (o resto do armazenamento é necessário: sessão, rascunho, esta escolha)
  var PREFERENCIAS = [/^clicheart-theme(-v)?$/, /^gestao-/, /^clicheart\.testform\.(aba|cat)$/];
  var ehPreferencia = function (k) { return PREFERENCIAS.some(function (re) { return re.test(String(k)); }); };

  function lerEscolha() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + NOME + '=([^;]*)'));
    var v = m ? decodeURIComponent(m[1]) : '';
    if (!v) { try { v = localStorage.getItem(NOME) || ''; } catch (e) { v = ''; } }
    var p = /^v(\d+)\.p([01])\.(\d{8})$/.exec(v);
    return p && p[1] === VERSAO ? { preferencias: p[2] === '1', em: p[3] } : null;
  }
  function gravarEscolha(preferencias) {
    var hoje = new Date(), d = hoje.getFullYear() + ('0' + (hoje.getMonth() + 1)).slice(-2) + ('0' + hoje.getDate()).slice(-2);
    var v = 'v' + VERSAO + '.p' + (preferencias ? '1' : '0') + '.' + d;
    var dominio = /(^|\.)clicheart\.com\.br$/.test(location.hostname) ? '; Domain=.clicheart.com.br' : '';
    document.cookie = NOME + '=' + v + '; Path=/; Max-Age=31536000; SameSite=Lax' + dominio + (location.protocol === 'https:' ? '; Secure' : '');
    try { _setItem.call(localStorage, NOME, v); } catch (e) { /* sem armazenamento: vale o cookie */ }
    escolha = { preferencias: preferencias, em: d };
    if (!preferencias) { apagarPreferencias(); return; }
    // permitiu agora: o que a pessoa já escolheu nesta página (ex.: o tema) passa a ficar guardado
    Object.keys(memoria).forEach(function (c) {
      try { _setItem.call(c.charAt(0) === 's' ? window.sessionStorage : window.localStorage, c.slice(2), memoria[c]); } catch (e) { /* bloqueado */ }
    });
    memoria = {};
  }
  function apagarPreferencias() {   // só o que está no disco; a memória da página continua (a tela não muda na hora)
    [window.localStorage, window.sessionStorage].forEach(function (s) {
      try { Object.keys(s).filter(ehPreferencia).forEach(function (k) { _removeItem.call(s, k); }); } catch (e) { /* bloqueado */ }
    });
  }

  // Trava: sem permissão, preferência NÃO vai para o disco — fica só na memória desta página (o tema troca e a
  // tela continua lendo o que acabou de escolher; ao recarregar, some). Com permissão, vai para o armazenamento.
  var _setItem = Storage.prototype.setItem, _getItem = Storage.prototype.getItem, _removeItem = Storage.prototype.removeItem;
  var escolha = lerEscolha();
  var permitido = function () { return !!(escolha && escolha.preferencias); };
  var memoria = {};   // 'l:chave' / 's:chave' → valor (localStorage / sessionStorage), só sem permissão
  var chaveMem = function (st, k) { return (st === window.sessionStorage ? 's:' : 'l:') + k; };
  Storage.prototype.setItem = function (k, v) {
    if (ehPreferencia(k) && !permitido()) { memoria[chaveMem(this, k)] = String(v); return; }
    return _setItem.call(this, k, v);
  };
  Storage.prototype.getItem = function (k) {
    if (ehPreferencia(k) && !permitido()) { var c = chaveMem(this, k); return Object.prototype.hasOwnProperty.call(memoria, c) ? memoria[c] : null; }
    return _getItem.call(this, k);
  };
  Storage.prototype.removeItem = function (k) {
    if (ehPreferencia(k)) delete memoria[chaveMem(this, k)];
    return _removeItem.call(this, k);
  };
  if (!permitido()) apagarPreferencias();

  // ── tela ──
  var TEXTO_AVISO = 'Este site usa só o necessário para funcionar (sessão de login e segurança). '
    + 'Se você permitir, ele também guarda suas preferências neste navegador, como o tema e os filtros. '
    + 'Não usamos cookies de estatística nem de publicidade.';
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function botao(txt, cls, fn) { var b = el('button', 'clp-bt ' + (cls || ''), txt); b.type = 'button'; b.addEventListener('click', fn); return b; }

  var barra = null;
  function fecharBarra() { if (barra) { barra.remove(); barra = null; } }
  function mostrarBarra() {
    if (barra || !document.body) return;
    barra = el('div', 'clp-barra');
    barra.setAttribute('role', 'region'); barra.setAttribute('aria-label', 'Privacidade e cookies');
    barra.appendChild(el('p', 'clp-barra-txt', TEXTO_AVISO));
    var acoes = el('div', 'clp-acoes');
    acoes.appendChild(botao('Saber mais', 'clp-link', function () { abrirJanela(); }));
    acoes.appendChild(botao('Só o necessário', 'clp-sec', function () { gravarEscolha(false); fecharBarra(); }));
    acoes.appendChild(botao('Permitir preferências', 'clp-pri', function () { gravarEscolha(true); fecharBarra(); }));
    barra.appendChild(acoes);
    document.body.appendChild(barra);
  }

  var SECOES = [
    ['Quem cuida dos seus dados', 'A Clicheart, dona destes sistemas internos. Para pedir acesso, correção ou exclusão dos seus dados, fale com o administrador do sistema ou com a gestão da Clicheart (o canal próprio da LGPD está sendo definido).'],
    ['O que fica no seu navegador', 'Necessários (sempre ligados): a sessão de login, que termina quando você sai ou em até 8 horas; o rascunho do que você está digitando, para não se perder; e esta sua escolha de privacidade. Preferências (só se você permitir): tema claro ou escuro, filtros, período e página aberta. Não há cookies de estatística nem de publicidade.'],
    ['Dados pessoais nos sistemas', 'Dos colaboradores: nome, e-mail e o registro de quem entrou e do que alterou, para segurança e conferência — guardados enquanto a empresa precisar. Dos clientes, nos atendimentos: o e-mail do pedido e o contato, apagados sozinhos em até 30 dias sem movimento (o que vale é a O.S. no Nucleus).'],
    ['Onde ficam e com quem', 'Num servidor contratado na Contabo, em data center na França, com cópia de segurança cifrada guardada por 14 dias. A proteção de rede é da Cloudflare (EUA); os relatórios de gestão vêm do Power BI (Microsoft); as O.S. ficam no Nucleus; o painel do Monitor é servido pelo GitHub (EUA). Ninguém mais recebe esses dados.'],
    ['Seus direitos', 'Pela LGPD (art. 18) você pode confirmar se tratamos seus dados, ter acesso a eles, corrigir, pedir anonimização ou exclusão do que for desnecessário e saber com quem foram compartilhados — pelo contato acima.'],
  ];
  var SECOES_PUBLICO = [
    ['Quem é responsável', 'A Clicheart mantém esta consulta gratuita. Para pedidos sobre dados pessoais, fale com a Clicheart (o canal próprio da LGPD está sendo definido).'],
    ['O que acontece com o que você digita', 'O CNPJ digitado vai direto do seu navegador para a BrasilAPI (e, se ela não responder, para a CNPJ.ws), que devolvem os dados públicos da Receita Federal — inclusive nomes de sócios, que são públicos por lei. Nada disso é guardado no servidor da Clicheart.'],
    ['Cookies', 'Esta página não usa cookies nem guarda nada no seu navegador. A Cloudflare protege o site contra ataques e pode registrar o endereço de acesso (IP) por pouco tempo, para segurança.'],
    ['Seus direitos', 'Pela LGPD (art. 18) você pode confirmar se tratamos seus dados, ter acesso a eles, corrigir e pedir exclusão do que for desnecessário — pelo contato acima.'],
  ];
  var janela = null;
  function fecharJanela() { if (janela) { janela.remove(); janela = null; } }
  function abrirJanela() {
    fecharJanela();
    janela = el('div', 'clp-fundo');
    var caixa = el('div', 'clp-janela');
    caixa.setAttribute('role', 'dialog'); caixa.setAttribute('aria-modal', 'true'); caixa.setAttribute('aria-labelledby', 'clpTit');
    var tit = el('h2', 'clp-tit', 'Privacidade e cookies'); tit.id = 'clpTit';
    caixa.appendChild(tit);
    var corpo = el('div', 'clp-corpo');
    (PUBLICO ? SECOES_PUBLICO : SECOES).forEach(function (s) { corpo.appendChild(el('h3', 'clp-sub', s[0])); corpo.appendChild(el('p', 'clp-p', s[1])); });
    if (PUBLICO) {
      caixa.appendChild(corpo);
      var so = el('div', 'clp-acoes'); so.appendChild(botao('Fechar', 'clp-pri', function () { fecharJanela(); })); caixa.appendChild(so);
      janela.appendChild(caixa);
      janela.addEventListener('click', function (e) { if (e.target === janela) fecharJanela(); });
      document.body.appendChild(janela);
      return;
    }
    var opc = el('div', 'clp-opcoes');
    var linha = function (titulo, desc, marcado, travado) {
      var l = el('label', 'clp-opcao' + (travado ? ' clp-travado' : ''));
      var c = el('input'); c.type = 'checkbox'; c.checked = marcado; c.disabled = !!travado;
      var t = el('span', 'clp-opcao-txt'); t.appendChild(el('b', null, titulo)); t.appendChild(el('span', 'clp-opcao-desc', desc));
      l.appendChild(c); l.appendChild(t); opc.appendChild(l); return c;
    };
    linha('Necessários', 'Sessão de login, segurança e rascunho — sempre ligados.', true, true);
    var pref = linha('Preferências', 'Tema, filtros e página aberta guardados neste navegador.', !!(escolha && escolha.preferencias), false);
    corpo.appendChild(opc);
    caixa.appendChild(corpo);
    var acoes = el('div', 'clp-acoes');
    acoes.appendChild(botao('Fechar', 'clp-link', function () { fecharJanela(); }));
    acoes.appendChild(botao('Salvar escolha', 'clp-pri', function () { gravarEscolha(pref.checked); fecharJanela(); fecharBarra(); }));
    caixa.appendChild(acoes);
    janela.appendChild(caixa);
    janela.addEventListener('click', function (e) { if (e.target === janela) fecharJanela(); });
    document.body.appendChild(janela);
    pref.focus();
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && janela) fecharJanela(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-cl-privacidade]');
    if (a) { e.preventDefault(); abrirJanela(); }
  });

  function iniciar() {
    // link no rodapé das telas de login padrão
    var rod = document.querySelector('.cl-rodape');
    if (rod && !rod.querySelector('[data-cl-privacidade]')) {
      rod.appendChild(document.createTextNode(' · '));
      var a = el('a', 'clp-rodape-link', 'Privacidade e cookies'); a.href = '#'; a.setAttribute('data-cl-privacidade', '');
      rod.appendChild(a);
    }
    if (!escolha && !PUBLICO) mostrarBarra();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
  window.clPrivacidade = { abrir: abrirJanela, escolha: function () { return escolha; } };
})();
