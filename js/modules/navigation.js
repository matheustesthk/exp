export let currentTab = 'dashboard';

export function switchTab(tab) {
    currentTab = tab;

    ['dashboard', 'tasks', 'finances', 'habits', 'notes', 'pomodoro', 'wishlist'].forEach(v => {
        const targetView = document.getElementById(`view-${v}`);
        if (targetView) targetView.classList.add('hidden');
        
        const navBtn = document.getElementById(`nav-${v}`);
        if (navBtn) navBtn.classList.remove('nav-item-active');

        const mobBtn = document.getElementById(`mobile-nav-${v}`);
        if (mobBtn) {
            mobBtn.classList.remove('text-brand-400');
            mobBtn.classList.add('text-gray-400');
        }
    });

    const activeView = document.getElementById(`view-${tab}`);
    if (activeView) activeView.classList.remove('hidden');

    const activeNav = document.getElementById(`nav-${tab}`);
    if (activeNav) activeNav.classList.add('nav-item-active');

    const activeMob = document.getElementById(`mobile-nav-${tab}`);
    if (activeMob) {
        activeMob.classList.remove('text-gray-400');
        activeMob.classList.add('text-brand-400');
    }

    const titleMap = {
        dashboard: ['fa-chart-pie text-brand-400', 'Dashboard'],
        tasks: ['fa-list-check text-brand-400', 'Tarefas & Kanban'],
        finances: ['fa-wallet text-accent-cyan', 'Gestão Financeira'],
        habits: ['fa-fire text-accent-amber', 'Rastreador de Hábitos'],
        notes: ['fa-note-sticky text-brand-400', 'Notas & Ideias'],
        pomodoro: ['fa-stopwatch text-accent-purple', 'Timer Pomodoro'],
        wishlist: ['fa-wand-magic-sparkles text-accent-pink', 'Lista de Desejos']
    };
    
    if (titleMap[tab]) {
        const [iconClass, label] = titleMap[tab];
        const titleEl = document.getElementById('page-title');
        if (titleEl) {
            titleEl.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${label}</span>`;
        }
    }

    if (typeof window.refreshUI === 'function') {
        window.refreshUI();
    }
}

export function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('hidden');
}

export function updateHeaderDateAndGreeting() {
    const dateEl = document.getElementById('header-date');
    const greetEl = document.getElementById('header-greeting');
    if (!dateEl || !greetEl) return;

    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = now.toLocaleDateString('pt-BR', options);
    dateEl.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    const hours = now.getHours();
    let greeting = 'Boa noite';
    if (hours >= 5 && hours < 12) greeting = 'Bom dia';
    else if (hours >= 12 && hours < 18) greeting = 'Boa tarde';

    greetEl.textContent = `${greeting}, Alex!`;
}