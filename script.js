/**
 * ============================================
 * RESPAWN PATROL - Guild Spawn Control System
 * Complete Implementation with Supabase
 * ============================================
 */

// ============================================
// SUPABASE CONFIGURATION
// ============================================

let supabaseClient = null;

// Initialize Supabase client
function initSupabase() {
    // ========================================================
    // IMPORTANTE: Substitua pelos seus dados do Supabase
    // ========================================================
    const SUPABASE_URL = 'https://czdyassmchxjtwpynsow.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZHlhc3NtY2h4anR3cHluc293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzOTA2NjUsImV4cCI6MjA5Njk2NjY2NX0.dbOBvIZG3iTJdQ0AsBlovX5RAG8GNASmMB3dyJSA34k';
    
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client initialized');
        return supabaseClient;
    } else {
        console.error('❌ Supabase JS library not loaded');
        return null;
    }
}

// ============================================
// CONFIGURATION & DATA
// ============================================

const STORAGE_KEYS = {
    CURRENT_PLAYER: 'respawnPatrol_currentPlayer',
    ACCESS_CODE: 'respawnPatrol_accessCode',
    PLAYER_NAME: 'respawnPatrol_playerName'
};

// No default image - cards without image_url will use dark gradient background

// ============================================
// STATE
// ============================================

let state = {
    currentPlayer: null,
    accessCode: null,
    hunts: [],
    ranking: []
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    loginScreen: document.getElementById('login-screen'),
    dashboardScreen: document.getElementById('dashboard-screen'),
    accessCodeInput: document.getElementById('access-code'),
    loginBtn: document.getElementById('login-btn'),
    loginError: document.getElementById('login-error'),
    playerName: document.getElementById('player-name'),
    logoutBtn: document.getElementById('logout-btn'),
    changeNickBtn: document.getElementById('change-nick-btn'),
    respawnsGrid: document.getElementById('respawns-grid'),
    rankingList: document.getElementById('ranking-list'),
    toast: document.getElementById('toast'),
    nickModal: document.getElementById('nick-modal'),
    nickModalOverlay: document.getElementById('nick-modal-overlay'),
    newNickInput: document.getElementById('new-nick'),
    saveNickBtn: document.getElementById('save-nick-btn'),
    cancelNickBtn: document.getElementById('cancel-nick-btn')
};

// ============================================
// INITIALIZATION
// ============================================

async function init() {
    initSupabase();
    
    // Check for saved session
    loadSessionFromStorage();
    
    setupEventListeners();
    
    if (state.currentPlayer && state.accessCode) {
        showDashboard();
        await loadHuntsFromSupabase();
        await loadRankingFromSupabase();
    } else {
        showLoginScreen();
    }
    
    // Update countdowns every minute
    setInterval(updateCountdowns, 60000);
}

function loadSessionFromStorage() {
    const savedPlayer = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAYER);
    const savedCode = localStorage.getItem(STORAGE_KEYS.ACCESS_CODE);
    const savedName = localStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
    
    if (savedPlayer && savedCode) {
        state.currentPlayer = JSON.parse(savedPlayer);
        state.accessCode = savedCode;
        if (savedName) {
            state.currentPlayer.name = savedName;
        }
    }
}

function saveSessionToStorage() {
    if (state.currentPlayer) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PLAYER, JSON.stringify(state.currentPlayer));
    }
    if (state.accessCode) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_CODE, state.accessCode);
    }
    if (state.currentPlayer?.name) {
        localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, state.currentPlayer.name);
    }
}

