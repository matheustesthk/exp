import { STORAGE_KEY, defaultState } from './config.js';

let state = loadState();
let activeWishSavingsId = null;

export function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try { 
            const parsed = JSON.parse(saved);
            if (!parsed.wishlist) parsed.wishlist = defaultState.wishlist;
            return parsed; 
        } catch(e) {
            console.error('Erro ao ler do localStorage:', e);
        }
    }
    return JSON.parse(JSON.stringify(defaultState));
}

export function getState() {
    return state;
}

export function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (typeof window.refreshUI === 'function') {
        window.refreshUI();
    }
}

export function resetState() {
    if (confirm("Tem certeza que deseja resetar todos os dados para o padrão?")) {
        state = JSON.parse(JSON.stringify(defaultState));
        saveState();
    }
}

export function getActiveWishSavingsId() {
    return activeWishSavingsId;
}

export function setActiveWishSavingsId(id) {
    activeWishSavingsId = id;
}
