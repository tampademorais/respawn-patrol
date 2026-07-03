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
    ranking: [],
    verificationHistory: []
};

// ============================================
// VERIFICATION STATUS CONFIGURATION
// ============================================

const VERIFICATION_STATUS = {
    SEM_PT: {
        id: 'SEM_PT',
        label: 'Sem PT',
        description: 'O respawn está vazio, não existe PT formada.',
        points: 1,
        color: 'blue',
        icon: '🔵',
        requiresImage: false,
        gradient: 'from-blue-600 to-blue-800',
        bgColor: 'bg-blue-900/30',
        borderColor: 'border-blue-500/50'
    },
    COM_PT: {
        id: 'COM_PT',
        label: 'Com PT',
        description: 'Existe uma PT formada aguardando completar.',
        points: 2,
        color: 'yellow',
        icon: '🟡',
        requiresImage: true,
        gradient: 'from-yellow-600 to-yellow-800',
        bgColor: 'bg-yellow-900/30',
        borderColor: 'border-yellow-500/50'
    },
    ACABOU_PT: {
        id: 'ACABOU_PT',
        label: 'Acabou PT',
        description: 'A PT encerrou a hunt e saiu do local.',
        points: 2,
        color: 'purple',
        icon: '🟣',
        requiresImage: true,
        gradient: 'from-purple-600 to-purple-800',
        bgColor: 'bg-purple-900/30',
        borderColor: 'border-purple-500/50'
    },
    MATAMOS: {
        id: 'MATAMOS',
        label: 'Matamos',
        description: 'Nossa PT matou a PT inimiga e assumiu o respawn.',
        points: 8,
        color: 'green',
        icon: '🟢',
        requiresImage: true,
        gradient: 'from-green-600 to-green-800',
        bgColor: 'bg-green-900/30',
        borderColor: 'border-green-500/50'
    },
    FRAGUEI: {
        id: 'FRAGUEI',
        label: 'Fraguei',
        description: 'A PT morreu durante a disputa.',
        points: 12,
        color: 'red',
        icon: '🔴',
        requiresImage: true,
        gradient: 'from-red-600 to-red-800',
        bgColor: 'bg-red-900/30',
        borderColor: 'border-red-500/50'
    }
};