function clearSessionFromStorage() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAYER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_CODE);
    localStorage.removeItem(STORAGE_KEYS.PLAYER_NAME);
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Login
    elements.loginBtn.addEventListener('click', handleLogin);
    elements.accessCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Logout
    elements.logoutBtn.addEventListener('click', handleLogout);

    // Change nick
    if (elements.changeNickBtn) {
        elements.changeNickBtn.addEventListener('click', openNickModal);
    }
    if (elements.saveNickBtn) {
        elements.saveNickBtn.addEventListener('click', handleSaveNick);
    }
    if (elements.cancelNickBtn) {
        elements.cancelNickBtn.addEventListener('click', closeNickModal);
    }
    if (elements.nickModalOverlay) {
        elements.nickModalOverlay.addEventListener('click', closeNickModal);
    }
    if (elements.newNickInput) {
        elements.newNickInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSaveNick();
        });
    }
}

// ============================================
// AUTHENTICATION
// ============================================

async function handleLogin() {
    const code = elements.accessCodeInput.value.trim().toUpperCase();
    
    if (!code) {
        showLoginError('Por favor, digite um código de acesso.');
        return;
    }

    if (!supabaseClient) {
        showLoginError('Erro de conexão com Supabase.');
        return;
    }

    showLoginError('Verificando código...');

    try {
        const { data, error } = await supabaseClient
            .from('access_codes')
            .select('code, player_name')
            .eq('code', code)
            .eq('is_active', true)
            .single();

        if (error || !data) {
            showLoginError('Código de acesso inválido ou inativo.');
            elements.accessCodeInput.style.animation = 'none';
            setTimeout(() => {
                elements.accessCodeInput.style.animation = 'shake 0.5s';
            }, 10);
            return;
        }

        // Success
        state.accessCode = data.code;
        state.currentPlayer = {
            code: data.code,
            name: data.player_name
        };
        
        saveSessionToStorage();
        
        elements.accessCodeInput.value = '';
        elements.loginError.textContent = '';
        
        showDashboard();
        await loadHuntsFromSupabase();
        await loadRankingFromSupabase();
        
        showToast(`Bem-vindo, ${data.player_name}!`, 'success');
    } catch (err) {
        console.error('Login error:', err);
        showLoginError('Erro ao conectar com o servidor.');
    }
}

function handleLogout() {
    state.currentPlayer = null;
    state.accessCode = null;
    state.hunts = [];
    state.ranking = [];
    clearSessionFromStorage();
    showLoginScreen();
    showToast('Você saiu do sistema.', 'success');
}

// ============================================
// NICKNAME CHANGE
// ============================================

function openNickModal() {
    if (elements.nickModal) {
        elements.nickModal.classList.add('active');
        if (elements.nickModalOverlay) {
            elements.nickModalOverlay.classList.add('active');
        }
        if (elements.newNickInput) {
            elements.newNickInput.value = state.currentPlayer?.name || '';
            elements.newNickInput.focus();
        }
    } else {
        // Fallback: use prompt if modal doesn't exist
        const newName = prompt('Digite seu novo nick:', state.currentPlayer?.name || '');
        if (newName && newName.trim()) {
            updateNickname(newName.trim());
        }
    }
}

function closeNickModal() {
    if (elements.nickModal) {
        elements.nickModal.classList.remove('active');
        if (elements.nickModalOverlay) {
            elements.nickModalOverlay.classList.remove('active');
        }
    }
}

async function handleSaveNick() {
    const newNick = elements.newNickInput?.value.trim();
    if (!newNick) {
        showToast('Digite um nick válido.', 'error');
        return;
    }
    
    closeNickModal();
    await updateNickname(newNick);
}

async function updateNickname(newNick) {
    if (!supabaseClient || !state.accessCode) {
        showToast('Erro ao atualizar nick.', 'error');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('access_codes')
            .update({ 
                player_name: newNick,
                updated_at: new Date().toISOString()
            })
            .eq('code', state.accessCode);

        if (error) {
            showToast('Erro ao atualizar nick: ' + error.message, 'error');
            return;
        }

        state.currentPlayer.name = newNick;
        saveSessionToStorage();
        
        // Update UI
        if (elements.playerName) {
            elements.playerName.textContent = newNick;
        }
        
        showToast(`Nick atualizado para: ${newNick}`, 'success');
    } catch (err) {
        console.error('Update nick error:', err);
        showToast('Erro ao atualizar nick.', 'error');
    }
}

