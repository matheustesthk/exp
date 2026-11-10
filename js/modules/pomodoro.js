import { getState, saveState } from '../state.js';
import { playChime } from '../utils.js';

let pomodoroTimer = null;

export function setPomoMode(mode) {
    const state = getState();
    state.pomodoro.mode = mode;
    if (pomodoroTimer) clearInterval(pomodoroTimer);
    state.pomodoro.isRunning = false;

    if (mode === 'focus') state.pomodoro.timeLeft = 25 * 60;
    else if (mode === 'shortBreak') state.pomodoro.timeLeft = 5 * 60;
    else if (mode === 'longBreak') state.pomodoro.timeLeft = 15 * 60;

    updatePomoUI();
}

export function togglePomodoro() {
    const state = getState();
    if (state.pomodoro.isRunning) {
        clearInterval(pomodoroTimer);
        state.pomodoro.isRunning = false;
    } else {
        state.pomodoro.isRunning = true;
        pomodoroTimer = setInterval(() => {
            if (state.pomodoro.timeLeft > 0) {
                state.pomodoro.timeLeft--;
                updatePomoUI();
            } else {
                clearInterval(pomodoroTimer);
                state.pomodoro.isRunning = false;
                playChime();
                if (state.pomodoro.mode === 'focus') {
                    state.pomodoro.focusMinutesToday += 25;
                    state.pomodoro.sessionsToday += 1;
                }
                saveState();
                alert("Sessão Pomodoro Concluída! 🎉");
            }
        }, 1000);
    }
    updatePomoUI();
}

export function resetPomodoro() {
    const state = getState();
    setPomoMode(state.pomodoro.mode);
}

export function updatePomoUI() {
    const state = getState();
    const min = Math.floor(state.pomodoro.timeLeft / 60);
    const sec = state.pomodoro.timeLeft % 60;
    const timeStr = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;

    const textEl = document.getElementById('pomo-timer-text');
    if (textEl) textEl.textContent = timeStr;
    const dashEl = document.getElementById('dash-pomo-display');
    if (dashEl) dashEl.textContent = timeStr;

    const btnText = state.pomodoro.isRunning ? 'Pausar' : 'Iniciar Foco';
    const mainBtn = document.getElementById('pomo-main-btn');
    if (mainBtn) mainBtn.textContent = btnText;
    const dashBtn = document.getElementById('dash-pomo-btn');
    if (dashBtn) dashBtn.textContent = btnText;

    const total = state.pomodoro.mode === 'focus' ? 25 * 60 : (state.pomodoro.mode === 'shortBreak' ? 5 * 60 : 15 * 60);
    const offset = 691 - (state.pomodoro.timeLeft / total) * 691;
    const ring = document.getElementById('pomo-progress-ring');
    if (ring) ring.style.strokeDashoffset = offset;

    const sessEl = document.getElementById('pomo-sessions-count');
    if (sessEl) sessEl.textContent = state.pomodoro.sessionsToday;
    const totalTimeEl = document.getElementById('pomo-total-time');
    if (totalTimeEl) totalTimeEl.textContent = `${state.pomodoro.focusMinutesToday} min`;
}