// State for verification modal
let verificationModalState = {
    currentHuntId: null,
    selectedStatus: null,
    imageFile: null,
    imagePreview: null,
    isUploading: false
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
                    ${hasImage ? `<button class="btn-view-print" data-hunt-id="${hunt.id}" data-image="${imageSrc}" title="Ver print">📷 Ver print</button>` : ''}
                </div>
                <div class="info-row">
                    <span class="info-label">${statusInfo.timeText.includes('Próximo') ? 'Próxima:' : 'Verificado por:'}</span>
                    <span class="info-value ${isReady || isNever ? 'player' : 'time'}">${isReady || isNever ? statusInfo.timeText : lastPlayerDisplay}</span>
                </div>
                ${!isReady && !isNever ? `
                <div class="info-row">
                    <button class="btn-history" data-hunt-id="${hunt.id}" title="Ver histórico">📜 Histórico</button>
                </div>
                ` : ''}
            </div>
            <div class="respawn-card-footer">
                <button class="btn btn-check" data-hunt-id="${hunt.id}" ${!isReady && !isNever ? 'disabled' : ''}>
                    ${!isReady && !isNever ? '⏳ Em cooldown' : '✓ VERIFIQUEI AGORA'}
                </button>
            </div>
        </div>
    `;

    // Add click listeners
    const checkBtn = card.querySelector('.btn-check');
    if (checkBtn && !checkBtn.disabled) {
        checkBtn.addEventListener('click', () => openVerificationModal(hunt.id));
    }

    // View print button - opens in new tab
    const viewPrintBtn = card.querySelector('.btn-view-print');
    if (viewPrintBtn) {
        viewPrintBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const imageUrl = e.target.dataset.image;
            if (imageUrl) {
                window.open(imageUrl, '_blank', 'noopener,noreferrer');
            } else {
                showToast('Print não encontrado.', 'error');
            }
        });
    }

    // History button
    const historyBtn = card.querySelector('.btn-history');
    if (historyBtn) {
        historyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openHistoryModal(hunt.id);
        });
    }

    return card;
}

// ============================================
// VERIFICATION MODAL
// ============================================

function openVerificationModal(huntId) {
    const hunt = state.hunts.find(h => h.id === huntId);
    if (!hunt) {
        showToast('Hunt não encontrada.', 'error');
        return;
    }

    // Reset modal state
    verificationModalState = {
        currentHuntId: huntId,
        selectedStatus: null,
        imageFile: null,
        imagePreview: null,
        isUploading: false
    };

    // Create modal HTML if it doesn't exist
    ensureVerificationModalExists();

    // Show modal
    const modal = document.getElementById('verification-modal');
    const overlay = document.getElementById('verification-modal-overlay');
    if (modal) modal.classList.add('active');
    if (overlay) overlay.classList.add('active');

    // Update hunt name in modal
    const huntNameEl = document.querySelector('.verification-modal-hunt-name');
    if (huntNameEl) huntNameEl.textContent = hunt.name;

    // Reset status selection
    document.querySelectorAll('.verification-status-option').forEach(el => {
        el.classList.remove('selected');
    });

    // Reset image upload area
    resetImageUploadArea();

    // Update confirm button state
    updateConfirmButtonState();
}

function closeVerificationModal() {
    const modal = document.getElementById('verification-modal');
    const overlay = document.getElementById('verification-modal-overlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');

    // Clear image preview if exists
    if (verificationModalState.imagePreview) {
        URL.revokeObjectURL(verificationModalState.imagePreview);
    }
}

function ensureVerificationModalExists() {
    if (document.getElementById('verification-modal')) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'verification-modal-overlay';
    overlay.className = 'verification-modal-overlay';
    overlay.addEventListener('click', closeVerificationModal);
    document.body.appendChild(overlay);

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'verification-modal';
    modal.className = 'verification-modal';

    modal.innerHTML = `
        <div class="verification-modal-content">
            <div class="verification-modal-header">
                <h3>⚔️ Verificar Respawn</h3>
                <button class="verification-modal-close" onclick="closeVerificationModal()">✕</button>
            </div>
            
            <div class="verification-modal-body">
                <p class="verification-modal-hunt-label">Respawn:</p>
                <p class="verification-modal-hunt-name">--</p>
                
                <div class="verification-status-list">
                    <p class="verification-section-label">Qual foi o resultado da verificação?</p>
                    
                    <div class="verification-status-option" data-status="SEM_PT" onclick="selectVerificationStatus('SEM_PT')">
                        <div class="verification-status-icon blue">🔵</div>
                        <div class="verification-status-info">
                            <div class="verification-status-name">Sem PT</div>
                            <div class="verification-status-desc">O respawn está vazio, não existe PT formada.</div>
                        </div>
                        <div class="verification-status-points">+1</div>
                    </div>
                    
                    <div class="verification-status-option" data-status="COM_PT" onclick="selectVerificationStatus('COM_PT')">
                        <div class="verification-status-icon yellow">🟡</div>
                        <div class="verification-status-info">
                            <div class="verification-status-name">Com PT</div>
                            <div class="verification-status-desc">Existe uma PT formada aguardando completar.</div>
                        </div>
                        <div class="verification-status-points">+2</div>
                    </div>
                    
                    <div class="verification-status-option" data-status="ACABOU_PT" onclick="selectVerificationStatus('ACABOU_PT')">
                        <div class="verification-status-icon purple">🟣</div>
                        <div class="verification-status-info">
                            <div class="verification-status-name">Acabou PT</div>
                            <div class="verification-status-desc">A PT encerrou a hunt e saiu do local.</div>
                        </div>
                        <div class="verification-status-points">+2</div>
                    </div>
                    
                    <div class="verification-status-option" data-status="MATAMOS" onclick="selectVerificationStatus('MATAMOS')">
                        <div class="verification-status-icon green">🟢</div>
                        <div class="verification-status-info">
                            <div class="verification-status-name">Matamos</div>
                            <div class="verification-status-desc">Nossa PT matou a PT inimiga e assumiu o respawn.</div>
                        </div>
                        <div class="verification-status-points">+8</div>
                    </div>
                    
                    <div class="verification-status-option" data-status="FRAGUEI" onclick="selectVerificationStatus('FRAGUEI')">
                        <div class="verification-status-icon red">🔴</div>
                        <div class="verification-status-info">
                            <div class="verification-status-name">Fraguei</div>
                            <div class="verification-status-desc">A PT morreu durante a disputa.</div>
                        </div>
                        <div class="verification-status-points">+12</div>
                    </div>
                </div>

                <!-- Image Upload Area (shown when status requires image) -->
                <div id="image-upload-section" class="image-upload-section" style="display: none;">
                    <p class="verification-section-label">📸 Print obrigatório</p>
                    <div class="image-upload-area" id="image-upload-area">
                        <div class="image-upload-placeholder" id="image-upload-placeholder">
                            <div class="upload-icon">📷</div>
                            <p class="upload-main-text">Arraste uma imagem aqui</p>
                            <p class="upload-sub-text">ou Cole usando CTRL+V</p>
                            <p class="upload-sub-text">ou Clique para selecionar</p>
                            <p class="upload-formats">PNG, JPG, JPEG, WEBP</p>
                        </div>
                        <div class="image-preview-container" id="image-preview-container" style="display: none;">
                            <img id="image-preview" src="" alt="Preview">
                            <button class="image-remove-btn" onclick="removeImage()" title="Remover imagem">✕</button>
                        </div>
                        <input type="file" id="image-file-input" accept="image/png,image/jpeg,image/jpg,image/webp" style="display: none;">
                    </div>
                    <p class="image-required-notice" id="image-required-notice">
                        ⚠️ Print obrigatório para confirmar esta verificação
                    </p>
                </div>
            </div>
            
            <div class="verification-modal-footer">
                <button class="btn btn-secondary" onclick="closeVerificationModal()">Cancelar</button>
                <button class="btn btn-confirm-verification" id="confirm-verification-btn" onclick="confirmVerification()" disabled>
                    Confirmar Verificação
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Setup event listeners for image upload
    setupImageUploadListeners();
}