// ============================================
// SCREEN MANAGEMENT
// ============================================

function showLoginScreen() {
    elements.loginScreen.classList.add('active');
    elements.dashboardScreen.classList.remove('active');
    elements.accessCodeInput.focus();
}

function showDashboard() {
    elements.loginScreen.classList.remove('active');
    elements.dashboardScreen.classList.add('active');
    
    if (elements.playerName) {
        elements.playerName.textContent = state.currentPlayer?.name || 'Jogador';
    }
    
    renderHunts();
    renderRanking();
}

// ============================================
// HUNTS MANAGEMENT
// ============================================

async function loadHuntsFromSupabase() {
    if (!supabaseClient) {
        showToast('Erro ao carregar hunts.', 'error');
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('hunts')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error loading hunts:', error);
            showToast('Erro ao carregar hunts.', 'error');
            return;
        }

        state.hunts = data || [];
        sortHuntsByPriority();
        renderHunts();
    } catch (err) {
        console.error('Error:', err);
        showToast('Erro ao carregar dados.', 'error');
    }
}

function sortHuntsByPriority() {
    state.hunts.sort((a, b) => {
        const statusA = getHuntStatus(a);
        const statusB = getHuntStatus(b);
        
        // Priority order: ready > never_checked > on_cooldown (by time remaining)
        const priorityOrder = { 'ready': 0, 'never_checked': 1, 'on_cooldown': 2 };
        
        if (priorityOrder[statusA] !== priorityOrder[statusB]) {
            return priorityOrder[statusA] - priorityOrder[statusB];
        }
        
        // Within same status, sort by time
        if (statusA === 'on_cooldown' && statusB === 'on_cooldown') {
            return (a.seconds_remaining || 999) - (b.seconds_remaining || 999);
        }
        
        if (statusA === 'never_checked' && statusB === 'never_checked') {
            return a.name.localeCompare(b.name);
        }
        
        return 0;
    });
}

function getHuntStatus(hunt) {
    if (!hunt.last_check) return 'never_checked';
    
    const now = new Date();
    const lastCheck = new Date(hunt.last_check);
    const cooldownMs = (hunt.cooldown_hours || 24) * 60 * 60 * 1000;
    const nextCheck = new Date(lastCheck.getTime() + cooldownMs);
    
    if (now >= nextCheck) return 'ready';
    
    return 'on_cooldown';
}

function getHuntStatusInfo(hunt) {
    const status = getHuntStatus(hunt);
    
    switch (status) {
        case 'ready':
            return {
                status: 'ready',
                label: '✅ PRONTO',
                labelClass: 'status-ready',
                icon: '✅',
                timeText: 'Disponível para verificação',
                color: 'var(--color-success)'
            };
        case 'never_checked':
            return {
                status: 'never_checked',
                label: '🔴 NUNCA',
                labelClass: 'status-never',
                icon: '🔴',
                timeText: 'Nunca verificado',
                color: 'var(--color-error)'
            };
        case 'on_cooldown':
            const now = new Date();
            const lastCheck = new Date(hunt.last_check);
            const cooldownMs = (hunt.cooldown_hours || 24) * 60 * 60 * 1000;
            const nextCheck = new Date(lastCheck.getTime() + cooldownMs);
            const remainingMs = nextCheck - now;
            const remainingHours = remainingMs / (60 * 60 * 1000);
            
            let timeLabel, timeClass;
            if (remainingHours > 24) {
                const days = Math.floor(remainingHours / 24);
                const hours = Math.floor(remainingHours % 24);
                timeLabel = `🟠 ${days}d ${hours}h`;
                timeClass = 'status-orange';
            } else if (remainingHours > 12) {
                const hours = Math.floor(remainingHours);
                timeLabel = `🟡 ${hours}h`;
                timeClass = 'status-yellow';
            } else {
                const hours = Math.floor(remainingHours);
                const minutes = Math.floor((remainingHours - hours) * 60);
                timeLabel = `🟢 ${hours}h ${minutes}m`;
                timeClass = 'status-green';
            }
            
            return {
                status: 'on_cooldown',
                label: timeLabel,
                labelClass: timeClass,
                icon: '⏳',
                timeText: `Próximo em: ${formatTimeRemaining(remainingMs)}`,
                color: remainingHours > 24 ? 'var(--color-error)' : remainingHours > 12 ? 'var(--color-accent)' : 'var(--color-success)'
            };
    }
}

