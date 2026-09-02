/**
 * SC-900 Study Hub — Comprehensive Test Script
 * Validates all files, links, data, and structure without a running server.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname.replace(/[\\/]scratch$/, '');
let errors = 0;
let warnings = 0;
let passed = 0;

function pass(msg) { console.log('  ✓ ' + msg); passed++; }
function fail(msg) { console.log('  ✗ FAIL: ' + msg); errors++; }
function warn(msg) { console.log('  ⚠ WARN: ' + msg); warnings++; }

console.log('\n=== SC-900 Study Hub Test Suite ===\n');

// 1. FILE STRUCTURE
console.log('1. File Structure');
const requiredFiles = [
  'index.html',
  'quiz/path1.html',
  'flashcards/path1.html',
  'css/styles.css',
  'js/quiz.js',
  'js/flashcards.js',
  'data/path1-quiz.json',
  'data/path1-flashcards.json',
  'data/path1-flashcards.csv',
  'README.md'
];

requiredFiles.forEach(f => {
  const full = path.join(ROOT, f);
  if (fs.existsSync(full)) {
    const stat = fs.statSync(full);
    if (stat.size > 0) pass(f + ' exists (' + stat.size + ' bytes)');
    else fail(f + ' is empty');
  } else {
    fail(f + ' not found');
  }
});

// 2. JSON DATA VALIDATION
console.log('\n2. Quiz Data Validation');
let quizData;
try {
  quizData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/path1-quiz.json'), 'utf8'));
  pass('path1-quiz.json is valid JSON');

  if (quizData.length === 25) pass('Contains exactly 25 questions');
  else fail('Expected 25 questions, got ' + quizData.length);

  quizData.forEach((q, i) => {
    if (!q.q) fail('Q' + (i+1) + ': missing question text');
    if (!q.o || q.o.length !== 4) fail('Q' + (i+1) + ': expected 4 options, got ' + (q.o ? q.o.length : 0));
    if (typeof q.a !== 'number' || q.a < 0 || q.a > 3) fail('Q' + (i+1) + ': invalid answer index: ' + q.a);
    if (!q.e) fail('Q' + (i+1) + ': missing explanation');
  });
  if (quizData.every(q => q.q && q.o && q.o.length === 4 && typeof q.a === 'number' && q.e)) {
    pass('All 25 questions have valid structure (q, o[4], a, e)');
  }
} catch (e) {
  fail('path1-quiz.json parse error: ' + e.message);
}

console.log('\n3. Flashcard Data Validation');
let flashcardData;
try {
  flashcardData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/path1-flashcards.json'), 'utf8'));
  pass('path1-flashcards.json is valid JSON');

  if (flashcardData.length === 21) pass('Contains exactly 21 flashcards');
  else fail('Expected 21 flashcards, got ' + flashcardData.length);

  flashcardData.forEach((c, i) => {
    if (!c.front) fail('Card ' + (i+1) + ': missing front text');
    if (!c.back) fail('Card ' + (i+1) + ': missing back text');
  });
  if (flashcardData.every(c => c.front && c.back)) {
    pass('All flashcards have valid front and back fields');
  }
} catch (e) {
  fail('path1-flashcards.json parse error: ' + e.message);
}

// 3. HTML VALIDATION
console.log('\n4. HTML Structure Validation');

function checkHTML(filepath, label) {
  const content = fs.readFileSync(path.join(ROOT, filepath), 'utf8');

  // Check doctype
  if (content.includes('<!DOCTYPE html>')) pass(label + ': has DOCTYPE');
  else fail(label + ': missing DOCTYPE');

  // Check charset
  if (content.includes('charset="utf-8"') || content.includes("charset='utf-8'")) pass(label + ': has charset utf-8');
  else fail(label + ': missing charset');

  // Check viewport
  if (content.includes('viewport')) pass(label + ': has viewport meta');
  else fail(label + ': missing viewport meta');

  // Check CSS link
  if (content.includes('styles.css')) pass(label + ': links to styles.css');
  else fail(label + ': missing CSS link');

  // Check nav
  if (content.includes('nav-bar')) pass(label + ': has navigation');
  else fail(label + ': missing navigation');

  return content;
}

const indexHTML = checkHTML('index.html', 'Dashboard');
const quizHTML = checkHTML('quiz/path1.html', 'Quiz');
const flashHTML = checkHTML('flashcards/path1.html', 'Flashcards');

// 4. LINK VALIDATION
console.log('\n5. Link Validation');

function extractLinks(html, htmlFile) {
  const links = [];
  const hrefRegex = /href="([^"]+)"/g;
  const srcRegex = /src="([^"]+)"/g;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    if (!match[1].startsWith('#') && !match[1].startsWith('http')) links.push(match[1]);
  }
  while ((match = srcRegex.exec(html)) !== null) {
    if (!match[1].startsWith('http')) links.push(match[1]);
  }
  return links;
}

function validateLinks(html, htmlFile, label) {
  const dir = path.dirname(path.join(ROOT, htmlFile));
  const links = extractLinks(html, htmlFile);
  let allGood = true;
  links.forEach(link => {
    const resolved = path.resolve(dir, link);
    if (!fs.existsSync(resolved)) {
      fail(label + ': broken link "' + link + '" -> ' + resolved);
      allGood = false;
    }
  });
  if (allGood && links.length > 0) pass(label + ': all ' + links.length + ' local links resolve');
}

validateLinks(indexHTML, 'index.html', 'Dashboard');
validateLinks(quizHTML, 'quiz/path1.html', 'Quiz');
validateLinks(flashHTML, 'flashcards/path1.html', 'Flashcards');

// 5. JAVASCRIPT VALIDATION
console.log('\n6. JavaScript Validation');

const quizJS = fs.readFileSync(path.join(ROOT, 'js/quiz.js'), 'utf8');
const flashJS = fs.readFileSync(path.join(ROOT, 'js/flashcards.js'), 'utf8');

// Check quiz.js has key functions
['selectOption', 'submitQuiz', 'restartQuiz', 'updateProgress', 'render'].forEach(fn => {
  if (quizJS.includes(fn)) pass('quiz.js has function: ' + fn);
  else fail('quiz.js missing function: ' + fn);
});

// Check quiz.js fetches correct data path
if (quizJS.includes('path1-quiz.json')) pass('quiz.js fetches path1-quiz.json');
else fail('quiz.js does not fetch path1-quiz.json');

// Check flashcards.js has key functions
['flipCard', 'prevCard', 'nextCard', 'shuffleCards', 'restartCards', 'showCard'].forEach(fn => {
  if (flashJS.includes(fn)) pass('flashcards.js has function: ' + fn);
  else fail('flashcards.js missing function: ' + fn);
});

// Check flashcards.js fetches correct data path
if (flashJS.includes('path1-flashcards.json')) pass('flashcards.js fetches path1-flashcards.json');
else fail('flashcards.js does not fetch path1-flashcards.json');

// Check keyboard shortcuts
['ArrowLeft', 'ArrowRight', 'Enter'].forEach(key => {
  if (flashJS.includes(key)) pass('flashcards.js handles key: ' + key);
  else fail('flashcards.js missing key handler: ' + key);
});

// 6. CSS VALIDATION
console.log('\n7. CSS Validation');
const css = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');

const requiredCSS = [
  '.nav-bar', '.container', '.btn-primary', '.btn-secondary',
  '.question-card', '.option-btn', '.correct', '.incorrect',
  '.explanation', '.progress-bar', '.progress-fill',
  '.flashcard-wrapper', '.flashcard', '.flashcard.flipped',
  '.flashcard-front', '.flashcard-back', 'backface-visibility',
  '.hidden', '.text-muted', '.path-card', '.stats-bar',
  '.score-display', '.footer', '.flashcard-nav',
  '@media', 'max-width: 480px', 'max-width: 768px',
  'prefers-reduced-motion'
];

requiredCSS.forEach(sel => {
  if (css.includes(sel)) pass('CSS has: ' + sel);
  else fail('CSS missing: ' + sel);
});

// 7. QUIZ DOM IDs match
console.log('\n8. DOM ID Matching');

// Check quiz HTML has expected IDs
['quiz-container', 'btn-submit', 'btn-restart', 'quiz-results', 'score-display', 'score-summary', 'progress-fill', 'progress-text'].forEach(id => {
  if (quizHTML.includes('id="' + id + '"')) pass('Quiz HTML has id="' + id + '"');
  else fail('Quiz HTML missing id="' + id + '"');
});

// Check quiz.js references those IDs
['quiz-container', 'btn-submit', 'btn-restart', 'quiz-results', 'score-display', 'score-summary', 'progress-fill', 'progress-text'].forEach(id => {
  if (quizJS.includes(id)) pass('quiz.js references id "' + id + '"');
  else fail('quiz.js does not reference id "' + id + '"');
});

// Check flashcard HTML has expected IDs
['flashcard', 'flashcard-front-content', 'flashcard-back-content', 'btn-prev', 'btn-next', 'btn-shuffle', 'btn-restart', 'flashcard-progress', 'flip-hint'].forEach(id => {
  if (flashHTML.includes('id="' + id + '"')) pass('Flashcard HTML has id="' + id + '"');
  else fail('Flashcard HTML missing id="' + id + '"');
});

// 8. CONTENT PRESERVATION CHECK
console.log('\n9. Content Preservation Check');

// Spot-check that original quiz questions are preserved
const sampleQuestions = [
  'shared responsibility model',
  'defense in depth',
  'Zero Trust security model',
  'asymmetric encryption',
  'hashing',
  'CIA triad',
  'GRC',
  'identity federation',
  'directory service',
  'Active Directory Domain Services'
];

sampleQuestions.forEach(topic => {
  const inQuiz = quizData && quizData.some(q => q.q.includes(topic) || q.o.some(o => o.includes(topic)) || q.e.includes(topic));
  if (inQuiz) pass('Quiz covers: ' + topic);
  else warn('Quiz may not cover: ' + topic);
});

// Spot-check flashcard content
const sampleFlashcards = [
  'Zero Trust',
  'defense in depth',
  'symmetric and asymmetric',
  'hashing',
  'CIA Triad',
  'federation'
];

sampleFlashcards.forEach(topic => {
  const inCards = flashcardData && flashcardData.some(c => c.front.includes(topic) || c.back.includes(topic));
  if (inCards) pass('Flashcards cover: ' + topic);
  else warn('Flashcards may not cover: ' + topic);
});

// 9. NO EXTERNAL DEPENDENCIES
console.log('\n10. External Dependency Check');
[indexHTML, quizHTML, flashHTML].forEach((html, i) => {
  const labels = ['Dashboard', 'Quiz', 'Flashcards'];
  if (!html.includes('cdn.') && !html.includes('googleapis.com') && !html.includes('unpkg.com')) {
    pass(labels[i] + ': no external CDN dependencies');
  } else {
    warn(labels[i] + ': has external CDN dependencies');
  }
});

// 10. IFRAME COMPATIBILITY
console.log('\n11. Iframe Compatibility Check');
[indexHTML, quizHTML, flashHTML].forEach((html, i) => {
  const labels = ['Dashboard', 'Quiz', 'Flashcards'];
  if (!html.includes('X-Frame-Options') && !html.includes('frame-ancestors')) {
    pass(labels[i] + ': no iframe restrictions');
  } else {
    warn(labels[i] + ': may have iframe restrictions');
  }
  // No service workers or auth
  if (!html.includes('serviceWorker') && !html.includes('navigator.credentials')) {
    pass(labels[i] + ': no service workers or auth APIs');
  }
});

// SUMMARY
console.log('\n' + '='.repeat(50));
console.log('RESULTS: ' + passed + ' passed, ' + errors + ' failed, ' + warnings + ' warnings');
if (errors === 0) {
  console.log('✓ ALL TESTS PASSED');
} else {
  console.log('✗ SOME TESTS FAILED');
}
console.log('='.repeat(50) + '\n');

process.exit(errors > 0 ? 1 : 0);
