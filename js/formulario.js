/* ==========================================================================
   FORMULARIO.JS  |  Encontro 8: validação acessível
   WCAG: 3.3.1 Identificação de erro, 3.3.3 Sugestão de correção,
         2.4.3 Ordem do foco, 4.1.3 Mensagens de status
   Lembrete (Desenvolvimento de Sistemas): validar no navegador melhora a
   experiência, mas NÃO protege o sistema. Num projeto real, as mesmas regras
   também devem ser aplicadas no servidor (back-end).
   ========================================================================== */
(function () {
  const form = document.querySelector('#form-contato');
  const resumo = document.querySelector('#resumo-form');   // role="status"
  if (!form || !resumo) return;

  // Desliga a validação padrão do navegador para usar mensagens próprias.
  form.setAttribute('novalidate', '');

  // Regras: cada campo tem a função de validação e a mensagem que ensina a corrigir.
  const campos = [
    { id: 'nome', ok: function (v) { return v.trim().length >= 3; },
      msg: 'Informe seu nome completo (mínimo de 3 letras).' },
    { id: 'email', ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      msg: 'Informe um e-mail válido, como nome@exemplo.com.' },
    { id: 'mensagem', ok: function (v) { return v.trim().length >= 10; },
      msg: 'Escreva uma mensagem com pelo menos 10 caracteres.' }
  ];

  // Região de status: limpar antes de escrever faz o leitor de tela ler de novo.
  function anunciar(mensagem) {
    resumo.textContent = '';
    window.setTimeout(function () { resumo.textContent = mensagem; }, 50);
  }

  // Mostra o erro logo após o campo e liga os dois por aria-describedby.
  function mostrarErro(campo, msg) {
    const el = document.getElementById(campo.id);
    let erro = document.getElementById(campo.id + '-erro');
    if (!erro) {
      erro = document.createElement('p');
      erro.id = campo.id + '-erro';
      erro.className = 'erro';
      el.insertAdjacentElement('afterend', erro);
    }
    erro.textContent = msg;
    el.setAttribute('aria-invalid', 'true');
    el.setAttribute('aria-describedby', campo.id + '-erro');
  }

  function limparErro(campo) {
    const el = document.getElementById(campo.id);
    const erro = document.getElementById(campo.id + '-erro');
    if (erro) erro.remove();
    el.removeAttribute('aria-invalid');
    el.removeAttribute('aria-describedby');
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    let primeiroComErro = null;

    campos.forEach(function (campo) {
      const el = document.getElementById(campo.id);
      if (campo.ok(el.value)) {
        limparErro(campo);
      } else {
        mostrarErro(campo, campo.msg);
        if (!primeiroComErro) primeiroComErro = el;
      }
    });

    if (primeiroComErro) {
      primeiroComErro.focus();                 // leva o foco ao primeiro erro (2.4.3)
      anunciar('O formulário tem erros. Corrija os campos indicados.');
      return;
    }
    anunciar('Mensagem enviada com sucesso! (simulação, sem servidor)');
    form.reset();
  });

  // Ao digitar, o erro daquele campo some.
  campos.forEach(function (campo) {
    document.getElementById(campo.id).addEventListener('input', function () {
      if (document.getElementById(campo.id + '-erro')) limparErro(campo);
    });
  });
})();
