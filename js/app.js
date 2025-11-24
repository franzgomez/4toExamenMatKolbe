/* ================================
   APP DE MATEMÁTICAS KOLBE – 4º GRADO
   VERSIÓN COMPLETA CON OPERACIONES (B2)
   SONIDOS + PROGRESO REAL + JUEGO FINAL
   ================================ */

class MathApp {
    constructor() {
        this.progress = this.loadProgress();
        this.exercises = this.generateExercises();
        this.currentSection = "home";
        this.currentExercises = [];
    }

    /* ================================
       1. STORAGE (GUARDAR / CARGAR)
       ================================ */

    loadProgress() {
        const saved = localStorage.getItem("mathAppProgress");
        if (saved) return JSON.parse(saved);

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
        localStorage.setItem("mathAppProgress", JSON.stringify(this.progress));
    }

    /* ================================
       2. INIT – ENTRADA PRINCIPAL
       ================================ */

    init() {
        this.setupEventListeners();
        this.initializeModuleProgress();
        this.updateProgressDisplay();
        this.renderHomeStats();
        this.checkDailyStreak();
        this.setupStudentNameField();
        this.renderProgressDetails();

        // ⬇ AGREGADO (sonidos)
        this.initMusic();
    }

    /* ================================
       3. NOMBRE DEL ALUMNO
       ================================ */
    setupStudentNameField() {
        const input = document.getElementById("studentName");
        if (!input) return;

        if (this.progress.studentName) input.value = this.progress.studentName;

        input.addEventListener("change", () => {
            this.progress.studentName = input.value.trim();
            this.saveProgress();
        });
    }

    /* ================================
       4. PROGRESO POR MÓDULO
       ================================ */
    initializeModuleProgress() {
        const modules = ["fractions", "decimals", "proportions", "operations"];

        if (!this.progress.solvedExercises)
            this.progress.solvedExercises = {};

        modules.forEach(module => {
            const total = this.exercises[module].length;
            if (!this.progress[module])
                this.progress[module] = { completed: 0, total, correct: 0, attempts: 0 };
            else
                this.progress[module].total = total;
        });

        this.saveProgress();
    }

    updateProgressDisplay() {
        const total = this.progress.fractions.total +
                      this.progress.decimals.total +
                      this.progress.proportions.total +
                      this.progress.operations.total;

        const completed = this.progress.fractions.completed +
                          this.progress.decimals.completed +
                          this.progress.proportions.completed +
                          this.progress.operations.completed;

        const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById("overallProgress").style.width = pct + "%";
        document.getElementById("progressText").textContent = `${pct}% completado`;
    }

    addStar() {
        this.progress.stars++;
    }

    /* ================================
       5. ACTUALIZAR PROGRESO POR EJERCICIO
       ================================ */

    updateProgress(module, isCorrect, exerciseId) {
        const data = this.progress[module];
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

        this.saveProgress();
        this.updateProgressDisplay();
        this.renderProgressDetails();
        this.logProgress(module, isCorrect, exerciseId);
    }

    /* ================================
       6. LOG
       ================================ */
    logProgress(module, isCorrect, exerciseId) {
        const timestamp = new Date().toISOString();
        this.progress.log.push({
            timestamp,
            module,
            exerciseId,
            correct: isCorrect,
            student: this.progress.studentName || "(sin nombre)"
        });
        this.saveProgress();
    }

