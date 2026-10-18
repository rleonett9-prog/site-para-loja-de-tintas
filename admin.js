/* ==========================================================
   Painel do Funcionário - FixTintas
   ----------------------------------------------------------
   A sessão e o login vêm do auth.js (o mesmo login do site).
   O modo MOCK/API é escolhido em AUTH_CONFIG (auth.js).

   Endpoints de produtos (JSON, com Authorization: Bearer <token>):
   GET    /produtos                            -> [produto]
   POST   /produtos          produto           -> produto (com id)
   PUT    /produtos/:id      produto           -> produto
   DELETE /produtos/:id                        -> 204   (somente gerente)
   POST   /upload            FormData(imagem)  -> { url }

   Modelo de produto:
   { id, nome, categoria, subcategoria, marca, volumes: [string],
     preco, preco_de, quantidade, estoque_minimo, descricao,
     imagem_url, ativo }

   Regras de permissão (a API deve aplicar as mesmas, devolvendo 403):
   - funcionario: cria produtos, edita dados, imagem e estoque.
                  NÃO altera preço de produto já cadastrado e NÃO exclui.
   - gerente:     tudo isso + altera preços, exclui e gerencia funcionários.
   ========================================================== */

const CONFIG = {
    USAR_MOCK: AUTH_CONFIG.USAR_MOCK,
    MAX_IMAGEM_MB: 2
};

const CATEGORIAS = {
    interior:    { nome: 'Interior',    subs: ['Tintas Plásticas', 'Tintas Acrílicas', 'Massas Corridas', 'Latex'] },
    exterior:    { nome: 'Exterior',    subs: ['Tintas Acrílicas', 'Vernizes', 'Tintas Piso', 'Latex'] },
    moveis:      { nome: 'Móveis',      subs: ['Esmaltes', 'Vernizes', 'Tintas Spray'] },
    especial:    { nome: 'Especial',    subs: ['Antimofo', 'Antiferrugem', 'Tintas para Madeira'] },
    marcas:      { nome: 'Marcas',      subs: ['Suvinil', 'Coral', 'Lukscolor', 'Eucatex'] },
    ferramentas: { nome: 'Ferramentas', subs: ['Rolos', 'Pincéis', 'Escadas', 'Bandejas'] },
    acessorios:  { nome: 'Acessórios',  subs: ['Lixas', 'Fitas Crepe', 'Plásticos de Proteção', 'Luvas', 'Máscaras'] }
};

/* ---------- Camada de API de produtos (real + mock) ---------- */
const MOCK_KEY = 'fixtintas_admin_produtos';

const MOCK_INICIAL = [
    { id: 1, nome: 'Tinta Eucatex interna 18 litros', categoria: 'interior', subcategoria: 'Tintas Acrílicas', marca: 'Eucatex', volumes: ['18L'], preco: 249.90, preco_de: 264.99, quantidade: 14, estoque_minimo: 5, descricao: 'Tinta de alta qualidade para interiores', imagem_url: '', ativo: true },
    { id: 2, nome: 'Tinta Suvinil externa 3,6 litros', categoria: 'exterior', subcategoria: 'Tintas Acrílicas', marca: 'Suvinil', volumes: ['3,6L'], preco: 54.90, preco_de: 69.90, quantidade: 3, estoque_minimo: 5, descricao: 'Tinta de alta qualidade para fachadas', imagem_url: '', ativo: true },
    { id: 3, nome: 'Tinta Lukscolor 1 litro', categoria: 'interior', subcategoria: 'Latex', marca: 'Lukscolor', volumes: ['1L'], preco: 19.90, preco_de: 24.90, quantidade: 0, estoque_minimo: 10, descricao: 'Tinta para ambientes externos', imagem_url: '', ativo: true },
    { id: 4, nome: 'Rolo de Pintura', categoria: 'ferramentas', subcategoria: 'Rolos', marca: '', volumes: [], preco: 19.90, preco_de: null, quantidade: 40, estoque_minimo: 10, descricao: 'Rolo para pintura de paredes.', imagem_url: '', ativo: false }
];

