console.log('FixTintas — JavaScript carregado!');
const todosProdutosGlobal = [
    { nome: 'Tintas Plásticas Básico',   categoria: 'interior',    subcategoria: 'Tintas Plásticas',      preco: 49.90,  descricao: 'Pacote essencial para tintas plásticas.' },
    { nome: 'Tintas Plásticas Premium',  categoria: 'interior',    subcategoria: 'Tintas Plásticas',      preco: 79.90,  descricao: 'Solução completa para acabamento superior.' },
    { nome: 'Tintas Acrílicas Básico',   categoria: 'interior',    subcategoria: 'Tintas Acrílicas',      preco: 49.90,  descricao: 'Tinta acrílica para interiores.' },
    { nome: 'Tintas Acrílicas Premium',  categoria: 'interior',    subcategoria: 'Tintas Acrílicas',      preco: 79.90,  descricao: 'Tinta acrílica premium para interiores.' },
    { nome: 'Massas Corridas Básico',    categoria: 'interior',    subcategoria: 'Massas Corridas',       preco: 39.90,  descricao: 'Massa corrida para nivelamento.' },
    { nome: 'Massas Corridas Premium',   categoria: 'interior',    subcategoria: 'Massas Corridas',       preco: 69.90,  descricao: 'Massa corrida premium.' },
    { nome: 'Latex Básico',              categoria: 'interior',    subcategoria: 'Latex',                 preco: 49.90,  descricao: 'Tinta látex para interiores.' },
    { nome: 'Latex Premium',             categoria: 'interior',    subcategoria: 'Latex',                 preco: 79.90,  descricao: 'Tinta látex premium.' },
    { nome: 'Tintas Acrílicas Exterior', categoria: 'exterior',    subcategoria: 'Tintas Acrílicas',      preco: 59.90,  descricao: 'Tinta acrílica para fachadas.' },
    { nome: 'Vernizes Exterior',         categoria: 'exterior',    subcategoria: 'Vernizes',              preco: 69.90,  descricao: 'Verniz de alta proteção.' },
    { nome: 'Tintas Piso Básico',        categoria: 'exterior',    subcategoria: 'Tintas Piso',           preco: 59.90,  descricao: 'Tinta para pisos externos.' },
    { nome: 'Tintas Piso Profissional',  categoria: 'exterior',    subcategoria: 'Tintas Piso',           preco: 99.90,  descricao: 'Tinta profissional para pisos.' },
    { nome: 'Esmalte Sintético',         categoria: 'moveis',      subcategoria: 'Esmaltes',              preco: 79.90,  descricao: 'Esmalte para móveis.' },
    { nome: 'Esmalte Premium',           categoria: 'moveis',      subcategoria: 'Esmaltes',              preco: 99.90,  descricao: 'Esmalte premium para móveis.' },
    { nome: 'Verniz Madeira',            categoria: 'moveis',      subcategoria: 'Vernizes',              preco: 59.90,  descricao: 'Verniz protetor para madeira.' },
    { nome: 'Tinta Spray Básico',        categoria: 'moveis',      subcategoria: 'Tintas Spray',          preco: 29.90,  descricao: 'Spray para acabamentos rápidos.' },
    { nome: 'Antimofo Premium',          categoria: 'especial',    subcategoria: 'Antimofo',              preco: 89.90,  descricao: 'Tinta antimofo para ambientes úmidos.' },
    { nome: 'Antiferrugem Pro',          categoria: 'especial',    subcategoria: 'Antiferrugem',          preco: 79.90,  descricao: 'Proteção contra ferrugem.' },
    { nome: 'Tinta para Madeira',        categoria: 'especial',    subcategoria: 'Tintas para Madeira',   preco: 69.90,  descricao: 'Tinta especial para madeira.' },
    { nome: 'Suvinil Branco 18L',        categoria: 'marcas',      subcategoria: 'Suvinil',               preco: 189.90, descricao: 'Tinta Suvinil branco 18L.' },
    { nome: 'Coral Premium 18L',         categoria: 'marcas',      subcategoria: 'Coral',                 preco: 179.90, descricao: 'Tinta Coral premium 18L.' },
    { nome: 'Lukscolor 3.6L',            categoria: 'marcas',      subcategoria: 'Lukscolor',             preco: 89.90,  descricao: 'Tinta Lukscolor 3.6L.' },
    { nome: 'Eucatex 18L',               categoria: 'marcas',      subcategoria: 'Eucatex',               preco: 159.90, descricao: 'Tinta Eucatex 18L.' },
    { nome: 'Rolo de Pintura',           categoria: 'ferramentas', subcategoria: 'Rolos',                 preco: 19.90,  descricao: 'Rolo para pintura de paredes.' },
    { nome: 'Pincel Profissional',       categoria: 'ferramentas', subcategoria: 'Pincéis',               preco: 14.90,  descricao: 'Pincel de alta qualidade.' },
    { nome: 'Escada 6 Degraus',          categoria: 'ferramentas', subcategoria: 'Escadas',               preco: 199.90, descricao: 'Escada dobrável 6 degraus.' },
    { nome: 'Bandeja para Tinta',        categoria: 'ferramentas', subcategoria: 'Bandejas',              preco: 12.90,  descricao: 'Bandeja para aplicação de tinta.' },
    { nome: 'Lixa Grossa',              categoria: 'acessorios',  subcategoria: 'Lixas',                 preco: 9.90,   descricao: 'Lixa para preparação de superfícies.' },
    { nome: 'Fita Crepe 50m',           categoria: 'acessorios',  subcategoria: 'Fitas Crepe',           preco: 7.90,   descricao: 'Fita crepe para proteção durante pintura.' },
    { nome: 'Plástico Proteção 4x5m',   categoria: 'acessorios',  subcategoria: 'Plásticos de Proteção', preco: 15.90,  descricao: 'Plástico para proteção de móveis.' },
    { nome: 'Luvas de Proteção',        categoria: 'acessorios',  subcategoria: 'Luvas',                 preco: 12.90,  descricao: 'Luvas para proteção durante pintura.' },
    { nome: 'Máscara Respiratória',     categoria: 'acessorios',  subcategoria: 'Máscaras',              preco: 19.90,  descricao: 'Máscara para proteção ao pintar.' },
];

