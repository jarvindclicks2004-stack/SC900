/**
 * SC-900 Path 1 Quiz Engine
 * Loads questions from JSON, handles selection, scoring, and explanations.
 */
(function () {
  'use strict';

  let questions = [];
  let answered = {};       // { questionIndex: selectedOptionIndex }
  let submitted = false;

  // DOM references
  const quizContainer = document.getElementById('quiz-container');
  const submitBtn = document.getElementById('btn-submit');
  const restartBtn = document.getElementById('btn-restart');
  const resultsSection = document.getElementById('quiz-results');
  const scoreDisplay = document.getElementById('score-display');
  const scoreSummary = document.getElementById('score-summary');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  /**
   * Load quiz data and render
   */
  async function init() {
    try {
      const resp = await fetch('../data/path1-quiz.json');
      if (!resp.ok) throw new Error('Failed to load quiz data');
      questions = await resp.json();
      render();
      updateProgress();
    } catch (err) {
      quizContainer.innerHTML =
        '<div class="question-card"><p>Error loading quiz data. Please check that data/path1-quiz.json exists.</p></div>';
      console.error(err);
    }
  }

  /**
   * Render all questions
   */
  function render() {
    quizContainer.innerHTML = '';

    questions.forEach(function (item, qi) {
      var card = document.createElement('div');
      card.className = 'question-card';
      card.id = 'question-' + qi;

      var numLabel = document.createElement('span');
      numLabel.className = 'question-number';
      numLabel.textContent = 'Question ' + (qi + 1) + ' of ' + questions.length;

      var qText = document.createElement('p');
      qText.className = 'question-text';
      qText.textContent = item.q;

      var optionsList = document.createElement('div');
      optionsList.className = 'options-list';

      item.o.forEach(function (optText, oi) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = optText;
        btn.setAttribute('data-question', qi);
        btn.setAttribute('data-option', oi);
        btn.addEventListener('click', function () {
          selectOption(qi, oi);
        });
        optionsList.appendChild(btn);
      });

      card.appendChild(numLabel);
      card.appendChild(qText);
      card.appendChild(optionsList);
      quizContainer.appendChild(card);
    });
  }

  /**
   * Handle option selection
   */
  function selectOption(qi, oi) {
    if (submitted) return;

    answered[qi] = oi;

    // Update visual selection
    var card = document.getElementById('question-' + qi);
    var buttons = card.querySelectorAll('.option-btn');
    buttons.forEach(function (btn) {
      btn.classList.remove('selected');
    });
    buttons[oi].classList.add('selected');

    updateProgress();
  }

  /**
   * Update progress bar and text
   */
  function updateProgress() {
    var count = Object.keys(answered).length;
    var total = questions.length;
    var pct = total > 0 ? Math.round((count / total) * 100) : 0;

    progressFill.style.width = pct + '%';
    progressText.textContent = count + ' of ' + total + ' answered';
  }

  /**
   * Submit quiz and show results
   */
  function submitQuiz() {
    if (submitted) return;
    submitted = true;

    var score = 0;

    questions.forEach(function (item, qi) {
      var card = document.getElementById('question-' + qi);
      var buttons = card.querySelectorAll('.option-btn');

      // Disable all buttons
      buttons.forEach(function (btn) {
        btn.disabled = true;
      });

      // Mark correct answer
      buttons[item.a].classList.add('correct');

      // Mark incorrect if user chose wrong
      if (answered[qi] !== undefined) {
        if (answered[qi] === item.a) {
          score++;
        } else {
          buttons[answered[qi]].classList.add('incorrect');
        }
      }

      // Show explanation
      var explanation = document.createElement('div');
      explanation.className = 'explanation';
      explanation.innerHTML = '<strong>Explanation:</strong> ' + item.e;
      card.appendChild(explanation);
    });

    // Show results
    var pct = Math.round((score / questions.length) * 100);
    scoreDisplay.textContent = score + ' / ' + questions.length + ' (' + pct + '%)';

    var answeredCount = Object.keys(answered).length;
    var unanswered = questions.length - answeredCount;
    var incorrect = answeredCount - score;

    scoreSummary.innerHTML =
      '<span class="result-correct">' + score + ' correct</span> · ' +
      '<span class="result-incorrect">' + incorrect + ' incorrect</span>' +
      (unanswered > 0 ? ' · <span class="result-unanswered">' + unanswered + ' unanswered</span>' : '');

    resultsSection.classList.remove('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitted';

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Restart quiz
   */
  function restartQuiz() {
    answered = {};
    submitted = false;
    resultsSection.classList.add('hidden');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Quiz';
    render();
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Event listeners
  submitBtn.addEventListener('click', submitQuiz);
  restartBtn.addEventListener('click', restartQuiz);

  // Initialize
  init();
})();