    /* ================================
       7. EVENTOS GENERALES
       ================================ */
    setupEventListeners() {
        // Navegación
        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const sec = btn.dataset.section;
                this.showSection(sec);
            });
        });

        // Exportar
        document.getElementById("exportProgress")?.addEventListener("click", () => {
            this.exportProgress();
        });

        // Sincronizar
        document.getElementById("syncProgress")?.addEventListener("click", () => {
            this.syncProgress();
        });

        // Reset
        document.getElementById("resetProgress")?.addEventListener("click", () => {
            this.resetProgress();
        });
    }

    /* ================================
       7B. CAMBIO DE SECCIÓN
       ================================ */
    showSection(sec) {
        this.currentSection = sec;

        document.querySelectorAll(".content-section").forEach(s => s.classList.remove("active"));
        document.getElementById(sec).classList.add("active");

        if (["fractions", "decimals", "proportions", "operations"].includes(sec)) {
            this.renderExercises(sec);
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    /* ===========================================
   8. GENERAR TODOS LOS EJERCICIOS
   =========================================== */

generateExercises() {
    return {
        fractions: this.generateFractionExercises(),
        decimals: this.generateDecimalExercises(),
        proportions: this.generateProportionExercises(),
        operations: []  // se llena en Bloque 3
    };
}

/* ===========================================
   8A. FRACTIONS
   =========================================== */

generateFractionExercises() {
    return [
        {
            id: "frac-1",
            type: "choice",
            question: "¿Cuál fracción representa 1 parte de 4?",
            options: ["1/2", "1/4", "2/4"],
            answer: 1,
            explanation: "1 parte de 4 totales es 1/4."
        },
        {
            id: "frac-2",
            type: "choice",
            question: "¿Qué fracción es mayor?",
            options: ["1/3", "1/5", "1/8"],
            answer: 0,
            explanation: "1/3 es la porción más grande."
        },
        {
            id: "frac-3",
            type: "numeric",
            question: "Si comés 2 partes de una pizza dividida en 8, ¿qué fracción comiste?",
            answer: "2/8",
            explanation: "La fracción es partes comidas / total = 2/8."
        }
    ];
}

/* ===========================================
   8B. DECIMALS
   =========================================== */

generateDecimalExercises() {
    return [
        {
            id: "dec-1",
            type: "choice",
            question: "¿Cuál es el decimal equivalente a 1/10?",
            options: ["0.01", "0.1", "1"],
            answer: 1,
            explanation: "1/10 es 0.1."
        },
        {
            id: "dec-2",
            type: "numeric",
            question: "Escribe el decimal para 25 centavos.",
            answer: "0.25",
            explanation: "25 centavos es 0.25."
        }
    ];
}

/* ===========================================
   8C. PROPORTIONS
   =========================================== */

generateProportionExercises() {
    return [
        {
            id: "prop-1",
            type: "choice",
            question: "Si 1 manzana vale 2€, ¿cuánto valen 3?",
            options: ["5€", "6€", "7€"],
            answer: 1,
            explanation: "3 × 2 = 6."
        },
        {
            id: "prop-2",
            type: "numeric",
            question: "Una tabla tiene 2→4. ¿Qué número corresponde a 5?",
            answer: "10",
            explanation: "La constante es ×2, entonces 5×2=10."
        }
    ];
}

/* ===========================================
   9. RENDER DE EJERCICIOS POR MÓDULO
   =========================================== */

renderExercises(module) {
    const containerId = {
        fractions: "fractionExercises",
        decimals: "decimalExercises",
        proportions: "proportionExercises",
        operations: "operationExercises"
    }[module];

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    this.currentExercises = this.exercises[module];

    this.currentExercises.forEach((ex, index) => {
        const card = this.createExerciseCard(ex, module, index);
        container.appendChild(card);
    });
}

/* ===========================================
   10. TARJETA DE EJERCICIO
   =========================================== */

createExerciseCard(ex, module, index) {
    const card = document.createElement("div");
    card.className = "exercise-card";
    card.dataset.module = module;
    card.dataset.index = index;
    card.dataset.id = ex.id || `${module}-${index}`;

    let html = `<div class="exercise-question">${ex.question}</div>`;

    if (ex.type === "choice") {
        html += `<div class="exercise-options">`;
        ex.options.forEach((opt, i) => {
            html += `<button class="option-btn" data-opt="${i}">${opt}</button>`;
        });
        html += `</div>`;
    }

    if (ex.type === "numeric") {
        html += `
            <div class="exercise-options">
                <input type="text" class="numeric-input" placeholder="Respuesta">
                <button class="check-btn">✔</button>
            </div>
        `;
    }

    // ⚡ Los ejercicios tipo "operation" se completan en bloque 3

    card.innerHTML = html;

    this.setupExerciseListeners(card, ex);

    return card;
}

/* ===========================================
   11. MANEJAR EVENTOS DE CADA EJERCICIO
   =========================================== */

setupExerciseListeners(card, ex) {
    const module = card.dataset.module;
    const id = card.dataset.id;

    if (ex.type === "choice") {
        card.querySelectorAll(".option-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = parseInt(btn.dataset.opt);
                const correct = index === ex.answer;
                this.updateProgress(module, correct, id);
                this.showExplanation(ex, correct, card);
            });
        });
    }

    if (ex.type === "numeric") {
        const input = card.querySelector(".numeric-input");
        const checkBtn = card.querySelector(".check-btn");

        checkBtn.addEventListener("click", () => {
            const user = input.value.trim();
            const correct = user === String(ex.answer);
            this.updateProgress(module, correct, id);
            this.showExplanation(ex, correct, card);
        });
    }
}