function mockLer() {
    try {
        const salvo = localStorage.getItem(MOCK_KEY);
        if (salvo) return JSON.parse(salvo);
    } catch (e) {}
    return JSON.parse(JSON.stringify(MOCK_INICIAL));
}
function mockGravar(lista) {
    try { localStorage.setItem(MOCK_KEY, JSON.stringify(lista)); } catch (e) {
        throw new Error('Armazenamento de teste cheio. Use imagens menores.');
    }
}
// No modo demo, simula as respostas 403 que a API real deve dar.
function mockExigirEquipe() {
    if (!Auth.ehEquipe()) throw new Error('Sem permissão.');
}
function mockExigirGerente(acao) {
    if (!Auth.ehGerente()) throw new Error(`Sem permissão: apenas o gerente pode ${acao}.`);
}

function reduzirImagem(file, larguraMax = 500) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onerror = () => reject(new Error('Falha ao ler a imagem.'));
        leitor.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('Imagem inválida.'));
            img.onload = () => {
                const escala = Math.min(1, larguraMax / img.width);
                const c = document.createElement('canvas');
                c.width = Math.round(img.width * escala);
                c.height = Math.round(img.height * escala);
                c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
                resolve(c.toDataURL('image/jpeg', 0.8));
            };
            img.src = leitor.result;
        };
        leitor.readAsDataURL(file);
    });
}

const API = {
    async listar() {
        if (CONFIG.USAR_MOCK) { mockExigirEquipe(); return mockLer(); }
        return Auth.req('/produtos');
    },
    async criar(p) {
        if (CONFIG.USAR_MOCK) {
            mockExigirEquipe();
            const lista = mockLer();
            p.id = lista.reduce((m, x) => Math.max(m, x.id), 0) + 1;
            lista.push(p); mockGravar(lista); return p;
        }
        return Auth.req('/produtos', { method: 'POST', body: JSON.stringify(p) });
    },
    async atualizar(id, p) {
        if (CONFIG.USAR_MOCK) {
            mockExigirEquipe();
            const lista = mockLer();
            const i = lista.findIndex(x => x.id === id);
            if (i < 0) throw new Error('Produto não encontrado.');
            const atual = lista[i];
            const mudouPreco = Number(p.preco) !== Number(atual.preco) || (p.preco_de ?? null) !== (atual.preco_de ?? null);
            if (mudouPreco) mockExigirGerente('alterar preços');
            lista[i] = { ...atual, ...p, id }; mockGravar(lista); return lista[i];
        }
        return Auth.req('/produtos/' + id, { method: 'PUT', body: JSON.stringify(p) });
    },
    async excluir(id) {
        if (CONFIG.USAR_MOCK) {
            mockExigirGerente('excluir produtos');
            mockGravar(mockLer().filter(x => x.id !== id));
            return;
        }
        return Auth.req('/produtos/' + id, { method: 'DELETE' });
    },
    async enviarImagem(file) {
        if (CONFIG.USAR_MOCK) { mockExigirEquipe(); return { url: await reduzirImagem(file) }; }
        const fd = new FormData();
        fd.append('imagem', file);
        return Auth.req('/upload', { method: 'POST', body: fd });
    }
};

/* ---------- Estado e utilidades ---------- */
let produtos = [];
let funcionarios = [];
let imagemAtual = '';   // url da imagem no formulário

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const moeda = v => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',');

function toast(msg, erro = false) {
    const t = $('toast');
    t.textContent = msg;
    t.className = 'toast visivel' + (erro ? ' erro-toast' : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('visivel'), 3000);
}

function situacao(p) {
    if (p.quantidade <= 0) return 'zerado';
    if (p.quantidade <= (p.estoque_minimo || 0)) return 'baixo';
    return 'ok';
}

/* ---------- Carregamento e renderização ---------- */
async function carregar() {
    try {
        produtos = await API.listar();
        renderizar();
    } catch (err) {
        toast(err.message, true);
    }
}

function renderizar() {
    renderCards();
    renderTabelaProdutos();
    renderTabelaEstoque();
}

