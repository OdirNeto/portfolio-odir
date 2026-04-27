/* =============================================================================
   Portfólio - Odir Pereira Borges Neto
   Script principal (JavaScript puro - sem frameworks)
   - Menu responsivo (hamburguer)
   - Alternância de tema claro/escuro com persistência (localStorage)
   - Filtro dinâmico de projetos
   - Validação do formulário de contato + simulação de envio (modal)
   ============================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------------------
     1) MENU RESPONSIVO (hamburguer)
     --------------------------------------------------------------------------- */
  const btnMenu = document.getElementById('btnMenu');
  const navMenu = document.getElementById('navMenu');

  if (btnMenu && navMenu) {
    btnMenu.addEventListener('click', function () {
      navMenu.classList.toggle('aberto');
      const aberto = navMenu.classList.contains('aberto');
      btnMenu.setAttribute('aria-expanded', aberto);
    });

    // Fecha o menu ao clicar em um link (em telas pequenas)
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('aberto');
        btnMenu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------------------------
     2) TEMA CLARO/ESCURO com persistência
     --------------------------------------------------------------------------- */
  const btnTema = document.getElementById('btnTema');
  const corpo = document.body;

  // Aplica o tema salvo (se houver) ao carregar a página
  const temaSalvo = localStorage.getItem('tema');
  if (temaSalvo === 'escuro') {
    corpo.classList.add('tema-escuro');
    if (btnTema) btnTema.textContent = '☀️';
  }

  if (btnTema) {
    btnTema.addEventListener('click', function () {
      corpo.classList.toggle('tema-escuro');
      const escuro = corpo.classList.contains('tema-escuro');
      btnTema.textContent = escuro ? '☀️' : '🌙';
      localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
    });
  }

  /* ---------------------------------------------------------------------------
     3) FILTRO DE PROJETOS (página portfolio.html)
     --------------------------------------------------------------------------- */
  const botoesFiltro = document.querySelectorAll('.btn-filtro');
  const projetos = document.querySelectorAll('.projeto');

  if (botoesFiltro.length > 0) {
    botoesFiltro.forEach(function (botao) {
      botao.addEventListener('click', function () {
        // Remove a classe "ativo" de todos e adiciona ao clicado
        botoesFiltro.forEach(function (b) { b.classList.remove('ativo'); });
        botao.classList.add('ativo');

        const filtro = botao.getAttribute('data-filtro');

        projetos.forEach(function (projeto) {
          const categorias = projeto.getAttribute('data-categoria') || '';
          if (filtro === 'todos' || categorias.includes(filtro)) {
            projeto.classList.remove('escondido');
          } else {
            projeto.classList.add('escondido');
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------------------------
     4) FORMULÁRIO DE CONTATO - validação e envio simulado
     --------------------------------------------------------------------------- */
  const form = document.getElementById('formContato');
  const modal = document.getElementById('modal');
  const fecharModal = document.getElementById('fecharModal');

  // Função utilitária: valida o formato de e-mail com expressão regular
  function emailValido(valor) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(valor);
  }

  // Função utilitária: marca um campo como inválido e exibe a mensagem
  function mostrarErro(idCampo, idErro, mensagem) {
    const campo = document.getElementById(idCampo);
    const erro = document.getElementById(idErro);
    if (campo) campo.classList.add('invalido');
    if (erro) erro.textContent = mensagem;
  }

  // Função utilitária: limpa o estado de erro de um campo
  function limparErro(idCampo, idErro) {
    const campo = document.getElementById(idCampo);
    const erro = document.getElementById(idErro);
    if (campo) campo.classList.remove('invalido');
    if (erro) erro.textContent = '';
  }

  if (form) {
    form.addEventListener('submit', function (evento) {
      evento.preventDefault(); // Impede o envio padrão do navegador

      // Limpa erros anteriores
      limparErro('nome', 'erroNome');
      limparErro('email', 'erroEmail');
      limparErro('mensagem', 'erroMensagem');

      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const mensagem = document.getElementById('mensagem').value.trim();

      let valido = true;

      // Validação do nome (mínimo 3 caracteres)
      if (nome === '') {
        mostrarErro('nome', 'erroNome', 'Por favor, informe seu nome.');
        valido = false;
      } else if (nome.length < 3) {
        mostrarErro('nome', 'erroNome', 'O nome deve ter pelo menos 3 caracteres.');
        valido = false;
      }

      // Validação do e-mail
      if (email === '') {
        mostrarErro('email', 'erroEmail', 'Por favor, informe seu e-mail.');
        valido = false;
      } else if (!emailValido(email)) {
        mostrarErro('email', 'erroEmail', 'Informe um e-mail válido (ex: usuario@dominio.com).');
        valido = false;
      }

      // Validação da mensagem (mínimo 10 caracteres)
      if (mensagem === '') {
        mostrarErro('mensagem', 'erroMensagem', 'Por favor, escreva uma mensagem.');
        valido = false;
      } else if (mensagem.length < 10) {
        mostrarErro('mensagem', 'erroMensagem', 'A mensagem deve ter pelo menos 10 caracteres.');
        valido = false;
      }

      // Se todos os campos estão válidos, simula o envio
      if (valido) {
        // Simulação do envio (em produção, aqui seria feita uma chamada à API)
        console.log('Formulário enviado (simulação):', { nome, email, mensagem });

        // Limpa o formulário
        form.reset();

        // Exibe modal de sucesso
        if (modal) {
          modal.classList.add('ativo');
          modal.setAttribute('aria-hidden', 'false');
        }
      }
    });

    // Validação em tempo real (ao sair do campo)
    document.getElementById('nome').addEventListener('blur', function () {
      if (this.value.trim().length >= 3) limparErro('nome', 'erroNome');
    });
    document.getElementById('email').addEventListener('blur', function () {
      if (emailValido(this.value.trim())) limparErro('email', 'erroEmail');
    });
    document.getElementById('mensagem').addEventListener('blur', function () {
      if (this.value.trim().length >= 10) limparErro('mensagem', 'erroMensagem');
    });
  }

  // Fecha o modal de confirmação
  if (fecharModal && modal) {
    fecharModal.addEventListener('click', function () {
      modal.classList.remove('ativo');
      modal.setAttribute('aria-hidden', 'true');
    });

    // Fecha o modal ao clicar fora do conteúdo
    modal.addEventListener('click', function (evento) {
      if (evento.target === modal) {
        modal.classList.remove('ativo');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

});