/* ──────────────────────────────────────────────
   MODAL PRODUTO
────────────────────────────────────────────── */
let produtoAtual = {};
let qtdAtual = 1;

function abrirModalProduto(nome, preco, descricao, subcategoria, volumeFixo, imagem) {
    produtoAtual = { nome, preco, descricao, subcategoria, volumeFixo: volumeFixo || null };
    qtdAtual = 1;

    document.getElementById('modal-nome').textContent = nome;
    document.getElementById('modal-preco').textContent = `R$ ${preco.toFixed(2).replace('.', ',')}`;
    document.getElementById('modal-descricao').textContent = descricao;
    const imgEl = document.getElementById('modal-img');
    if (imagem) {
        imgEl.innerHTML = `<img src="${imagem}" style="width:100%;height:100%;object-fit:contain;border-radius:8px;" alt="${nome}">`;
    } else {
        imgEl.textContent = nome;
    }
    document.getElementById('modal-qtd').textContent = 1;

    const corSel = document.getElementById('cor-selecionada');
    if (corSel) corSel.textContent = 'Nenhuma cor selecionada';

    document.querySelectorAll('.cor-item').forEach(c => c.classList.remove('ativa'));
    document.querySelectorAll('.opcao-btn').forEach(b => b.classList.remove('ativo'));

    const secaoCor        = document.getElementById('secao-cor');
    const secaoVolume     = document.getElementById('secao-volume');
    const secaoAcabamento = document.getElementById('secao-acabamento');
    const volumesBtns     = document.getElementById('modal-volumes');
    const labelVolume     = document.getElementById('label-volume');

    // Produtos da promoção têm volume fixo — tratamos como tinta sem seleção de volume
    const eTinta  = !['Rolos', 'Pincéis', 'Escadas', 'Bandejas',
                      'Lixas', 'Fitas Crepe', 'Plásticos de Proteção',
                      'Luvas', 'Máscaras'].includes(subcategoria);
    const eEscada = subcategoria === 'Escadas';
    const eRolo   = subcategoria === 'Rolos';
    const ePincel = subcategoria === 'Pincéis';

    secaoCor.style.display        = eTinta ? 'block' : 'none';
    secaoAcabamento.style.display = eTinta ? 'block' : 'none';

    // Se volume já está fixo (produtos da promoção), oculta a seção de escolha
    if (volumeFixo) {
        secaoVolume.style.display = 'none';
        volumesBtns.innerHTML = '';
    } else if (eEscada) {
        secaoVolume.style.display = 'block';
        labelVolume.textContent = 'Degraus';
        volumesBtns.innerHTML = `
            <button class="opcao-btn" data-valor="3 degraus">3</button>
            <button class="opcao-btn" data-valor="5 degraus">5</button>
            <button class="opcao-btn" data-valor="7 degraus">7</button>
            <button class="opcao-btn" data-valor="10 degraus">10</button>
        `;
    } else if (eRolo) {
        secaoVolume.style.display = 'block';
        labelVolume.textContent = 'Tamanho';
        volumesBtns.innerHTML = `
            <button class="opcao-btn" data-valor='1"'>1"</button>
            <button class="opcao-btn" data-valor='2"'>2"</button>
            <button class="opcao-btn" data-valor='6"'>6"</button>
        `;
    } else if (ePincel) {
        secaoVolume.style.display = 'block';
        labelVolume.textContent = 'Tamanho';
        volumesBtns.innerHTML = `
            <button class="opcao-btn" data-valor='3/4"'>3/4"</button>
            <button class="opcao-btn" data-valor='1"'>1"</button>
            <button class="opcao-btn" data-valor='2"'>2"</button>
        `;
    } else if (eTinta) {
        secaoVolume.style.display = 'block';
        labelVolume.textContent = 'Volume';
        volumesBtns.innerHTML = `
            <button class="opcao-btn" data-valor="900ml">900ml</button>
            <button class="opcao-btn" data-valor="3,6L">3,6L</button>
            <button class="opcao-btn" data-valor="18L">18L</button>
        `;
    } else {
        secaoVolume.style.display = 'none';
    }

    // Revincula eventos dos novos botões gerados
    document.querySelectorAll('.opcoes-botoes').forEach(grupo => {
        grupo.querySelectorAll('.opcao-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                grupo.querySelectorAll('.opcao-btn').forEach(b => b.classList.remove('ativo'));
                this.classList.add('ativo');
            });
        });
    });

    document.getElementById('modal-produto').style.display = 'flex';
}