/* ===========================================
   12. MOSTRAR EXPLICACIÓN
   =========================================== */

showExplanation(ex, correct, card) {
    let box = card.querySelector(".explanation-box");
    if (!box) {
        box = document.createElement("div");
        box.className = "explanation-box";
        card.appendChild(box);
    }

    box.innerHTML = `
        <strong>${correct ? "✔ Correcto" : "✖ Incorrecto"}</strong><br>
        ${ex.explanation || ""}
    `;

    box.style.display = "block";
}

/* ===========================================
   13. GENERAR EJERCICIOS DE OPERACIONES (CASITA B2)
   =========================================== */

generateOperationExercises() {
    return [

        /* ======================
           SUMAS 3 CIFRAS
        ====================== */
        this.makeOperation("op-suma-1", "addition", "3", [3,5,8], [1,0,7],  (358+107)),
        this.makeOperation("op-suma-2", "addition", "3", [4,2,9], [2,3,1],  (429+231)),
        this.makeOperation("op-suma-3", "addition", "3", [5,6,3], [1,2,8],  (563+128)),
        this.makeOperation("op-suma-4", "addition", "3", [8,1,4], [1,0,5],  (814+105)),
        this.makeOperation("op-suma-5", "addition", "3", [7,4,2], [1,5,1],  (742+151)),
        this.makeOperation("op-suma-6", "addition", "3", [6,4,5], [2,2,9],  (645+229)),

        /* ======================
           RESTAS 3 CIFRAS
        ====================== */
        this.makeOperation("op-resta-1", "subtraction", "3", [8,4,5], [2,1,3],  (845-213)),
        this.makeOperation("op-resta-2", "subtraction", "3", [7,3,6], [1,5,2],  (736-152)),
        this.makeOperation("op-resta-3", "subtraction", "3", [6,8,2], [3,4,7],  (682-347)),
        this.makeOperation("op-resta-4", "subtraction", "3", [9,4,7], [1,8,6],  (947-186)),
        this.makeOperation("op-resta-5", "subtraction", "3", [5,5,5], [2,3,4],  (555-234)),
        this.makeOperation("op-resta-6", "subtraction", "3", [8,1,9], [1,0,8],  (819-108)),

        /* ======================
           SUMAS 4 CIFRAS
        ====================== */
        this.makeOperation("op-suma4-1", "addition", "4", [1,2,5,8], [2,1,0,7], (1258+2107)),
        this.makeOperation("op-suma4-2", "addition", "4", [3,4,2,9], [1,3,1,2], (3429+1312)),
        this.makeOperation("op-suma4-3", "addition", "4", [4,8,3,6], [1,6,4,9], (4836+1649)),
        this.makeOperation("op-suma4-4", "addition", "4", [2,5,7,4], [1,0,2,5], (2574+1025)),
        this.makeOperation("op-suma4-5", "addition", "4", [3,7,6,1], [2,2,3,4], (3761+2234)),
        this.makeOperation("op-suma4-6", "addition", "4", [4,4,5,2], [1,5,5,5], (4452+1555)),

        /* ======================
           RESTAS 4 CIFRAS
        ====================== */
        this.makeOperation("op-resta4-1", "subtraction", "4", [9,5,4,8], [1,2,3,4], (9548-1234)),
        this.makeOperation("op-resta4-2", "subtraction", "4", [8,4,3,5], [2,3,4,1], (8435-2341)),
        this.makeOperation("op-resta4-3", "subtraction", "4", [6,7,2,8], [3,1,2,5], (6728-3125)),
        this.makeOperation("op-resta4-4", "subtraction", "4", [7,8,4,2], [2,6,4,3], (7842-2643)),
        this.makeOperation("op-resta4-5", "subtraction", "4", [8,0,5,6], [1,4,3,2], (8056-1432)),
        this.makeOperation("op-resta4-6", "subtraction", "4", [7,5,5,5], [1,0,5,1], (7555-1051)),

        /* ======================
           MULTIPLICACIONES
        ====================== */
        this.makeMult("op-mult-1", [2,4,5], 3, 245*3),
        this.makeMult("op-mult-2", [1,3,7], 4, 137*4),
        this.makeMult("op-mult-3", [3,8,6], 5, 386*5),
        this.makeMult("op-mult-4", [4,2,8], 6, 428*6),
        this.makeMult("op-mult-5", [5,1,9], 7, 519*7),
        this.makeMult("op-mult-6", [2,8,7], 8, 287*8),

        /* ======================
           DIVISIONES (1 CIFRA)
        ====================== */
        this.makeDiv("op-div-1", 468, 3, Math.floor(468/3)),
        this.makeDiv("op-div-2", 525, 5, Math.floor(525/5)),
        this.makeDiv("op-div-3", 648, 4, Math.floor(648/4)),
        this.makeDiv("op-div-4", 735, 7, Math.floor(735/7)),
        this.makeDiv("op-div-5", 864, 8, Math.floor(864/8)),
        this.makeDiv("op-div-6", 912, 6, Math.floor(912/6))
    ];
}