function formatTimeRemaining(ms) {
    if (ms <= 0) return 'Agora';
    
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours === 0) return `${minutes} minutos`;
    if (hours < 24) return `${hours}h ${minutes}m`;
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} dia${days > 1 ? 's' : ''} e ${remainingHours}h`;
}

function hasHuntImage(hunt) {
    return hunt.image_url && hunt.image_url.trim() !== '';
}

function getHuntImage(hunt) {
    if (hasHuntImage(hunt)) {
        return hunt.image_url;
    }
    return null;
}

function renderHunts() {
    const grid = elements.respawnsGrid;
    if (!grid) return;
    
    grid.innerHTML = '';

    if (state.hunts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🗺️</div>
                <p>Nenhum respawn cadastrado.</p>
            </div>
        `;
        return;
    }

    state.hunts.forEach((hunt, index) => {
        const card = createHuntCard(hunt, index);
        grid.appendChild(card);
    });
}

function createHuntCard(hunt, index) {
    const card = document.createElement('div');
    const statusInfo = getHuntStatusInfo(hunt);
    const isReady = statusInfo.status === 'ready';
    const isNever = statusInfo.status === 'never_checked';
    
    card.className = `respawn-card ${isReady ? 'ready' : ''} ${isNever ? 'never-checked' : ''}`;
    card.style.animationDelay = `${index * 0.03}s`;
    card.dataset.huntId = hunt.id;

    const lastCheckDisplay = hunt.last_check 
        ? formatDateTime(hunt.last_check) 
        : 'Nunca';
    
    const lastPlayerDisplay = hunt.updated_by || 'Ninguém';
    const hasImage = hasHuntImage(hunt);
    const imageSrc = getHuntImage(hunt);

    card.innerHTML = `
        <div class="respawn-card-header ${isReady ? 'ready-border' : ''} ${hasImage ? 'has-image' : 'no-image'}">
            ${hasImage ? `<img src="${imageSrc}" alt="${hunt.name}" class="respawn-card-image" loading="lazy" onerror="this.style.display='none'; this.parentElement.classList.add('no-image');">` : ''}
            ${isReady ? '<div class="ready-badge">DISPONÍVEL</div>' : ''}
            <div class="respawn-card-overlay">
                <h3 class="respawn-card-name">${hunt.name}</h3>
                <span class="respawn-card-weight">⚡ ${hunt.priority} pts</span>
            </div>
        </div>
        <div class="respawn-card-body">
            <div class="respawn-card-status ${statusInfo.labelClass}">
                <span class="status-icon">${statusInfo.icon}</span>
                <span class="status-label">${statusInfo.label}</span>
            </div>
            <div class="respawn-card-info">
                <div class="info-row">
                    <span class="info-label">Cooldown:</span>
                    <span class="info-value">${hunt.cooldown_hours || 24}h</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Última verificação:</span>
                    <span class="info-value time">${lastCheckDisplay}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">${statusInfo.timeText.includes('Próximo') ? 'Próxima:' : 'Verificado por:'}</span>
                    <span class="info-value ${isReady || isNever ? 'player' : 'time'}">${isReady || isNever ? statusInfo.timeText : lastPlayerDisplay}</span>
                </div>
            </div>
            <div class="respawn-card-footer">
                <button class="btn btn-check" data-hunt-id="${hunt.id}" ${!isReady && !isNever ? 'disabled' : ''}>
                    ${!isReady && !isNever ? '⏳ Em cooldown' : '✓ VERIFIQUEI AGORA'}
                </button>
            </div>
        </div>
    `;

    // Add click listener
    const checkBtn = card.querySelector('.btn-check');
    if (checkBtn && !checkBtn.disabled) {
        checkBtn.addEventListener('click', () => handleHuntCheck(hunt.id));
    }

    return card;
}

