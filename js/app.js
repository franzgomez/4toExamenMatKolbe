// Math Learning App for 4th Grade - Kolbe
class MathApp {
    constructor() {
        this.currentSection = 'home';
        this.progress = this.loadProgress();
        this.exercises = this.generateExercises();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeModuleProgress();
        this.setupStudentNameField();
        this.updateProgressDisplay();
        this.renderHomeStats();
        this.checkDailyStreak();
        this.renderProgressDetails();

        // Botones móviles
        const btnToTop = document.getElementById('btnToTop');
        const btnToHome = document.getElementById('btnToHome');

        if (btnToTop) {
            btnToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        if (btnToHome) {
            btnToHome.addEventListener('click', () => {
                this.showSection('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Module cards
        document.querySelectorAll('.module-card .start-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const moduleCard = e.target.closest('.module-card');
                const module = moduleCard.dataset.module;
                this.showSection(module);
            });
        });

        // Tab buttons
        document.querySelectorAll('.lesson-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.showTab(tab);
            });
        });

        // Export and sync buttons
        document.getElementById('exportProgress')?.addEventListener('click', () => this.exportProgress());
        document.getElementById('syncProgress')?.addEventListener('click', () => this.syncProgress());
        document.getElementById('resetProgress')?.addEventListener('click', () => this.resetProgress());

        // Modal close
        document.querySelectorAll('.close').forEach(close => {
            close.addEventListener('click', () => this.closeModal());
        });

        document.getElementById('continueBtn')?.addEventListener('click', () => this.closeModal());

