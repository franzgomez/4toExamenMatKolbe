// Configuration file for Math Learning App
const CONFIG = {
    // Google Apps Script Web App URL para sincronizar progreso
    // Reemplaza esta URL con tu despliegue real de Google Apps Script
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzcXRXxHjZoVjguDMfyi11xZcUocfive_Xj_kUEEr7gUWNH_nECXaw8uzf_-bqdd8I/exec',
    
    // App settings
    APP_VERSION: '1.1.0',
    APP_NAME: 'Matemáticas Kolbe 4º Grado',
    
    // Feature flags
    FEATURES: {
        PROGRESS_SYNC: true,
        OFFLINE_MODE: true,
        ACHIEVEMENTS: true,
        DAILY_STREAKS: true
    },
    
    // Exercise configuration
    EXERCISE_CONFIG: {
        ATTEMPTS_PER_EXERCISE: 3,
        STARS_PER_CORRECT: 1,
        HINT_PENALTY: 0.5
    },
    
    // Achievement thresholds
    ACHIEVEMENTS: {
        FIRST_STAR: 1,
        PERFECT_MODULE: 5, // Minimum exercises to qualify for perfect score
        STREAK_WEEK: 7,
        STREAK_MONTH: 30
    }
};

// Export for Node / tests (no afecta al navegador)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