function renderCards() {
    $('card-total').textContent = produtos.length;
    $('card-ativos').textContent = produtos.filter(p => p.ativo).length;
    $('card-baixo').textContent = produtos.filter(p => situacao(p) === 'baixo').length;
    $('card-zerado').textContent = produtos.filter(p => situacao(p) === 'zerado').length;
}

function thumb(p) {
    return p.imagem_url
        ? `<div class="thumb"><img src="${esc(p.imagem_url)}" alt=""></div>`
        : `<div class="thumb">sem foto</div>`;
}

function badgeEstoque(p) {
    const s = situacao(p);
    const rotulo = { ok: 'Em estoque', baixo: 'Estoque baixo', zerado: 'Sem estoque' }[s];
    return `<span class="badge ${s}">${rotulo}</span>`;
}

function renderTabelaProdutos() {
    const termo = $('f-busca').value.toLowerCase().trim();
    const cat = $('f-categoria').value;
    const st = $('f-status').value;
    const podeExcluir = Auth.ehGerente();

    const lista = produtos.filter(p => {
        if (termo && !(p.nome.toLowerCase().includes(termo) || (p.marca || '').toLowerCase().includes(termo))) return false;
        if (cat && p.categoria !== cat) return false;
        if (st === 'ativo' && !p.ativo) return false;
        if (st === 'inativo' && p.ativo) return false;
        if ((st === 'baixo' || st === 'zerado') && situacao(p) !== st) return false;
        return true;
    });

    $('tabela-produtos').innerHTML = lista.length ? lista.map(p => `
        <tr>
            <td>${thumb(p)}</td>
            <td><strong>${esc(p.nome)}</strong>${p.marca ? `<span class="sub">${esc(p.marca)}</span>` : ''}</td>
            <td>${esc(CATEGORIAS[p.categoria]?.nome || p.categoria)}<span class="sub">${esc(p.subcategoria || '')}</span></td>
            <td>${p.preco_de ? `<span class="preco-de">${moeda(p.preco_de)}</span>` : ''}${moeda(p.preco)}</td>
            <td>${p.quantidade} un. ${badgeEstoque(p)}</td>
            <td><span class="badge ${p.ativo ? 'ok' : 'inativo'}">${p.ativo ? 'Ativo' : 'Oculto'}</span></td>
            <td class="acoes">
                <button class="btn btn-secundario btn-sm" data-editar="${p.id}">Editar</button>
                ${podeExcluir ? `<button class="btn btn-perigo btn-sm" data-excluir="${p.id}">Excluir</button>` : ''}
            </td>
        </tr>`).join('')
        : '<tr><td colspan="7" class="vazio">Nenhum produto encontrado.</td></tr>';
}

function renderTabelaEstoque() {
    const termo = $('e-busca').value.toLowerCase().trim();
    const lista = produtos.filter(p => !termo || p.nome.toLowerCase().includes(termo));
    $('tabela-estoque').innerHTML = lista.length ? lista.map(p => `
        <tr class="linha-${situacao(p) === 'ok' ? '' : situacao(p)}">
            <td><strong>${esc(p.nome)}</strong> ${badgeEstoque(p)}</td>
            <td>${p.estoque_minimo ?? 0}</td>
            <td><input type="number" min="0" step="1" class="input-qtd" value="${p.quantidade}" data-qtd="${p.id}"></td>
            <td><button class="btn btn-primario btn-sm" data-salvar-qtd="${p.id}">Salvar</button></td>
        </tr>`).join('')
        : '<tr><td colspan="4" class="vazio">Nenhum produto encontrado.</td></tr>';
}

/* ---------- Navegação ---------- */
const VIEWS = ['produtos', 'estoque', 'funcionarios'];

function mostrarView(nome) {
    if (nome === 'funcionarios' && !Auth.ehGerente()) nome = 'produtos';
    document.querySelectorAll('.menu-item').forEach(b => b.classList.toggle('ativo', b.dataset.view === nome));
    VIEWS.forEach(v => { $('view-' + v).style.display = v === nome ? '' : 'none'; });
    if (nome === 'funcionarios') carregarFuncionarios();
}

document.querySelectorAll('.menu-item').forEach(btn => {
    btn.addEventListener('click', () => mostrarView(btn.dataset.view));
});

