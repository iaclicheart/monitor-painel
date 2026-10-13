// Login padrão Clicheart: só o comportamento comum (olho da senha e aviso de Caps Lock).
// O envio, os erros e a sessão continuam sendo do próprio app (não mexer na lógica auditada).
//   <button type="button" class="cl-olho" data-cl-olho="idDaSenha" aria-label="Mostrar senha"></button>
//   <div class="cl-aviso" data-cl-caps="idDaSenha" hidden role="status">…Caps Lock está ligado.</div>
// window.clLogin.erro(el, texto) mostra o erro no padrão; clLogin.treme(el) dá a tremida.
(function () {
  var OLHO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
  var FECHADO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6A17.4 17.4 0 0 0 2 12s3.6 7 10 7a10.6 10.6 0 0 0 5.4-1.4"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  var ICONE_ERRO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>';

  function liga(raiz) {
    (raiz || document).querySelectorAll('[data-cl-olho]').forEach(function (b) {
      var alvo = document.getElementById(b.getAttribute('data-cl-olho'));
      if (!alvo || b.getAttribute('data-cl-ligado')) return;
      b.setAttribute('data-cl-ligado', '1');
      b.innerHTML = OLHO;
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        var ver = alvo.type === 'password';
        alvo.type = ver ? 'text' : 'password';
        b.innerHTML = ver ? FECHADO : OLHO;
        b.setAttribute('aria-label', ver ? 'Esconder senha' : 'Mostrar senha');
        b.setAttribute('aria-pressed', ver ? 'true' : 'false');
        alvo.focus();
      });
    });
    (raiz || document).querySelectorAll('[data-cl-caps]').forEach(function (av) {
      var alvo = document.getElementById(av.getAttribute('data-cl-caps'));
      if (!alvo || av.getAttribute('data-cl-ligado')) return;
      av.setAttribute('data-cl-ligado', '1');
      var olha = function (e) { if (e.getModifierState) av.hidden = !e.getModifierState('CapsLock'); };
      alvo.addEventListener('keydown', olha);
      alvo.addEventListener('keyup', olha);
      alvo.addEventListener('blur', function () { av.hidden = true; });
    });
  }
  function treme(el) { if (!el) return; el.classList.remove('cl-treme'); void el.offsetWidth; el.classList.add('cl-treme'); }
  function erro(el, texto) {
    if (!el) return;
    if (!texto) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="cl-erro" role="alert">' + ICONE_ERRO + '<span></span></div>';
    el.querySelector('span').textContent = texto;      // texto puro: nada de HTML vindo do servidor
  }
  window.clLogin = { liga: liga, treme: treme, erro: erro };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { liga(document); });
  else liga(document);
})();