function selectVerificationStatus(statusId) {
    verificationModalState.selectedStatus = statusId;
    const statusConfig = VERIFICATION_STATUS[statusId];

    // Update UI selection
    document.querySelectorAll('.verification-status-option').forEach(el => {
        el.classList.remove('selected');
        if (el.dataset.status === statusId) {
            el.classList.add('selected');
        }
    });

    // Show/hide image upload section
    const imageSection = document.getElementById('image-upload-section');
    if (statusConfig.requiresImage) {
        imageSection.style.display = 'block';
    } else {
        imageSection.style.display = 'none';
    }

    // Update confirm button state
    updateConfirmButtonState();
}

function updateConfirmButtonState() {
    const btn = document.getElementById('confirm-verification-btn');
    if (!btn || !verificationModalState.selectedStatus) {
        if (btn) btn.disabled = true;
        return;
    }

    const statusConfig = VERIFICATION_STATUS[verificationModalState.selectedStatus];
    
    if (statusConfig.requiresImage) {
        // Image is required - button enabled only if image exists
        btn.disabled = !verificationModalState.imageFile;
    } else {
        // No image required - button always enabled
        btn.disabled = false;
    }
}

// ============================================
// IMAGE UPLOAD FUNCTIONALITY
// ============================================

function setupImageUploadListeners() {
    const uploadArea = document.getElementById('image-upload-area');
    const fileInput = document.getElementById('image-file-input');
    
    if (!uploadArea || !fileInput) return;

    // Click to select
    uploadArea.addEventListener('click', (e) => {
        if (e.target.closest('.image-remove-btn')) return;
        if (!verificationModalState.imageFile) {
            fileInput.click();
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageFile(e.target.files[0]);
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (isValidImageType(file)) {
                handleImageFile(file);
            } else {
                showToast('Formato de imagem inválido. Use PNG, JPG, JPEG ou WEBP.', 'error');
            }
        }
    });

    // Paste support (Ctrl+V)
    document.addEventListener('paste', handlePaste);
}

function handlePaste(e) {
    // Only handle paste when modal is open
    const modal = document.getElementById('verification-modal');
    if (!modal || !modal.classList.contains('active')) return;

    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
            e.preventDefault();
            const file = items[i].getAsFile();
            if (file && isValidImageType(file)) {
                handleImageFile(file);
            } else {
                showToast('Formato de imagem inválido.', 'error');
            }
            break;
        }
    }
}

function isValidImageType(file) {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    return validTypes.includes(file.type);
}

