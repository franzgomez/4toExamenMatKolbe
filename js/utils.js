// Utility functions for Matemáticas Kolbe App
class Utils {
    // Audio management
    static playSound(soundType) {
        if (!CONFIG.FEATURES.AUDIO_FEEDBACK) return;
        
        try {
            const audioElement = document.getElementById(soundType + 'Sound');
            if (audioElement) {
                audioElement.currentTime = 0;
                audioElement.play().catch(e => console.log('Audio play failed:', e));
            }
        } catch (error) {
            console.log('Audio error:', error);
        }
    }
    
    // Local storage management
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }
    
    static loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    }
    
    static removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
    
    // Date and time utilities
    static getCurrentDateString() {
        return new Date().toISOString().split('T')[0];
    }
    
    static formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    static getTimestamp() {
        return new Date().toISOString();
    }
    
    // Math utilities
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    static randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    static shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    static roundToDecimal(number, decimals) {
        return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }
    
    // Progress calculation utilities
    static calculateModuleProgress(exercises, completedExercises) {
        if (!exercises || exercises.length === 0) return 0;
        const completed = completedExercises || [];
        return Math.round((completed.length / exercises.length) * 100);
    }
    
    static calculateOverallProgress(moduleProgresses) {
        const modules = Object.keys(CONFIG.MODULES);
        const totalProgress = modules.reduce((sum, module) => {
            return sum + (moduleProgresses[module] || 0);
        }, 0);
        return Math.round(totalProgress / modules.length);
    }
    
    static calculateAccuracy(correct, total) {
        if (total === 0) return 0;
        return Math.round((correct / total) * 100);
    }
    
    // DOM utilities
    static createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }
    
    static show(elementId) {
        const element = document.getElementById(elementId);
        if (element) element.style.display = 'block';
    }
    
    static hide(elementId) {
        const element = document.getElementById(elementId);
        if (element) element.style.display = 'none';
    }
    
    static addClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) element.classList.add(className);
    }
    
    static removeClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) element.classList.remove(className);
    }
    
    // Animation utilities
    static animateElement(elementId, animationClass, duration = 1000) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(animationClass);
            setTimeout(() => {
                element.classList.remove(animationClass);
            }, duration);
        }
    }
    
    static scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Validation utilities
    static isValidName(name) {
        return name && name.trim().length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(name.trim());
    }
    
    static isValidAnswer(answer, type = 'numeric') {
        if (type === 'numeric') {
            return !isNaN(parseFloat(answer)) && isFinite(answer);
        }
        return answer && answer.toString().trim() !== '';
    }
    
    // PDF generation utilities
    static async generateProgressPDF(progressData, studentName) {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            
            // Header
            pdf.setFontSize(20);
            pdf.text('Reporte de Progreso', 20, 30);
            pdf.setFontSize(16);
            pdf.text('Matemáticas Kolbe - 4to Grado', 20, 45);
            
            // Student info
            pdf.setFontSize(12);
            pdf.text(`Estudiante: ${studentName}`, 20, 65);
            pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 75);
            
            // Overall progress
            pdf.setFontSize(14);
            pdf.text('Progreso General:', 20, 95);
            pdf.setFontSize(12);
            pdf.text(`Progreso Total: ${progressData.overallProgress}%`, 30, 105);
            pdf.text(`Ejercicios Completados: ${progressData.totalExercises}`, 30, 115);
            pdf.text(`Respuestas Correctas: ${progressData.correctAnswers}`, 30, 125);
            pdf.text(`Precisión: ${progressData.accuracy}%`, 30, 135);
            
            // Module progress
            pdf.setFontSize(14);
            pdf.text('Progreso por Módulo:', 20, 155);
            let yPos = 165;
            
            Object.keys(CONFIG.MODULES).forEach(moduleKey => {
                const module = CONFIG.MODULES[moduleKey];
                const moduleProgress = progressData.modules[moduleKey] || { progress: 0, exercises: 0 };
                pdf.setFontSize(12);
                pdf.text(`${module.name}: ${moduleProgress.progress}% (${moduleProgress.exercises} ejercicios)`, 30, yPos);
                yPos += 10;
            });
            
            // Achievements
            if (progressData.achievements && progressData.achievements.length > 0) {
                pdf.setFontSize(14);
                pdf.text('Logros Obtenidos:', 20, yPos + 15);
                yPos += 25;
                
                progressData.achievements.forEach(achievement => {
                    pdf.setFontSize(12);
                    pdf.text(`• ${achievement}`, 30, yPos);
                    yPos += 10;
                });
            }
            
            // Save PDF
            const fileName = `Progreso_${studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
            
            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            return false;
        }
    }
    
    // Network utilities
    static async syncToServer(data) {
        try {
            const response = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data)
            });
            
            if (response.ok) {
                return await response.text();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Sync error:', error);
            throw error;
        }
    }
    
    // Achievement utilities
    static checkAchievements(progress) {
        const achievements = [];
        
        // First star
        if (progress.totalStars >= CONFIG.ACHIEVEMENTS.FIRST_STAR) {
            achievements.push('🌟 Primera Estrella');
        }
        
        // Perfect module
        Object.keys(CONFIG.MODULES).forEach(moduleKey => {
            const moduleProgress = progress.modules[moduleKey];
            if (moduleProgress && moduleProgress.progress === 100) {
                achievements.push(`🏆 ${CONFIG.MODULES[moduleKey].name} Perfecto`);
            }
        });
        
        // Streak achievements
        if (progress.streak >= CONFIG.ACHIEVEMENTS.STREAK_WEEK) {
            achievements.push('🔥 Racha de una Semana');
        }
        
        if (progress.streak >= CONFIG.ACHIEVEMENTS.STREAK_MONTH) {
            achievements.push('🔥 Racha de un Mes');
        }
        
        // Explorer - complete at least one exercise in each module
        const completedModules = Object.keys(progress.modules).filter(
            moduleKey => progress.modules[moduleKey] && progress.modules[moduleKey].exercises > 0
        );
        if (completedModules.length >= CONFIG.ACHIEVEMENTS.EXPLORER) {
            achievements.push('🗺️ Explorador');
        }
        
        // Perfectionist
        if (progress.perfectAnswers >= CONFIG.ACHIEVEMENTS.PERFECTIONIST) {
            achievements.push('💎 Perfeccionista');
        }
        
        return achievements;
    }
    
    // Mobile detection
    static isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Timer utilities
    static createTimer(duration, callback, updateCallback) {
        let timeLeft = duration;
        
        const timer = setInterval(() => {
            timeLeft--;
            
            if (updateCallback) {
                updateCallback(timeLeft);
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                if (callback) callback();
            }
        }, 1000);
        
        return timer;
    }
    
    // Debounce utility
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    // Error handling
    static handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // Show user-friendly message
        const message = context ? 
            `Ocurrió un error en ${context}. Por favor, intenta de nuevo.` : 
            'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
            
        alert(message);
    }
    
    // Feature detection
    static supportsLocalStorage() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    static supportsAudio() {
        return !!(document.createElement('audio').canPlayType);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
