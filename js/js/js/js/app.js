// Caminho: js/app.js
import { renderLogin } from './modules/m1_login.js';

// Estado Global da Aplicação
export const state = {
    usuario: JSON.parse(sessionStorage.getItem('caetano_user')) || null,
    condominio: JSON.parse(sessionStorage.getItem('caetano_condo')) || null
};

export function setSession(usuario, condominio) {
    state.usuario = usuario;
    state.condominio = condominio;
    sessionStorage.setItem('caetano_user', JSON.stringify(usuario));
    sessionStorage.setItem('caetano_condo', JSON.stringify(condominio));
    atualizarHeader();
}

export function clearSession() {
    state.usuario = null;
    state.condominio = null;
    sessionStorage.removeItem('caetano_user');
    sessionStorage.removeItem('caetano_condo');
    atualizarHeader();
    renderLogin();
}

export function atualizarHeader() {
    const elCondo = document.getElementById('condominio-ativo-nome');
    const nav = document.getElementById('nav-principal');

    if (state.condominio && state.usuario) {
        if (elCondo) elCondo.textContent = `${state.condominio.nome_fantasia} (${state.usuario.nome_completo.split(' ')[0]})`;
        if (nav) nav.classList.remove('hidden');
    } else {
        if (elCondo) elCondo.textContent = 'Selecione o Condomínio';
        if (nav) nav.classList.add('hidden');
    }
}

// Monitoramento de Conexão Online/Offline
function initNetworkMonitor() {
    const statusEl = document.getElementById('status-conexao');
    const labelEl = document.getElementById('label-online');

    function updateStatus() {
        if (navigator.onLine) {
            statusEl.className = 'flex items-center space-x-2 bg-emerald-950 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-800';
            labelEl.textContent = 'ONLINE';
        } else {
            statusEl.className = 'flex items-center space-x-2 bg-amber-950 text-amber-400 text-xs px-2.5 py-1 rounded-full border border-amber-800';
            labelEl.textContent = 'OFFLINE';
        }
    }

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
}

// Navegação de Módulos (Menu Inferior)
function initNavigation() {
    document.getElementById('btn-nav-m3')?.addEventListener('click', () => alert('Módulo 3: Encomendas - Em carregamento'));
    document.getElementById('btn-nav-m4')?.addEventListener('click', () => alert('Módulo 4: Chaves - Em carregamento'));
    document.getElementById('btn-nav-m5')?.addEventListener('click', () => alert('Módulo 5: Custódia - Em carregamento'));
    document.getElementById('btn-nav-m6')?.addEventListener('click', () => alert('Módulo 6: Autorizados - Em carregamento'));
    document.getElementById('btn-nav-menu')?.addEventListener('click', () => {
        if (confirm('Deseja encerrar a sessão do operador?')) {
            clearSession();
        }
    });
}

// Inicialização Geral
document.addEventListener('DOMContentLoaded', () => {
    initNetworkMonitor();
    initNavigation();
    atualizarHeader();

    if (!state.usuario || !state.condominio) {
        renderLogin();
    }
});