/* ===========================================
   14. FABRICANTES DE OPERACIONES
   =========================================== */

makeOperation(id, type, digits, topArr, botArr, result) {
    return {
        id,
        type: "operation",
        operationType: type,
        digits,
        top: topArr,
        bot: botArr,
        result: String(result),
        explanation: `El resultado correcto es ${result}.`
    };
}

makeMult(id, topArr, factor, result) {
    return {
        id,
        type: "operation-mult",
        top: topArr,
        factor,
        result: String(result),
        explanation: `${topArr.join("")} × ${factor} = ${result}`
    };
}

makeDiv(id, number, divisor, result) {
    return {
        id,
        type: "operation-div",
        number,
        divisor,
        result: String(result),
        explanation: `${number} ÷ ${divisor} = ${result}`
    };
}

/* ===========================================
   15. RENDER TARJETA DE OPERACIÓN (CASITA B2)
   =========================================== */

createOperationCard(ex, module) {
    const card = document.createElement("div");
    card.className = "exercise-card";
    card.dataset.module = module;
    card.dataset.id = ex.id;

    let html = `<div class="exercise-question">Resolvé:</div>`;

    /* SUMA / RESTA CON DÍGITOS */
    if (ex.type === "operation") {
        const sign = ex.operationType === "addition" ? "+" : "−";

        html += `<div class="operation-grid">`;

        // Fila 1 (número de arriba)
        html += `<div class="op-row">`;
        ex.top.forEach(d => {
            html += `<div class="op-digit">${d}</div>`;
        });
        html += `</div>`;

        // Fila 2 (signo + número de abajo)
        html += `<div class="op-row">`;
        html += `<div class="op-sign">${sign}</div>`;
        ex.bot.forEach(d => {
            html += `<div class="op-digit">${d}</div>`;
        });
        html += `</div>`;

        // Separador
        html += `<div class="op-line"></div>`;

        // Inputs para cada dígito del resultado
        html += `<div class="op-row">`;
        const resultDigits = ex.result.split("");
        resultDigits.forEach((_d,i) => {
            html += `<input class="digit-input" maxlength="1" data-pos="${i}">`;
        });
        html += `</div>`;

        html += `</div>`; // fin operation-grid
    }

    /* MULTIPLICACIONES */
    if (ex.type === "operation-mult") {
        html += `
        <div class="operation-grid">
            <div class="op-row">
                ${ex.top.map(d => `<div class="op-digit">${d}</div>`).join("")}
            </div>
            <div class="op-row">
                <div class="op-sign">×</div>
                <div class="op-digit">${ex.factor}</div>
            </div>
            <div class="op-line"></div>
            <div class="op-row">
                ${ex.result.split("").map((_,i)=>`<input class="digit-input" maxlength="1" data-pos="${i}">`).join("")}
            </div>
        </div>`;
    }

    /* DIVISIONES */
    if (ex.type === "operation-div") {
        html += `
        <div class="operation-grid">
            <div class="op-div-container">
                <span class="op-divisor">${ex.divisor}</span>
                <div class="op-div-symbol">)</div>
                <span class="op-number">${ex.number}</span>
            </div>
            <div class="op-row">
                ${ex.result.split("").map((_,i)=>`<input class="digit-input" maxlength="1" data-pos="${i}">`).join("")}
            </div>
        </div>`;
    }

    // Agregar botón para corregir
    html += `
        <div class="exercise-options">
            <button class="check-btn">✔</button>
        </div>
    `;

    card.innerHTML = html;
    this.setupOperationListeners(card, ex);
    return card;
}

