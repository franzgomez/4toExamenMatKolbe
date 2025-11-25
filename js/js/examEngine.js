// ======================================================================
//  EXAM ENGINE — Motor del Examen Final
// ======================================================================

class ExamEngine {

    constructor(app) {
        this.app = app;
        this.allQuestions = [];
        this.examQuestions = [];
        this.answers = [];
        this.currentIndex = 0;
        this.timerId = null;
        this.timeLeft = 0;
        this.isPractice = false;
        this.initialized = false;
    }

    // ---------------------------------------------------------
    // Cargar preguntas desde /data/exam.json
    // ---------------------------------------------------------
    async loadQuestions() {
        if (this.allQuestions.length > 0) return;

        try {
            const res = await fetch('data/exam.json');
            const data = await res.json();
            this.allQuestions = data.examQuestions || data;
        } catch (e) {
            console.error('Error cargando preguntas de examen:', e);
            alert('Error cargando preguntas del examen.');
        }
    }

    // ---------------------------------------------------------
    // Vincular listeners de los botones del examen
    // (llamado una sola vez desde app.js)
    // ---------------------------------------------------------
    attachEventListeners() {
        if (this.initialized) return;
        this.initialized = true;

        const startExamBtn = document.getElementById('startExamBtn');
        const practiceExamBtn = document.getElementById('practiceExamBtn');
        const prevBtn = document.getElementById('prevQuestionBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const submitBtn = document.getElementById('submitExamBtn');

        if (startExamBtn) {
            startExamBtn.addEventListener('click', () => {
                // Examen real: requiere nombre
                if (!this.app.requireStudentName(() => this.startExam(false))) return;
                this.startExam(false);
            });
        }

        if (practiceExamBtn) {
            practiceExamBtn.addEventListener('click', () => {
                // Examen de práctica: no actualiza progreso global
                this.startExam(true);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.saveCurrentAnswer();
                this.prevQuestion();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.saveCurrentAnswer();
                this.nextQuestion();
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.saveCurrentAnswer();
                this.finishExam(false);
            });
        }
    }

    // ---------------------------------------------------------
    // Iniciar examen (real o práctica)
    // ---------------------------------------------------------
    async startExam(isPractice = false) {
        await this.loadQuestions();

        this.isPractice = isPractice;

        const totalQuestions = CONFIG.EXERCISE_CONFIG.EXAM_QUESTIONS_COUNT || 10;
        const shuffled = Utils.shuffle(this.allQuestions);
        this.examQuestions = shuffled.slice(0, totalQuestions);

        this.answers = new Array(this.examQuestions.length).fill(null);
        this.currentIndex = 0;

        this.timeLeft = CONFIG.EXERCISE_CONFIG.EXAM_TIME_LIMIT || 900;

        // Mostrar área de examen
        const examArea = document.getElementById('examArea');
        const examResults = document.getElementById('examResults');
        const totalQuestionsEl = document.getElementById('totalQuestions');
        const currentQuestionEl = document.getElementById('currentQuestion');
        const submitBtn = document.getElementById('submitExamBtn');

        if (examArea) examArea.style.display = 'block';
        if (examResults) examResults.style.display = 'none';
        if (totalQuestionsEl) totalQuestionsEl.textContent = this.examQuestions.length;
        if (currentQuestionEl) currentQuestionEl.textContent = 1;
        if (submitBtn) submitBtn.style.display = 'none';

        this.updateTimerDisplay(this.timeLeft);
        this.renderCurrentQuestion();

        this.startTimer();
    }

    // ---------------------------------------------------------
    // Timer del examen
    // ---------------------------------------------------------
    startTimer() {
        if (this.timerId) clearInterval(this.timerId);

        this.timerId = Utils.createTimer(
            this.timeLeft,
            () => this.finishExam(true),
            (t) => {
                this.timeLeft = t;
                this.updateTimerDisplay(t);
            }
        );
    }

    updateTimerDisplay(seconds) {
        const timerEl = document.getElementById('examTimer');
        if (timerEl) {
            timerEl.textContent = Utils.formatTime(seconds);
        }
    }

    // ---------------------------------------------------------
    // Renderizar pregunta actual
    // ---------------------------------------------------------
    renderCurrentQuestion() {
        const questionObj = this.examQuestions[this.currentIndex];
        const container = document.getElementById('examQuestion');
        const currentQuestionEl = document.getElementById('currentQuestion');
        const prevBtn = document.getElementById('prevQuestionBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const submitBtn = document.getElementById('submitExamBtn');

        if (!questionObj || !container) return;

        container.innerHTML = "";

        if (currentQuestionEl) {
            currentQuestionEl.textContent = this.currentIndex + 1;
        }

        // Control de botones nav
        if (prevBtn) prevBtn.disabled = (this.currentIndex === 0);
        if (nextBtn) nextBtn.style.display = (this.currentIndex === this.examQuestions.length - 1) ? 'none' : 'inline-block';
        if (submitBtn) submitBtn.style.display = (this.currentIndex === this.examQuestions.length - 1) ? 'inline-block' : 'none';

        const card = Utils.createElement('div', 'exercise-card');
        const title = Utils.createElement('div', 'exercise-question',
            `${questionObj.question}`
        );
        card.appendChild(title);

        const type = questionObj.type;

        if (type === 'multiple_choice') {
            const optionsDiv = Utils.createElement('div', 'exercise-options');
            questionObj.options.forEach((opt, idx) => {
                const label = Utils.createElement('label', 'option-label');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'examOption';
                input.value = idx;

                if (this.answers[this.currentIndex] !== null &&
                    this.answers[this.currentIndex].type === 'multiple_choice' &&
                    this.answers[this.currentIndex].value == idx) {
                    input.checked = true;
                }

                label.appendChild(input);
                label.appendChild(document.createTextNode(' ' + opt));
                optionsDiv.appendChild(label);
            });
            card.appendChild(optionsDiv);

        } else if (type === 'numeric') {
            const input = Utils.createElement('input', 'numeric-input');
            input.type = 'number';
            input.placeholder = 'Tu respuesta';

            if (this.answers[this.currentIndex] &&
                this.answers[this.currentIndex].type === 'numeric') {
                input.value = this.answers[this.currentIndex].value;
            }

            card.appendChild(input);

        } else if (type === 'word_problem') {
            const input = Utils.createElement('input', 'numeric-input');
            input.type = 'text';
            input.placeholder = 'Escribe el resultado';

            if (this.answers[this.currentIndex] &&
                this.answers[this.currentIndex].type === 'word_problem') {
                input.value = this.answers[this.currentIndex].value;
            }

            card.appendChild(input);
        }

        container.appendChild(card);
    }

    // ---------------------------------------------------------
    // Guardar respuesta actual antes de navegar
    // ---------------------------------------------------------
    saveCurrentAnswer() {
        const questionObj = this.examQuestions[this.currentIndex];
        if (!questionObj) return;

        const type = questionObj.type;
        let value = null;

        if (type === 'multiple_choice') {
            const selected = document.querySelector('input[name="examOption"]:checked');
            if (selected) value = parseInt(selected.value, 10);

        } else {
            const input = document.querySelector('#examQuestion .numeric-input');
            if (input) value = input.value;
        }

        this.answers[this.currentIndex] = { type, value };
    }

    // ---------------------------------------------------------
    // Navegar preguntas
    // ---------------------------------------------------------
    nextQuestion() {
        if (this.currentIndex < this.examQuestions.length - 1) {
            this.currentIndex++;
            this.renderCurrentQuestion();
        }
    }

    prevQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderCurrentQuestion();
        }
    }

