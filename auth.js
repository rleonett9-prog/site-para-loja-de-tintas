/* ==========================================================
   auth.js — Sessão, login, cadastro e perfis (FixTintas)
   Carregue ANTES de script.js e admin.js em todas as páginas.
   ----------------------------------------------------------
   Para ligar na sua API: troque USAR_MOCK para false e ajuste
   API_URL. Contrato esperado (JSON, header Authorization: Bearer <token>):

   POST  /auth/login           { email, senha }
         -> { token, id, nome, email, perfil, trocar_senha }
   POST  /auth/register        { nome, cpf, nascimento, telefone, email, senha }
         -> 201   (SEMPRE cria perfil "cliente"; ignore qualquer "perfil" enviado)
   GET   /auth/me              -> { id, nome, email, perfil, trocar_senha }
   POST  /auth/trocar-senha    { senha_atual, nova_senha } -> 204

   Somente perfil "gerente":
   GET   /funcionarios         -> [{ id, nome, email, perfil, ativo }]
   POST  /funcionarios         { nome, email, perfil, senha_temporaria }
         -> funcionário criado com trocar_senha = true
   PATCH /funcionarios/:id     { ativo }

   Perfis: "cliente" | "funcionario" | "gerente"

   IMPORTANTE: esconder botões no front NÃO é segurança. Toda rota
   de produtos, estoque, upload e funcionários deve checar o perfil
   do token na API (responder 401 sem token e 403 sem permissão).
   O modo MOCK abaixo existe só para demonstração.
   ========================================================== */

const AUTH_CONFIG = {
    API_URL: 'http://localhost:3000/api',
    USAR_MOCK: true
};

