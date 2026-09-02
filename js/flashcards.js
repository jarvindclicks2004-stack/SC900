/**
 * SC-900 Path 1 Flashcards Engine
 * Loads flashcards from JSON, handles flip, navigation, shuffle, restart.
 * Keyboard shortcuts: Space/Enter=flip, Left=prev, Right=next, S=shuffle, R=restart
 */
(function () {
  'use strict';

  let cards = [];
  let originalCards = [];
  let currentIndex = 0;
  let isFlipped = false;

  // DOM references
  const flashcard = document.getElementById('flashcard');
  const frontContent = document.getElementById('flashcard-front-content');
  const backContent = document.getElementById('flashcard-back-content');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const shuffleBtn = document.getElementById('btn-shuffle');
  const restartBtn = document.getElementById('btn-restart');
  const progressText = document.getElementById('flashcard-progress');
  const flipHint = document.getElementById('flip-hint');

  /**
   * Load flashcard data
   */
  async function init() {
    try {
      const resp = await fetch('../data/path1-flashcards.json');
      if (!resp.ok) throw new Error('Failed to load flashcard data');
      cards = await resp.json();
      originalCards = cards.slice();
      showCard();
    } catch (err) {
      frontContent.textContent = 'Error loading flashcard data. Please check that data/path1-flashcards.json exists.';
      console.error(err);
    }
  }

  /**
   * Display current card
   */
  function showCard() {
    if (cards.length === 0) return;

    // Reset flip state
    isFlipped = false;
    flashcard.classList.remove('flipped');

    var card = cards[currentIndex];
    frontContent.textContent = card.front;
    backContent.textContent = card.back;

    // Update progress
    progressText.textContent = (currentIndex + 1) + ' / ' + cards.length;

    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === cards.length - 1;

    // Show flip hint
    if (flipHint) {
      flipHint.textContent = 'Click card or press Space to flip';
    }
  }

  /**
   * Flip the current card
   */
  function flipCard() {
    isFlipped = !isFlipped;
    if (isFlipped) {
      flashcard.classList.add('flipped');
    } else {
      flashcard.classList.remove('flipped');
    }

    if (flipHint) {
      flipHint.textContent = isFlipped ? 'Click card or press Space to flip back' : 'Click card or press Space to flip';
    }
  }

  /**
   * Go to previous card
   */
  function prevCard() {
    if (currentIndex > 0) {
      currentIndex--;
      showCard();
    }
  }

  /**
   * Go to next card
   */
  function nextCard() {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      showCard();
    }
  }

  /**
   * Shuffle cards using Fisher-Yates
   */
  function shuffleCards() {
    for (var i = cards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = cards[i];
      cards[i] = cards[j];
      cards[j] = temp;
    }
    currentIndex = 0;
    showCard();
  }

  /**
   * Restart to original order
   */
  function restartCards() {
    cards = originalCards.slice();
    currentIndex = 0;
    showCard();
  }

  // Click to flip
  flashcard.addEventListener('click', flipCard);

  // Button events
  prevBtn.addEventListener('click', prevCard);
  nextBtn.addEventListener('click', nextCard);
  shuffleBtn.addEventListener('click', shuffleCards);
  restartBtn.addEventListener('click', restartCards);

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // Don't capture if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        flipCard();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevCard();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextCard();
        break;
      case 's':
      case 'S':
        e.preventDefault();
        shuffleCards();
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        restartCards();
        break;
    }
  });

  // Initialize
  init();
})();