        // Generate initial exercises
        this.generateAllExercises();
    }

    // Navigation
    showSection(sectionId) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const navBtn = document.querySelector(`[data-section="${sectionId}"]`);
        if (navBtn) navBtn.classList.add('active');

        // Show section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        const sectionEl = document.getElementById(sectionId);
        if (sectionEl) sectionEl.classList.add('active');

        this.currentSection = sectionId;

        // Generate exercises for the current module when needed
        if (['fractions', 'decimals', 'proportions', 'operations'].includes(sectionId)) {
            this.generateModuleExercises(sectionId);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showTab(tabId) {
        const [module] = tabId.split('-');
        
        // Update tab buttons
        document.querySelectorAll(`#${module} .tab-btn`).forEach(btn => {
            btn.classList.remove('active');
        });
        const tabBtn = document.querySelector(`[data-tab="${tabId}"]`);
        if (tabBtn) tabBtn.classList.add('active');

        // Show tab content
        document.querySelectorAll(`#${module} .tab-content`).forEach(content => {
            content.classList.remove('active');
        });
        const tabContent = document.getElementById(tabId);
        if (tabContent) tabContent.classList.add('active');
    }

    // Exercise Generation
    generateExercises() {
        return {
            fractions: this.generateFractionExercises(),
            decimals: this.generateDecimalExercises(),
            proportions: this.generateProportionExercises(),
            operations: this.generateOperationExercises()
        };
    }

    generateFractionExercises() {
        const exercises = [];
        
        // Basic fraction identification
        exercises.push({
            type: 'multiple_choice',
            question: '¿Qué fracción representa 3 partes de un total de 8?',
            options: ['3/8', '8/3', '3/5', '5/8'],
            correct: 0,
            explanation: '3/8 significa 3 partes de un total de 8 partes iguales.',
            hint: 'El numerador (arriba) son las partes que tomamos, el denominador (abajo) es el total.'
        });

        // Fraction comparison
        exercises.push({
            type: 'multiple_choice',
            question: '¿Cuál fracción es mayor?',
            options: ['1/4', '1/3', '1/5', '1/6'],
            correct: 1,
            explanation: '1/3 es mayor porque cuando el denominador es menor, las partes son más grandes.',
            hint: 'Piensa en una pizza: ¿prefieres 1/3 o 1/4 de pizza?'
        });

        // Equivalent fractions
        exercises.push({
            type: 'multiple_choice',
            question: '¿Qué fracción es equivalente a 1/2?',
            options: ['2/4', '1/3', '3/5', '1/4'],
            correct: 0,
            explanation: '2/4 = 1/2 porque ambas representan la mitad del entero.',
            hint: 'Fracciones equivalentes representan la misma cantidad.'
        });

        // Fraction addition
        exercises.push({
            type: 'numeric',
            question: '¿Cuánto es 1/4 + 1/4? (Escribe solo el numerador de la fracción resultado)',
            answer: 2,
            explanation: '1/4 + 1/4 = 2/4. Como tienen el mismo denominador, sumamos los numeradores.',
            hint: 'Cuando los denominadores son iguales, suma solo los numeradores.'
        });

        // Fraction on number line
        exercises.push({
            type: 'multiple_choice',
            question: 'En una recta numérica del 0 al 1, ¿dónde estaría 3/4?',
            options: ['Cerca del 0', 'En la mitad', 'Cerca del 1', 'Después del 1'],
            correct: 2,
            explanation: '3/4 está cerca del 1 porque es 3 de 4 partes, casi completo.',
            hint: '3/4 significa que falta solo 1/4 para llegar al entero completo.'
        });

        return exercises;
    }

    generateDecimalExercises() {
        const exercises = [];

        // Basic decimal reading
        exercises.push({
            type: 'multiple_choice',
            question: '¿Cómo se lee 0.5?',
            options: ['Cinco décimos', 'Cero punto cinco', 'Cinco centésimos', 'Medio'],
            correct: 0,
            explanation: '0.5 se lee como cinco décimos o medio.',
            hint: 'El primer número después del punto son los décimos.'
        });

        // Decimal comparison
        exercises.push({
            type: 'multiple_choice',
            question: '¿Cuál número es mayor?',
            options: ['0.3', '0.25', '0.4', '0.35'],
            correct: 2,
            explanation: '0.4 es el mayor porque 4 décimos es más que 3 décimos.',
            hint: 'Compara los décimos primero (el número después del punto).'
        });

        // Money context
        exercises.push({
            type: 'multiple_choice',
            question: 'Si tienes 2 euros y 50 céntimos, ¿cómo se escribe en decimales?',
            options: ['2.50€', '2.5€', '250€', 'Ambas A y B'],
            correct: 3,
            explanation: '2.50€ y 2.5€ son equivalentes, ambas representan 2 euros y 50 céntimos.',
            hint: 'Los céntimos se escriben después del punto decimal.'
        });

        // Decimal addition
        exercises.push({
            type: 'numeric',
            question: '¿Cuánto es 0.2 + 0.3? (Escribe como decimal)',
            answer: 0.5,
            explanation: '0.2 + 0.3 = 0.5 (dos décimos más tres décimos igual cinco décimos).',
            hint: 'Suma los décimos: 2 + 3 = 5 décimos.'
        });

        // Fraction to decimal
        exercises.push({
            type: 'multiple_choice',
            question: '¿Cuál es el decimal equivalente a 1/2?',
            options: ['0.2', '0.5', '1.2', '0.12'],
            correct: 1,
            explanation: '1/2 = 0.5 porque la mitad se puede expresar como 5 décimos.',
            hint: 'La mitad de 10 décimos son 5 décimos.'
        });

        return exercises;
    }

    generateProportionExercises() {
        const exercises = [];

        // Basic proportionality
        exercises.push({
            type: 'multiple_choice',
            question: 'Si 2 lápices cuestan 4€, ¿cuánto cuestan 4 lápices?',
            options: ['6€', '8€', '10€', '12€'],
            correct: 1,
            explanation: 'Si 2 lápices = 4€, entonces 4 lápices = 8€ (el doble).',
            hint: 'En proporcionalidad directa, si duplicas una cantidad, duplicas la otra.'
        });

        // Constant of proportionality
        exercises.push({
            type: 'numeric',
            question: 'Si 3 manzanas cuestan 6€, ¿cuál es la constante de proporcionalidad? (precio por manzana)',
            answer: 2,
            explanation: 'Constante = 6€ ÷ 3 manzanas = 2€ por manzana.',
            hint: 'Divide el precio total entre la cantidad de manzanas.'
        });

        // Table completion
        exercises.push({
            type: 'numeric',
            question: 'Completa la tabla: Si 1 libro cuesta 5€, ¿cuánto cuestan 6 libros?',
            answer: 30,
            explanation: '6 libros × 5€ = 30€.',
            hint: 'Multiplica el número de libros por el precio de cada libro.'
        });

        // Recipe proportions
        exercises.push({
            type: 'multiple_choice',
            question: 'Una receta para 4 personas usa 2 tazas de harina. ¿Cuántas tazas necesitas para 8 personas?',
            options: ['3 tazas', '4 tazas', '6 tazas', '8 tazas'],
            correct: 1,
            explanation: 'Para 8 personas (el doble), necesitas 4 tazas (el doble de 2).',
            hint: 'Si doblas las personas, doblas los ingredientes.'
        });

        // Speed and time
        exercises.push({
            type: 'multiple_choice',
            question: 'Si caminas 2 km en 1 hora, ¿cuántos km caminarás en 3 horas?',
            options: ['4 km', '5 km', '6 km', '8 km'],
            correct: 2,
            explanation: '3 horas × 2 km/hora = 6 km.',
            hint: 'Multiplica las horas por la velocidad (km por hora).'
        });

        return exercises;
    }

    generateOperationExercises() {
        // type: 'operation'
        // Cada ejercicio tiene top, bottom, result como arrays de dígitos
        const ops = [];

        // 6 sumas 3 cifras
        ops.push({
            type: 'operation',
            op: '+',
            top: [2, 3, 7],
            bottom: [1, 5, 4],
            result: [3, 9, 1],
            explanation: '237 + 154 = 391 sumando unidades, decenas y centenas.'
        });
        ops.push({
            type: 'operation',
            op: '+',
            top: [4, 5, 8],
            bottom: [3, 2, 7],
            result: [7, 8, 5],
            explanation: '458 + 327 = 785.'
        });
        ops.push({
            type: 'operation',
            op: '+',
            top: [1, 9, 9],
            bottom: [3, 0, 1],
            result: [5, 0, 0],
            explanation: '199 + 301 = 500.'
        });
        ops.push({
            type: 'operation',
            op: '+',
            top: [6, 2, 4],
            bottom: [1, 7, 3],
            result: [7, 9, 7],
            explanation: '624 + 173 = 797.'
        });
        ops.push({
            type: 'operation',
            op: '+',
            top: [3, 0, 5],
            bottom: [2, 4, 8],
            result: [5, 5, 3],
            explanation: '305 + 248 = 553.'
        });
        ops.push({
            type: 'operation',
            op: '+',
            top: [7, 1, 6],
            bottom: [1, 8, 9],
            result: [9, 0, 5],
            explanation: '716 + 189 = 905.'
        });

        // 6 restas 3 cifras
        ops.push({
            type: 'operation',
            op: '-',
            top: [5, 2, 0],
            bottom: [2, 3, 7],
            result: [2, 8, 3],
            explanation: '520 - 237 = 283.'
        });
        ops.push({
            type: 'operation',
            op: '-',
            top: [8, 4, 6],
            bottom: [2, 5, 9],
            result: [5, 8, 7],
            explanation: '846 - 259 = 587.'
        });
        ops.push({
            type: 'operation',
            op: '-',
            top: [7, 0, 0],
            bottom: [4, 2, 5],
            result: [2, 7, 5],
            explanation: '700 - 425 = 275.'
        });
        ops.push({
            type: 'operation',
            op: '-',
            top: [6, 3, 9],
            bottom: [1, 4, 7],
            result: [4, 9, 2],
            explanation: '639 - 147 = 492.'
        });
        ops.push({
            type: 'operation',
            op: '-',
            top: [9, 1, 0],
            bottom: [3, 6, 4],
            result: [5, 4, 6],
            explanation: '910 - 364 = 546.'
        });
        ops.push({
            type: 'operation',
            op: '-',
            top: [4, 5, 0],
            bottom: [1, 7, 8],
            result: [2, 7, 2],
            explanation: '450 - 178 = 272.'
        });

        // 6 sumas 4 cifras
        ops.push({
            type: 'operation',
            op: '+',
            top: [1, 2, 3, 4],
            bottom: [2, 0, 1, 6],
            result: [3, 3, 5, 0],
            explanation: '1234 + 2016 = 3350.'
        });
        ops.push({
            type: 'operation',
            op: '+',
            top: [3, 4, 5, 8],
            bottom: [1, 2, 0, 7],
            result: [4, 6, 6, 5],
            explanation: '3458 + 1207 = 4665.'
        });
        ops.push({
            type: 'operation',
            op: '+',
            top: [2, 0, 5, 9],
            bottom: [1, 4, 3, 2],
            result: [3, 4, 9, 1],
            explanation: '2059 + 1432 = 3491.'
        });
        ops.push({
            type: 'operation',
            op: '+',
            top: [4, 0, 7, 6],
            bottom: [3, 1, 2, 4],
            result: [7, 1, 9, 0],
            explanation: '4076 + 3124 = 7190.'
        });
        ops.push({
            type: 'operation',
            op: '+',
            top: [5, 5, 0, 5],
            bottom: [1, 2, 4, 5],
            result: [6, 7, 5, 0],
            explanation: '5505 + 1245 = 6750.'
        });
        ops.push({
            type: 'operation',
            op: '+',
            top: [9, 0, 0, 9],
            bottom: [0, 9, 9, 1],
            result: [9, 9, 0, 0],
            explanation: '9009 + 0991 = 9900.'
        });

        // 6 restas 4 cifras
        ops.push({
            type: 'operation',
            op: '-',
            top: [5, 0, 0, 0],
            bottom: [2, 3, 5, 7],
            result: [2, 6, 4, 3],
            explanation: '5000 - 2357 = 2643.'
        });
        ops.push({
            type: 'operation',
            op: '-',
            top: [8, 4, 0, 2],
            bottom: [3, 1, 2, 5],
            result: [5, 2, 7, 7],
            explanation: '8402 - 3125 = 5277.'
        });
        ops.push({
            type: 'operation',
            op: '-',
            top: [7, 2, 3, 0],
            bottom: [4, 5, 6, 8],
            result: [2, 6, 6, 2],
            explanation: '7230 - 4568 = 2662.'
        });
        ops.push({
            type: 'operation',
            op: '-',
            top: [9, 0, 1, 5],
            bottom: [2, 8, 7, 6],
            result: [6, 2, 3, 9],
            explanation: '9015 - 2876 = 6139 (ajustado: 9015-2876=6139).'
        });
        ops.push({
            type: 'operation',
            op: '-',
            top: [6, 6, 6, 6],
            bottom: [3, 3, 3, 3],
            result: [3, 3, 3, 3],
            explanation: '6666 - 3333 = 3333.'
        });
        ops.push({
            type: 'operation',
            op: '-',
            top: [4, 2, 0, 0],
            bottom: [1, 9, 9, 9],
            result: [2, 2, 0, 1],
            explanation: '4200 - 1999 = 2201.'
        });

        // 6 multiplicaciones (1 cifra)
        ops.push({
            type: 'operation',
            op: '×',
            top: [2, 3, 7],
            bottom: [4],
            result: [9, 4, 8],
            explanation: '237 × 4 = 948.'
        });
        ops.push({
            type: 'operation',
            op: '×',
            top: [1, 5, 6],
            bottom: [3],
            result: [4, 6, 8],
            explanation: '156 × 3 = 468.'
        });
        ops.push({
            type: 'operation',
            op: '×',
            top: [3, 2, 0],
            bottom: [5],
            result: [1, 6, 0, 0],
            explanation: '320 × 5 = 1600.'
        });
        ops.push({
            type: 'operation',
            op: '×',
            top: [2, 4, 5],
            bottom: [6],
            result: [1, 4, 7, 0],
            explanation: '245 × 6 = 1470.'
        });
        ops.push({
            type: 'operation',
            op: '×',
            top: [4, 0, 2],
            bottom: [7],
            result: [2, 8, 1, 4],
            explanation: '402 × 7 = 2814.'
        });
        ops.push({
            type: 'operation',
            op: '×',
            top: [1, 2, 5],
            bottom: [8],
            result: [1, 0, 0, 0],
            explanation: '125 × 8 = 1000.'
        });

        // 6 multiplicaciones (2 cifras)
        ops.push({
            type: 'operation',
            op: '×',
            top: [1, 2, 4],
            bottom: [1, 2],
            result: [1, 4, 8, 8],
            explanation: '124 × 12 = 1488.'
        });
        ops.push({
            type: 'operation',
            op: '×',
            top: [2, 1, 5],
            bottom: [1, 3],
            result: [2, 7, 9, 5],
            explanation: '215 × 13 = 2795.'
        });
        ops.push({
            type: 'operation',
            op: '×',
            top: [3, 0, 6],
            bottom: [1, 4],
            result: [4, 2, 8, 4],
            explanation: '306 × 14 = 4284.'
        });
        ops.push({
            type: 'operation',
            op: '×',
            top: [1, 5, 0],
            bottom: [1, 9],
            result: [2, 8, 5, 0],
            explanation: '150 × 19 = 2850.'
        });
        ops.push({
            type: 'operation',
            op: '×',
            top: [2, 4, 3],
            bottom: [1, 6],
            result: [3, 8, 8, 8],
            explanation: '243 × 16 = 3888.'
        });
        ops.push({
            type: 'operation',
            op: '×',
            top: [1, 2, 5],
            bottom: [2, 0],
            result: [2, 5, 0, 0],
            explanation: '125 × 20 = 2500.'
        });

        // 6 divisiones (1 cifra, con resto)
        // Para la corrección solo usamos el cociente entero
        ops.push({
            type: 'operation',
            op: '÷',
            top: [4, 8],
            bottom: [4],
            result: [1, 2],
            explanation: '48 ÷ 4 = 12.'
        });
        ops.push({
            type: 'operation',
            op: '÷',
            top: [9, 6],
            bottom: [3],
            result: [3, 2],
            explanation: '96 ÷ 3 = 32.'
        });
        ops.push({
            type: 'operation',
            op: '÷',
            top: [8, 4],
            bottom: [7],
            result: [1, 2],
            explanation: '84 ÷ 7 = 12.'
        });
        ops.push({
            type: 'operation',
            op: '÷',
            top: [7, 2],
            bottom: [8],
            result: [9],
            explanation: '72 ÷ 8 = 9.'
        });
        ops.push({
            type: 'operation',
            op: '÷',
            top: [9, 0],
            bottom: [5],
            result: [1, 8],
            explanation: '90 ÷ 5 = 18.'
        });
        ops.push({
            type: 'operation',
            op: '÷',
            top: [7, 5],
            bottom: [3],
            result: [2, 5],
            explanation: '75 ÷ 3 = 25.'
        });

        return ops;
    }

    generateAllExercises() {
        // Generate fraction exercises
        this.renderExercises('fractions', 'fractionExercises');
        
        // Generate decimal exercises
        this.renderExercises('decimals', 'decimalExercises');
        
        // Generate money exercises
        this.renderMoneyExercises();
        
        // Generate proportion exercises
        this.renderExercises('proportions', 'proportionExercises');
        
        // Generate table exercises
        this.renderTableExercises();

        // Generate fraction game
        this.renderFractionGame();

        // Generate operations
        this.renderExercises('operations', 'operationExercises');
        this.renderOperationsGame();
    }

    generateModuleExercises(module) {
        if (module === 'fractions') {
            this.renderExercises('fractions', 'fractionExercises');
            this.renderFractionGame();
        } else if (module === 'decimals') {
            this.renderExercises('decimals', 'decimalExercises');
            this.renderMoneyExercises();
        } else if (module === 'proportions') {
            this.renderExercises('proportions', 'proportionExercises');
            this.renderTableExercises();
        } else if (module === 'operations') {
            this.renderExercises('operations', 'operationExercises');
            this.renderOperationsGame();
        }
    }

    renderExercises(module, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const exercises = this.exercises[module];
        container.innerHTML = '';

        exercises.forEach((exercise, index) => {
            const exerciseCard = this.createExerciseCard(exercise, module, index);
            container.appendChild(exerciseCard);
        });
    }

    createExerciseCard(exercise, module, index) {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.dataset.module = module;
        card.dataset.index = index;
        card.dataset.id = `${module}-${index}`;

        // OPERATIONS (casita B2)
        if (exercise.type === 'operation') {
            const topDigits = exercise.top;
            const bottomDigits = exercise.bottom;
            const resultDigits = exercise.result;

            const opSymbol = exercise.op;

            let topRow = '';
            topDigits.forEach(d => {
                topRow += `<div class="digit-box">${d}</div>`;
            });

            let bottomRow = '';
            bottomDigits.forEach(d => {
                bottomRow += `<div class="digit-box">${d}</div>`;
            });

            let inputsRow = '';
            resultDigits.forEach((_, i) => {
                inputsRow += `<input type="text" maxlength="1" class="digit-input" data-pos="${i}">`;
            });

            card.innerHTML = `
                <div class="exercise-question">
                    Resuelve la operación y completa los casilleros de abajo con el resultado:
                </div>
                <div class="operation-layout">
                    <div class="operation-row">
                        <span class="op-symbol">&nbsp;</span>
                        <div class="digit-row">
                            ${topRow}
                        </div>
                    </div>
                    <div class="operation-row">
                        <span class="op-symbol">${opSymbol}</span>
                        <div class="digit-row">
                            ${bottomRow}
                        </div>
                    </div>
                    <div class="operation-separator"></div>
                    <div class="operation-row">
                        <span class="op-symbol">&nbsp;</span>
                        <div class="digit-row">
                            ${inputsRow}
                        </div>
                    </div>
                </div>
                <button class="check-btn operation-check-btn">Verificar</button>
                <div class="explanation-content" style="margin-top:15px; display:none;">
                    <strong>Explicación:</strong> ${exercise.explanation}
                </div>
            `;

            this.setupOperationListeners(card, exercise);
            return card;
        }

        // Multiple choice / numeric (resto de módulos)
        let optionsHTML = '';
        
        if (exercise.type === 'multiple_choice') {
            optionsHTML = `
                <div class="exercise-options">
                    ${exercise.options.map((option, i) => 
                        `<button class="option-btn" data-option="${i}">${option}</button>`
                    ).join('')}
                </div>
            `;
        } else if (exercise.type === 'numeric') {
            optionsHTML = `
                <div class="numeric-container">
                    <input type="number" class="numeric-input" placeholder="Tu respuesta" step="0.01">
                    <button class="check-btn">Verificar</button>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="exercise-question">${exercise.question}</div>
            ${optionsHTML}
            ${exercise.hint ? `
            <button class="hint-btn">💡 Pista</button>
            <div class="hint-content">
                <strong>Pista:</strong> ${exercise.hint}
            </div>` : ''}
            <div class="explanation-content" style="display: none;">
                <strong>Explicación:</strong> ${exercise.explanation}
            </div>
        `;

        this.setupExerciseListeners(card, exercise);
        return card;
    }

    setupExerciseListeners(card, exercise) {
        const exerciseId = card.dataset.id;

        // Multiple choice options
        card.querySelectorAll('.option-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.selectOption(card, index, exercise, exerciseId);
            });
        });

        // Numeric input
        const checkBtn = card.querySelector('.check-btn');
        const numericInput = card.querySelector('.numeric-input');
        if (checkBtn && numericInput) {
            checkBtn.addEventListener('click', () => {
                this.checkNumericAnswer(card, exercise, exerciseId);
            });
            numericInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.checkNumericAnswer(card, exercise, exerciseId);
                }
            });
        }

        // Hint button
        const hintBtn = card.querySelector('.hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                const hintContent = card.querySelector('.hint-content');
                if (hintContent) hintContent.classList.toggle('show');
            });
        }
    }

    setupOperationListeners(card, exercise) {
        const exerciseId = card.dataset.id;
        const inputs = card.querySelectorAll('.digit-input');
        const button = card.querySelector('.operation-check-btn');

        if (!button || !inputs.length) return;

        const correctDigits = exercise.result;

        const checkOperation = () => {
            let allFilled = true;
            const userDigits = [];

            inputs.forEach((input, idx) => {
                const val = input.value.trim();
                if (val === '') {
                    allFilled = false;
                }
                userDigits[idx] = val;
            });

            if (!allFilled) {
                this.showFeedback('Completa todos los casilleros', 'Asegúrate de escribir todos los dígitos del resultado.', false);
                return;
            }

            // Normalizamos: cada dígito es un número, permitimos 0-9
            let allCorrect = true;
            inputs.forEach((input, idx) => {
                input.classList.remove('correct', 'incorrect');
                const expected = String(correctDigits[idx]);
                const given = userDigits[idx];
                if (given === expected) {
                    input.classList.add('correct');
                } else {
                    input.classList.add('incorrect');
                    allCorrect = false;
                }
            });

            const module = card.dataset.module;
            if (allCorrect) {
                card.classList.add('correct');
                card.classList.remove('incorrect');
                this.showFeedback('¡Correcto! 🎉', exercise.explanation, true);
                this.updateProgress(module, true, exerciseId);
            } else {
                card.classList.add('incorrect');
                card.classList.remove('correct');
                const correctoTexto = correctDigits.join('');
                this.showFeedback('Revisa tus dígitos', `El resultado correcto es ${correctoTexto}. ${exercise.explanation}`, false);
                this.updateProgress(module, false, exerciseId);
            }

            const explanation = card.querySelector('.explanation-content');
            if (explanation) explanation.style.display = 'block';
        };

        button.addEventListener('click', checkOperation);
        inputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    checkOperation();
                }
            });
        });
    }

    selectOption(card, selectedIndex, exercise, exerciseId) {
        const options = card.querySelectorAll('.option-btn');
        const isCorrect = selectedIndex === exercise.correct;

        // Clear previous selections
        options.forEach(btn => {
            btn.classList.remove('selected', 'correct', 'incorrect');
        });

        // Mark selected option
        options[selectedIndex].classList.add('selected');

        // Show results after a brief delay
        setTimeout(() => {
            if (isCorrect) {
                options[selectedIndex].classList.add('correct');
                card.classList.add('correct');
                card.classList.remove('incorrect');
                this.showFeedback('¡Correcto! 🎉', exercise.explanation, true);
                this.updateProgress(card.dataset.module, true, exerciseId);
            } else {
                options[selectedIndex].classList.add('incorrect');
                const correctBtn = options[exercise.correct];
                if (correctBtn) correctBtn.classList.add('correct');
                card.classList.add('incorrect');
                card.classList.remove('correct');
                this.showFeedback('¡Inténtalo de nuevo! 🤔', exercise.explanation, false);
                this.updateProgress(card.dataset.module, false, exerciseId);
            }
            
            // Show explanation
            const explanation = card.querySelector('.explanation-content');
            if (explanation) explanation.style.display = 'block';
            
        }, 400);
    }

    checkNumericAnswer(card, exercise, exerciseId) {
        const input = card.querySelector('.numeric-input');
        const userAnswer = parseFloat(input.value);
        const isCorrect = Math.abs(userAnswer - exercise.answer) < 0.01;

        if (isCorrect) {
            card.classList.add('correct');
            card.classList.remove('incorrect');
            input.style.borderColor = '#4caf50';
            this.showFeedback('¡Correcto! 🎉', exercise.explanation, true);
            this.updateProgress(card.dataset.module, true, exerciseId);
        } else {
            card.classList.add('incorrect');
            card.classList.remove('correct');
            input.style.borderColor = '#f44336';
            this.showFeedback(`¡Inténtalo de nuevo! La respuesta correcta es ${exercise.answer}`, exercise.explanation, false);
            this.updateProgress(card.dataset.module, false, exerciseId);
        }

        // Show explanation
        const explanation = card.querySelector('.explanation-content');
        if (explanation) explanation.style.display = 'block';
    }

    renderMoneyExercises() {
        const container = document.getElementById('moneyExercises');
        if (!container) return;

        const moneyExercises = [
            {
                question: '¿Cuánto dinero tienes en total?',
                coins: [
                    { value: 0.50, count: 2, label: '50¢' },
                    { value: 0.20, count: 3, label: '20¢' },
                    { value: 0.10, count: 1, label: '10¢' }
                ],
                answer: 1.70
            },
            {
                question: 'Si compras algo que cuesta 2.35€ y pagas con 3€, ¿cuánto cambio recibes?',
                answer: 0.65,
                type: 'calculation'
            }
        ];

        container.innerHTML = '';
        
        moneyExercises.forEach((exercise) => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.className = 'exercise-card';
            
            let content = `<div class="exercise-question">${exercise.question}</div>`;
            
            if (exercise.coins) {
                content += '<div class="coin-display">';
                exercise.coins.forEach(coin => {
                    for (let i = 0; i < coin.count; i++) {
                        content += `<div class="coin">${coin.label}</div>`;
                    }
                });
                content += '</div>';
            }
            
            content += `
                <div class="numeric-container">
                    <input type="number" class="numeric-input" placeholder="€" step="0.01">
                    <button class="check-btn">Verificar</button>
                </div>
            `;
            
            exerciseDiv.innerHTML = content;

            const btn = exerciseDiv.querySelector('.check-btn');
            const input = exerciseDiv.querySelector('.numeric-input');

            const checkAnswer = () => {
                const userAnswer = parseFloat(input.value);
                const correctAnswer = exercise.answer;
                const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01;
                
                if (isCorrect) {
                    exerciseDiv.classList.add('correct');
                    exerciseDiv.classList.remove('incorrect');
                    this.showFeedback('¡Correcto! 🎉', `La respuesta es ${correctAnswer.toFixed(2)}€`, true);
                } else {
                    exerciseDiv.classList.add('incorrect');
                    exerciseDiv.classList.remove('correct');
                    this.showFeedback('Incorrecto', `La respuesta es ${correctAnswer.toFixed(2)}€`, false);
                }
            };

            btn.addEventListener('click', checkAnswer);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') checkAnswer();
            });
            
            container.appendChild(exerciseDiv);
        });
    }

    renderTableExercises() {
        const container = document.getElementById('tableExercises');
        if (!container) return;

        const tableExercise = {
            title: 'Completa la tabla de proporcionalidad',
            description: 'Cada bolígrafo cuesta 3€',
            table: [
                { bolígrafos: 1, precio: 3 },
                { bolígrafos: 2, precio: null },
                { bolígrafos: 3, precio: null },
                { bolígrafos: 4, precio: 12 },
                { bolígrafos: 5, precio: null }
            ]
        };

        let tableHTML = `
            <div class="exercise-card">
                <h4>${tableExercise.title}</h4>
                <p>${tableExercise.description}</p>
                <table class="proportion-table">
                    <tr><th>Bolígrafos</th><th>Precio (€)</th></tr>
        `;

        tableExercise.table.forEach((row) => {
            tableHTML += `<tr>
                <td>${row.bolígrafos}</td>
                <td>
                    ${row.precio !== null 
                        ? row.precio 
                        : `<input type="number" class="table-input" data-answer="${row.bolígrafos * 3}" placeholder="?">`
                    }
                </td>
            </tr>`;
        });

        tableHTML += `
                </table>
                <button class="check-btn">Verificar Tabla</button>
            </div>
        `;

        container.innerHTML = tableHTML;

        const exerciseCard = container.querySelector('.exercise-card');
        const button = exerciseCard.querySelector('.check-btn');

        button.addEventListener('click', () => {
            const inputs = exerciseCard.querySelectorAll('.table-input');
            let allCorrect = true;

            inputs.forEach(input => {
                const userAnswer = parseInt(input.value);
                const correctAnswer = parseInt(input.dataset.answer);
                
                if (userAnswer === correctAnswer) {
                    input.style.borderColor = '#4caf50';
                } else {
                    input.style.borderColor = '#f44336';
                    allCorrect = false;
                }
            });

            if (allCorrect) {
                exerciseCard.classList.add('correct');
                exerciseCard.classList.remove('incorrect');
                this.showFeedback('¡Excelente! Has completado la tabla correctamente 🎉', 'Cada bolígrafo cuesta 3€, entonces multiplicas el número de bolígrafos por 3.', true);
            } else {
                exerciseCard.classList.add('incorrect');
                exerciseCard.classList.remove('correct');
                this.showFeedback('Revisa tus respuestas', 'Recuerda: cada bolígrafo cuesta 3€.', false);
            }
        });
    }

    renderFractionGame() {
        const container = document.getElementById('fractionGame');
        if (!container) return;

        let gameHTML = `
            <div class="game-round">
                <h4>¿Qué fracción representa la parte coloreada?</h4>
                <div class="shape-display" id="gameShape"></div>
                <div class="game-options" id="gameOptions"></div>
                <button class="check-btn" id="newGameBtn">Nueva Pregunta</button>
            </div>
        `;

        container.innerHTML = gameHTML;
        this.startNewGameRound();

        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.startNewGameRound();
        });
    }

    startNewGameRound() {
        const gameShape = document.getElementById('gameShape');
        const gameOptions = document.getElementById('gameOptions');
        if (!gameShape || !gameOptions) return;
        
        const fractions = [
            { numerator: 1, denominator: 2 },
            { numerator: 1, denominator: 3 },
            { numerator: 2, denominator: 3 },
            { numerator: 1, denominator: 4 },
            { numerator: 3, denominator: 4 }
        ];
        
        const correctFraction = fractions[Math.floor(Math.random() * fractions.length)];
        
        gameShape.innerHTML = this.createFractionVisual(correctFraction);
        
        // Create options (correct + 3 wrong)
        const options = [correctFraction];
        while (options.length < 4) {
            const randomFraction = fractions[Math.floor(Math.random() * fractions.length)];
            if (!options.some(f => f.numerator === randomFraction.numerator && f.denominator === randomFraction.denominator)) {
                options.push(randomFraction);
            }
        }
        
        // Shuffle options
        options.sort(() => Math.random() - 0.5);
        const correctIndex = options.findIndex(f => f.numerator === correctFraction.numerator && f.denominator === correctFraction.denominator);
        
        // Create option buttons
        gameOptions.innerHTML = '';
        options.forEach((fraction, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = `${fraction.numerator}/${fraction.denominator}`;
            btn.addEventListener('click', () => {
                if (index === correctIndex) {
                    btn.classList.add('correct');
                    this.showFeedback('¡Correcto! 🎉', `${fraction.numerator}/${fraction.denominator} es la respuesta correcta.`, true);
                } else {
                    btn.classList.add('incorrect');
                    gameOptions.children[correctIndex].classList.add('correct');
                    this.showFeedback('¡Inténtalo de nuevo!', `La respuesta correcta es ${correctFraction.numerator}/${correctFraction.denominator}`, false);
                }
                // Disable all buttons
                [...gameOptions.children].forEach(b => b.disabled = true);
            });
            gameOptions.appendChild(btn);
        });
    }

    createFractionVisual(fraction) {
        const { numerator, denominator } = fraction;
        let visual = '';
        
        if (denominator <= 4) {
            // Use pizza/circle representation
            visual = `<div class="fraction-circle">`;
            for (let i = 0; i < denominator; i++) {
                const filled = i < numerator ? 'filled' : '';
                visual += `<div class="circle-segment ${filled}"></div>`;
            }
            visual += `</div>`;
        } else {
            // Use bar representation
            visual = `<div class="fraction-bar">`;
            for (let i = 0; i < denominator; i++) {
                const filled = i < numerator ? 'filled' : '';
                visual += `<div class="bar-segment ${filled}"></div>`;
            }
            visual += `</div>`;
        }
        
        return visual;
    }

    renderOperationsGame() {
        const container = document.getElementById('operationsGame');
        if (!container) return;

        container.innerHTML = `
            <div class="game-round">
                <h4>Elige la opción correcta</h4>
                <p id="opGameQuestion"></p>
                <div class="exercise-options" id="opGameOptions"></div>
                <button class="check-btn" id="opGameNew">Nueva Pregunta</button>
            </div>
        `;

        const newBtn = document.getElementById('opGameNew');
        newBtn.addEventListener('click', () => this.startOperationsGameRound());
        this.startOperationsGameRound();
    }

    startOperationsGameRound() {
        const questionEl = document.getElementById('opGameQuestion');
        const optionsEl = document.getElementById('opGameOptions');
        if (!questionEl || !optionsEl) return;

        const pool = this.exercises.operations;
        if (!pool || !pool.length) return;

        const base = pool[Math.floor(Math.random() * pool.length)];

        const topNum = parseInt(base.top.join(''), 10);
        const bottomNum = parseInt(base.bottom.join(''), 10);
        let correctValue;

        switch (base.op) {
            case '+':
                correctValue = topNum + bottomNum;
                break;
            case '-':
                correctValue = topNum - bottomNum;
                break;
            case '×':
                correctValue = topNum * bottomNum;
                break;
            case '÷':
                correctValue = Math.floor(topNum / bottomNum);
                break;
            default:
                correctValue = parseInt(base.result.join(''), 10);
        }

        questionEl.textContent = `¿Cuál es el resultado de ${topNum} ${base.op} ${bottomNum}?`;

        // Generamos 3 opciones incorrectas cercanas
        const options = new Set();
        options.add(correctValue);

        while (options.size < 4) {
            const delta = Math.floor(Math.random() * 15) + 1;
            const sign = Math.random() < 0.5 ? -1 : 1;
            const candidate = correctValue + sign * delta;
            if (candidate > 0) options.add(candidate);
        }

        const optionsArr = Array.from(options);
        optionsArr.sort(() => Math.random() - 0.5);
        const correctIndex = optionsArr.indexOf(correctValue);

        optionsEl.innerHTML = '';
        optionsArr.forEach((value, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = value;
            btn.addEventListener('click', () => {
                if (index === correctIndex) {
                    btn.classList.add('correct');
                    this.showFeedback('¡Correcto! 🎉', `Muy bien, ${topNum} ${base.op} ${bottomNum} = ${correctValue}.`, true);
                } else {
                    btn.classList.add('incorrect');
                    optionsEl.children[correctIndex].classList.add('correct');
                    this.showFeedback('¡Inténtalo de nuevo!', `La respuesta correcta era ${correctValue}.`, false);
                }
                [...optionsEl.children].forEach(b => b.disabled = true);
            });
            optionsEl.appendChild(btn);
        });
    }

    // Progress Management
    initializeModuleProgress() {
        const modules = ['fractions', 'decimals', 'proportions', 'operations'];

        if (!this.progress) this.progress = {};
        if (!this.progress.solvedExercises) {
            this.progress.solvedExercises = {}; // { "fractions-0": true, ... }
        }

        modules.forEach(module => {
            const list = this.exercises[module];
            if (!list) return;
            const totalExercises = list.length;

            if (!this.progress[module]) {
                this.progress[module] = {
                    completed: 0,
                    total: totalExercises,
                    correct: 0,
                    attempts: 0
                };
            } else {
                this.progress[module].total = totalExercises;
                if (this.progress[module].completed > totalExercises) {
                    this.progress[module].completed = totalExercises;
                }
            }
        });

        this.saveProgress();
    }

    updateProgress(module, isCorrect, exerciseId) {
        if (!this.progress[module]) {
            this.progress[module] = { completed: 0, total: this.exercises[module]?.length || 0, correct: 0, attempts: 0 };
        }

        this.progress[module].attempts = (this.progress[module].attempts || 0) + 1;

        if (isCorrect) {
            this.progress[module].correct = (this.progress[module].correct || 0) + 1;

            if (!this.progress.solvedExercises) {
                this.progress.solvedExercises = {};
            }

            if (!this.progress.solvedExercises[exerciseId]) {
                this.progress.solvedExercises[exerciseId] = true;
                this.progress[module].completed++;
                this.addStar();
            }
        }

        this.saveProgress();
        this.updateProgressDisplay();
        this.checkAchievements();
        this.renderProgressDetails();
        this.logProgress(module, isCorrect, exerciseId);
    }

    logProgress(module, isCorrect, exerciseId) {
        const timestamp = new Date().toISOString();
        const progressEntry = {
            userId: this.progress.studentName || "anonimo",
            timestamp: timestamp,
            module: module,
            subTopic: this.currentSection,
            questionId: exerciseId,
            correct: isCorrect
        };

        // Store for later sync
        if (!this.progress.syncLog) {
            this.progress.syncLog = [];
        }
        this.progress.syncLog.push(progressEntry);
        this.saveProgress();
    }

    addStar() {
        if (!this.progress.totalStars) {
            this.progress.totalStars = 0;
        }
        this.progress.totalStars++;
    }

    updateProgressDisplay() {
        // Overall progress based on completed vs total ejercicios
        const modules = ['fractions', 'decimals', 'proportions', 'operations'];

        let totalExercises = 0;
        let completedExercises = 0;

        modules.forEach(module => {
            const data = this.progress[module];
            if (data && typeof data.total === 'number') {
                totalExercises += data.total;
                completedExercises += (data.completed || 0);
            }
        });

        const overallPercent = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
        
        const progressFill = document.getElementById('overallProgress');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) progressFill.style.width = `${overallPercent}%`;
        if (progressText) progressText.textContent = `${overallPercent}% completado`;

        // Update module progress
        modules.forEach(module => {
            const moduleData = this.progress[module];
            if (moduleData) {
                const percent = moduleData.total > 0 ? Math.round((moduleData.completed / moduleData.total) * 100) : 0;
                const progressElement = document.querySelector(`[data-progress="${module}"]`);
                if (progressElement) {
                    progressElement.style.width = `${percent}%`;
                    const percentElement = progressElement.parentElement.nextElementSibling;
                    if (percentElement) percentElement.textContent = `${percent}%`;
                }
            }
        });
    }

    renderHomeStats() {
        const totalStars = document.getElementById('totalStars');
        const totalExercises = document.getElementById('totalExercises');
        const streakDays = document.getElementById('streakDays');

        if (totalStars) totalStars.textContent = this.progress.totalStars || 0;
        if (totalExercises) {
            let total = 0;
            const modules = ['fractions', 'decimals', 'proportions', 'operations'];
            modules.forEach(module => {
                const data = this.progress[module];
                if (data && typeof data.attempts === 'number') {
                    total += data.attempts;
                }
            });
            totalExercises.textContent = total;
        }
        if (streakDays) streakDays.textContent = this.progress.streakDays || 0;
    }

    checkDailyStreak() {
        const today = new Date().toDateString();
        const lastVisit = this.progress.lastVisit;
        
        if (lastVisit !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastVisit === yesterday.toDateString()) {
                // Continue streak
                this.progress.streakDays = (this.progress.streakDays || 0) + 1;
            } else {
                // Reset streak
                this.progress.streakDays = 1;
            }
            
            this.progress.lastVisit = today;
            this.saveProgress();
        }
    }

    checkAchievements() {
        const achievements = [];
        
        // First star
        if ((this.progress.totalStars || 0) >= CONFIG.ACHIEVEMENTS.FIRST_STAR && !this.progress.achievements?.includes('first-star')) {
            achievements.push({
                id: 'first-star',
                name: 'Primera Estrella',
                icon: '⭐',
                description: '¡Has ganado tu primera estrella!'
            });
        }
        
        // Perfect score in module
        ['fractions', 'decimals', 'proportions', 'operations'].forEach(module => {
            const data = this.progress[module];
            if (data && data.total >= CONFIG.ACHIEVEMENTS.PERFECT_MODULE && data.completed === data.total) {
                const achievementId = `perfect-${module}`;
                if (!this.progress.achievements?.includes(achievementId)) {
                    const names = {
                        fractions: 'Fracciones',
                        decimals: 'Decimales',
                        proportions: 'Proporciones',
                        operations: 'Operaciones'
                    };
                    achievements.push({
                        id: achievementId,
                        name: `Maestro de ${names[module] || module}`,
                        icon: '🏆',
                        description: `¡Completaste todos los ejercicios de ${names[module] || module}!`
                    });
                }
            }
        });
        
        if (!this.progress.achievements) {
            this.progress.achievements = [];
        }
        
        achievements.forEach(achievement => {
            if (!this.progress.achievements.includes(achievement.id)) {
                this.progress.achievements.push(achievement.id);
                this.showAchievement(achievement);
            }
        });
        
        if (achievements.length > 0) {
            this.saveProgress();
        }
    }

    showAchievement(achievement) {
        this.showFeedback(
            `🏆 ¡Nuevo Logro Desbloqueado! 🏆`,
            `${achievement.icon} ${achievement.name}: ${achievement.description}`,
            true
        );
    }

    // Feedback System
    showFeedback(title, message, isSuccess) {
        const modal = document.getElementById('feedbackModal');
        const content = document.getElementById('feedbackContent');
        
        if (!modal || !content) return;

        content.innerHTML = `
            <h3>${title}</h3>
            <p>${message}</p>
        `;
        
        content.className = `feedback-content ${isSuccess ? 'success' : 'error'}`;
        modal.style.display = 'block';
        
        // Auto close after 3 seconds for success
        if (isSuccess) {
            setTimeout(() => {
                this.closeModal();
            }, 3000);
        }
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Progress Persistence
    saveProgress() {
        localStorage.setItem('mathAppProgress', JSON.stringify(this.progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('mathAppProgress');
        return saved ? JSON.parse(saved) : {
            totalStars: 0,
            streakDays: 0,
            lastVisit: null,
            achievements: [],
            solvedExercises: {}
        };
    }

    exportProgress() {
        if (!this.progress.studentName || this.progress.studentName.trim() === '') {
            this.showFeedback('Falta el nombre', 'Por favor completa tu nombre y apellido antes de descargar el progreso.', false);
            return;
        }

        const win = window.open('', '_blank');
        const today = new Date().toLocaleString();

        let html = `
            <html>
            <head>
                <title>Progreso Matemáticas Kolbe 4º</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1, h2 { color: #2c3e50; }
                    table { border-collapse: collapse; width: 100%; margin-top: 15px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
                    th { background: #f0f0f0; }
                    .small { font-size: 0.9rem; color: #555; }
                </style>
            </head>
            <body>
                <h1>Progreso Matemáticas Kolbe – 4º Grado</h1>
                <p><strong>Alumno:</strong> ${this.progress.studentName}</p>
                <p class="small"><strong>Fecha:</strong> ${today}</p>
        `;

        const modules = ['fractions', 'decimals', 'proportions', 'operations'];
        const nameMap = {
            fractions: 'Fracciones',
            decimals: 'Decimales',
            proportions: 'Proporcionalidad',
            operations: 'Operaciones'
        };

        html += `<h2>Resumen por módulo</h2>
                 <table>
                 <tr><th>Módulo</th><th>Completados</th><th>Total</th><th>Porcentaje</th></tr>`;

        modules.forEach(module => {
            const data = this.progress[module];
            if (!data || !data.total) return;
            const percent = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
            html += `<tr>
                        <td>${nameMap[module] || module}</td>
                        <td>${data.completed}</td>
                        <td>${data.total}</td>
                        <td>${percent}%</td>
                    </tr>`;
        });

        html += `</table>`;

        html += `
            <h2>Estadísticas generales</h2>
            <p><strong>Estrellas totales:</strong> ${this.progress.totalStars || 0}</p>
            <p><strong>Días seguidos usando la app:</strong> ${this.progress.streakDays || 0}</p>
            </body></html>
        `;

        win.document.write(html);
        win.document.close();
        win.focus();
        win.print();

        this.showFeedback('Reporte generado', 'Se abrió una ventana con tu progreso. Usá "Guardar como PDF" en la impresión.', true);
    }

    async syncProgress() {
        const syncStatus = document.getElementById('syncStatus');
        
        if (!CONFIG.FEATURES.PROGRESS_SYNC) {
            if (syncStatus) {
                syncStatus.textContent = 'La sincronización está desactivada.';
                syncStatus.className = 'sync-status error';
            }
            return;
        }

        if (!this.progress.studentName || this.progress.studentName.trim() === '') {
            if (syncStatus) {
                syncStatus.textContent = 'Completa el nombre antes de sincronizar.';
                syncStatus.className = 'sync-status error';
            }
            return;
        }

        if (!this.progress.syncLog || this.progress.syncLog.length === 0) {
            if (syncStatus) {
                syncStatus.textContent = 'No hay datos nuevos para sincronizar.';
                syncStatus.className = 'sync-status';
            }
            return;
        }

        try {
            if (syncStatus) {
                syncStatus.textContent = 'Sincronizando...';
                syncStatus.className = 'sync-status';
            }

            for (const entry of this.progress.syncLog) {
                await fetch(CONFIG.SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entry)
                });
            }

            this.progress.syncLog = [];
            this.saveProgress();

            if (syncStatus) {
                syncStatus.textContent = '✅ Progreso sincronizado correctamente';
                syncStatus.className = 'sync-status success';
            }
            
        } catch (error) {
            console.error('Sync error:', error);
            if (syncStatus) {
                syncStatus.textContent = '❌ Error al sincronizar. Inténtalo más tarde.';
                syncStatus.className = 'sync-status error';
            }
        }
    }

    resetProgress() {
        if (!confirm('¿Seguro que querés borrar todo el progreso y empezar de cero?')) return;

        localStorage.removeItem('mathAppProgress');
        this.progress = this.loadProgress();
        this.initializeModuleProgress();
        this.updateProgressDisplay();
        this.renderHomeStats();
        this.renderProgressDetails();

        const nameInput = document.getElementById('studentName');
        if (nameInput) nameInput.value = '';

        this.showFeedback('Progreso reiniciado', 'Listo, podés empezar desde cero.', true);
    }

    setupStudentNameField() {
        const nameInput = document.getElementById('studentName');
        if (!nameInput) return;

        if (this.progress.studentName) {
            nameInput.value = this.progress.studentName;
        }

        nameInput.addEventListener('change', () => {
            this.progress.studentName = nameInput.value.trim();
            this.saveProgress();
        });
    }

    renderProgressDetails() {
        const badgesContainer = document.getElementById('badgesContainer');
        const statsContainer = document.getElementById('detailedStats');

        if (!badgesContainer || !statsContainer) return;

        // Badges
        badgesContainer.innerHTML = '';
        const achievements = this.progress.achievements || [];

        if (achievements.length === 0) {
            badgesContainer.innerHTML = '<p>Aún no hay logros. ¡Comenzá a resolver ejercicios!</p>';
        } else {
            const achievementMap = {
                'first-star': { icon: '⭐', name: 'Primera estrella' },
                'perfect-fractions': { icon: '🥧', name: 'Maestro en fracciones' },
                'perfect-decimals': { icon: '💰', name: 'Maestro en decimales' },
                'perfect-proportions': { icon: '📊', name: 'Maestro en proporciones' },
                'perfect-operations': { icon: '🧮', name: 'Maestro en operaciones' }
            };

            achievements.forEach(id => {
                const data = achievementMap[id] || { icon: '🏆', name: id };
                const div = document.createElement('div');
                div.className = 'badge';
                div.innerHTML = `
                    <div class="badge-icon">${data.icon}</div>
                    <div class="badge-name">${data.name}</div>
                `;
                badgesContainer.appendChild(div);
            });
        }

        // Estadísticas
        statsContainer.innerHTML = '';
        const modules = ['fractions', 'decimals', 'proportions', 'operations'];
        const nameMap = {
            fractions: 'Fracciones',
            decimals: 'Decimales',
            proportions: 'Proporcionalidad',
            operations: 'Operaciones'
        };

        modules.forEach(module => {
            const data = this.progress[module];
            if (!data || !data.total) return;
            const percent = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;

            const row = document.createElement('div');
            row.className = 'stat-row';
            row.innerHTML = `
                <strong>${nameMap[module] || module}</strong>: 
                ${data.completed}/${data.total} ejercicios completados (${percent}%)
            `;
            statsContainer.appendChild(row);
        });
    }
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mathApp = new MathApp();
});

