$root = "c:\Users\Arvind\Downloads\SC900-Path1-GitHub"
$out = @()

# File checks
$files = @("index.html","quiz\path1.html","flashcards\path1.html","css\styles.css","js\quiz.js","js\flashcards.js","data\path1-quiz.json","data\path1-flashcards.json")
foreach ($f in $files) {
    $p = Join-Path $root $f
    if (Test-Path $p) { $out += "OK: $f" } else { $out += "MISSING: $f" }
}

# JSON checks
try {
    $quiz = Get-Content (Join-Path $root "data\path1-quiz.json") -Raw | ConvertFrom-Json
    $out += "Quiz questions: $($quiz.Count)"
} catch { $out += "ERROR: Quiz JSON: $_" }

try {
    $fc = Get-Content (Join-Path $root "data\path1-flashcards.json") -Raw | ConvertFrom-Json
    $out += "Flashcards: $($fc.Count)"
} catch { $out += "ERROR: Flashcard JSON: $_" }

# HTML content checks
$idx = Get-Content (Join-Path $root "index.html") -Raw
$qz = Get-Content (Join-Path $root "quiz\path1.html") -Raw
$fl = Get-Content (Join-Path $root "flashcards\path1.html") -Raw

if ($idx -match "nav-bar") { $out += "OK: Dashboard nav" } else { $out += "FAIL: Dashboard nav" }
if ($idx -match "quiz/path1.html") { $out += "OK: Quiz link" } else { $out += "FAIL: Quiz link" }
if ($idx -match "flashcards/path1.html") { $out += "OK: Flashcards link" } else { $out += "FAIL: Flashcards link" }
if ($qz -match "quiz-container") { $out += "OK: Quiz container" } else { $out += "FAIL: Quiz container" }
if ($qz -match "quiz.js") { $out += "OK: Quiz JS ref" } else { $out += "FAIL: Quiz JS ref" }
if ($fl -match "flashcard") { $out += "OK: Flashcard element" } else { $out += "FAIL: Flashcard element" }
if ($fl -match "flashcards.js") { $out += "OK: Flashcards JS ref" } else { $out += "FAIL: Flashcards JS ref" }

# No CDN
if ($idx -notmatch "cdn\.") { $out += "OK: No CDN dashboard" } else { $out += "WARN: CDN in dashboard" }
if ($qz -notmatch "cdn\.") { $out += "OK: No CDN quiz" } else { $out += "WARN: CDN in quiz" }
if ($fl -notmatch "cdn\.") { $out += "OK: No CDN flashcards" } else { $out += "WARN: CDN in flashcards" }

$out += "DONE"
$out | Out-File -FilePath (Join-Path $root "scratch\test-output.txt") -Encoding UTF8