/* ===========================================
   16. LISTENERS PARA EJERCICIOS DE OPERACIÓN
   =========================================== */

setupOperationListeners(card, ex) {
    const module = "operations";
    const id = ex.id;
    const inputs = card.querySelectorAll(".digit-input");
    const checkBtn = card.querySelector(".check-btn");

    checkBtn.addEventListener("click", () => {
        const userDigits = Array.from(inputs).map(inp => inp.value.trim() || "_");
        const correctDigits = ex.result.split("");

        let allCorrect = true;

        userDigits.forEach((digit, idx) => {
            if (digit === correctDigits[idx]) {
                inputs[idx].classList.add("digit-correct");
                inputs[idx].classList.remove("digit-wrong");
            } else {
                inputs[idx].classList.add("digit-wrong");
                inputs[idx].classList.remove("digit-correct");
                allCorrect = false;
            }
        });

        this.updateProgress(module, allCorrect, id);
        this.showExplanation(ex, allCorrect, card);
    });
}

/* ===========================================
   17. RENDER ÚNICO (Inclusión de operaciones)
   =========================================== */

renderExercises(module) {
    const containerId = {
        fractions: "fractionExercises",
        decimals: "decimalExercises",
        proportions: "proportionExercises",
        operations: "operationExercises"
    }[module];

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    this.currentExercises = this.exercises[module];

    this.currentExercises.forEach((ex, index) => {
        let card;

        if (module === "operations") {
            card = this.createOperationCard(ex, module);
        } else {
            card = this.createExerciseCard(ex, module, index);
        }

        container.appendChild(card);
    });

    // 👉 Si es operaciones, agregamos el botón del juego final
    if (module === "operations") {
        const btn = document.createElement("button");
        btn.className = "start-btn";
        btn.textContent = "🎮 Juego Final";
        btn.addEventListener("click", () => this.launchOperationGame());
        container.appendChild(btn);
    }
}

/* ===========================================
   18. JUEGO FINAL DE OPERACIONES
   =========================================== */

launchOperationGame() {
    const modal = document.getElementById("exerciseModal");
    const body = document.getElementById("modalBody");

    modal.style.display = "block";

    // Tomamos 1 ejercicio al azar
    const list = this.exercises.operations;
    const random = list[Math.floor(Math.random() * list.length)];

    // Creamos opciones falsas
    let options = [random.result];
    while (options.length < 3) {
        const fake = (parseInt(random.result) + Math.floor(Math.random() * 20) - 10);
        if (!options.includes(String(fake)) && fake > 0) options.push(String(fake));
    }

    // Mezclar
    options = options.sort(() => Math.random() - 0.5);

    body.innerHTML = `
        <h2>🎮 Juego Final</h2>
        <p>Elegí el resultado correcto:</p>

        <div class="operation-game-question">
            ${this.renderOperationGameMini(random)}
        </div>

        <div class="exercise-options">
            ${options.map(o => `<button class="option-btn" data-val="${o}">${o}</button>`).join("")}
        </div>
    `;

    body.querySelectorAll(".option-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const chosen = btn.dataset.val;
            const correct = chosen === random.result;

            this.updateProgress("operations", correct, random.id);

            body.innerHTML = `
                <h2>${correct ? "✔ Correcto" : "✖ Incorrecto"}</h2>
                <p>Respuesta correcta: <strong>${random.result}</strong></p>
                <button id="closeGame" class="check-btn">Cerrar</button>
            `;

            document.getElementById("closeGame").addEventListener("click", () => {
                modal.style.display = "none";
            });
        });
    });
}