function fecharModalProduto() {
    document.getElementById('modal-produto').style.display = 'none';
}

function alterarQtd(delta) {
    qtdAtual = Math.max(1, qtdAtual + delta);
    document.getElementById('modal-qtd').textContent = qtdAtual;
}

function adicionarModalAoCarrinho() {
    const cor        = document.querySelector('.cor-item.ativa')?.dataset.cor || '';
    const acabamento = document.querySelector('#modal-acabamentos .opcao-btn.ativo')?.dataset.valor || '';

    // Se o produto tem volume fixo (promoções), usa ele; senão lê o botão selecionado
    const volume = produtoAtual.volumeFixo
        ? produtoAtual.volumeFixo
        : (document.querySelector('#modal-volumes .opcao-btn.ativo')?.dataset.valor || '');

    const eTinta = !['Rolos', 'Pincéis', 'Escadas', 'Bandejas',
                     'Lixas', 'Fitas Crepe', 'Plásticos de Proteção',
                     'Luvas', 'Máscaras'].includes(produtoAtual.subcategoria);

    const eEscada = produtoAtual.subcategoria === 'Escadas';
    const eRolo   = produtoAtual.subcategoria === 'Rolos';
    const ePincel = produtoAtual.subcategoria === 'Pincéis';

    if (eTinta && !cor)                                    { alert('Selecione uma cor!'); return; }
    if (eTinta && !produtoAtual.volumeFixo && !volume)     { alert('Selecione um volume!'); return; }
    if (eTinta && !acabamento)                             { alert('Selecione um acabamento!'); return; }
    if ((eEscada || eRolo || ePincel) && !volume)          { alert('Selecione um tamanho!'); return; }

    let nomeCompleto = produtoAtual.nome;
    if (volume && !produtoAtual.volumeFixo) nomeCompleto += ` ${volume}`; // volume fixo já está no nome
    if (acabamento)  nomeCompleto += ` ${acabamento}`;
    if (cor)         nomeCompleto += ` ${cor}`;

    for (let i = 0; i < qtdAtual; i++) {
        adicionarAoCarrinho(nomeCompleto, produtoAtual.preco);
    }
    fecharModalProduto();
}

