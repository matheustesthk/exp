import { getState, saveState } from '../state.js';
import { escapeHtml } from '../utils.js';

// Mapeamento de classes 100% literais e saturadas para quebrar o preto e branco
const HABIT_CATEGORY_STYLES = {
    saude: {
        text: 'text-brand-400',
        badge: 'bg-brand-500/10 text-brand-400 border-brand-500/20'
    },
    fitness: {
        text: 'text-accent-pink',
        badge: 'bg-accent-pink/10 text-accent-pink border-accent-pink/20'
    },
    estudos: {
        text: 'text-accent-purple',
        badge: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20'
    },
    trabalho: {
        text: 'text-brand-500',
        badge: 'bg-brand-500/10 text-brand-400 border-brand-500/20'
    },
    lazer: {
        text: 'text-accent-cyan',
        badge: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20'
    },
    default: {
        text: 'text-amber-400',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
};

export function renderHabits() {
    const state = getState();
    const daysName = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const container = document.getElementById('habits-matrix-container');
    if (!container) return;

    container.innerHTML = '';

    state.habits.forEach(h => {
        // Normaliza a categoria para buscar o estilo correspondente (ex: 'Saúde' vira 'saude')
        const categoryKey = h.category ? h.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") : 'default';
        const currentStyle = HABIT_CATEGORY_STYLES[categoryKey] || HABIT_CATEGORY_STYLES.default;

        let daysHtml = '';
        daysName.forEach((day, idx) => {
            const isDone = h.completedDays.includes(idx);
            
            // Botão alterado: se concluído, ele usa as cores saturadas do tema em vez de cinza
            daysHtml += `
                <button onclick="toggleHabitDay('${h.id}', ${idx})" class="flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-200 ${isDone ? 'bg-brand-500/20 border-brand-500 text-brand-400 shadow-md shadow-brand-500/10' : 'bg-dark-bg border-dark-border text-gray-500 hover:text-white hover:border-gray-600'}">
                    <span class="text-[10px] font-bold">${day}</span>
                    <i class="fa-solid ${isDone ? 'fa-check' : 'fa-minus'} text-xs"></i>
                </button>
            `;
        });

        // Card alterado: adicionado badges dinâmicos e bordas que reagem à categoria do hábito
        container.innerHTML += `
            <div class="bg-dark-card border border-dark-border hover:border-brand-500/30 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 shadow-lg">
                <div class="flex items-center justify-between md:justify-start gap-4">
                    <div>
                        <h4 class="font-bold text-white text-sm">${escapeHtml(h.title)}</h4>
                        <span class="text-[10px] px-2 py-0.5 rounded border font-medium inline-block mt-1 ${currentStyle.badge}">${h.category}</span>
                    </div>
                    <div class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                        <i class="fa-solid fa-fire text-amber-500 animate-pulse"></i> ${h.streak}d
                    </div>
                </div>
                <div class="grid grid-cols-7 gap-1.5 sm:gap-2">
                    ${daysHtml}
                </div>
            </div>
        `;
    });
}

export function toggleHabitDay(habitId, dayIdx) {
    const state = getState();
    const habit = state.habits.find(h => h.id === habitId);
    if (habit) {
        if (habit.completedDays.includes(dayIdx)) {
            habit.completedDays = habit.completedDays.filter(d => d !== dayIdx);
        } else {
            habit.completedDays.push(dayIdx);
        }
        habit.streak = habit.completedDays.length * 2;
        saveState();
        renderHabits(); // Adicionado para atualizar a interface imediatamente após o clique
    }
}