    // ---------------------------------------------------------
    // Finalizar examen
    // ---------------------------------------------------------
    finishExam(timeUp = false) {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }

        const examArea = document.getElementById('examArea');
        const examResults = document.getElementById('examResults');

        if (examArea) examArea.style.display = 'none';
        if (examResults) examResults.style.display = 'block';

        const { correctCount, totalPoints, scoredPoints, percentage, grade } =
            this.calculateResults();

        // Mostrar resultados en pantalla
        examResults.innerHTML = `
            <div class="exercise-card">
                <h3>📊 Resultado del Examen ${this.isPractice ? '(Práctica)' : ''}</h3>
                ${timeUp ? '<p>⏰ El tiempo se terminó, el examen se cerró automáticamente.</p>' : ''}
                <p><strong>Preguntas correctas:</strong> ${correctCount} de ${this.examQuestions.length}</p>
                <p><strong>Puntos obtenidos:</strong> ${scoredPoints} / ${totalPoints}</p>
                <p><strong>Porcentaje:</strong> ${percentage}%</p>
                <p><strong>Calificación:</strong> ${grade}</p>
            </div>
        `;

        // Actualizar progreso si NO es práctica
        if (!this.isPractice) {
            this.updateExamProgress(percentage, correctCount);
        }
    }

    // ---------------------------------------------------------
    // Calcular resultados
    // ---------------------------------------------------------
    calculateResults() {
        let correctCount = 0;
        let totalPoints = 0;
        let scoredPoints = 0;

        this.examQuestions.forEach((q, idx) => {
            const ans = this.answers[idx];
            const points = q.points || 1;
            totalPoints += points;

            if (!ans || ans.value === null || ans.value === '') return;

            let isCorrect = false;

            if (q.type === 'multiple_choice') {
                isCorrect = (parseInt(ans.value, 10) === q.correct);
            } else if (q.type === 'numeric') {
                const numUser = parseFloat(ans.value);
                const numCorrect = parseFloat(q.answer);
                if (!isNaN(numUser) && !isNaN(numCorrect)) {
                    isCorrect = (numUser === numCorrect);
                }
            } else if (q.type === 'word_problem') {
                const userStr = String(ans.value).toLowerCase().trim();
                const correctStr = String(q.answer).toLowerCase().trim();
                isCorrect = (userStr === correctStr);
            }

            if (isCorrect) {
                correctCount++;
                scoredPoints += points;
            }
        });

        const percentage = totalPoints > 0
            ? Math.round((scoredPoints / totalPoints) * 100)
            : 0;

        let grade = 'F';
        if (percentage >= 90) grade = 'A';
        else if (percentage >= 80) grade = 'B';
        else if (percentage >= 70) grade = 'C';
        else if (percentage >= 60) grade = 'D';

        return { correctCount, totalPoints, scoredPoints, percentage, grade };
    }

    // ---------------------------------------------------------
    // Actualizar módulo "exam" en el progreso global
    // ---------------------------------------------------------
    updateExamProgress(percentage, correctCount) {
        const moduleData = this.app.progress.modules.exam;

        moduleData.progress = percentage;               // usamos el % como progreso del módulo
        moduleData.exercises += this.examQuestions.length;
        moduleData.correct += correctCount;
        moduleData.total += this.examQuestions.length;

        this.app.progress.totalExercises += this.examQuestions.length;
        this.app.progress.correctAnswers += correctCount;
        this.app.progress.totalAnswers += this.examQuestions.length;

        this.app.saveProgress();
        this.app.updateProgressDisplay();
        this.app.renderHomeStats();

        if (this.app.currentSection === 'progress') {
            this.app.renderProgressDashboard();
        }
    }
}

// Export
if (typeof module !== "undefined") {
    module.exports = ExamEngine;
}