// Add some CSS for dynamic fraction visuals (se mantiene por compatibilidad)
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .fraction-circle {
        display: grid;
        gap: 5px;
        width: 200px;
        height: 200px;
        margin: 20px auto;
        border-radius: 50%;
        overflow: hidden;
    }
    
    .circle-segment {
        background: #e0e0e0;
        border: 2px solid #666;
        border-radius: 10px;
        transition: background 0.3s ease;
    }
    
    .circle-segment.filled {
        background: #4facfe;
    }
    
    .fraction-bar {
        display: flex;
        width: 300px;
        height: 60px;
        margin: 20px auto;
        border: 2px solid #666;
        border-radius: 10px;
        overflow: hidden;
    }
    
    .bar-segment {
        flex: 1;
        background: #e0e0e0;
        border-right: 1px solid #666;
        transition: background 0.3s ease;
    }
    
    .bar-segment:last-child {
        border-right: none;
    }
    
    .bar-segment.filled {
        background: #4facfe;
    }
    
    .coin-display {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 20px 0;
        flex-wrap: wrap;
    }
    
    .table-input {
        width: 80px;
        padding: 5px;
        font-size: 1rem;
        border: 2px solid #dee2e6;
        border-radius: 5px;
        text-align: center;
    }
    
    .table-input:focus {
        outline: none;
        border-color: #4facfe;
    }
    
    .game-round {
        text-align: center;
        padding: 20px;
    }
    
    .shape-display {
        margin: 30px 0;
        min-height: 250px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .game-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        max-width: 300px;
        margin: 20px auto;
    }
`;
document.head.appendChild(dynamicStyles);
