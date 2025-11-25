/* ===========================================
   MATEMÁTICAS KOLBE – 4º GRADO
   LÓGICA COMPLETA DE LA APP
   =========================================== */

class MathApp {
    constructor() {
        this.modules = ["fractions", "decimals", "proportions", "operations"];
        this.exercises = this.generateExercises();
        this.progress = this.loadProgress();
        this.currentSection = "home";
        this.bgMusic = null;
        this.correctSound = null;
        this.wrongSound = null;
    }

    /* ================================
       STORAGE
       ================================ */

    loadProgress() {
        try {
            const raw = localStorage.getItem("mathKolbeProgress");
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error("Error leyendo progreso:", e);
        }
        return {
            studentName: "",
            stars: 0,
            solvedExercises: {},
            fractions: { completed: 0, total: 0, correct: 0, attempts: 0 },
            decimals: { completed: 0, total: 0, correct: 0, attempts: 0 },
            proportions: { completed: 0, total: 0, correct: 0, attempts: 0 },
            operations: { completed: 0, total: 0, correct: 0, attempts: 0 },
            achievements: [],
            log: [],
            streak: 0,
            lastVisit: null
        };
    }

    saveProgress() {
        try {
            localStorage.setItem("mathKolbeProgress", JSON.stringify(this.progress));
        } catch (e) {
            console.error("Error guardando progreso:", e);
        }
    }

    /* ================================
       INIT
       ================================ */

    init() {
        this.cacheDom();
        this.setupEventListeners();
        this.initializeModuleProgress();
        this.updateProgressDisplay();
        this.renderHomeStats();
        this.checkDailyStreak();
        this.setupStudentNameField();
        this.renderProgressDetails();
        this.initMusic();
    }

    cacheDom() {
        this.sections = document.querySelectorAll(".content-section");
        this.navButtons = document.querySelectorAll(".nav-btn");
        this.overallProgressBar = document.getElementById("overallProgress");
        this.progressText = document.getElementById("progressText");
        this.totalStarsEl = document.getElementById("totalStars");
        this.totalExercisesEl = document.getElementById("totalExercises");
        this.streakDaysEl = document.getElementById("streakDays");
        this.badgesContainer = document.getElementById("badgesContainer");
        this.detailedStats = document.getElementById("detailedStats");
        this.scrollTopBtn = document.getElementById("scrollTopBtn");
        this.scrollHomeBtn = document.getElementById("scrollHomeBtn");
        this.modal = document.getElementById("exerciseModal");
        this.modalBody = document.getElementById("modalBody");
    }

    /* ================================
       NOMBRE DEL ALUMNO
       ================================ */

    setupStudentNameField() {
        const input = document.getElementById("studentName");
        if (!input) return;

        if (this.progress.studentName) {
            input.value = this.progress.studentName;
        }

        input.addEventListener("change", () => {
            this.progress.studentName = input.value.trim();
            this.saveProgress();
        });
    }

    /* ================================
       GENERAR EJERCICIOS
       ================================ */

    generateExercises() {
        return {
            fractions: this.generateFractionExercises(),
            decimals: this.generateDecimalExercises(),
            proportions: this.generateProportionExercises(),
            operations: this.generateOperationExercises()
        };
    }

    generateFractionExercises() {
        return [
            {
                id: "frac-1",
                type: "choice",
                question: "¿Cuál fracción representa 1 parte de 4?",
                options: ["1/2", "1/4", "3/4"],
                answer: 1,
                explanation: "Si dividís algo en 4 partes y tomás 1, la fracción es 1/4."
            },
            {
                id: "frac-2",
                type: "choice",
                question: "¿Cuál fracción es mayor?",
                options: ["1/3", "1/5", "1/8"],
                answer: 0,
                explanation: "Cuanto más grande es el denominador, más chica es la porción. Por eso 1/3 es la mayor."
            },
            {
                id: "frac-3",
                type: "numeric",
                question: "Comés 2 porciones de una torta dividida en 8. ¿Qué fracción comiste?",
                answer: "2/8",
                explanation: "Partes comidas / total de partes = 2/8."
            },
            {
                id: "frac-4",
                type: "numeric",
                question: "Comés 3 porciones de una pizza dividida en 6. ¿Qué fracción comiste?",
                answer: "3/6",
                explanation: "3 de 6 partes → 3/6."
            }
        ];
    }

    generateDecimalExercises() {
        return [
            {
                id: "dec-1",
                type: "choice",
                question: "¿Cuál es el decimal equivalente a 1/10?",
                options: ["0.01", "0.1", "1"],
                answer: 1,
                explanation: "1/10 = 0.1."
            },
            {
                id: "dec-2",
                type: "numeric",
                question: "Escribe el decimal para 25 centavos.",
                answer: "0.25",
                explanation: "25 centavos son 0.25 de un peso."
            },
            {
                id: "dec-3",
                type: "choice",
                question: "¿Cuál número es mayor?",
                options: ["0.4", "0.09", "0.13"],
                answer: 0,
                explanation: "0.4 = 40 centésimos; es el mayor."
            },
            {
                id: "dec-4",
                type: "numeric",
                question: "Escribe el decimal para 7 décimos.",
                answer: "0.7",
                explanation: "7 décimos = 0.7."
            }
        ];
    }