/* ===========================================
   19. MINI-RENDER PARA EL JUEGO FINAL
   =========================================== */

renderOperationGameMini(ex) {
    if (ex.type === "operation") {
        const sign = ex.operationType === "addition" ? "+" : "−";
        return `
            <div class="op-mini">
                ${ex.top.join("")} ${sign} ${ex.bot.join("")}
            </div>
        `;
    }

    if (ex.type === "operation-mult") {
        return `<div class="op-mini">${ex.top.join("")} × ${ex.factor}</div>`;
    }

    if (ex.type === "operation-div") {
        return `<div class="op-mini">${ex.number} ÷ ${ex.divisor}</div>`;
    }

    return "";
}

/* ===========================================
   20. NAVEGACIÓN FLUIDA + CERRAR MODALES
   =========================================== */

closeAllModals() {
    document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
}

constructorCloseListeners() {
    const modal = document.getElementById("exerciseModal");
    const closeBtn = document.querySelector("#exerciseModal .close");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", event => {
        if (event.target === modal) modal.style.display = "none";
    });
}

/* ===========================================
   21. RENDER DETALLADO DE PROGRESO (LOGROS + STATS)
   =========================================== */

renderProgressDetails() {
    const badges = document.getElementById("badgesContainer");
    const stats = document.getElementById("detailedStats");
    if (!badges || !stats) return;

    /* --- LOGROS --- */

    badges.innerHTML = "";
    const a = this.progress.achievements;

    if (!a || a.length === 0) {
        badges.innerHTML = "<p>Aún no hay logros</p>";
    } else {
        a.forEach(id => {
            const div = document.createElement("div");
            div.className = "badge";
            div.innerHTML = `
                <div class="badge-icon">🏅</div>
                <div class="badge-name">${id.replace(/-/g," ")}</div>`;
            badges.appendChild(div);
        });
    }

    /* --- ESTADÍSTICAS POR MÓDULO --- */

    stats.innerHTML = "";
    const modules = ["fractions", "decimals", "proportions", "operations"];
    const names = {
        fractions: "Fracciones",
        decimals: "Decimales",
        proportions: "Proporcionalidad",
        operations: "Operaciones"
    };

    modules.forEach(m => {
        const data = this.progress[m];
        if (!data) return;
        const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;

        const row = document.createElement("div");
        row.className = "stat-row";
        row.innerHTML = `
            <strong>${names[m]}</strong>: 
            ${data.completed}/${data.total} (${pct}%)`;
        stats.appendChild(row);
    });
}

/* ===========================================
   22. Racha diaria
   =========================================== */
checkDailyStreak() {
    const today = new Date().toDateString();
    const last = this.progress.lastVisit;

    if (!last) {
        this.progress.streak = 1;
    } else {
        const lastDate = new Date(last).toDateString();
        if (lastDate !== today) this.progress.streak++;
    }

    this.progress.lastVisit = today;
    this.saveProgress();

    const streakBox = document.getElementById("streakDays");
    if (streakBox) streakBox.textContent = this.progress.streak;
}

/* ===========================================
   23. RESET COMPLETO
   =========================================== */

resetProgress() {
    if (!confirm("¿Seguro que querés borrar todo el progreso?")) return;

    localStorage.removeItem("mathAppProgress");
    this.progress = this.loadProgress();
    this.initializeModuleProgress();
    this.updateProgressDisplay();
    this.renderHomeStats();
    this.renderProgressDetails();
}

