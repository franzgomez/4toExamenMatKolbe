// Configuration file for Math Learning App
const CONFIG = {
    // Google Apps Script Web App URL for progress sync
    // Replace this URL with your actual Google Apps Script deployment URL
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzcXRXxHjZoVjguDMfyi11xZcUocfive_Xj_kUEEr7gUWNH_nECXaw8uzf_-bqdd8I/exec',
    
    // App settings
    APP_VERSION: '1.0.0',
    APP_NAME: 'Mate Aventura',
    
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
