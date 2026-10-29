## Why
SCRUM-7 needs the browser entry page to exist at the repository root so the app opens to the approved start screen.

## What Changes
- Add a root `index.html` page.
- Render exactly one visible blue `300px` by `300px` rectangle.
- Use plain HTML and CSS only, with no HTTP API.

## Impact
- The repository gains its browser entry page.
- The start page becomes a single, minimal visual surface with no additional UI.
- No backend or API surface is introduced.
