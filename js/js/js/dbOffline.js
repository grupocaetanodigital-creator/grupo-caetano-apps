// Caminho: js/dbOffline.js
const DB_NAME = 'CaetanoAppsDB';
const DB_VERSION = 1;

export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('moradores')) {
                const store = db.createObjectStore('moradores', { keyPath: 'id' });
                store.createIndex('unidade', 'unidade', { unique: false });
            }
            if (!db.objectStoreNames.contains('entregadores')) {
                db.createObjectStore('entregadores', { keyPath: 'id' });
            }
        };
    });
}

export async function salvarMoradoresCache(moradoresList) {
    const db = await openDB();
    const tx = db.transaction('moradores', 'readwrite');
    const store = tx.objectStore('moradores');
    store.clear();
    for (const m of moradoresList) {
        store.put(m);
    }
    return tx.complete;
}

export async function buscarMoradoresPorUnidade(unidade) {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction('moradores', 'readonly');
        const store = tx.objectStore('moradores');
        const index = store.index('unidade');
        const request = index.getAll(unidade);
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
    });
}
