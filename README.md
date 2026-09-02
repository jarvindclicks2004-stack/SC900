# SC-900 Path 1 Study Hub

A static study website for the **Microsoft SC-900: Security, Compliance, and Identity Fundamentals** certification exam, covering Learning Path 1.

## Structure

```
/
├── index.html                  # Dashboard / home page
├── quiz/
│   └── path1.html              # Interactive 25-question practice quiz
├── flashcards/
│   └── path1.html              # Interactive flashcards with flip, shuffle, keyboard shortcuts
├── css/
│   └── styles.css              # Main stylesheet
├── js/
│   ├── quiz.js                 # Quiz engine
│   └── flashcards.js           # Flashcards engine
├── data/
│   ├── path1-quiz.json         # Quiz questions data (25 questions)
│   ├── path1-flashcards.json   # Flashcards data (21 cards)
│   └── path1-flashcards.csv    # Original flashcards CSV source
└── README.md
```

## Features

- **Dashboard** — Overview of Path 1 with quick access to quiz and flashcards
- **Quiz** — 25 multiple-choice questions with scoring, explanations, progress tracking, and restart
- **Flashcards** — 21 flip cards with previous/next navigation, shuffle, restart, progress counter, and keyboard shortcuts

## Usage

This is a fully static website. To use it:

1. Serve the project root with any static file server, or
2. Deploy to any static hosting provider (Vercel, Netlify, GitHub Pages, etc.)

**Local development:**

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

Then open `http://localhost:8000` in your browser.

> **Note:** Due to `fetch()` calls for JSON data, the site must be served via HTTP — opening HTML files directly via `file://` will not work in most browsers.

## Obsidian Integration

To embed in Obsidian, use an iframe pointing to your deployed URL:

```html
<iframe src="https://your-deployed-url.vercel.app/" width="100%" height="800" style="border: none;"></iframe>
```

## Keyboard Shortcuts (Flashcards)

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Flip card |
| `←` | Previous card |
| `→` | Next card |
| `S` | Shuffle |
| `R` | Restart |

## Technical Details

- Pure HTML, CSS, and JavaScript — no frameworks or build tools
- Responsive design that works in iframe embeds
- All study content loaded from JSON data files
- No external dependencies, no authentication, no backend
