// Math Learning App for 4th Grade
class MathApp {
    constructor() {
        this.currentSection = 'home';
        this.progress = this.loadProgress();
        this.exercises = this.generateExercises();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgressDisplay();
        this.renderHomeStats();
        this.checkDailyStreak();
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
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.showTab(tab);
            });
        });

        // Export and sync buttons
        document.getElementById('exportProgress')?.addEventListener('click', () => this.exportProgress());
        document.getElementById('syncProgress')?.addEventListener('click', () => this.syncProgress());

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
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Show section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        this.currentSection = sectionId;

        // Generate exercises for the current module
        if (['fractions', 'decimals', 'proportions'].includes(sectionId)) {
            this.generateModuleExercises(sectionId);
        }
    }

    showTab(tabId) {
        const [module, tab] = tabId.split('-');
        
        // Update tab buttons
        document.querySelectorAll(`#${module} .tab-btn`).forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Show tab content
        document.querySelectorAll(`#${module} .tab-content`).forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
    }

    // Exercise Generation
    generateExercises() {
        return {
            fractions: this.generateFractionExercises(),
            decimals: this.generateDecimalExercises(),
            proportions: this.generateProportionExercises()
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
            question: '¿Cuánto es 1/4 + 1/4? (Escribe solo el numerador)',
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
            hint: '3/4 significa que faltan solo 1/4 para llegar al entero completo.'
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
                    <input type="number" class="numeric-input" placeholder="Tu respuesta" step="0.1">
                    <button class="check-btn">Verificar</button>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="exercise-question">${exercise.question}</div>
            ${optionsHTML}
            <button class="hint-btn">💡 Pista</button>
            <div class="hint-content">
                <strong>Pista:</strong> ${exercise.hint}
            </div>
            <div class="explanation-content" style="display: none;">
                <strong>Explicación:</strong> ${exercise.explanation}
            </div>
        `;

        this.setupExerciseListeners(card, exercise);
        return card;
    }

    setupExerciseListeners(card, exercise) {
        // Multiple choice options
        card.querySelectorAll('.option-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.selectOption(card, index, exercise);
            });
        });

        // Numeric input
        const checkBtn = card.querySelector('.check-btn');
        if (checkBtn) {
            checkBtn.addEventListener('click', () => {
                this.checkNumericAnswer(card, exercise);
            });
        }

        // Hint button
        const hintBtn = card.querySelector('.hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                const hintContent = card.querySelector('.hint-content');
                hintContent.classList.toggle('show');
            });
        }
    }

    selectOption(card, selectedIndex, exercise) {
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
                this.showFeedback('¡Correcto! 🎉', exercise.explanation, true);
                this.updateProgress(card.dataset.module, true);
            } else {
                options[selectedIndex].classList.add('incorrect');
                options[exercise.correct].classList.add('correct');
                card.classList.add('incorrect');
                this.showFeedback('¡Inténtalo de nuevo! 🤔', exercise.explanation, false);
                this.updateProgress(card.dataset.module, false);
            }
            
            // Show explanation
            const explanation = card.querySelector('.explanation-content');
            explanation.style.display = 'block';
            
        }, 500);
    }

    checkNumericAnswer(card, exercise) {
        const input = card.querySelector('.numeric-input');
        const userAnswer = parseFloat(input.value);
        const isCorrect = Math.abs(userAnswer - exercise.answer) < 0.01;

        if (isCorrect) {
            card.classList.add('correct');
            input.style.borderColor = '#4caf50';
            this.showFeedback('¡Correcto! 🎉', exercise.explanation, true);
            this.updateProgress(card.dataset.module, true);
        } else {
            card.classList.add('incorrect');
            input.style.borderColor = '#f44336';
            this.showFeedback(`¡Inténtalo de nuevo! La respuesta correcta es ${exercise.answer}`, exercise.explanation, false);
            this.updateProgress(card.dataset.module, false);
        }

        // Show explanation
        const explanation = card.querySelector('.explanation-content');
        explanation.style.display = 'block';
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
        
        moneyExercises.forEach((exercise, index) => {
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
                    <button class="check-btn" onclick="this.parentElement.parentElement.checkAnswer(${exercise.answer})">Verificar</button>
                </div>
            `;
            
            exerciseDiv.innerHTML = content;
            exerciseDiv.checkAnswer = (correctAnswer) => {
                const input = exerciseDiv.querySelector('.numeric-input');
                const userAnswer = parseFloat(input.value);
                const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01;
                
                if (isCorrect) {
                    exerciseDiv.classList.add('correct');
                    this.showFeedback('¡Correcto! 🎉', `La respuesta es ${correctAnswer.toFixed(2)}€`, true);
                } else {
                    exerciseDiv.classList.add('incorrect');
                    this.showFeedback(`Incorrecto. La respuesta es ${correctAnswer.toFixed(2)}€`, '', false);
                }
            };
            
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

        tableExercise.table.forEach((row, index) => {
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
                <button class="check-btn" onclick="this.parentElement.checkTable()">Verificar Tabla</button>
            </div>
        `;

        container.innerHTML = tableHTML;

        // Add check function to the exercise card
        const exerciseCard = container.querySelector('.exercise-card');
        exerciseCard.checkTable = () => {
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
                this.showFeedback('¡Excelente! Has completado la tabla correctamente 🎉', 'Cada bolígrafo cuesta 3€, entonces multiplicas el número de bolígrafos por 3.', true);
            } else {
                this.showFeedback('Revisa tus respuestas. Recuerda: cada bolígrafo cuesta 3€', '', false);
            }
        };
    }

    renderFractionGame() {
        const container = document.getElementById('fractionGame');
        if (!container) return;

        const gameData = {
            shapes: ['circle', 'rectangle', 'triangle'],
            fractions: [
                { numerator: 1, denominator: 2 },
                { numerator: 1, denominator: 3 },
                { numerator: 2, denominator: 3 },
                { numerator: 3, denominator: 4 }
            ]
        };

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
        
        // Random fraction
        const fractions = [
            { numerator: 1, denominator: 2 },
            { numerator: 1, denominator: 3 },
            { numerator: 2, denominator: 3 },
            { numerator: 1, denominator: 4 },
            { numerator: 3, denominator: 4 }
        ];
        
        const correctFraction = fractions[Math.floor(Math.random() * fractions.length)];
        
        // Create visual representation
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
        
        return visual + `
            <style>
                .fraction-circle {
                    display: grid;
                    grid-template-columns: repeat(${Math.ceil(Math.sqrt(denominator))}, 1fr);
                    gap: 2px;
                    width: 200px;
                    height: 200px;
                    margin: 20px auto;
                }
                .circle-segment {
                    background: #e0e0e0;
                    border: 2px solid #666;
                    border-radius: 10px;
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
                }
                .bar-segment:last-child {
                    border-right: none;
                }
                .bar-segment.filled {
                    background: #4facfe;
                }
            </style>
        `;
    }

    // Progress Management
    updateProgress(module, isCorrect) {
        if (!this.progress[module]) {
            this.progress[module] = { completed: 0, total: 0, correct: 0 };
        }
        
        this.progress[module].total++;
        if (isCorrect) {
            this.progress[module].correct++;
            this.progress[module].completed++;
            this.addStar();
        }
        
        this.saveProgress();
        this.updateProgressDisplay();
        this.checkAchievements();

        // Log progress for sync
        this.logProgress(module, isCorrect);
    }

    logProgress(module, isCorrect) {
        const timestamp = new Date().toISOString();
        const progressEntry = {
            userId: "child1",
            timestamp: timestamp,
            module: module,
            subTopic: this.currentSection,
            question: `Exercise in ${module}`,
            answer: isCorrect ? "correct" : "incorrect",
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
        // Update overall progress
        const totalExercises = Object.values(this.progress)
            .filter(p => p && p.total !== undefined)
            .reduce((sum, p) => sum + p.total, 0);
        
        const completedExercises = Object.values(this.progress)
            .filter(p => p && p.completed !== undefined)
            .reduce((sum, p) => sum + p.completed, 0);

        const overallPercent = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
        
        const progressFill = document.getElementById('overallProgress');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) progressFill.style.width = `${overallPercent}%`;
        if (progressText) progressText.textContent = `${overallPercent}% completado`;

        // Update module progress
        ['fractions', 'decimals', 'proportions'].forEach(module => {
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
            const total = Object.values(this.progress)
                .filter(p => p && p.total !== undefined)
                .reduce((sum, p) => sum + p.total, 0);
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
        if (this.progress.totalStars >= 1 && !this.progress.achievements?.includes('first-star')) {
            achievements.push({
                id: 'first-star',
                name: 'Primera Estrella',
                icon: '⭐',
                description: '¡Has ganado tu primera estrella!'
            });
        }
        
        // Perfect score in module
        Object.entries(this.progress).forEach(([module, data]) => {
            if (data && data.total >= 5 && data.correct === data.total) {
                const achievementId = `perfect-${module}`;
                if (!this.progress.achievements?.includes(achievementId)) {
                    achievements.push({
                        id: achievementId,
                        name: `Maestro de ${module}`,
                        icon: '🏆',
                        description: `¡Perfecto en ${module}!`
                    });
                }
            }
        });
        
        // Add achievements
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
            achievements: []
        };
    }

    exportProgress() {
        const dataStr = JSON.stringify(this.progress, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `math_progress_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showFeedback('¡Progreso Exportado!', 'Tu progreso se ha descargado como archivo JSON.', true);
    }

    async syncProgress() {
        const syncStatus = document.getElementById('syncStatus');
        
        if (!this.progress.syncLog || this.progress.syncLog.length === 0) {
            syncStatus.textContent = 'No hay datos nuevos para sincronizar.';
            syncStatus.className = 'sync-status';
            return;
        }

        try {
            syncStatus.textContent = 'Sincronizando...';
            syncStatus.className = 'sync-status';

            // Send each log entry
            for (const entry of this.progress.syncLog) {
                const response = await fetch(CONFIG.SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entry)
                });
            }

            // Clear sync log after successful sync
            this.progress.syncLog = [];
            this.saveProgress();

            syncStatus.textContent = '✅ Progreso sincronizado correctamente';
            syncStatus.className = 'sync-status success';
            
        } catch (error) {
            console.error('Sync error:', error);
            syncStatus.textContent = '❌ Error al sincronizar. Inténtalo más tarde.';
            syncStatus.className = 'sync-status error';
        }
    }
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mathApp = new MathApp();
});

// Add some CSS for dynamic elements
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
    
    .numeric-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin: 15px 0;
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