async function handleHuntCheck(huntId) {
    const hunt = state.hunts.find(h => h.id === huntId);
    
    if (!hunt) {
        showToast('Hunt não encontrada.', 'error');
        return;
    }

    if (!supabaseClient) {
        showToast('Erro de conexão.', 'error');
        return;
    }

    const now = new Date().toISOString();
    const points = hunt.priority || 1;

    try {
        // 1. Insert check record
        const { error: checkError } = await supabaseClient
            .from('hunt_checks')
            .insert({
                hunt_id: huntId,
                player_name: state.currentPlayer.name,
                checked_at: now,
                points: points
            });

        if (checkError) {
            showToast('Erro ao registrar verificação: ' + checkError.message, 'error');
            return;
        }

        // 2. Update hunt
        const { error: updateError } = await supabaseClient
            .from('hunts')
            .update({
                last_check: now,
                updated_by: state.currentPlayer.name,
                updated_at: now
            })
            .eq('id', huntId);

        if (updateError) {
            showToast('Erro ao atualizar hunt: ' + updateError.message, 'error');
            return;
        }

        // 3. Update local state
        hunt.last_check = now;
        hunt.updated_by = state.currentPlayer.name;
        hunt.updated_at = now;

        sortHuntsByPriority();
        renderHunts();
        await loadRankingFromSupabase();

        showToast(`+${points} pontos! ${hunt.name} verificada!`, 'success');
    } catch (err) {
        console.error('Check error:', err);
        showToast('Erro ao processar verificação.', 'error');
    }
}

function updateCountdowns() {
    // Re-render hunts to update countdown displays
    if (state.hunts.length > 0) {
        sortHuntsByPriority();
        renderHunts();
    }
}

// ============================================
// RANKING
// ============================================

async function loadRankingFromSupabase() {
    if (!supabaseClient) return;

    try {
        // Use the ranking function or calculate from hunt_checks
        const { data, error } = await supabaseClient
            .rpc('get_ranking');

        if (error) {
            // Fallback: calculate manually
            const { data: checks, error: checksError } = await supabaseClient
                .from('hunt_checks')
                .select('player_name, points');

            if (checksError) {
                console.error('Ranking error:', checksError);
                return;
            }

            // Calculate ranking manually
            const scores = {};
            checks.forEach(check => {
                if (!scores[check.player_name]) {
                    scores[check.player_name] = { name: check.player_name, score: 0, checks: 0 };
                }
                scores[check.player_name].score += check.points || 1;
                scores[check.player_name].checks += 1;
            });

            state.ranking = Object.values(scores).sort((a, b) => b.score - a.score);
        } else {
            state.ranking = data.map(d => ({
                name: d.player_name,
                score: Number(d.total_points),
                checks: Number(d.total_checks)
            }));
        }

        renderRanking();
    } catch (err) {
        console.error('Ranking error:', err);
    }
}

