import { getState, saveState } from '../state.js';
import { escapeHtml } from '../utils.js';

export let currentTaskView = 'kanban';

export function setTaskView(view) {
    currentTaskView = view;
    if (view === 'kanban') {
        document.getElementById('tasks-kanban-view').classList.remove('hidden');
        document.getElementById('tasks-list-view').classList.add('hidden');
        document.getElementById('btn-view-kanban').className = 'px-2.5 py-1 text-xs font-semibold rounded bg-brand-600 text-white transition';
        document.getElementById('btn-view-list').className = 'px-2.5 py-1 text-xs font-semibold rounded text-gray-400 hover:text-white transition';
    } else {
        document.getElementById('tasks-kanban-view').classList.add('hidden');
        document.getElementById('tasks-list-view').classList.remove('hidden');
        document.getElementById('btn-view-list').className = 'px-2.5 py-1 text-xs font-semibold rounded bg-brand-600 text-white transition';
        document.getElementById('btn-view-kanban').className = 'px-2.5 py-1 text-xs font-semibold rounded text-gray-400 hover:text-white transition';
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
                const prioBadge = t.priority === 'Alta' 
                    ? 'bg-accent-rose/10 text-accent-rose' 
                    : (t.priority === 'Média' ? 'bg-accent-amber/10 text-accent-amber' : 'bg-gray-500/10 text-gray-400');

                listContainer.innerHTML += `
                    <div class="py-3 flex items-center justify-between text-xs">
                        <div class="flex items-center gap-3">
                            <input type="checkbox" ${t.status === 'Done' ? 'checked' : ''} onchange="toggleTaskStatus('${t.id}')" class="rounded custom-checkbox w-4 h-4 cursor-pointer">
                            <div>
                                <p class="font-bold text-white ${t.status === 'Done' ? 'line-through text-gray-500' : ''}">${escapeHtml(t.title)}</p>
                                <p class="text-[10px] text-gray-400">${t.category} • Vencimento: ${t.dueDate}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${prioBadge}">${t.priority}</span>
                            <button onclick="deleteTask('${t.id}')" class="text-gray-500 hover:text-accent-rose p-1"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                `;
            });
        }
    }
}

export function createTaskCard(t) {
    const div = document.createElement('div');
    div.className = 'glass-card p-3 rounded-xl space-y-2 border border-dark-border hover:border-brand-500/40 transition cursor-pointer';
    
    const prioBadge = t.priority === 'Alta' 
        ? 'bg-accent-rose/10 text-accent-rose border-accent-rose/20' 
        : (t.priority === 'Média' ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20');

    div.innerHTML = `
        <div class="flex items-start justify-between gap-2">
            <span class="text-xs font-bold text-white leading-snug">${escapeHtml(t.title)}</span>
            <button onclick="deleteTask('${t.id}')" class="text-gray-500 hover:text-accent-rose text-xs"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="flex items-center justify-between pt-1">
            <span class="text-[10px] px-2 py-0.5 rounded border ${prioBadge} font-bold">${t.priority}</span>
            <select onchange="updateTaskStatus('${t.id}', this.value)" class="bg-dark-bg text-[10px] text-gray-300 border border-dark-border rounded px-1.5 py-0.5 focus:outline-none">
                <option value="To Do" ${t.status === 'To Do' ? 'selected' : ''} class="bg-dark-card text-white">A Fazer</option>
                <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''} class="bg-dark-card text-white">Em Progresso</option>
                <option value="Done" ${t.status === 'Done' ? 'selected' : ''} class="bg-dark-card text-white">Concluído</option>
            </select>
        </div>
    `;
    return div;
}

export function toggleTaskStatus(id) {
    const state = getState();
    const task = state.tasks.find(t => t.id === id);
    if (task) {
        task.status = task.status === 'Done' ? 'To Do' : 'Done';
        saveState();
    }
}

export function updateTaskStatus(id, newStatus) {
    const state = getState();
    const task = state.tasks.find(t => t.id === id);
    if (task) {
        task.status = newStatus;
        saveState();
    }
}

export function deleteTask(id) {
    const state = getState();
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveState();
}