/* ---------- Filtros ---------- */
$('f-categoria').innerHTML += Object.entries(CATEGORIAS).map(([k, v]) => `<option value="${k}">${v.nome}</option>`).join('');
['f-busca', 'f-categoria', 'f-status'].forEach(id => $(id).addEventListener('input', renderTabelaProdutos));
$('e-busca').addEventListener('input', renderTabelaEstoque);

/* ---------- Ações na tabela (delegação) ---------- */
$('tabela-produtos').addEventListener('click', async e => {
    const ed = e.target.closest('[data-editar]');
    const ex = e.target.closest('[data-excluir]');
    if (ed) abrirModal(produtos.find(p => p.id === Number(ed.dataset.editar)));
    if (ex) {
        const p = produtos.find(x => x.id === Number(ex.dataset.excluir));
        if (!p || !confirm(`Excluir "${p.nome}"? Esta ação não pode ser desfeita.`)) return;
        try { await API.excluir(p.id); toast('Produto excluído.'); await carregar(); }
        catch (err) { toast(err.message, true); }
    }
});

$('tabela-estoque').addEventListener('click', async e => {
    const btn = e.target.closest('[data-salvar-qtd]');
    if (!btn) return;
    const id = Number(btn.dataset.salvarQtd);
    const input = document.querySelector(`[data-qtd="${id}"]`);
    const qtd = parseInt(input.value, 10);
    if (isNaN(qtd) || qtd < 0) { toast('Quantidade inválida.', true); return; }
    btn.disabled = true;
    try {
        const p = produtos.find(x => x.id === id);
        await API.atualizar(id, { ...p, quantidade: qtd });
        toast('Estoque atualizado.');
        await carregar();
    } catch (err) { toast(err.message, true); btn.disabled = false; }
});

/* ---------- Modal de produto ---------- */
$('p-categoria').innerHTML = Object.entries(CATEGORIAS).map(([k, v]) => `<option value="${k}">${v.nome}</option>`).join('');

function preencherSubs(cat, selecionada = '') {
    const subs = CATEGORIAS[cat]?.subs || [];
    $('p-subcategoria').innerHTML = '<option value="">—</option>' + subs.map(s => `<option ${s === selecionada ? 'selected' : ''}>${esc(s)}</option>`).join('');
}
$('p-categoria').addEventListener('change', e => preencherSubs(e.target.value));

function mostrarPreview(url) {
    imagemAtual = url || '';
    $('p-preview').innerHTML = url ? `<img src="${esc(url)}" alt="Pré-visualização">` : 'Sem imagem';
}

function abrirModal(p) {
    $('p-erro').textContent = '';
    $('form-produto').reset();
    $('modal-titulo').textContent = p ? 'Editar produto' : 'Novo produto';
    $('p-id').value = p ? p.id : '';
    $('p-nome').value = p?.nome || '';
    $('p-categoria').value = p?.categoria || 'interior';
    preencherSubs($('p-categoria').value, p?.subcategoria || '');
    $('p-marca').value = p?.marca || '';
    $('p-volume').value = (p?.volumes || []).join(', ');
    $('p-preco').value = p?.preco ?? '';
    $('p-preco-de').value = p?.preco_de ?? '';
    $('p-qtd').value = p?.quantidade ?? 0;
    $('p-min').value = p?.estoque_minimo ?? 5;
    $('p-descricao').value = p?.descricao || '';
    $('p-ativo').checked = p ? !!p.ativo : true;

    // Funcionário não altera preço de produto já cadastrado (só o gerente)
    const travarPreco = !!p && !Auth.ehGerente();
    $('p-preco').disabled = travarPreco;
    $('p-preco-de').disabled = travarPreco;
    $('p-aviso-preco').style.display = travarPreco ? '' : 'none';

    mostrarPreview(p?.imagem_url || '');
    $('modal-produto').style.display = 'flex';
    $('p-nome').focus();
}

function fecharModal() { $('modal-produto').style.display = 'none'; }

$('btn-novo').addEventListener('click', () => abrirModal(null));
$('btn-fechar-modal').addEventListener('click', fecharModal);
$('btn-cancelar').addEventListener('click', fecharModal);
$('modal-produto').addEventListener('mousedown', e => { if (e.target === $('modal-produto')) fecharModal(); });

