console.log('FixTintas — JavaScript carregado!');

// CARRINHO
let carrinho = [];

function abrirCarrinho() {
    document.getElementById('painel-carrinho').style.display = 'flex';
}

function fecharCarrinho() {
    document.getElementById('painel-carrinho').style.display = 'none';
}

function adicionarAoCarrinho(nome, preco) {
    const item = carrinho.find(i => i.nome === nome);
    if (item) {
        item.qtd++;
    } else {
        carrinho.push({ nome, preco, qtd: 1 });
    }
    atualizarCarrinho();
    mostrarNotificacao(`"${nome}" adicionado ao carrinho!`);
}

function removerDoCarrinho(nome) {
    carrinho = carrinho.filter(i => i.nome !== nome);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const total = carrinho.reduce((acc, i) => acc + i.preco * i.qtd, 0);
    const totalItens = carrinho.reduce((acc, i) => acc + i.qtd, 0);

    const badge = document.getElementById('carrinho-badge');
    if (badge) badge.textContent = totalItens;

    const totalEl = document.getElementById('carrinho-total');
    if (totalEl) totalEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;

    const lista = document.getElementById('carrinho-lista');
    if (!lista) return;

    lista.innerHTML = carrinho.length === 0
        ? '<p class="carrinho-vazio">Carrinho vazio</p>'
        : carrinho.map(i => `
            <div class="carrinho-item">
                <span>${i.nome} × ${i.qtd}</span>
                <span>R$ ${(i.preco * i.qtd).toFixed(2).replace('.', ',')}</span>
                <button onclick="removerDoCarrinho('${i.nome}')">✕</button>
            </div>
        `).join('');
}

