
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

    checkAndShowAchievements() {
        const currentAchievements = Utils.checkAchievements(this.progress);
        const newAchievements = currentAchievements.filter(achievement => 
            !this.progress.achievements.includes(achievement)
        );

        if (newAchievements.length > 0) {
            this.progress.achievements = currentAchievements;
            this.saveProgress();
            
            newAchievements.forEach(achievement => {
                this.showFeedbackModal({
                    title: '🏆 ¡Nuevo Logro!',
                    message: achievement,
                    type: 'achievement'
                });
            });
        }
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
                    this.showFeedback('✅ Progreso exportado exitosamente', 'success');
                } else {
                    this.showFeedback('❌ Error al exportar progreso', 'error');
                }
            });
    }

    exportExamResults() {
        // This would be called from exam results
        if (!this.studentName) return;

        // Generate exam-specific PDF
        this.showFeedback('📥 Función de exportación de examen en desarrollo', 'info');
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
        this.showFeedback('🔄 Progreso reiniciado exitosamente', 'success');
        
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

    showFeedback(message, type = 'info') {
        // Simple feedback using browser alert for now
        // Could be enhanced with custom notification system
        alert(message);
    }

    // Fallback Exercise Generation (if JSON files fail to load)
    generateFractionExercises() {
        return [
            {
                id: 'frac_fallback_1',
                type: 'multiple_choice',
                question: '¿Qué fracción representa la mitad de algo?',
                options: ['1/2', '1/3', '2/4', 'Ambas A y C'],
                correct: 3,
                explanation: '1/2 y 2/4 representan la misma cantidad: la mitad.',
                hint: 'Piensa en fracciones equivalentes.'
            }
            // Add more fallback exercises as needed
        ];
    }

    generateDecimalExercises() {
        return [
            {
                id: 'dec_fallback_1',
                type: 'multiple_choice',
                question: '¿Cuál es el valor de 0.5 en fracción?',
                options: ['1/2', '5/10', '50/100', 'Todas las anteriores'],
                correct: 3,
                explanation: '0.5 = 1/2 = 5/10 = 50/100. Todas son equivalentes.',
                hint: '0.5 significa 5 décimos.'
            }
        ];
    }

    generateProportionExercises() {
        return [
            {
                id: 'prop_fallback_1',
                type: 'multiple_choice',
                question: 'Si 2 manzanas cuestan 4€, ¿cuánto cuestan 4 manzanas?',
                options: ['6€', '8€', '10€', '12€'],
                correct: 1,
                explanation: 'Si 2 manzanas = 4€, entonces 4 manzanas = 8€.',
                hint: 'Encuentra el precio de 1 manzana primero.'
            }
        ];
    }

    generateOperationExercises() {
        return [
            {
                id: 'op_fallback_1',
                type: 'numeric',
                question: 'Calcula: 25 + 37',
                answer: 62,
                explanation: '25 + 37 = 62',
                hint: 'Suma las unidades primero: 5 + 7 = 12, luego las decenas: 20 + 30 = 50.'
            }
        ];
    }

    generateExamQuestions() {
        return [
            {
                id: 'exam_fallback_1',
                type: 'multiple_choice',
                topic: 'fractions',
                question: '¿Cuál fracción es mayor?',
                options: ['1/3', '1/4', '1/5', '1/6'],
                correct: 0,
                points: 1,
                explanation: '1/3 es la mayor porque el denominador es menor.'
            }
        ];
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MathApp();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathApp;
}