function handleImageFile(file) {
    if (!isValidImageType(file)) {
        showToast('Formato inválido. Use PNG, JPG, JPEG ou WEBP.', 'error');
        return;
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
        showToast('Imagem muito grande. Máximo 10MB.', 'error');
        return;
    }

    verificationModalState.imageFile = file;

    // Show preview
    const preview = document.getElementById('image-preview');
    const placeholder = document.getElementById('image-upload-placeholder');
    const previewContainer = document.getElementById('image-preview-container');

    if (verificationModalState.imagePreview) {
        URL.revokeObjectURL(verificationModalState.imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    verificationModalState.imagePreview = previewUrl;

    preview.src = previewUrl;
    placeholder.style.display = 'none';
    previewContainer.style.display = 'flex';

    updateConfirmButtonState();
}

function removeImage() {
    verificationModalState.imageFile = null;
    
    if (verificationModalState.imagePreview) {
        URL.revokeObjectURL(verificationModalState.imagePreview);
        verificationModalState.imagePreview = null;
    }

    const placeholder = document.getElementById('image-upload-placeholder');
    const previewContainer = document.getElementById('image-preview-container');
    const fileInput = document.getElementById('image-file-input');

    placeholder.style.display = 'flex';
    previewContainer.style.display = 'none';
    if (fileInput) fileInput.value = '';

    updateConfirmButtonState();
}

function resetImageUploadArea() {
    removeImage();
}

// ============================================
// CONFIRM VERIFICATION
// ============================================

async function confirmVerification() {
    const { currentHuntId, selectedStatus, imageFile } = verificationModalState;

    console.log('[VERIFY] Starting verification:', { currentHuntId, selectedStatus, hasImage: !!imageFile });

    if (!currentHuntId || !selectedStatus) {
        showToast('Selecione uma opção.', 'error');
        return;
    }

    const statusConfig = VERIFICATION_STATUS[selectedStatus];
    if (statusConfig.requiresImage && !imageFile) {
        showToast('Anexe um print para confirmar.', 'error');
        return;
    }

    // Set uploading state
    verificationModalState.isUploading = true;
    const confirmBtn = document.getElementById('confirm-verification-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Enviando...';
    }

    const now = new Date().toISOString();
    const points = statusConfig.points;
    let imageUrl = null;

    try {
        // 1. Upload image if required
        if (imageFile) {
            console.log('[VERIFY] Uploading image...');
            imageUrl = await uploadVerificationImage(imageFile, currentHuntId, selectedStatus);
            console.log('[VERIFY] Upload result:', imageUrl);

            // If image is required but upload failed, block confirmation
            if (statusConfig.requiresImage && !imageUrl) {
                showToast('Erro ao enviar imagem. Não foi possível confirmar a verificação.', 'error');
                throw new Error('Image upload failed for required status');
            }
        }

        console.log('[VERIFY] Inserting check record with image_url:', imageUrl);

        // 2. Insert check record with status and image
        const { data: checkData, error: checkError } = await supabaseClient
            .from('hunt_checks')
            .insert({
                hunt_id: currentHuntId,
                player_name: state.currentPlayer.name,
                checked_at: now,
                points: points,
                status: selectedStatus,
                image_url: imageUrl
            })
            .select();

        if (checkError) {
            console.error('[VERIFY] Check insert error:', checkError);
            showToast('Erro ao registrar verificação: ' + checkError.message, 'error');
            throw checkError;
        }

        console.log('[VERIFY] Check inserted successfully:', checkData);

        // 3. Update hunt
        const { error: updateError } = await supabaseClient
            .from('hunts')
            .update({
                last_check: now,
                updated_by: state.currentPlayer.name,
                updated_at: now
            })
            .eq('id', currentHuntId);

        if (updateError) {
            console.error('[VERIFY] Hunt update error:', updateError);
            showToast('Erro ao atualizar hunt: ' + updateError.message, 'error');
            throw updateError;
        }

        // 4. Update local state
        const hunt = state.hunts.find(h => h.id === currentHuntId);
        if (hunt) {
            hunt.last_check = now;
            hunt.updated_by = state.currentPlayer.name;
            hunt.updated_at = now;
            // Also update image_url if we have one
            if (imageUrl) {
                hunt.image_url = imageUrl;
            }
        }

        sortHuntsByPriority();
        renderHunts();
        await loadRankingFromSupabase();

        closeVerificationModal();
        showToast(`+${points} pontos! ${statusConfig.label} - ${hunt?.name || ''}`, 'success');

    } catch (err) {
        console.error('[VERIFY] Error:', err);
        showToast('Erro ao processar verificação.', 'error');
    } finally {
        verificationModalState.isUploading = false;
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Confirmar Verificação';
        }
    }
}

async function uploadVerificationImage(file, huntId, status) {
    const hunt = state.hunts.find(h => h.id === huntId);
    const huntName = hunt ? hunt.name.replace(/[^a-zA-Z0-9]/g, '_') : 'hunt';
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `verifications/${huntName}_${status}_${timestamp}.${extension}`;

    try {
        // First, ensure bucket exists and has public access
        // Note: In production, the bucket should be created via Supabase dashboard
        
        const { data, error } = await supabaseClient.storage
            .from('verification-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            // If bucket doesn't exist, return null and still allow verification
            if (error.message.includes('Bucket not found')) {
                showToast('Bucket de imagens não configurado. Verificação registrada sem imagem.', 'error');
                return null;
            }
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseClient.storage
            .from('verification-images')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (err) {
        console.error('Image upload error:', err);
        showToast('Erro ao enviar imagem, mas verificação foi registrada.', 'error');
        return null;
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
// OPEN PRINT IN NEW TAB
// ============================================

function openPrint(imageUrl) {
    if (!imageUrl || imageUrl.trim() === '') {
        showToast('Print não encontrado');
        return;
    }

    console.log('[PRINT URL]', imageUrl);

    window.open(imageUrl, '_blank', 'noopener,noreferrer');
}

// ============================================
// HISTORY MODAL
// ============================================

function openHistoryModal(huntId) {
    const hunt = state.hunts.find(h => h.id === huntId);
    if (!hunt) return;

    // Create modal if doesn't exist
    if (!document.getElementById('history-modal')) {
        const overlay = document.createElement('div');
        overlay.id = 'history-modal-overlay';
        overlay.className = 'history-modal-overlay';
        overlay.addEventListener('click', closeHistoryModal);
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.id = 'history-modal';
        modal.className = 'history-modal';
        modal.innerHTML = `
            <div class="history-modal-content">
                <div class="history-modal-header">
                    <h3>📜 Histórico da Hunt</h3>
                    <button class="history-modal-close" onclick="closeHistoryModal()">✕</button>
                </div>
                <div class="history-modal-body">
                    <p class="history-modal-hunt-name" id="history-hunt-name">--</p>
                    <div id="history-list" class="history-list">
                        <!-- History items will be inserted here -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Update hunt name
    document.getElementById('history-hunt-name').textContent = hunt.name;

    // Load history from Supabase
    loadHuntHistory(huntId);

    // Show modal
    const modal = document.getElementById('history-modal');
    const overlay = document.getElementById('history-modal-overlay');
    modal.classList.add('active');
    overlay.classList.add('active');
}

async function loadHuntHistory(huntId) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';

    console.log('[HISTORY] Loading history for hunt:', huntId);

    try {
        const { data: checks, error } = await supabaseClient
            .from('hunt_checks')
            .select('id, hunt_id, player_name, checked_at, points, status, image_url')
            .eq('hunt_id', huntId)
            .order('checked_at', { ascending: false })
            .limit(50);

        console.log('[HISTORY] Raw data:', checks);
        console.log('[HISTORY] Error:', error);

        if (error || !checks || checks.length === 0) {
            historyList.innerHTML = '<p class="history-empty">Nenhuma verificação registrada para esta hunt.</p>';
            return;
        }

        historyList.innerHTML = '';

        checks.forEach((check, index) => {
            console.log('[HISTORY] Check item:', check);
            const statusConfig = VERIFICATION_STATUS[check.status] || VERIFICATION_STATUS.SEM_PT;
            const item = document.createElement('div');
            item.className = 'history-item';
            item.style.animationDelay = `${index * 0.05}s`;

            const hasImage = check.image_url && check.image_url.trim() !== '';
            console.log('[HISTORY] Has image:', hasImage, 'URL:', check.image_url);

            item.innerHTML = `
                <div class="history-item-header">
                    <div class="history-status-badge ${statusConfig.color}">
                        ${statusConfig.icon} ${statusConfig.label}
                    </div>
                    <div class="history-points">+${check.points || statusConfig.points} pts</div>
                </div>
                <div class="history-item-info">
                    <div class="history-player">${check.player_name}</div>
                    <div class="history-date">${formatDateTime(check.checked_at)}</div>
                </div>
                ${hasImage ? `
                <div class="history-item-actions">
                    <button class="btn-view-print-small" onclick="window.open('${check.image_url}', '_blank', 'noopener,noreferrer')">
                        📷 Ver print
                    </button>
                </div>
                ` : ''}
            `;

            historyList.appendChild(item);
        });
    } catch (err) {
        console.error('[HISTORY] Error loading history:', err);
        historyList.innerHTML = '<p class="history-empty">Erro ao carregar histórico.</p>';
    }
}

function closeHistoryModal() {
    const modal = document.getElementById('history-modal');
    const overlay = document.getElementById('history-modal-overlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// ============================================
// START APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', init);