/* ===========================================
   24. EXPORTAR PROGRESO (HTML → PDF)
   =========================================== */

exportProgress() {
    if (!this.progress.studentName) {
        alert("Antes de descargar, ingresá tu nombre.");
        return;
    }

    const win = window.open("", "_blank");
    const today = new Date().toLocaleString();

    win.document.write(`
        <html>
        <head>
            <title>Progreso Matemáticas Kolbe</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                h1 { color:#2c3e50; }
                table { width:100%; border-collapse: collapse; margin-top:20px; }
                th,td { border:1px solid #ccc; padding:8px; text-align:center; }
                th { background:#eee; }
            </style>
        </head>
        <body>
            <h1>Progreso Matemáticas Kolbe – 4º Grado</h1>
            <p><strong>Alumno:</strong> ${this.progress.studentName}</p>
            <p><strong>Fecha:</strong> ${today}</p>

            <h2>Resumen por módulo</h2>
            <table>
                <tr><th>Módulo</th><th>Completados</th><th>Total</th><th>%</th></tr>
                ${this.renderExportRows()}
            </table>
        </body>
        </html>
    `);

    win.document.close();
    win.print();
}

/* Helper para exportación */
renderExportRows() {
    const modules = ["fractions","decimals","proportions","operations"];
    const names = {
        fractions:"Fracciones",
        decimals:"Decimales",
        proportions:"Proporcionalidad",
        operations:"Operaciones"
    };

    return modules.map(m=>{
        const d = this.progress[m];
        const pct = d.total ? Math.round((d.completed/d.total)*100) : 0;
        return `<tr>
            <td>${names[m]}</td>
            <td>${d.completed}</td>
            <td>${d.total}</td>
            <td>${pct}%</td>
        </tr>`;
    }).join("");
}

/* ===========================================
   25. SINCRONIZAR ONLINE (GOOGLE SHEETS)
   =========================================== */

async syncProgress() {
    const url = CONFIG.SCRIPT_URL;
    if (!this.progress.studentName) {
        alert("Ingresá tu nombre antes de sincronizar.");
        return;
    }

    try {
        const res = await fetch(url, {
            method:"POST",
            headers:{ "Content-Type":"text/plain;charset=utf-8" },
            body: JSON.stringify(this.progress.log)
        });

        const txt = await res.text();
        const box = document.getElementById("syncStatus");
        box.textContent = "Sincronizado correctamente";
        box.className = "sync-status success";
    }
    catch(e) {
        const box = document.getElementById("syncStatus");
        box.textContent = "Error al sincronizar";
        box.className = "sync-status error";
    }
}

/* ===========================================
   26. SONIDOS + MÚSICA DE FONDO
   =========================================== */

initMusic() {
    // Música de fondo
    this.bgMusic = new Audio("assets/sounds/bg-music.mp3");
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.35;

    // Sonido correcto
    this.correctSound = new Audio("assets/sounds/correct.mp3");
    this.correctSound.volume = 0.8;

    // Sonido incorrecto
    this.wrongSound = new Audio("assets/sounds/wrong.mp3");
    this.wrongSound.volume = 0.6;

    // Botón UI
    const btn = document.getElementById("toggleMusic");
    let isPlaying = false;

    btn.addEventListener("click", () => {
        if (isPlaying) {
            this.bgMusic.pause();
            btn.textContent = "🔇";
        } else {
            this.bgMusic.play();
            btn.textContent = "🎵";
        }
        isPlaying = !isPlaying;
    });
}

/* ===========================================
   27. RENDER DATOS HOME
   =========================================== */

renderHomeStats() {
    document.getElementById("totalStars").textContent = this.progress.stars;
    document.getElementById("totalExercises").textContent =
        this.progress.fractions.total +
        this.progress.decimals.total +
        this.progress.proportions.total +
        this.progress.operations.total;
}

/* ===========================================
   28. CIERRE FINAL DE LA CLASE
   =========================================== */

} // ← Cierre de class MathApp

/* ===========================================
   29. CREAR INSTANCIA
   =========================================== */

const app = new MathApp();
app.init();