$('p-imagem').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        $('p-erro').textContent = 'Formato inválido. Use PNG, JPG ou WEBP.'; e.target.value = ''; return;
    }
    if (file.size > CONFIG.MAX_IMAGEM_MB * 1024 * 1024) {
        $('p-erro').textContent = `A imagem deve ter no máximo ${CONFIG.MAX_IMAGEM_MB} MB.`; e.target.value = ''; return;
    }
    $('p-erro').textContent = '';
    try {
        const r = await API.enviarImagem(file);
        mostrarPreview(r.url);
    } catch (err) {
        $('p-erro').textContent = err.message;
    }
});
$('btn-remover-img').addEventListener('click', () => { mostrarPreview(''); $('p-imagem').value = ''; });

$('form-produto').addEventListener('submit', async e => {
    e.preventDefault();
    const nome = $('p-nome').value.trim();
    const preco = parseFloat($('p-preco').value);
    const preco_de = $('p-preco-de').value === '' ? null : parseFloat($('p-preco-de').value);
    const quantidade = parseInt($('p-qtd').value, 10);
    const estoque_minimo = parseInt($('p-min').value, 10) || 0;

    let erro = '';
    if (!nome) erro = 'Informe o nome do produto.';
    else if (isNaN(preco) || preco <= 0) erro = 'Informe um preço válido.';
    else if (preco_de !== null && preco_de < preco) erro = 'O preço "De" deve ser maior que o preço atual.';
    else if (isNaN(quantidade) || quantidade < 0) erro = 'Informe uma quantidade válida (0 ou mais).';
    if (erro) { $('p-erro').textContent = erro; return; }

    const dados = {
        nome,
        categoria: $('p-categoria').value,
        subcategoria: $('p-subcategoria').value,
        marca: $('p-marca').value.trim(),
        volumes: $('p-volume').value.split(',').map(v => v.trim()).filter(Boolean),
        preco, preco_de, quantidade, estoque_minimo,
        descricao: $('p-descricao').value.trim(),
        imagem_url: imagemAtual,
        ativo: $('p-ativo').checked
    };

    const id = $('p-id').value ? Number($('p-id').value) : null;
    $('btn-salvar').disabled = true;
    try {
        if (id) await API.atualizar(id, dados); else await API.criar(dados);
        fecharModal();
        toast(id ? 'Produto atualizado.' : 'Produto cadastrado.');
        await carregar();
    } catch (err) {
        $('p-erro').textContent = err.message;
    } finally {
        $('btn-salvar').disabled = false;
    }
});

/* ---------- Funcionários (somente gerente) ---------- */
async function carregarFuncionarios() {
    if (!Auth.ehGerente()) return;
    try {
        funcionarios = await Auth.api.listarFuncionarios();
        renderFuncionarios();
    } catch (err) {
        toast(err.message, true);
    }
}

function renderFuncionarios() {
    const eu = Auth.sessao()?.id;
    $('tabela-funcionarios').innerHTML = funcionarios.length ? funcionarios.map(f => `
        <tr>
            <td><strong>${esc(f.nome)}</strong>${f.id === eu ? '<span class="sub">você</span>' : ''}</td>
            <td>${esc(f.email)}</td>
            <td>${esc(Auth.rotuloPerfil(f.perfil))}</td>
            <td>
                <span class="badge ${f.ativo ? 'ok' : 'inativo'}">${f.ativo ? 'Ativo' : 'Desativado'}</span>
                ${f.trocar_senha ? '<span class="badge baixo">Senha temporária</span>' : ''}
            </td>
            <td class="acoes">
                <button class="btn btn-sm ${f.ativo ? 'btn-perigo' : 'btn-secundario'}" data-alternar="${f.id}" ${f.id === eu ? 'disabled' : ''}>
                    ${f.ativo ? 'Desativar' : 'Reativar'}
                </button>
            </td>
        </tr>`).join('')
        : '<tr><td colspan="5" class="vazio">Nenhum funcionário cadastrado.</td></tr>';
}

