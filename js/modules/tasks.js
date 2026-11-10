import { getState, saveState } from '../state.js';
import { escapeHtml } from '../utils.js';

export let currentTaskView = 'kanban';

// Mapeamento literal de classes acrílicas e saturadas para o scanner do Tailwind CDN
const PRIORITY_STYLES = {
    'Alta': 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]',
    'Média': 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
    'Baixa': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
};

const CATEGORY_STYLES = {
    'Trabalho': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    'Estudos': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    'Pessoal': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    'Finanças': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Saúde': 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    'Geral': 'bg-brand-500/10 text-brand-400 border-brand-500/30'
};

export function setTaskView(view) {
    currentTaskView = view;
    if (view === 'kanban') {
        document.getElementById('tasks-kanban-view').classList.remove('hidden');
        document.getElementById('tasks-list-view').classList.add('hidden');
        document.getElementById('btn-view-kanban').className = 'px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30 shadow-[0_0_12px_rgba(34,197,94,0.15)] transition';
        document.getElementById('btn-view-list').className = 'px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition';
    } else {
        document.getElementById('tasks-kanban-view').classList.add('hidden');
        document.getElementById('tasks-list-view').classList.remove('hidden');
        document.getElementById('btn-view-list').className = 'px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30 shadow-[0_0_12px_rgba(34,197,94,0.15)] transition';
        document.getElementById('btn-view-kanban').className = 'px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition';
    }
    renderTasks();
}

export function renderTasks() {
    const state = getState();
    const search = (document.getElementById('task-search')?.value || '').toLowerCase();
    const prioFilter = document.getElementById('task-filter-priority')?.value || 'all';

    let filtered = state.tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search);
        const matchesPrio = prioFilter === 'all' || t.priority === prioFilter;
        return matchesSearch && matchesPrio;
    });

    if (currentTaskView === 'kanban') {
        const todoCol = document.getElementById('col-todo');
        const inProgressCol = document.getElementById('col-in-progress');
        const doneCol = document.getElementById('col-done');

        if (todoCol) todoCol.innerHTML = '';
        if (inProgressCol) inProgressCol.innerHTML = '';
        if (doneCol) doneCol.innerHTML = '';

        let todoCount = 0, inProgCount = 0, doneCount = 0;

        filtered.forEach(t => {
            const card = createTaskCard(t);
            if (t.status === 'To Do' && todoCol) {
                todoCol.appendChild(card);
                todoCount++;
            } else if (t.status === 'In Progress' && inProgressCol) {
                inProgressCol.appendChild(card);
                inProgCount++;
            } else if (t.status === 'Done' && doneCol) {
                doneCol.appendChild(card);
                doneCount++;
            }
        });

        const countTodo = document.getElementById('count-todo');
        if (countTodo) countTodo.textContent = todoCount;
        const countInProg = document.getElementById('count-in-progress');
        if (countInProg) countInProg.textContent = inProgCount;
        const countDone = document.getElementById('count-done');
        if (countDone) countDone.textContent = doneCount;

    } else {
        const listContainer = document.getElementById('tasks-list-container');
        if (listContainer) {
            listContainer.innerHTML = '';
            filtered.forEach(t => {
                const prioClass = PRIORITY_STYLES[t.priority] || PRIORITY_STYLES['Baixa'];
                const catClass = CATEGORY_STYLES[t.category] || CATEGORY_STYLES['Geral'];

                listContainer.innerHTML += `
                    <div class="py-3 px-3 mb-2 flex items-center justify-between text-xs bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/5 hover:border-brand-500/30 transition">
                        <div class="flex items-center gap-3">
                            <input type="checkbox" ${t.status === 'Done' ? 'checked' : ''} onchange="toggleTaskStatus('${t.id}')" class="rounded custom-checkbox w-4 h-4 cursor-pointer accent-brand-500">
                            <div>
                                <p class="font-bold text-gray-100 ${t.status === 'Done' ? 'line-through text-gray-500' : ''}">${escapeHtml(t.title)}</p>
                                <div class="flex items-center gap-2 mt-1">
                                    <span class="text-[10px] px-2 py-0.5 rounded-full border ${catClass}">${t.category || 'Geral'}</span>
                                    <span class="text-[10px] text-gray-400"><i class="fa-regular fa-calendar mr-1"></i>${t.dueDate || 'Sem data'}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded-full border text-[10px] font-bold ${prioClass}">${t.priority}</span>
                            <button onclick="deleteTask('${t.id}')" class="text-gray-500 hover:text-rose-400 p-1.5 transition"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                `;
            });
        }
    }
}

export function createTaskCard(t) {
    const div = document.createElement('div');
    div.className = 'glass-card p-3.5 rounded-xl space-y-3 border border-white/10 hover:border-brand-500/40 bg-slate-900/50 backdrop-blur-md shadow-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all cursor-pointer group';
    
    const prioBadge = PRIORITY_STYLES[t.priority] || PRIORITY_STYLES['Baixa'];
    const catBadge = CATEGORY_STYLES[t.category] || CATEGORY_STYLES['Geral'];

    div.innerHTML = `
        <div class="flex items-start justify-between gap-2">
            <span class="text-xs font-semibold text-gray-100 group-hover:text-white leading-snug transition">${escapeHtml(t.title)}</span>
            <button onclick="deleteTask('${t.id}')" class="text-gray-500 hover:text-rose-400 text-xs transition opacity-80 group-hover:opacity-100"><i class="fa-solid fa-trash"></i></button>
        </div>
        
        <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[9px] px-2 py-0.5 rounded-full border ${catBadge} font-medium">${t.category || 'Geral'}</span>
            ${t.dueDate ? `<span class="text-[9px] px-2 py-0.5 rounded-full border border-gray-700 bg-gray-800/50 text-gray-400"><i class="fa-regular fa-clock mr-1"></i>${t.dueDate}</span>` : ''}
        </div>

        <div class="flex items-center justify-between pt-1 border-t border-white/5">
            <span class="text-[10px] px-2 py-0.5 rounded-full border ${prioBadge} font-bold">${t.priority}</span>
            <select onchange="updateTaskStatus('${t.id}', this.value)" class="bg-slate-950/80 text-[10px] text-gray-300 border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-500/50 transition cursor-pointer">
                <option value="To Do" ${t.status === 'To Do' ? 'selected' : ''}>A Fazer</option>
                <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>Em Progresso</option>
                <option value="Done" ${t.status === 'Done' ? 'selected' : ''}>Concluído</option>
            </select>
        </div>
    `;
    return div;
}

export function updateTaskStatus(id, newStatus) {
    const state = getState();
    const task = state.tasks.find(t => t.id === id);
    if (task) {
        task.status = newStatus;
        saveState(state);
        renderTasks();
    }
}

export function toggleTaskStatus(id) {
    const state = getState();
    const task = state.tasks.find(t => t.id === id);
    if (task) {
        task.status = task.status === 'Done' ? 'To Do' : 'Done';
        saveState(state);
        renderTasks();
    }
}

export function deleteTask(id) {
    const state = getState();
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveState(state);
    renderTasks();
}