function mostrarNotificacao(msg) {
    let notif = document.getElementById('notificacao');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'notificacao';
        notif.style.cssText = `
            position: fixed; bottom: 24px; right: 24px;
            background: #1a2a6c; color: #fff;
            padding: 12px 22px; border-radius: 8px;
            font-size: 0.9rem; font-weight: 600;
            box-shadow: 0 4px 16px rgba(0,0,0,0.25);
            z-index: 9999; opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(notif);
    }
    notif.textContent = msg;
    notif.style.opacity = '1';
    clearTimeout(notif._timer);
    notif._timer = setTimeout(() => { notif.style.opacity = '0'; }, 2500);
}

function vincularBotoesCarrinho() {
    document.querySelectorAll('.produto button:not(.btn-finalizar)').forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    document.querySelectorAll('.produto button:not(.btn-finalizar)').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.produto');
            const nome = card.querySelector('h3')?.textContent?.trim() || 'Produto';
            const precoTexto = card.querySelector('.preco')?.textContent || 'R$ 0,00';
            const preco = parseFloat(
                precoTexto.replace('R$', '').replace('.', '').replace(',', '.').trim()
            ) || 0;
            adicionarAoCarrinho(nome, preco);
        });
    });
}

// Login e registro
function abrirLogin() {
    document.getElementById('modal-login').style.display = 'flex';
}

function fecharLogin() {
    document.getElementById('modal-login').style.display = 'none';
}

function trocarAba(aba) {
    document.getElementById('form-login').style.display = aba === 'login' ? 'block' : 'none';
    document.getElementById('form-registro').style.display = aba === 'registro' ? 'block' : 'none';
    document.querySelectorAll('.aba').forEach(b => b.classList.remove('ativa'));
    event.target.classList.add('ativa');
}

// Validações simples
(function iniciarCarrossel() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    let atual = 0;

    function mostrarSlide(index) {
        slides.forEach(s => s.classList.remove('ativo'));
        slides[index].classList.add('ativo');
    }

    const btnProximo = document.querySelector('.btn-carrossel.proximo');
    const btnAnterior = document.querySelector('.btn-carrossel.anterior');

    if (btnProximo) {
        btnProximo.addEventListener('click', () => {
            atual = (atual + 1) % slides.length;
            mostrarSlide(atual);
        });
    }

    if (btnAnterior) {
        btnAnterior.addEventListener('click', () => {
            atual = (atual - 1 + slides.length) % slides.length;
            mostrarSlide(atual);
        });
    }

    setInterval(() => {
        atual = (atual + 1) % slides.length;
        mostrarSlide(atual);
    }, 5000);
})();

// Dados de categorias e subcategorias
const categorias = {
    interior:    ['Tintas Plásticas', 'Tintas Acrílicas', 'Massas Corridas', 'Latex'],
    exterior:    ['Tintas Acrílicas', 'Vernizes', 'Tintas Piso', 'Latex'],
    moveis:      ['Esmaltes', 'Vernizes', 'Tintas Spray'],
    especial:    ['Antimofo', 'Antiferrugem', 'Tintas para Madeira'],
    marcas:      ['Suvinil', 'Coral', 'Lukscolor', 'Eucatex'],
    ferramentas: ['Rolos', 'Pincéis', 'Escadas', 'Bandejas'],
    acessorios:  ['Lixas', 'Fitas Crepe', 'Plásticos de Proteção', 'Luvas', 'Máscaras']
};

function abrirSubcategoria(categoria) {
    const coluna2 = document.getElementById('coluna-2');
    if (!coluna2) return;

    const subs = categorias[categoria] || [];

    coluna2.innerHTML = `
        <button class="btn-voltar" onclick="fecharColuna2()">‹ Voltar</button>
        <h3>${categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h3>
        <ul class="lista-categorias">
            ${subs.map(sub => `
                <li class="categoria" data-subcategoria="${sub}">
                    ${sub}
                    <span class="seta">›</span>
                </li>
            `).join('')}
        </ul>
    `;

    document.body.classList.add('col-2-open');

    coluna2.querySelectorAll('.categoria[data-subcategoria]').forEach(item => {
        item.addEventListener('click', function () {
            abrirPaginaProdutos(categoria, this.dataset.subcategoria);
        });
    });
}

function abrirPaginaProdutos(categoria, subcategoria) {
    const url = new URL('produtos.html', window.location.href);
    url.searchParams.set('categoria', categoria);
    url.searchParams.set('subcategoria', subcategoria);
    window.location.href = url.toString();
}

function fecharColuna2() {
    const coluna2 = document.getElementById('coluna-2');
    if (coluna2) coluna2.innerHTML = '';
    document.body.classList.remove('col-2-open');
}

document.querySelectorAll('.categoria[data-categoria]').forEach(cat => {
    cat.addEventListener('click', function () {
        abrirSubcategoria(this.dataset.categoria);
    });
});

// Busca simples
const btnBusca = document.getElementById('btn-busca');
if (btnBusca) {
    btnBusca.addEventListener('click', function () {
        const termo = document.getElementById('input-busca').value.trim().toLowerCase();
        if (!termo) return;
        document.querySelectorAll('.produto').forEach(p => {
            const nome = p.querySelector('h3')?.textContent.toLowerCase() || '';
            const desc = p.querySelector('p')?.textContent.toLowerCase() || '';
            p.style.display = (nome.includes(termo) || desc.includes(termo)) ? 'block' : 'none';
        });
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    vincularBotoesCarrinho();
    atualizarCarrinho();

    // Ajusta altura da sidebar para não ficar atrás do nav
    const nav = document.querySelector('nav');
    const sidebar = document.querySelector('.sidebar-filtro');
    if (nav && sidebar) {
        const navH = nav.offsetHeight;
        sidebar.style.top = navH + 'px';
        sidebar.style.height = `calc(100vh - ${navH}px)`;
    }

    // Fecha carrinho ao clicar fora
    const painelCarrinho = document.getElementById('painel-carrinho');
    if (painelCarrinho) {
        painelCarrinho.addEventListener('click', function (e) {
            if (e.target === this) fecharCarrinho();
        });
    }

    // Fecha modal login ao clicar fora
    const modalLogin = document.getElementById('modal-login');
    if (modalLogin) {
        modalLogin.addEventListener('click', function (e) {
            if (e.target === this) fecharLogin();
        });
    }
});