## ADDED Requirements
### Requirement: Root entry page
The repository SHALL provide a root `index.html` browser entry page.

#### Scenario: Page exists at the root
- **GIVEN** the repository is checked out
- **WHEN** the browser opens the repository root entry page
- **THEN** the page is served from `index.html` at the repository root

### Requirement: Blue rectangle rendering
The root `index.html` SHALL render exactly one visible blue `300px` by `300px` rectangle and nothing else.

#### Scenario: Single blue rectangle is visible
- **GIVEN** the page is opened in a browser
- **WHEN** the page loads
- **THEN** exactly one visible blue `300px` by `300px` rectangle appears
- **AND** no other visible content appears

### Requirement: No extra UI
The root `index.html` SHALL not display any other visible text, controls, navigation, labels, buttons, inputs, menus, or explanatory content.

#### Scenario: No additional interface elements appear
- **GIVEN** the page is opened in a browser
- **WHEN** the page loads
- **THEN** no visible text, controls, navigation, labels, buttons, inputs, menus, or explanatory content appear

### Requirement: Plain HTML and CSS only
The implementation SHALL use plain HTML and CSS only and SHALL introduce no HTTP API.

#### Scenario: Source contains only static markup and styles
- **GIVEN** the source is inspected
- **WHEN** the implementation is reviewed
- **THEN** it uses plain HTML and CSS only
- **AND** it introduces no HTTP API