$('tabela-funcionarios').addEventListener('click', async e => {
    const btn = e.target.closest('[data-alternar]');
    if (!btn) return;
    const f = funcionarios.find(x => x.id === Number(btn.dataset.alternar));
    if (!f) return;
    const acao = f.ativo ? 'desativar' : 'reativar';
    if (!confirm(`Deseja ${acao} o acesso de ${f.nome}?`)) return;
    btn.disabled = true;
    try {
        await Auth.api.alternarAtivo(f.id, !f.ativo);
        toast(f.ativo ? 'Funcionário desativado.' : 'Funcionário reativado.');
        await carregarFuncionarios();
    } catch (err) {
        toast(err.message, true);
        btn.disabled = false;
    }
});

function gerarSenhaTemporaria() {
    const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const todos = letras + '23456789';
    let s;
    do {
        const bytes = new Uint32Array(10);
        crypto.getRandomValues(bytes);
        s = Array.from(bytes, b => todos[b % todos.length]).join('');
    } while (!/[A-Za-z]/.test(s) || !/\d/.test(s));
    return s;
}

function abrirModalFunc() {
    $('form-func').reset();
    $('f-erro').textContent = '';
    $('f-senha').value = gerarSenhaTemporaria();
    $('modal-func').style.display = 'flex';
    $('f-nome').focus();
}
function fecharModalFunc() { $('modal-func').style.display = 'none'; }

$('btn-novo-func').addEventListener('click', abrirModalFunc);
$('btn-fechar-func').addEventListener('click', fecharModalFunc);
$('btn-cancelar-func').addEventListener('click', fecharModalFunc);
$('modal-func').addEventListener('mousedown', e => { if (e.target === $('modal-func')) fecharModalFunc(); });
$('btn-gerar-senha').addEventListener('click', () => { $('f-senha').value = gerarSenhaTemporaria(); });

$('form-func').addEventListener('submit', async e => {
    e.preventDefault();
    const nome = $('f-nome').value.trim();
    const email = $('f-email').value.trim();
    const perfil = $('f-perfil').value;
    const senha = $('f-senha').value;

    let erro = '';
    if (nome.split(/\s+/).length < 2) erro = 'Informe o nome completo.';
    else if (!Auth.emailValido(email)) erro = 'Informe um e-mail válido.';
    else if (Auth.validarSenha(senha)) erro = Auth.validarSenha(senha);
    if (erro) { $('f-erro').textContent = erro; return; }

    $('btn-salvar-func').disabled = true;
    try {
        await Auth.api.criarFuncionario({ nome, email, perfil, senha_temporaria: senha });
        fecharModalFunc();
        const aviso = $('aviso-senha');
        aviso.innerHTML = `
            <strong>${esc(nome)}</strong> foi cadastrado(a) (${esc(email)}).<br>
            Senha temporária: <code>${esc(senha)}</code> — entregue pessoalmente. Ela não será exibida novamente e deverá ser trocada no primeiro acesso.
            <button type="button" class="btn btn-sm btn-secundario" id="btn-fechar-aviso">Entendi</button>`;
        aviso.style.display = '';
        $('btn-fechar-aviso').addEventListener('click', () => { aviso.style.display = 'none'; aviso.innerHTML = ''; });
        await carregarFuncionarios();
    } catch (err) {
        $('f-erro').textContent = err.message;
    } finally {
        $('btn-salvar-func').disabled = false;
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { fecharModal(); fecharModalFunc(); }
});

/* ---------- Sessão: sair e alterar senha ---------- */
$('btn-sair').addEventListener('click', () => Auth.sair());
$('btn-senha').addEventListener('click', () => Auth.abrirModalSenha(false));

/* ---------- Início ---------- */
(async function iniciarPainel() {
    // Só funcionário ou gerente com conta ativa entra; os demais voltam para a loja.
    if (!(await Auth.exigirEquipe())) return;
    const s = Auth.sessao();
    $('usuario-nome').textContent = `${s.nome} · ${Auth.rotuloPerfil(s.perfil)}`;
    $('menu-funcionarios').style.display = Auth.ehGerente() ? '' : 'none';
    $('app').style.display = 'flex';
    carregar();
})();
