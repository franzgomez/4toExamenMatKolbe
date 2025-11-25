// Main Application Class for Matemáticas Kolbe
class MathApp {
    constructor() {
        console.log('Iniciando MathApp...');
        
        // Initialize state
        this.currentSection = 'home';
        this.studentName = '';
        this.progress = this.loadProgress();
        this.confirmationCallback = null;
        this.exerciseEngine = new ExerciseEngine(this);
        this.examEngine = new ExamEngine(this);
        this.exerciseEngine = new ExerciseEngine(this);
        this.examEngine = new ExamEngine(this);
        this.operationsEngine = new OperationsEngine(this);

        // Load student name
        this.loadStudentName();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize displays
        this.updateProgressDisplay();
        this.renderHomeStats();
        this.setupModuleTabs();
        this.examEngine.attachEventListeners();

        console.log('MathApp inicializado correctamente');
    }
    
    // Initialize default progress structure
    loadProgress() {
        const savedProgress = Utils.loadFromStorage(CONFIG.STORAGE_KEYS.PROGRESS);
        
        if (savedProgress) {
            return savedProgress;
        }
        
        // Default progress structure
        return {
            modules: {
                fractions: { progress: 0, exercises: 0, correct: 0, total: 0 },
                decimals: { progress: 0, exercises: 0, correct: 0, total: 0 },
                proportions: { progress: 0, exercises: 0, correct: 0, total: 0 },
                operations: { progress: 0, exercises: 0, correct: 0, total: 0 },
                exam: { progress: 0, exercises: 0, correct: 0, total: 0 }
            },
            totalExercises: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            totalStars: 0,
            streak: 0,
            perfectAnswers: 0,
            achievements: [],
            lastActivity: null
        };
    }
    
    saveProgress() {
        Utils.saveToStorage(CONFIG.STORAGE_KEYS.PROGRESS, this.progress);
    }
    
    loadStudentName() {
        const savedName = Utils.loadFromStorage(CONFIG.STORAGE_KEYS.STUDENT_NAME);
        if (savedName) {
            this.studentName = savedName;
            const nameInput = document.getElementById('studentName');
            if (nameInput) {
                nameInput.value = savedName;
            }
        }
    }
    
    saveStudentName(name) {
        if (Utils.isValidName(name)) {
            this.studentName = name.trim();
            Utils.saveToStorage(CONFIG.STORAGE_KEYS.STUDENT_NAME, this.studentName);
            alert('✅ Nombre guardado correctamente');
            return true;
        } else {
            alert('❌ Por favor ingresa un nombre válido (mínimo 2 letras)');
            return false;
        }
    }
    
    requireStudentName(callback) {
        if (!this.studentName || this.studentName.trim() === '') {
            this.showModal('nameRequiredModal');
            this.nameRequiredCallback = callback;
            return false;
        }
        return true;
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });
        
        // Module cards - start buttons
        document.querySelectorAll('.module-card .start-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.module-card');
                const module = card.dataset.module;
                this.showSection(module);
            });
        });
        
        // Student name save button
        const saveNameBtn = document.getElementById('saveNameBtn');
        if (saveNameBtn) {
            saveNameBtn.addEventListener('click', () => {
                const nameInput = document.getElementById('studentName');
                if (nameInput) {
                    this.saveStudentName(nameInput.value);
                }
            });
        }
        
        // Name modal buttons
        const saveNameModalBtn = document.getElementById('saveNameModalBtn');
        if (saveNameModalBtn) {
            saveNameModalBtn.addEventListener('click', () => {
                const nameInput = document.getElementById('nameModalInput');
                if (nameInput && this.saveStudentName(nameInput.value)) {
                    this.closeModal('nameRequiredModal');
                    if (this.nameRequiredCallback) {
                        this.nameRequiredCallback();
                        this.nameRequiredCallback = null;
                    }
                }
            });
        }
        
        const cancelNameModalBtn = document.getElementById('cancelNameModalBtn');
        if (cancelNameModalBtn) {
            cancelNameModalBtn.addEventListener('click', () => {
                this.closeModal('nameRequiredModal');
                this.nameRequiredCallback = null;
            });
        }
        
        // Progress section buttons
        const exportProgressBtn = document.getElementById('exportProgress');
        if (exportProgressBtn) {
            exportProgressBtn.addEventListener('click', () => this.exportProgress());
        }
        
        const syncProgressBtn = document.getElementById('syncProgress');
        if (syncProgressBtn) {
            syncProgressBtn.addEventListener('click', () => this.syncProgress());
        }
        
        const resetProgressBtn = document.getElementById('resetProgress');
        if (resetProgressBtn) {
            resetProgressBtn.addEventListener('click', () => this.showResetConfirmation());
        }
        
        // Confirmation modal buttons
        const confirmYesBtn = document.getElementById('confirmYesBtn');
        if (confirmYesBtn) {
            confirmYesBtn.addEventListener('click', () => this.handleConfirmation(true));
        }
        
        const confirmNoBtn = document.getElementById('confirmNoBtn');
        if (confirmNoBtn) {
            confirmNoBtn.addEventListener('click', () => this.handleConfirmation(false));
        }
        
        // Feedback modal continue button
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.closeModal('feedbackModal'));
        }
        
        // Mobile buttons
        document.querySelectorAll('#scrollToTopBtn').forEach(btn => {
            btn.addEventListener('click', () => Utils.scrollToTop());
        });
        
        document.querySelectorAll('#backToHomeBtn').forEach(btn => {
            btn.addEventListener('click', () => this.showSection('home'));
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        });
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        });
        // Tabs de módulos: cuando abren pestaña de ejercicios, cargamos el motor
