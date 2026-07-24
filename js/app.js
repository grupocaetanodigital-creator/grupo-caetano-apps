// Caminho: js/app.js
import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    await carregarCondominios();
});

async function carregarCondominios() {
    try {
        const { data: condominios, error } = await supabase
            .from('condominios')
            .select('*')
            .eq('status', 'ATIVO');

        if (error) throw error;

        // Remover o indicador de carregamento da tela
        const spinner = document.querySelector('.animate-spin')?.parentElement || document.querySelector('div[class*="Carregando"]')?.parentElement;
        const loadingText = document.evaluate("//*[contains(text(), 'Carregando Sistema de Portaria')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        
        if (loadingText) {
            const container = loadingText.closest('.flex') || loadingText.parentElement;
            if (container) container.remove();
        }

        renderizarTelaLogin(condominios || []);

    } catch (err) {
        console.error('Erro ao conectar ao Supabase:', err.message);
        alert('Erro ao carregar dados do sistema: ' + err.message);
    }
}

function renderizarTelaLogin(condominios) {
    let container = document.getElementById('app-root');
    if (!container) {
        container = document.createElement('div');
        container.id = 'app-root';
        document.body.appendChild(container);
    }

    const optionsHtml = condominios.map(c => `<option value="${c.id}">${c.nome_fantasia}</option>`).join('');

    container.innerHTML = `
        <div class="min-h-screen flex items-center justify-center p-4 bg-gray-900">
            <div class="bg-gray-800 text-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-700">
                <div class="text-center mb-6">
                    <h1 class="text-2xl font-bold text-blue-400 mb-1">Grupo Caetano</h1>
                    <p class="text-sm text-gray-400">Portaria & Controle de Acesso</p>
                </div>

                <form id="form-login" class="space-y-4" onsubmit="return false;">
                    <div>
                        <label class="block text-xs font-semibold uppercase text-gray-300 mb-1">Condomínio</label>
                        <select id="select-condominio" class="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500">
                            ${optionsHtml.length > 0 ? optionsHtml : '<option value="">Nenhum condomínio encontrado</option>'}
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold uppercase text-gray-300 mb-1">CPF do Operador</label>
                        <input type="text" id="input-cpf" placeholder="11122233344" maxlength="11" class="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label class="block text-xs font-semibold uppercase text-gray-300 mb-1">PIN de Acesso</label>
                        <input type="password" id="input-pin" placeholder="****" maxlength="8" class="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <button type="button" id="btn-entrar" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg min-h-[48px] shadow-lg transition duration-200 mt-2">
                        ENTRAR NO SISTEMA
                    </button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('btn-entrar').addEventListener('click', realizarLogin);
}

async function realizarLogin() {
    const condominioId = document.getElementById('select-condominio').value;
    const cpf = document.getElementById('input-cpf').value.replace(/\D/g, '');
    const pin = document.getElementById('input-pin').value;

    if (!condominioId || !cpf || !pin) {
        alert('Por favor, selecione o condomínio e informe CPF e PIN!');
        return;
    }

    try {
        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('cpf', cpf)
            .eq('pin_hash', pin)
            .eq('status', 'ATIVO')
            .single();

        if (error || !usuario) {
            alert('CPF ou PIN incorretos!');
            return;
        }

        alert(`Acesso Autorizado! Bem-vindo(a), ${usuario.nome_completo}.`);
        localStorage.setItem('usuario_logado', JSON.stringify(usuario));
        localStorage.setItem('condominio_id', condominioId);

    } catch (err) {
        alert('Erro no login: ' + err.message);
    }
}
