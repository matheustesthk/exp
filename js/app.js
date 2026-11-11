import { resetState } from './state.js';
import { switchTab, toggleMobileMenu, updateHeaderDateAndGreeting } from './modules/navigation.js';
import { openModal, closeModal, handleModalSubmit } from './modules/modal.js';
import { renderDashboard } from './modules/dashboard.js';
import { renderTasks, setTaskView, toggleTaskStatus, updateTaskStatus, deleteTask } from './modules/tasks.js';
import { renderFinances, deleteFinance } from './modules/finances.js';
import { renderHabits, toggleHabitDay } from './modules/habits.js';
import { renderNotes, toggleFavoriteNote, deleteNote } from './modules/notes.js';
import { setPomoMode, togglePomodoro, resetPomodoro, updatePomoUI } from './modules/pomodoro.js';
import { renderWishlist, quickAddSavingsPrompt, toggleWishConquered, deleteWish } from './modules/wishlist.js';

function refreshUI() {
    updateHeaderDateAndGreeting();
    renderDashboard();
    renderTasks();
    renderFinances();
    renderHabits();
    renderNotes();
    renderWishlist();
    updatePomoUI();
}

// Vincula a função de atualização da UI ao objeto global window
window.refreshUI = refreshUI;

// Vincula todos os eventos inline do HTML ao objeto global window
window.switchTab = switchTab;
window.toggleMobileMenu = toggleMobileMenu;
window.resetDataModal = resetState;
window.openModal = openModal;
window.closeModal = closeModal;
window.handleModalSubmit = handleModalSubmit;

window.setTaskView = setTaskView;
window.renderTasks = renderTasks;
window.toggleTaskStatus = toggleTaskStatus;
window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;

window.deleteFinance = deleteFinance;

window.toggleHabitDay = toggleHabitDay;

window.renderNotes = renderNotes;
window.toggleFavoriteNote = toggleFavoriteNote;
window.deleteNote = deleteNote;

window.setPomoMode = setPomoMode;
window.togglePomodoro = togglePomodoro;
window.resetPomodoro = resetPomodoro;

window.renderWishlist = renderWishlist;
window.quickAddSavingsPrompt = quickAddSavingsPrompt;
window.toggleWishConquered = toggleWishConquered;
window.deleteWish = deleteWish;

// Inicializa a aplicação ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    refreshUI();
});