(function () {
    const CHAVE_SESSAO = 'fix_sessao';
    const CHAVE_USUARIOS = 'fixtintas_usuarios';
    const ROTULOS = { cliente: 'Cliente', funcionario: 'Funcionário', gerente: 'Gerente' };

    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    /* ---------- Sessão ---------- */
    function lerSessao() {
        try { return JSON.parse(sessionStorage.getItem(CHAVE_SESSAO)); } catch (e) { return null; }
    }
    function gravarSessao(s) {
        try { sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(s)); } catch (e) {}
    }
    function limparSessao() {
        try { sessionStorage.removeItem(CHAVE_SESSAO); } catch (e) {}
    }
    const logado = () => !!lerSessao();
    const token = () => lerSessao()?.token || '';
    const ehEquipe = () => ['funcionario', 'gerente'].includes(lerSessao()?.perfil);
    const ehGerente = () => lerSessao()?.perfil === 'gerente';

    /* ---------- Validações ---------- */
    function emailValido(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
    function cpfValido(c) {
        c = String(c).replace(/\D/g, '');
        if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
        for (let t = 9; t < 11; t++) {
            let s = 0;
            for (let i = 0; i < t; i++) s += Number(c[i]) * (t + 1 - i);
            const d = ((s * 10) % 11) % 10;
            if (d !== Number(c[t])) return false;
        }
        return true;
    }
    function validarSenha(s) {
        if (!s || s.length < 8 || !/[A-Za-z]/.test(s) || !/\d/.test(s))
            return 'A senha deve ter no mínimo 8 caracteres, com letras e números.';
        return '';
    }

    /* ---------- Requisição à API real ---------- */
    function aoSessaoExpirar() {
        limparSessao();
        atualizarBarra();
        if (document.body && document.body.dataset.area === 'admin') location.replace('index.html');
    }

    async function req(caminho, opcoes = {}, publico = false) {
        const headers = { ...(opcoes.headers || {}) };
        const t = token();
        if (t && !publico) headers.Authorization = 'Bearer ' + t;
        if (opcoes.body && !(opcoes.body instanceof FormData)) headers['Content-Type'] = 'application/json';
        let resp;
        try {
            resp = await fetch(AUTH_CONFIG.API_URL + caminho, { ...opcoes, headers });
        } catch (e) {
            throw new Error('Não foi possível conectar ao servidor.');
        }
        if (resp.status === 401 && !publico) {
            aoSessaoExpirar();
            throw new Error('Sessão expirada. Entre novamente.');
        }
        if (!resp.ok) {
            let msg = resp.status === 403 ? 'Você não tem permissão para esta ação.' : 'Erro ' + resp.status;
            try { msg = (await resp.json()).mensagem || msg; } catch (e) {}
            throw new Error(msg);
        }
        return resp.status === 204 ? null : resp.json();
    }

    /* ---------- Mock (somente demonstração) ---------- */
    async function hash(txt) {
        try {
            if (window.crypto && crypto.subtle) {
                const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('fixtintas:' + txt));
                return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
            }
        } catch (e) {}
        // Fallback (navegador sem crypto.subtle, ex.: página aberta via file://).
        // Hash simples só para a demo não guardar a senha em texto puro.
        let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
        const s = 'fixtintas:' + txt;
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i);
            h1 = Math.imul(h1 ^ c, 2654435761);
            h2 = Math.imul(h2 ^ c, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return 'weak:' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
    }

    async function mockLerUsuarios() {
        try {
            const salvo = localStorage.getItem(CHAVE_USUARIOS);
            if (salvo) return JSON.parse(salvo);
        } catch (e) {}
        const lista = [
            { id: 1, nome: 'Gerente Demo', email: 'gerente@fixtintas.com', senha_hash: await hash('Gerente@123'), perfil: 'gerente', ativo: true, trocar_senha: false },
            { id: 2, nome: 'Funcionário Demo', email: 'funcionario@fixtintas.com', senha_hash: await hash('Func@123'), perfil: 'funcionario', ativo: true, trocar_senha: false }
        ];
        mockGravarUsuarios(lista);
        return lista;
    }
    function mockGravarUsuarios(lista) {
        try { localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista)); } catch (e) {
            throw new Error('Não foi possível salvar (armazenamento do navegador indisponível).');
        }
    }
    const semHash = u => { const { senha_hash, ...resto } = u; return resto; };
    function mockExigirGerente() {
        if (lerSessao()?.perfil !== 'gerente') throw new Error('Sem permissão: apenas o gerente pode fazer isso.');
    }

    /* ---------- API de autenticação (real + mock) ---------- */
    const api = {
        async login(email, senha) {
            if (AUTH_CONFIG.USAR_MOCK) {
                const lista = await mockLerUsuarios();
                const u = lista.find(x => x.email.toLowerCase() === email.toLowerCase());
                if (!u || u.senha_hash !== await hash(senha)) throw new Error('E-mail ou senha incorretos.');
                if (!u.ativo) throw new Error('Conta desativada. Procure o gerente da loja.');
                return { token: 'mock-' + u.id, id: u.id, nome: u.nome, email: u.email, perfil: u.perfil, trocar_senha: !!u.trocar_senha };
            }
            return req('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }, true);
        },

        async registrar(d) {
            if (AUTH_CONFIG.USAR_MOCK) {
                const lista = await mockLerUsuarios();
                if (lista.some(x => x.email.toLowerCase() === d.email.toLowerCase())) throw new Error('Este e-mail já está cadastrado.');
                if (lista.some(x => x.cpf && x.cpf === d.cpf)) throw new Error('Este CPF já está cadastrado.');
                const id = lista.reduce((m, x) => Math.max(m, x.id), 0) + 1;
                // Cadastro público SEMPRE vira cliente, qualquer que seja o dado recebido.
                lista.push({ id, nome: d.nome, cpf: d.cpf, nascimento: d.nascimento, telefone: d.telefone, email: d.email, senha_hash: await hash(d.senha), perfil: 'cliente', ativo: true, trocar_senha: false });
                mockGravarUsuarios(lista);
                return null;
            }
            return req('/auth/register', { method: 'POST', body: JSON.stringify(d) }, true);
        },

        async me() {
            if (AUTH_CONFIG.USAR_MOCK) {
                const s = lerSessao();
                const u = (await mockLerUsuarios()).find(x => x.id === s?.id);
                if (!u || !u.ativo) throw new Error('Conta inativa ou inexistente.');
                return { id: u.id, nome: u.nome, email: u.email, perfil: u.perfil, trocar_senha: !!u.trocar_senha };
            }
            return req('/auth/me');
        },

        async trocarSenha(atual, nova) {
            if (AUTH_CONFIG.USAR_MOCK) {
                const lista = await mockLerUsuarios();
                const u = lista.find(x => x.id === lerSessao()?.id);
                if (!u) throw new Error('Usuário não encontrado.');
                if (u.senha_hash !== await hash(atual)) throw new Error('Senha atual incorreta.');
                u.senha_hash = await hash(nova);
                u.trocar_senha = false;
                mockGravarUsuarios(lista);
                return null;
            }
            return req('/auth/trocar-senha', { method: 'POST', body: JSON.stringify({ senha_atual: atual, nova_senha: nova }) });
        },

        async listarFuncionarios() {
            if (AUTH_CONFIG.USAR_MOCK) {
                mockExigirGerente();
                return (await mockLerUsuarios()).filter(u => u.perfil !== 'cliente').map(semHash);
            }
            return req('/funcionarios');
        },

        async criarFuncionario(d) {
            if (AUTH_CONFIG.USAR_MOCK) {
                mockExigirGerente();
                if (!['funcionario', 'gerente'].includes(d.perfil)) throw new Error('Perfil inválido.');
                const lista = await mockLerUsuarios();
                if (lista.some(x => x.email.toLowerCase() === d.email.toLowerCase())) throw new Error('Este e-mail já está cadastrado.');
                const id = lista.reduce((m, x) => Math.max(m, x.id), 0) + 1;
                const novo = { id, nome: d.nome, email: d.email, senha_hash: await hash(d.senha_temporaria), perfil: d.perfil, ativo: true, trocar_senha: true };
                lista.push(novo);
                mockGravarUsuarios(lista);
                return semHash(novo);
            }
            return req('/funcionarios', { method: 'POST', body: JSON.stringify(d) });
        },

        async alternarAtivo(id, ativo) {
            if (AUTH_CONFIG.USAR_MOCK) {
                mockExigirGerente();
                if (id === lerSessao()?.id) throw new Error('Você não pode desativar a própria conta.');
                const lista = await mockLerUsuarios();
                const u = lista.find(x => x.id === id && x.perfil !== 'cliente');
                if (!u) throw new Error('Funcionário não encontrado.');
                u.ativo = ativo;
                mockGravarUsuarios(lista);
                return semHash(u);
            }
            return req('/funcionarios/' + id, { method: 'PATCH', body: JSON.stringify({ ativo }) });
        }
    };

    /* ---------- Interface compartilhada ---------- */
    function injetarEstilos() {
        if (document.getElementById('fx-estilos')) return;
        const st = document.createElement('style');
        st.id = 'fx-estilos';
        st.textContent = `
        .fx-menu-usuario{position:fixed;z-index:10000;min-width:230px;background:#fff;color:#222;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.25);padding:8px;font-family:Arial,Helvetica,sans-serif}
        .fx-menu-usuario .fx-cab{padding:8px 10px;border-bottom:1px solid #eee;margin-bottom:6px;font-size:.9rem}
        .fx-menu-usuario .fx-cab small{display:block;color:#888;margin-top:2px}
        .fx-menu-usuario a,.fx-menu-usuario button{display:block;width:100%;text-align:left;background:none;border:0;padding:9px 10px;border-radius:6px;font-size:.92rem;color:#1a2a6c;cursor:pointer;text-decoration:none;font-family:inherit}
        .fx-menu-usuario a:hover,.fx-menu-usuario button:hover{background:#eef1fb}
        .fx-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:10001;padding:16px}
        .fx-modal{background:#fff;color:#222;border-radius:14px;padding:24px;width:100%;max-width:380px;display:flex;flex-direction:column;gap:10px;font-family:Arial,Helvetica,sans-serif}
        .fx-modal h2{color:#1a2a6c;margin:0;font-size:1.2rem}
        .fx-modal p{margin:0;font-size:.88rem;color:#666}
        .fx-modal input{box-sizing:border-box;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:.95rem;width:100%}
        .fx-modal .fx-btn{background:#1a2a6c;color:#fff;border:0;border-radius:8px;padding:11px;cursor:pointer;font-size:.95rem}
        .fx-modal .fx-btn:disabled{opacity:.5;cursor:not-allowed}
        .fx-modal .fx-sec{background:#fff;color:#1a2a6c;border:1px solid #1a2a6c}
        .fx-erro{color:#c62828;font-size:.85rem;min-height:1em;margin:2px 0}
        .fx-dica{font-size:.75rem;color:#888;margin-top:10px;line-height:1.4}
        .fx-aviso{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#1a2a6c;color:#fff;padding:12px 20px;border-radius:10px;z-index:10002;font-size:.9rem;box-shadow:0 4px 16px rgba(0,0,0,.25);max-width:90vw;font-family:Arial,Helvetica,sans-serif}
        .fx-aviso.erro{background:#c62828}`;
        document.head.appendChild(st);
    }

    function aviso(msg, erro = false) {
        let el = document.getElementById('fx-aviso');
        if (!el) { el = document.createElement('div'); el.id = 'fx-aviso'; document.body.appendChild(el); }
        el.className = 'fx-aviso' + (erro ? ' erro' : '');
        el.textContent = msg;
        el.style.display = 'block';
        clearTimeout(el._t);
        el._t = setTimeout(() => { el.style.display = 'none'; }, 3500);
    }

    function atualizarBarra() {
        const s = lerSessao();
        const primeiro = s ? String(s.nome || 'Conta').split(' ')[0] : '';
        document.querySelectorAll('.btn-login').forEach(b => {
            b.textContent = s ? '👤 ' + primeiro : '👤 Login';
        });
    }

    function fecharMenuUsuario() {
        document.getElementById('fx-menu-usuario')?.remove();
    }

    function abrirMenuUsuario(btn) {
        if (document.getElementById('fx-menu-usuario')) { fecharMenuUsuario(); return; }
        const s = lerSessao();
        if (!s) return;
        btn = btn || document.querySelector('.btn-login');
        const r = btn.getBoundingClientRect();
        const m = document.createElement('div');
        m.id = 'fx-menu-usuario';
        m.className = 'fx-menu-usuario';
        m.style.top = (r.bottom + 6) + 'px';
        m.style.right = Math.max(8, window.innerWidth - r.right) + 'px';
        m.innerHTML = `
            <div class="fx-cab"><strong>Olá, ${esc(s.nome)}</strong><small>${esc(ROTULOS[s.perfil] || s.perfil)} · ${esc(s.email)}</small></div>
            ${ehEquipe() ? '<a href="admin.html">🛠️ Painel do funcionário</a>' : ''}
            <button type="button" data-fx="senha">🔑 Alterar senha</button>
            <button type="button" data-fx="sair">🚪 Sair</button>`;
        document.body.appendChild(m);
        m.addEventListener('click', e => {
            const b = e.target.closest('[data-fx]');
            if (!b) return;
            fecharMenuUsuario();
            if (b.dataset.fx === 'sair') sair();
            if (b.dataset.fx === 'senha') abrirModalSenha(false);
        });
    }
    document.addEventListener('click', e => {
        const m = document.getElementById('fx-menu-usuario');
        if (m && !m.contains(e.target) && !e.target.closest('.btn-login')) m.remove();
    });

    function sair() {
        limparSessao();
        atualizarBarra();
        fecharMenuUsuario();
        if (document.body.dataset.area === 'admin') location.replace('index.html');
        else aviso('Você saiu da sua conta.');
    }

    /* ---------- Modal de troca de senha ---------- */
    function abrirModalSenha(obrigatoria) {
        if (document.getElementById('fx-modal-senha')) return;
        injetarEstilos();
        const ov = document.createElement('div');
        ov.id = 'fx-modal-senha';
        ov.className = 'fx-overlay';
        ov.innerHTML = `
            <form class="fx-modal" novalidate>
                <h2>${obrigatoria ? 'Defina uma nova senha' : 'Alterar senha'}</h2>
                ${obrigatoria ? '<p>Por segurança, troque a senha temporária antes de continuar.</p>' : ''}
                <input type="password" placeholder="${obrigatoria ? 'Senha temporária' : 'Senha atual'}" autocomplete="current-password">
                <input type="password" placeholder="Nova senha (mín. 8, letras e números)" autocomplete="new-password">
                <input type="password" placeholder="Confirmar nova senha" autocomplete="new-password">
                <p class="fx-erro"></p>
                <button type="submit" class="fx-btn">Salvar nova senha</button>
                ${obrigatoria ? '<button type="button" class="fx-btn fx-sec" data-sair>Sair</button>' : '<button type="button" class="fx-btn fx-sec" data-cancelar>Cancelar</button>'}
            </form>`;
        document.body.appendChild(ov);
        const form = ov.querySelector('form');
        const [atual, nova, conf] = form.querySelectorAll('input');
        const erroEl = form.querySelector('.fx-erro');
        const btn = form.querySelector('button[type=submit]');
        atual.focus();

        form.querySelector('[data-cancelar]')?.addEventListener('click', () => ov.remove());
        form.querySelector('[data-sair]')?.addEventListener('click', () => { ov.remove(); sair(); });

        form.addEventListener('submit', async e => {
            e.preventDefault();
            erroEl.textContent = '';
            const msg = validarSenha(nova.value);
            if (!atual.value) erroEl.textContent = 'Informe a senha atual.';
            else if (msg) erroEl.textContent = msg;
            else if (nova.value !== conf.value) erroEl.textContent = 'A confirmação não confere com a nova senha.';
            else if (nova.value === atual.value) erroEl.textContent = 'A nova senha deve ser diferente da atual.';
            if (erroEl.textContent) return;
            btn.disabled = true;
            try {
                await api.trocarSenha(atual.value, nova.value);
                const s = lerSessao();
                if (s) { s.trocar_senha = false; gravarSessao(s); }
                ov.remove();
                aviso('Senha alterada com sucesso.');
            } catch (err) {
                erroEl.textContent = err.message;
            } finally {
                btn.disabled = false;
            }
        });
    }

    /* ---------- Login e cadastro no modal do site ---------- */
    function garantirErro(container, antesDe) {
        let el = container.querySelector('.fx-erro');
        if (!el) {
            el = document.createElement('p');
            el.className = 'fx-erro';
            antesDe.parentNode.insertBefore(el, antesDe);
        }
        return el;
    }

    function irParaAba(indice) {
        const abas = document.querySelectorAll('.modal-abas .aba');
        if (abas[indice]) abas[indice].click();
    }

    function ligarLogin() {
        const form = document.getElementById('form-login');
        if (!form) return;
        const [emailEl, senhaEl] = form.querySelectorAll('input');
        const btn = form.querySelector('.btn-submit');
        if (!emailEl || !senhaEl || !btn) return;
        const erroEl = garantirErro(form, btn);

        if (AUTH_CONFIG.USAR_MOCK) {
            const dica = document.createElement('p');
            dica.className = 'fx-dica';
            dica.innerHTML = '<strong>Modo demonstração</strong><br>Gerente: gerente@fixtintas.com / Gerente@123<br>Funcionário: funcionario@fixtintas.com / Func@123';
            form.appendChild(dica);
        }

        async function fazerLogin() {
            erroEl.textContent = '';
            const email = emailEl.value.trim();
            if (!emailValido(email)) { erroEl.textContent = 'Informe um e-mail válido.'; return; }
            if (!senhaEl.value) { erroEl.textContent = 'Informe a senha.'; return; }
            btn.disabled = true;
            try {
                const s = await api.login(email, senhaEl.value);
                gravarSessao(s);
                senhaEl.value = '';
                emailEl.value = '';
                document.getElementById('modal-login').style.display = 'none';
                atualizarBarra();
                if (s.trocar_senha) abrirModalSenha(true);
                else aviso(ehEquipe()
                    ? `Bem-vindo, ${s.nome.split(' ')[0]}! O painel está no menu do seu nome.`
                    : `Bem-vindo, ${s.nome.split(' ')[0]}!`);
            } catch (err) {
                erroEl.textContent = err.message || 'Não foi possível entrar.';
            } finally {
                btn.disabled = false;
            }
        }
        btn.addEventListener('click', fazerLogin);
        form.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); fazerLogin(); }
        });
    }

    async function registrarDoFormulario() {
        const form = document.getElementById('form-registro');
        if (!form) return;
        const [nomeEl, cpfEl, nascEl, telEl, emailEl, senhaEl, confEl] = form.querySelectorAll('input');
        const btn = document.getElementById('btn-cadastrar');
        const erroEl = garantirErro(form, btn);
        erroEl.textContent = '';

        const nome = nomeEl.value.trim();
        const cpf = cpfEl.value.replace(/\D/g, '');
        const telefone = telEl.value.replace(/\D/g, '');
        const email = emailEl.value.trim();

        let erro = '';
        if (nome.split(/\s+/).length < 2) erro = 'Informe seu nome completo.';
        else if (!cpfValido(cpf)) erro = 'CPF inválido.';
        else if (telefone.length < 10) erro = 'Informe um telefone com DDD.';
        else if (!emailValido(email)) erro = 'Informe um e-mail válido.';
        else if (validarSenha(senhaEl.value)) erro = validarSenha(senhaEl.value);
        else if (senhaEl.value !== confEl.value) erro = 'A confirmação não confere com a senha.';
        if (erro) { erroEl.textContent = erro; return; }

        btn.disabled = true;
        try {
            await api.registrar({ nome, cpf, nascimento: nascEl.value, telefone, email, senha: senhaEl.value });
            form.querySelectorAll('input').forEach(i => { i.value = ''; });
            aviso('Cadastro realizado! Entre com seu e-mail e senha.');
            irParaAba(0);
            const loginEmail = document.querySelector('#form-login input[type=email]');
            if (loginEmail) loginEmail.value = email;
        } catch (err) {
            erroEl.textContent = err.message || 'Não foi possível cadastrar.';
        } finally {
            btn.disabled = false;
        }
    }

    /* ---------- Proteção da página do painel ---------- */
    async function exigirEquipe() {
        const s = lerSessao();
        if (!s || !['funcionario', 'gerente'].includes(s.perfil)) {
            location.replace('index.html');
            return false;
        }
        try {
            // Confirma com o servidor (ou com o cadastro, no modo demo) que a conta
            // continua ativa e que o perfil não mudou.
            const eu = await api.me();
            gravarSessao({ ...s, ...eu });
            if (!ehEquipe()) { location.replace('index.html'); return false; }
        } catch (e) {
            limparSessao();
            location.replace('index.html');
            return false;
        }
        return true;
    }

    /* ---------- Inicialização ---------- */
    function iniciar() {
        injetarEstilos();
        atualizarBarra();
        ligarLogin();
        if (lerSessao()?.trocar_senha) abrirModalSenha(true);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
    else iniciar();

    window.Auth = {
        config: AUTH_CONFIG,
        req, api, aviso,
        sessao: lerSessao,
        logado, token, ehEquipe, ehGerente,
        sair, exigirEquipe,
        abrirMenuUsuario, abrirModalSenha, registrarDoFormulario,
        rotuloPerfil: p => ROTULOS[p] || p,
        validarSenha, emailValido
    };
})();
