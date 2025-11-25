// ======================================================================
//  EXERCISE ENGINE — Motor general para Fracciones, Decimales, Proporciones
// ======================================================================

const MODULE_EXERCISE_CONTAINERS = {
    fractions: 'fractionExercises',
    decimals: 'decimalExercises',
    proportions: 'proportionExercises'
};

class ExerciseEngine {

    constructor(app) {
        this.app = app;  
        this.currentModule = null;
        this.currentExercises = [];
        this.currentIndex = 0;
        this.allowAnswer = true;
    }

    // ---------------------------------------------------------
    // Cargar ejercicios desde /data/<module>.json
    // ---------------------------------------------------------
    async loadModule(moduleKey) {
        this.currentModule = moduleKey;
        this.currentIndex = 0;
        this.allowAnswer = true;

        const url = `data/${moduleKey}.json`;

        try {
            const res = await fetch(url);
            const json = await res.json();

            // JSON puede tener {exercises:[...]} o array plano
            this.currentExercises = json.exercises || json;

            this.renderCurrentExercise();

        } catch (e) {
            console.error(`Error cargando ${url}:`, e);
            alert("Error cargando ejercicios del módulo.");
        }
    }

    // ---------------------------------------------------------
    // Renderizar ejercicio actual
    // ---------------------------------------------------------
    renderCurrentExercise() {
        const exercise = this.currentExercises[this.currentIndex];
        if (!exercise) return;

        const containerId = MODULE_EXERCISE_CONTAINERS[this.currentModule];
        if (!containerId) {
            console.warn('No hay contenedor asociado para el módulo:', this.currentModule);
            return;
        }

        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = ""; // limpiar

        const card = Utils.createElement("div", "exercise-card");

        // ---- PREGUNTA ----
        const q = Utils.createElement("div", "exercise-question", exercise.question);
        card.appendChild(q);

        // ---- OPCIONES / INPUT ----
        if (exercise.type === "multiple_choice") {
            const optionsDiv = Utils.createElement("div", "exercise-options");
            exercise.options.forEach((opt, idx) => {
                const btn = Utils.createElement("button", "option-btn", opt);
                btn.addEventListener("click", () => {
                    if (this.allowAnswer) this.checkAnswer(idx, exercise);
                });
                optionsDiv.appendChild(btn);
            });
            card.appendChild(optionsDiv);

        } else if (exercise.type === "numeric") {
            const input = Utils.createElement("input", "numeric-input");
            input.type = "number";
            input.placeholder = "Tu respuesta";

            const btn = Utils.createElement("button", "option-btn", "Responder");
            btn.addEventListener("click", () => {
                if (!this.allowAnswer) return;
                this.checkAnswer(input.value, exercise);
            });

            card.appendChild(input);
            card.appendChild(btn);
        }

        // ---- HINT ----
        if (exercise.hint) {
            const hintBtn = Utils.createElement("button", "option-btn", "💡 Pista");
            hintBtn.addEventListener("click", () => alert(`Pista: ${exercise.hint}`));
            card.appendChild(hintBtn);
        }

        // ---- SIGUIENTE ----
        const nextBtn = Utils.createElement("button", "option-btn next-btn", "➡ Siguiente");
        nextBtn.addEventListener("click", () => this.nextExercise());
        card.appendChild(nextBtn);

        container.appendChild(card);
    }

    // ---------------------------------------------------------
    // Validar respuesta
    // ---------------------------------------------------------
    checkAnswer(answer, exercise) {

        this.allowAnswer = false;
        this.app.progress.totalAnswers++;
        this.app.progress.totalExercises++;

        let isCorrect = false;

        if (exercise.type === "multiple_choice") {
            isCorrect = (answer == exercise.correct);
        }

        if (exercise.type === "numeric") {
            const num = parseFloat(answer);
            if (!isNaN(num)) {
                isCorrect = (num == exercise.answer);
            }
        }

        const moduleData = this.app.progress.modules[this.currentModule];
        moduleData.total++;

        if (isCorrect) {
            moduleData.correct++;
            this.app.progress.totalStars++;
            this.app.progress.perfectAnswers++; // conteo simple
            Utils.playSound("correct");
            this.showFeedback("🎉 ¡Correcto!", exercise.explanation || "¡Bien hecho!");
        } else {
            Utils.playSound("wrong");
            this.showFeedback("❌ Incorrecto", exercise.explanation || "Repasemos el concepto e inténtalo de nuevo.");
        }

        this.updateModuleProgress();
        this.app.saveProgress();
        this.app.updateProgressDisplay();
        this.app.renderHomeStats();

        setTimeout(() => {
            this.allowAnswer = true;
        }, 300);
    }

    // ---------------------------------------------------------
    // Feedback modal
    // ---------------------------------------------------------
    showFeedback(title, explanation) {
        const modal = document.getElementById("feedbackModal");
        const content = document.getElementById("feedbackContent");

        if (!modal || !content) return;

        content.innerHTML = `
            <h3>${title}</h3>
            <p>${explanation}</p>
        `;

        this.app.showModal("feedbackModal");
    }

    // ---------------------------------------------------------
    // Calcular progreso por módulo
    // ---------------------------------------------------------
    updateModuleProgress() {
        const moduleData = this.app.progress.modules[this.currentModule];
        const totalExercises = this.currentExercises.length || 1;
        moduleData.progress = Math.round((moduleData.correct / totalExercises) * 100);
    }

    // ---------------------------------------------------------
    // Avanzar al siguiente ejercicio
    // ---------------------------------------------------------
    nextExercise() {
        this.currentIndex++;

        if (this.currentIndex >= this.currentExercises.length) {
            alert("🎉 ¡Completaste todos los ejercicios del módulo!");
            this.currentIndex = 0;
        }

        this.renderCurrentExercise();
    }
}

// Export
if (typeof module !== "undefined") {
    module.exports = ExerciseEngine;
}