/* ──────────────────────────────────────────────
   DROPDOWN DE BUSCA
────────────────────────────────────────────── */
function iniciarDropdownBusca() {
    const input = document.getElementById('input-busca');
    const dropdown = document.getElementById('dropdown-busca');
    if (!input || !dropdown) return;

    input.addEventListener('input', function () {
        const termo = this.value.trim().toLowerCase();
        if (!termo) {
            dropdown.classList.remove('ativo');
            dropdown.innerHTML = '';
            return;
        }

        const resultados = todosProdutosGlobal
            .filter(p =>
                p.nome.toLowerCase().includes(termo) ||
                p.subcategoria.toLowerCase().includes(termo) ||
                p.categoria.toLowerCase().includes(termo)
            ).slice(0, 6);

        if (resultados.length === 0) {
            dropdown.innerHTML = '<div class="dropdown-vazio">Nenhum produto encontrado</div>';
        } else {
            dropdown.innerHTML = resultados.map(p => `
                <div class="dropdown-item" data-categoria="${p.categoria}" data-sub="${p.subcategoria}">
                    <div class="dropdown-item-nome">${p.nome}</div>
                    <div class="dropdown-item-sub">${p.subcategoria} · ${p.categoria.charAt(0).toUpperCase() + p.categoria.slice(1)}</div>
                </div>
            `).join('');

            dropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', function () {
                    const url = new URL('produtos.html', window.location.href);
                    url.searchParams.set('categoria', this.dataset.categoria);
                    url.searchParams.set('subcategoria', this.dataset.sub);
                    window.location.href = url.toString();
                });
            });
        }
        dropdown.classList.add('ativo');
    });

    document.addEventListener('click', function (e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('ativo');
        }
    });
}

/* ──────────────────────────────────────────────
   BUSCA NAVBAR — redireciona para busca.html
────────────────────────────────────────────── */
function iniciarBuscaNavbar() {
    const btnBusca = document.getElementById('btn-busca');
    const inputBusca = document.getElementById('input-busca');
    if (!btnBusca || !inputBusca) return;
    if (window.location.pathname.includes('produtos.html')) return;

    function executarBusca() {
        const termo = inputBusca.value.trim();
        if (!termo) return;
        const url = new URL('busca.html', window.location.href);
        url.searchParams.set('q', termo);
        window.location.href = url.toString();
    }

    btnBusca.addEventListener('click', executarBusca);
    inputBusca.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') executarBusca();
    });
}

/* ──────────────────────────────────────────────
   BUSCA — exibe resultados na busca.html
────────────────────────────────────────────── */
function exibirResultadosBusca() {
    const params = new URLSearchParams(window.location.search);
    const termo = params.get('q')?.toLowerCase() || '';
    if (!termo) return;

    const titulo    = document.getElementById('titulo-busca');
    const subtitulo = document.getElementById('subtitulo-busca');
    const lista     = document.getElementById('resultados-lista');
    if (!lista) return;

    const resultados = todosProdutosGlobal.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo) ||
        p.subcategoria.toLowerCase().includes(termo) ||
        p.categoria.toLowerCase().includes(termo)
    );

    if (titulo) titulo.textContent = `Resultados para "${termo}"`;
    if (subtitulo) subtitulo.textContent = `${resultados.length} produto(s) encontrado(s)`;

    const input = document.getElementById('input-busca');
    if (input) input.value = termo;

    lista.innerHTML = resultados.length === 0
        ? '<p style="color:#888;">Nenhum produto encontrado.</p>'
        : resultados.map(p => `
            <div class="produto">
                <div class="produto-imagem">${p.subcategoria}</div>
                <h3>${p.nome}</h3>
                <p>${p.descricao}</p>
                <p class="preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</p>
                <button>Adicionar ao Carrinho</button>
            </div>
        `).join('');

    vincularBotoesCarrinho();
}

/* ──────────────────────────────────────────────
   CARRINHO
────────────────────────────────────────────── */
let carrinho = [];

function abrirCarrinho() {
    document.getElementById('painel-carrinho').style.display = 'flex';
}

function fecharCarrinho() {
    document.getElementById('painel-carrinho').style.display = 'none';
}

