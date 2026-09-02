// Quick validation test
var fs = require('fs');
var path = require('path');
var ROOT = 'c:\\Users\\Arvind\\Downloads\\SC900-Path1-GitHub';
var results = [];

function check(label, cond) {
  results.push((cond ? 'PASS' : 'FAIL') + ': ' + label);
}

// File existence
var files = ['index.html', 'quiz/path1.html', 'flashcards/path1.html', 'css/styles.css', 'js/quiz.js', 'js/flashcards.js', 'data/path1-quiz.json', 'data/path1-flashcards.json'];
files.forEach(function(f) {
  check(f + ' exists', fs.existsSync(path.join(ROOT, f)));
});

// JSON validation
var quiz = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/path1-quiz.json'), 'utf8'));
check('Quiz has 25 questions', quiz.length === 25);
check('All quiz items valid', quiz.every(function(q) { return q.q && q.o && q.o.length === 4 && typeof q.a === 'number' && q.e; }));

var cards = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/path1-flashcards.json'), 'utf8'));
check('Flashcards has 21 cards', cards.length === 21);
check('All flashcard items valid', cards.every(function(c) { return c.front && c.back; }));

// HTML checks
var idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
var qz = fs.readFileSync(path.join(ROOT, 'quiz/path1.html'), 'utf8');
var fc = fs.readFileSync(path.join(ROOT, 'flashcards/path1.html'), 'utf8');

check('Dashboard has nav-bar', idx.indexOf('nav-bar') >= 0);
check('Dashboard links to quiz', idx.indexOf('quiz/path1.html') >= 0);
check('Dashboard links to flashcards', idx.indexOf('flashcards/path1.html') >= 0);
check('Quiz has quiz-container', qz.indexOf('quiz-container') >= 0);
check('Quiz has btn-submit', qz.indexOf('btn-submit') >= 0);
check('Quiz loads quiz.js', qz.indexOf('quiz.js') >= 0);
check('Flashcards has flashcard id', fc.indexOf('id="flashcard"') >= 0);
check('Flashcards has btn-prev', fc.indexOf('btn-prev') >= 0);
check('Flashcards has btn-next', fc.indexOf('btn-next') >= 0);
check('Flashcards has btn-shuffle', fc.indexOf('btn-shuffle') >= 0);
check('Flashcards loads flashcards.js', fc.indexOf('flashcards.js') >= 0);

// CSS checks
var css = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
check('CSS has flashcard flip', css.indexOf('rotateY(180deg)') >= 0);
check('CSS has progress-bar', css.indexOf('.progress-bar') >= 0);
check('CSS has responsive 480px', css.indexOf('max-width: 480px') >= 0);
check('CSS has responsive 768px', css.indexOf('max-width: 768px') >= 0);
check('CSS has reduced-motion', css.indexOf('prefers-reduced-motion') >= 0);

// No external deps
check('No CDN in dashboard', idx.indexOf('cdn.') < 0);
check('No CDN in quiz', qz.indexOf('cdn.') < 0);
check('No CDN in flashcards', fc.indexOf('cdn.') < 0);

// Output
fs.writeFileSync(path.join(ROOT, 'scratch', 'results.txt'), results.join('\n') + '\n');