function renderRanking() {
    const list = elements.rankingList;
    if (!list) return;
    
    list.innerHTML = '';

    if (state.ranking.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏆</div>
                <p>Nenhum jogador no ranking ainda.</p>
            </div>
        `;
        return;
    }

    state.ranking.forEach((entry, index) => {
        const item = createRankingItem(entry, index);
        list.appendChild(item);
    });
}

function createRankingItem(entry, index) {
    const item = document.createElement('div');
    item.className = 'ranking-item';
    
    const isCurrentPlayer = entry.name === state.currentPlayer?.name;
    if (isCurrentPlayer) {
        item.classList.add('current-player');
    }

    let positionClass = '';
    if (index === 0) positionClass = 'gold';
    else if (index === 1) positionClass = 'silver';
    else if (index === 2) positionClass = 'bronze';

    const medals = ['🥇', '🥈', '🥉'];
    const displayPosition = index < 3 ? medals[index] : `#${index + 1}`;

    item.innerHTML = `
        <div class="rank-position ${positionClass}">${displayPosition}</div>
        <div class="rank-info">
            <div class="rank-name">${entry.name}</div>
            <div class="rank-score">${entry.checks || 0} verificações</div>
        </div>
        <div class="rank-points">${entry.score}</div>
    `;

    return item;
}

// ============================================
// UTILITIES
// ============================================

function formatDateTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'agora mesmo';
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `há ${minutes} min`;
    }
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `há ${hours}h`;
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month} às ${hours}:${minutes}`;
}

function showToast(message, type = 'success') {
    const toast = elements.toast;
    if (!toast) return;
    
    if (toast._timeout) {
        clearTimeout(toast._timeout);
    }
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoginError(message) {
    if (elements.loginError) {
        elements.loginError.textContent = message;
    }
}

// ============================================
// DYNAMIC STYLES
// ============================================

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .respawn-card.ready {
        border: 2px solid var(--color-success);
        box-shadow: var(--shadow-medium), 0 0 20px rgba(78, 204, 163, 0.2);
    }
    
    .respawn-card.ready:hover {
        box-shadow: var(--shadow-medium), 0 0 30px rgba(78, 204, 163, 0.4);
    }
    
    .respawn-card.never-checked {
        border-left: 4px solid var(--color-error);
    }
    
    .ready-border {
        border: 2px solid var(--color-success) !important;
    }
    
    .ready-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--color-success);
        color: var(--bg-primary);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        z-index: 10;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .respawn-card-status {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-bottom: 12px;
        background: rgba(255,255,255,0.05);
    }
    
    .status-ready {
        color: var(--color-success);
        background: rgba(78, 204, 163, 0.1);
    }
    
    .status-never {
        color: var(--color-error);
        background: rgba(233, 69, 96, 0.1);
    }
    
    .status-orange {
        color: #ff9800;
        background: rgba(255, 152, 0, 0.1);
    }
    
    .status-yellow {
        color: #ffc107;
        background: rgba(255, 193, 7, 0.1);
    }
    
    .status-green {
        color: var(--color-success);
        background: rgba(78, 204, 163, 0.1);
    }
    
    .status-icon {
        font-size: 1rem;
    }
    
    .btn-check:disabled {
        background: var(--bg-input);
        color: var(--color-text-dim);
        cursor: not-allowed;
        box-shadow: none;
    }
    
    .btn-check:disabled:hover {
        transform: none;
        box-shadow: none;
    }
    
    /* Nick Modal */
    .nick-modal {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-lg);
        padding: 30px;
        z-index: 1001;
        min-width: 300px;
        box-shadow: var(--shadow-medium);
    }
    
    .nick-modal.active {
        display: block;
    }
    
    .nick-modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1000;
    }
    
    .nick-modal-overlay.active {
        display: block;
    }
    
    .nick-modal h3 {
        font-family: var(--font-heading);
        color: var(--color-text-bright);
        margin-bottom: 20px;
    }
    
    .nick-modal input {
        width: 100%;
        padding: 12px;
        background: var(--bg-input);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        color: var(--color-text-bright);
        font-size: 1rem;
        margin-bottom: 15px;
    }
    
    .nick-modal input:focus {
        outline: none;
        border-color: var(--color-primary);
    }
    
    .nick-modal-buttons {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }
    
    .nick-modal-buttons .btn {
        padding: 8px 20px;
        font-size: 0.85rem;
    }
`;
document.head.appendChild(dynamicStyles);

// ============================================
// START APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', init);