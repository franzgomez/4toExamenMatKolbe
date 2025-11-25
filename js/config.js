// Configuration file for Matemáticas Kolbe App
const CONFIG = {
    // Google Apps Script Web App URL for progress sync
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzcXRXxHjZoVjguDMfyi11xZcUocfive_Xj_kUEEr7gUWNH_nECXaw8uzf_-bqdd8I/exec',
    
    // App settings
    APP_VERSION: '2.0.0',
    APP_NAME: 'Matemáticas Kolbe - 4to Grado Fin de Año',
    
    // Feature flags
    FEATURES: {
        PROGRESS_SYNC: true,
        OFFLINE_MODE: true,
        ACHIEVEMENTS: true,
        DAILY_STREAKS: true,
        AUDIO_FEEDBACK: true,
        PDF_EXPORT: true
    },
    
    // Exercise configuration
    EXERCISE_CONFIG: {
        ATTEMPTS_PER_EXERCISE: 3,
        STARS_PER_CORRECT: 1,
        HINT_PENALTY: 0.5,
        MIN_EXERCISES_PER_MODULE: 8,
        EXAM_TIME_LIMIT: 900, // 15 minutes in seconds
        EXAM_QUESTIONS_COUNT: 10
    },
    
    // Achievement thresholds
    ACHIEVEMENTS: {
        FIRST_STAR: 1,
        PERFECT_MODULE: 8,
        STREAK_WEEK: 7,
        STREAK_MONTH: 30,
        SPEED_MASTER: 5,
        EXPLORER: 4,
        PERFECTIONIST: 20
    },
    
    // Module configuration
    MODULES: {
        fractions: { name: 'Fracciones', icon: '🍕', color: '#ff6b35' },
        decimals: { name: 'Decimales', icon: '💰', color: '#f7931e' },
        proportions: { name: 'Proporciones', icon: '📊', color: '#0099cc' },
        operations: { name: 'Operaciones', icon: '🔢', color: '#7b68ee' },
        exam: { name: 'Examen Final', icon: '📝', color: '#dc3545' }
    },
    
    // Audio files
    AUDIO: {
        CORRECT_SOUND: 'assets/sounds/correct.mp3',
        WRONG_SOUND: 'assets/sounds/wrong.mp3',
        BG_MUSIC: 'assets/sounds/bg-music.mp3'
    },
    
    // LocalStorage keys
    STORAGE_KEYS: {
        STUDENT_NAME: 'kolbe_student_name',
        PROGRESS: 'kolbe_progress',
        ACHIEVEMENTS: 'kolbe_achievements',
        DAILY_STREAK: 'kolbe_daily_streak',
        LAST_ACTIVITY: 'kolbe_last_activity',
        SETTINGS: 'kolbe_settings'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
