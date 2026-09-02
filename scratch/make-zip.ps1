$src = "c:\Users\Arvind\Downloads\SC900-Path1-GitHub"
$dst = "c:\Users\Arvind\Downloads\SC900-Path1-StudyHub.zip"

if (Test-Path $dst) { Remove-Item $dst -Force }

$items = @(
    "$src\index.html",
    "$src\README.md",
    "$src\css",
    "$src\js",
    "$src\data",
    "$src\quiz",
    "$src\flashcards"
)

Compress-Archive -Path $items -DestinationPath $dst -Force
Write-Output "DONE: $dst"