    generateProportionExercises() {
        return [
            {
                id: "prop-1",
                type: "choice",
                question: "Si 1 cuaderno vale $200, ¿cuánto valen 3?",
                options: ["$600", "$500", "$300"],
                answer: 0,
                explanation: "Multiplicás por 3: 200 × 3 = 600."
            },
            {
                id: "prop-2",
                type: "numeric",
                question: "En una tabla proporcional 2 → 6. ¿Qué valor corresponde a 5?",
                answer: "15",
                explanation: "Multiplicás por 3: 2×3=6, entonces 5×3=15."
            },
            {
                id: "prop-3",
                type: "choice",
                question: "Si 4 lápices valen $120, 1 lápiz vale:",
                options: ["$40", "$30", "$20"],
                answer: 1,
                explanation: "120 ÷ 4 = 30."
            },
            {
                id: "prop-4",
                type: "numeric",
                question: "En una receta, 2 vasos de jugo se mezclan con 8 vasos de agua. ¿Cuántos vasos de agua necesitas para 5 vasos de jugo si mantenés la proporción?",
                answer: "20",
                explanation: "La relación es ×4 (2→8), entonces 5×4=20."
            }
        ];
    }

    /* ================================
       OPERACIONES – CASITA B2
       ================================ */

    generateOperationExercises() {
        const list = [];
        // Helper para suma/resta
        const makeOp = (id, operationType, top, bottom) => {
            const a = parseInt(top.join(""), 10);
            const b = parseInt(bottom.join(""), 10);
            let res = operationType === "addition" ? a + b : a - b;
            return {
                id,
                type: "operation",
                operationType,
                digits: String(res).length,
                top,
                bottom,
                result: String(res),
                explanation: `El resultado es ${a} ${operationType === "addition" ? "+" : "−"} ${b} = ${res}.`
            };
        };

        list.push(
            makeOp("op-sum-1", "addition", [3, 5, 8], [1, 0, 7]),
            makeOp("op-sum-2", "addition", [4, 2, 9], [2, 3, 1]),
            makeOp("op-sub-1", "subtraction", [8, 4, 5], [2, 1, 3]),
            makeOp("op-sub-2", "subtraction", [7, 3, 6], [1, 5, 2])
        );

        // Multiplicaciones (3 cifras × 1 cifra)
        const makeMult = (id, topArr, factor) => {
            const a = parseInt(topArr.join(""), 10);
            const res = a * factor;
            return {
                id,
                type: "operation-mult",
                top: topArr,
                factor,
                result: String(res),
                explanation: `${a} × ${factor} = ${res}.`
            };
        };

        list.push(
            makeMult("op-mult-1", [2, 4, 5], 3),
            makeMult("op-mult-2", [1, 3, 7], 4)
        );

        // Divisiones (3 cifras ÷ 1 cifra)
        const makeDiv = (id, number, divisor) => {
            const res = Math.floor(number / divisor);
            return {
                id,
                type: "operation-div",
                number,
                divisor,
                result: String(res),
                explanation: `${number} ÷ ${divisor} = ${res}.`
            };
        };

        list.push(
            makeDiv("op-div-1", 468, 3),
            makeDiv("op-div-2", 525, 5)
        );

        return list;
    }

    /* ================================
       PROGRESO POR MÓDULO
       ================================ */

    initializeModuleProgress() {
        if (!this.progress.solvedExercises) {
            this.progress.solvedExercises = {};
        }

        this.modules.forEach(m => {
            const total = this.exercises[m].length;
            if (!this.progress[m]) {
                this.progress[m] = { completed: 0, total, correct: 0, attempts: 0 };
            } else {
                this.progress[m].total = total;
            }
        });

        this.saveProgress();
    }

    updateProgressDisplay() {
        const totals = this.modules.map(m => this.progress[m].total);
        const completeds = this.modules.map(m => this.progress[m].completed);

        const total = totals.reduce((a, b) => a + b, 0);
        const completed = completeds.reduce((a, b) => a + b, 0);

        const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

        if (this.overallProgressBar) {
            this.overallProgressBar.style.width = pct + "%";
        }
        if (this.progressText) {
            this.progressText.textContent = `${pct}% completado`;
        }
    }

    addStar() {
        this.progress.stars++;
    }

    updateProgress(module, isCorrect, exerciseId) {
        const data = this.progress[module];
        if (!data) return;

        data.attempts++;
        if (isCorrect) {
            data.correct++;
            if (!this.progress.solvedExercises[exerciseId]) {
                this.progress.solvedExercises[exerciseId] = true;
                data.completed++;
                this.addStar();
            }
            if (this.correctSound) this.correctSound.play();
        } else {
            if (this.wrongSound) this.wrongSound.play();
        }

        this.logProgress(module, isCorrect, exerciseId);
        this.saveProgress();
        this.updateProgressDisplay();
        this.renderProgressDetails();
        this.renderHomeStats();
    }

    logProgress(module, isCorrect, exerciseId) {
        const now = new Date().toISOString();
        this.progress.log.push({
            timestamp: now,
            module,
            exerciseId,
            correct: isCorrect,
            student: this.progress.studentName || "(sin nombre)"
        });
    }

    /* ================================
       EVENTOS GENERALES
       ================================ */

    setupEventListeners() {
        // Navegación
        this.navButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const sec = btn.dataset.section;
                this.showSection(sec);
            });
        });

        // Exportar
        const exportBtn = document.getElementById("exportProgress");
        if (exportBtn) {
            exportBtn.addEventListener("click", () => this.exportProgress());
        }

        // Sincronizar
        const syncBtn = document.getElementById("syncProgress");
        if (syncBtn) {
            syncBtn.addEventListener("click", () => this.syncProgress());
        }

        // Reset
        const resetBtn = document.getElementById("resetProgress");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => this.resetProgress());
        }

        // Scroll botones
        if (this.scrollTopBtn) {
            this.scrollTopBtn.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
        if (this.scrollHomeBtn) {
            this.scrollHomeBtn.addEventListener("click", () => {
                this.showSection("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        window.addEventListener("scroll", () => {
            const y = window.scrollY || window.pageYOffset;
            const show = y > 200;
