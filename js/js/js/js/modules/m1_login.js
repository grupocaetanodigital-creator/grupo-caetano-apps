// Caminho: js/modules/m1_login.js
import { supabase } from '../supabaseClient.js';
import { setSession } from '../app.js';

export async function renderLogin() {
    const appView = document.getElementById('app-view');
    
    appView.innerHTML = `
        <div class="max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl mt-4">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span class="text-3xl font-extrabold text-white">GC</span>
                </div>
                <h2 class="text-xl font-bold text-white">Acesso à Portaria</h2>
                <p class="text-xs text-slate-400 mt-1">Identifique-se para iniciar o turno</p>
            </div>

            <form id="form-login" class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1">CPF do Operador</label>
                    <input type="text" id="login-cpf" maxlength="11" placeholder="Somente números" required 
                        class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-lg tracking-wider">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1">PIN de Acesso (4 a 6 dígitos)</label>
                    <input type="password" id="login-pin" maxlength="6" placeholder="••••" required 
                        class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-lg tracking-widest text-center">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1">Condomínio</label>
                    <select id="login-condominio" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm">
                        <option value="">Carregando condomínios...</option>
                    </select>
                </div>

                <button type="submit" id="btn-entrar" class="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3.5 rounded-xl min-h-[48px] shadow-lg transition-all text-base mt-2 flex items-center justify-center gap-2">
                    <span>Entrar no Sistema</span>
                </button>
            </form>
            
            <div id="login-erro" class="hidden mt-4 p-3 bg-rose-950 border border-rose-800 rounded-xl text-xs text-rose-300 text-center font-medium"></div>
        </div>
    `;

    carregarCondominios();
    document.getElementById('form-login').addEventListener('submit', realizarLogin);
}

async function carregarCondominios() {
    const selectCondo = document.getElementById('login-condominio');
    try {
        const { data, error } = await supabase
            .from('condominios')
            .select('id, nome_fantasia')
            .eq('status', 'ATIVO')
            .order('nome_fantasia');

        if (error) throw error;

        if (!data || data.length === 0) {
            selectCondo.innerHTML = `<option value="">Nenhum condomínio cadastrado</option>`;
            return;
        }

        selectCondo.innerHTML = '<option value="">-- Selecione o Condomínio --</option>' + 
            data.map(c => `<option value="${c.id}">${c.nome_fantasia}</option>`).join('');

    } catch (err) {
        console.error('Erro ao carregar condomínios:', err);
        selectCondo.innerHTML = `<option value="">Erro ao carregar lista</option>`;
    }
}

async function realizarLogin(e) {
    e.preventDefault();
    const cpf = document.getElementById('login-cpf').value.replace(/\D/g, '');
    const pin = document.getElementById('login-pin').value;
    const condominioId = document.getElementById('login-condominio').value;
    const btnEntrar = document.getElementById('btn-entrar');
    const divErro = document.getElementById('login-erro');

    divErro.classList.add('hidden');
    btnEntrar.disabled = true;
    btnEntrar.textContent = 'Autenticando...';

    try {
        // 1. Consulta usuário por CPF
        const { data: usuario, error: errUser } = await supabase
            .from('usuarios')
            .select('id, cpf, nome_completo, pin_hash, perfil, status, tentativas_falhas, bloqueado_ate')
            .eq('cpf', cpf)
            .single();

        if (errUser || !usuario) {
            throw new Error('CPF ou PIN incorretos.');
        }

        if (usuario.status !== 'ATIVO') {
            throw new Error('Usuário inativo. Fale com a supervisão.');
        }

        if (usuario.bloqueado_ate && new Date(usuario.bloqueado_ate) > new Date()) {
            throw new Error('Conta temporariamente bloqueada por tentativas incorretas.');
        }

        // 2. Validação do PIN
        if (usuario.pin_hash !== pin) {
            throw new Error('CPF ou PIN incorretos.');
        }

        // 3. Valida vínculo com o Condomínio Selecionado
        const { data: vinculo, error: errVinculo } = await supabase
            .from('usuario_condominios')
            .select('id')
            .eq('usuario_id', usuario.id)
            .eq('condominio_id', condominioId)
            .single();

        if (errVinculo || !vinculo) {
            throw new Error('Operador não possui acesso autorizado a este condomínio.');
        }

        // 4. Busca dados do condomínio
        const { data: condo, error: errCondo } = await supabase
            .from('condominios')
            .select('id, nome_fantasia')
            .eq('id', condominioId)
            .single();

        if (errCondo) throw errCondo;

        // Sucesso na autenticação
        setSession(usuario, condo);

        const appView = document.getElementById('app-view');
        appView.innerHTML = `
            <div class="p-6 bg-slate-800 border border-slate-700 rounded-2xl text-center shadow-xl">
                <span class="text-4xl">🎉</span>
                <h2 class="text-xl font-bold text-emerald-400 mt-2">Bem-vindo(a), ${usuario.nome_completo}!</h2>
                <p class="text-xs text-slate-400 mt-1">Turno iniciado no condomínio ${condo.nome_fantasia}.</p>
                <p class="text-xs text-slate-500 mt-4">Utilize o menu inferior para acessar os módulos operacionais da portaria.</p>
            </div>
        `;

    } catch (err) {
        divErro.textContent = err.message || 'Falha ao autenticar.';
        divErro.classList.remove('hidden');
    } finally {
        btnEntrar.disabled = false;
        btnEntrar.textContent = 'Entrar no Sistema';
    }
}