this.setupModuleTabs();

// Enlazar botones del examen con el motor
this.examEngine.attachEventListeners();

        console.log('Event listeners configurados');
    }

    // ---------------------------------------------------------
// Configurar tabs de todos los módulos
// ---------------------------------------------------------
setupModuleTabs() {
    document.querySelectorAll('.lesson-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.currentTarget.dataset.tab;

            const parentTabs = e.currentTarget.closest('.lesson-tabs');
            if (parentTabs) {
                parentTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            }

            const container = e.currentTarget.closest('.lesson-container');
            if (container) {
                container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                const targetContent = container.querySelector(`#${tab}`);
                if (targetContent) targetContent.classList.add('active');
            }

            if (tab === 'fractions-exercises') {
                this.exerciseEngine.loadModule('fractions');
            } else if (tab === 'decimals-exercises') {
                this.exerciseEngine.loadModule('decimals');
            } else if (tab === 'proportions-exercises') {
                this.exerciseEngine.loadModule('proportions');
            }

            if (tab === 'op-sum' ||
                tab === 'op-sub' ||
                tab === 'op-mult' ||
                tab === 'op-div' ||
                tab === 'op-game-missing' ||
                tab === 'op-game-error') {

                this.operationsEngine.render(tab);
            }
        });
    });
}

    
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const selectedSection = document.getElementById(sectionName);
        if (selectedSection) {
            selectedSection.classList.add('active');
        }
        
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionName) {
                btn.classList.add('active');
            }
        });
        
        this.currentSection = sectionName;
        
        // Load section-specific content
        if (sectionName === 'progress') {
            this.renderProgressDashboard();
        }
        
        // Scroll to top
        Utils.scrollToTop();
    }
    
    updateProgressDisplay() {
        // Update overall progress bar
        const overallProgress = Utils.calculateOverallProgress(
            Object.fromEntries(
                Object.keys(CONFIG.MODULES).map(key => [key, this.progress.modules[key].progress])
            )
        );
        
        const progressFill = document.getElementById('overallProgress');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${overallProgress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${overallProgress}% completado`;
        }
        
        // Update individual module progress
        Object.keys(CONFIG.MODULES).forEach(moduleKey => {
            const moduleProgress = this.progress.modules[moduleKey].progress;
            const progressElement = document.querySelector(`[data-progress="${moduleKey}"]`);
            const percentElement = document.getElementById(`${moduleKey}-progress`);
            
            if (progressElement) {
                progressElement.style.width = `${moduleProgress}%`;
            }
            
            if (percentElement) {
                percentElement.textContent = `${moduleProgress}%`;
            }
        });
    }
    
    renderHomeStats() {
        const totalStarsEl = document.getElementById('totalStars');
        const totalExercisesEl = document.getElementById('totalExercises');
        const streakDaysEl = document.getElementById('streakDays');
        const accuracyRateEl = document.getElementById('accuracyRate');
        
        if (totalStarsEl) {
            totalStarsEl.textContent = this.progress.totalStars;
        }
        
        if (totalExercisesEl) {
            totalExercisesEl.textContent = this.progress.totalExercises;
        }
        
        if (streakDaysEl) {
            streakDaysEl.textContent = this.progress.streak;
        }
        
        if (accuracyRateEl) {
            const accuracy = Utils.calculateAccuracy(this.progress.correctAnswers, this.progress.totalAnswers);
            accuracyRateEl.textContent = accuracy;
        }
    }

    // Progress Dashboard
    renderProgressDashboard() {
        this.renderModuleProgress();
        this.renderAchievements();
        this.renderDetailedStats();
    }

    renderModuleProgress() {
        const container = document.getElementById('moduleProgressGrid');
        if (!container) return;

        container.innerHTML = '';

        Object.keys(CONFIG.MODULES).forEach(moduleKey => {
            const module = CONFIG.MODULES[moduleKey];
            const progress = this.progress.modules[moduleKey];
            
            const card = Utils.createElement('div', 'module-progress-card');
            card.innerHTML = `
                <h4>${module.icon} ${module.name}</h4>
                <div class="progress-detail">
                    <span class="label">Progreso:</span>
                    <span class="value">${progress.progress}%</span>
                </div>
                <div class="progress-detail">
                    <span class="label">Ejercicios:</span>
                    <span class="value">${progress.exercises}</span>
                </div>
                <div class="progress-detail">
                    <span class="label">Correctos:</span>
                    <span class="value">${progress.correct}</span>
                </div>
                <div class="progress-detail">
                    <span class="label">Precisión:</span>
                    <span class="value">${progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0}%</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderAchievements() {
        const container = document.getElementById('badgesContainer');
        if (!container) return;

        const achievements = Utils.checkAchievements(this.progress);
        
        if (achievements.length === 0) {
            container.innerHTML = '<p>Completa ejercicios para desbloquear logros.</p>';
            return;
        }

        container.innerHTML = '';
        achievements.forEach(achievement => {
            const badge = Utils.createElement('div', 'badge', achievement);
            container.appendChild(badge);
        });
    }

    renderDetailedStats() {
        const container = document.getElementById('detailedStats');
        if (!container) return;

        const accuracy = this.progress.totalAnswers > 0 ? 
            Math.round((this.progress.correctAnswers / this.progress.totalAnswers) * 100) : 0;

        const stats = [
            { label: 'Total de ejercicios', value: this.progress.totalExercises },
            { label: 'Respuestas correctas', value: this.progress.correctAnswers },
            { label: 'Respuestas totales', value: this.progress.totalAnswers },
            { label: 'Precisión general', value: `${accuracy}%` },
            { label: 'Estrellas obtenidas', value: this.progress.totalStars },
            { label: 'Racha actual', value: `${this.progress.streak} días` },
            { label: 'Respuestas perfectas', value: this.progress.perfectAnswers }
        ];

        container.innerHTML = '';
        stats.forEach(stat => {
            const statDiv = Utils.createElement('div', 'stat-item');
            statDiv.innerHTML = `
                <span class="stat-label">${stat.label}:</span>
                <span class="stat-value">${stat.value}</span>
            `;
            container.appendChild(statDiv);
        });
    }

    // Export and Sync Functions
    exportProgress() {
        if (!this.requireStudentName(() => this.exportProgress())) {
            return;
        }

        const progressData = {
            overallProgress: Utils.calculateOverallProgress(
                Object.fromEntries(
                    Object.keys(CONFIG.MODULES).map(key => [key, this.progress.modules[key].progress])
                )
            ),
            totalExercises: this.progress.totalExercises,
            correctAnswers: this.progress.correctAnswers,
            accuracy: this.progress.totalAnswers > 0 ? 
                Math.round((this.progress.correctAnswers / this.progress.totalAnswers) * 100) : 0,
            modules: this.progress.modules,
            achievements: this.progress.achievements
        };

        Utils.generateProgressPDF(progressData, this.studentName)
            .then(success => {
                if (success) {
                    alert('✅ Progreso exportado exitosamente');
                } else {
                    alert('❌ Error al exportar progreso');
                }
            });
    }

    async syncProgress() {
        if (!this.requireStudentName(() => this.syncProgress())) {
            return;
        }

        const syncStatus = document.getElementById('syncStatus');
        if (syncStatus) {
            syncStatus.className = 'sync-status loading';
            syncStatus.textContent = '⏳ Sincronizando...';
        }

        try {
            const syncData = {
                nombre: this.studentName,
                fecha: Utils.getCurrentDateString(),
                progreso_general: Utils.calculateOverallProgress(
                    Object.fromEntries(
                        Object.keys(CONFIG.MODULES).map(key => [key, this.progress.modules[key].progress])
                    )
                ),
                modulos: JSON.stringify(this.progress.modules),
                logros: JSON.stringify(this.progress.achievements),
                estadisticas: JSON.stringify({
                    total_ejercicios: this.progress.totalExercises,
                    respuestas_correctas: this.progress.correctAnswers,
                    respuestas_totales: this.progress.totalAnswers,
                    racha: this.progress.streak
                })
            };

            await Utils.syncToServer(syncData);
            
            if (syncStatus) {
                syncStatus.className = 'sync-status success';
                syncStatus.textContent = '✅ Sincronización exitosa';
            }
            
            setTimeout(() => {
                if (syncStatus) syncStatus.textContent = '';
            }, 3000);

        } catch (error) {
            console.error('Sync error:', error);
            
            if (syncStatus) {
                syncStatus.className = 'sync-status error';
                syncStatus.textContent = '❌ Error de sincronización';
            }
            
            setTimeout(() => {
                if (syncStatus) syncStatus.textContent = '';
            }, 5000);
        }
    }

    // Reset Functions
    showResetConfirmation() {
        this.showConfirmationModal(
            '🔄 Reiniciar Todo',
            '¿Estás seguro de que deseas reiniciar todo tu progreso? Esta acción no se puede deshacer.',
            () => this.resetAllProgress()
        );
    }

    resetAllProgress() {
        // Clear all stored data
        Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
            Utils.removeFromStorage(key);
        });

        // Reset application state
        this.progress = this.loadProgress();
        this.studentName = '';
        
        // Clear student name input
        const nameInput = document.getElementById('studentName');
        if (nameInput) nameInput.value = '';

        // Update displays
        this.updateProgressDisplay();
        this.renderHomeStats();
        
        // Show success message
        alert('🔄 Progreso reiniciado exitosamente');
        
        // Go to home
        this.showSection('home');
    }

    // Modal Management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
        }
    }

    closeModal(modalId = null) {
        if (modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('show');
                modal.style.display = 'none';
            }
        } else {
            // Close all modals
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('show');
                modal.style.display = 'none';
            });
        }
    }

    showFeedbackModal(feedback) {
        const modal = document.getElementById('feedbackModal');
        const content = document.getElementById('feedbackContent');
        
        if (modal && content) {
            content.innerHTML = `
                <h3>${feedback.title}</h3>
                <p>${feedback.message}</p>
            `;
            
            if (feedback.type === 'achievement') {
                content.classList.add('bounce-in');
                Utils.playSound('correct');
            }
            
            this.showModal('feedbackModal');
            
            setTimeout(() => {
                content.classList.remove('bounce-in');
            }, 1000);
        }
    }

    showConfirmationModal(title, message, onConfirm) {
        const titleElement = document.getElementById('confirmationTitle');
        const messageElement = document.getElementById('confirmationMessage');
        
        if (titleElement) titleElement.textContent = title;
        if (messageElement) messageElement.textContent = message;
        
        this.confirmationCallback = onConfirm;
        this.showModal('confirmationModal');
    }

    handleConfirmation(confirmed) {
        this.closeModal('confirmationModal');
        
        if (confirmed && this.confirmationCallback) {
            this.confirmationCallback();
        }
        
        this.confirmationCallback = null;
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, inicializando app...');
    window.app = new MathApp();
    
    // Inicializar música de fondo
    Utils.initBackgroundMusic();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathApp;
}
