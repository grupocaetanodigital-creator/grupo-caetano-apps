// Caminho: js/whatsapp.js
/**
 * Monta a URL wa.me com sanitização rígida e ativa o fallback com botão "Copiar Mensagem".
 */
export function enviarWhatsApp(telefoneBruto, mensagemTexto) {
    let numClean = telefoneBruto.replace(/\D/g, '');
    if (!numClean.startsWith('55') && numClean.length >= 10 && numClean.length <= 11) {
        numClean = '55' + numClean;
    }

    const textoEncoded = encodeURIComponent(mensagemTexto);
    const urlWa = `https://wa.me/${numClean}?text=${textoEncoded}`;

    const txtMsg = document.getElementById('txt-whatsapp-mensagem');
    const btnLink = document.getElementById('btn-abrir-wa-link');
    const btnCopiar = document.getElementById('btn-copiar-wa-msg');
    const btnFechar = document.getElementById('btn-fechar-wa-modal');
    const modal = document.getElementById('modal-whatsapp-fallback');

    if (txtMsg) txtMsg.value = mensagemTexto;
    if (btnLink) btnLink.href = urlWa;

    if (btnCopiar) {
        btnCopiar.onclick = async () => {
            try {
                await navigator.clipboard.writeText(mensagemTexto);
                alert('Mensagem copiada para a área de transferência!');
            } catch (e) {
                txtMsg.select();
                document.execCommand('copy');
                alert('Mensagem copiada!');
            }
        };
    }

    if (btnFechar) {
        btnFechar.onclick = () => modal.classList.add('hidden');
    }

    if (modal) modal.classList.remove('hidden');

    window.open(urlWa, '_blank');
}
