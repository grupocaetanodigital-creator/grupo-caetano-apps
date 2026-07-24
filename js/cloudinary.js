// Caminho: js/cloudinary.js
const CLOUD_NAME = nuow1ooh
const UPLOAD_PRESET = 'caetano_apps_preset';

/**
 * Compacta a foto da câmera via <canvas> (WebP 0.7, max 1024px)
 * e faz o upload direto para o Cloudinary sem precisar de senha (Unsigned).
 */
export async function compressAndUploadImage(fileInput) {
    if (!fileInput.files || fileInput.files.length === 0) {
        throw new Error('Nenhuma imagem foi selecionada.');
    }

    const file = fileInput.files[0];
    
    const compressedBlob = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxDim = 1024;

                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Erro na compactação da imagem.'));
                }, 'image/webp', 0.7);
            };
            img.onerror = () => reject(new Error('Falha ao carregar arquivo de imagem.'));
        };
        reader.onerror = () => reject(new Error('Falha ao ler arquivo.'));
    });

    const formData = new FormData();
    formData.append('file', compressedBlob, 'foto_portaria.webp');
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Falha no upload da foto para o Cloudinary.');
    }

    const data = await response.json();
    return data.secure_url;
}