function adicionarAoCarrinho(nome, preco) {
    const item = carrinho.find(i => i.nome === nome);
    if (item) { item.qtd++; } else { carrinho.push({ nome, preco, qtd: 1 }); }
    atualizarCarrinho();
    mostrarNotificacao(`"${nome}" adicionado ao carrinho!`);
}

function removerDoCarrinho(nome) {
    carrinho = carrinho.filter(i => i.nome !== nome);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const total     = carrinho.reduce((acc, i) => acc + i.preco * i.qtd, 0);
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
            const descricao    = card.querySelector('p:not(.preco)')?.textContent?.trim() || '';
            // Lê subcategoria e volume fixo dos atributos data-* do card (produtos da promoção)
            const subcategoria = card.dataset.subcategoria || card.querySelector('.produto-imagem')?.textContent?.trim() || 'Tintas Acrílicas';
            const volumeFixo   = card.dataset.volumeFixo || null;
            abrirModalProduto(nome, preco, descricao, subcategoria, volumeFixo);
        });
    });
}

/* ──────────────────────────────────────────────
   LOGIN / REGISTRO
────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────
   VALIDAÇÃO DE IDADE
────────────────────────────────────────────── */
function definirIdadeMinima() {
    const input = document.getElementById('data-nascimento');
    if (!input) return;
    const hoje = new Date();
    hoje.setFullYear(hoje.getFullYear() - 18);
    input.max = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,'0')}-${String(hoje.getDate()).padStart(2,'0')}`;

    const btnCadastrar = document.getElementById('btn-cadastrar');
    if (!btnCadastrar) return;
    btnCadastrar.addEventListener('click', function () {
        if (!input.value) { alert('Por favor, informe sua data de nascimento.'); return; }
        const nascimento = new Date(input.value);
        const minima = new Date();
        minima.setFullYear(minima.getFullYear() - 18);
        if (nascimento > minima) {
            alert('Você precisa ter pelo menos 18 anos para se cadastrar.');
            input.value = '';
            return;
        }
        alert('Cadastro realizado com sucesso!');
    });
}

/* ──────────────────────────────────────────────
   CARROSSEL
────────────────────────────────────────────── */
(function iniciarCarrossel() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    let atual = 0;
    function mostrarSlide(index) {
        slides.forEach(s => s.classList.remove('ativo'));
        slides[index].classList.add('ativo');
    }
    const btnProximo  = document.querySelector('.btn-carrossel.proximo');
    const btnAnterior = document.querySelector('.btn-carrossel.anterior');
    if (btnProximo)  btnProximo.addEventListener('click',  () => { atual = (atual + 1) % slides.length; mostrarSlide(atual); });
    if (btnAnterior) btnAnterior.addEventListener('click', () => { atual = (atual - 1 + slides.length) % slides.length; mostrarSlide(atual); });
    setInterval(() => { atual = (atual + 1) % slides.length; mostrarSlide(atual); }, 5000);
})();

/* ──────────────────────────────────────────────
   SIDEBAR — CATEGORIAS (index.html)
────────────────────────────────────────────── */
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
                    ${sub}<span class="seta">›</span>
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
    cat.addEventListener('click', function () { abrirSubcategoria(this.dataset.categoria); });
});

/* ──────────────────────────────────────────────
   INICIALIZAÇÃO — único DOMContentLoaded
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    vincularBotoesCarrinho();
    atualizarCarrinho();
    definirIdadeMinima();
    iniciarDropdownBusca();
    iniciarBuscaNavbar();

    if (window.location.pathname.includes('busca.html')) {
        exibirResultadosBusca();
    }

    // Ajusta sidebar abaixo da nav
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

    // Fecha modal produto ao clicar fora
    const modalProduto = document.getElementById('modal-produto');
    if (modalProduto) {
        modalProduto.addEventListener('click', function (e) {
            if (e.target === this) fecharModalProduto();
        });
    }

    // Cores
    document.querySelectorAll('.cor-item').forEach(cor => {
        cor.addEventListener('click', function () {
            document.querySelectorAll('.cor-item').forEach(c => c.classList.remove('ativa'));
            this.classList.add('ativa');
            const label = document.getElementById('cor-selecionada');
            if (label) label.textContent = `Cor: ${this.dataset.cor}`;
        });
    });
});