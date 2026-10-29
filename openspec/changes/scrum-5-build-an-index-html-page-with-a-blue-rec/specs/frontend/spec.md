## ADDED Requirements
### Requirement: Root entry page
The frontend SHALL provide a root `index.html` page as the browser entrypoint.

#### Scenario: Load the page
- **GIVEN** the frontend root page is requested
- **WHEN** the browser renders `index.html`
- **THEN** the page loads successfully as the entrypoint

### Requirement: Blue rectangle display
The frontend SHALL render exactly one blue rectangle sized `300px` by `300px`.

#### Scenario: Show the rectangle
- **GIVEN** the root page is loaded
- **WHEN** the browser renders the page
- **THEN** exactly one blue `300px` by `300px` rectangle is visible

### Requirement: Empty page content
The frontend SHALL keep the page otherwise empty with no text, controls, navigation, labels, buttons, inputs, menus, or explanatory text.

#### Scenario: No extra visible content
- **GIVEN** the page is loaded
- **WHEN** the browser inspects the rendered content
- **THEN** no text, controls, navigation, labels, buttons, inputs, menus, or explanatory text appear

### Requirement: Plain HTML and CSS only
The frontend SHALL implement the page using plain HTML and CSS only.

#### Scenario: Inspect the implementation
- **GIVEN** the rectangle is present
- **WHEN** the implementation is inspected
- **THEN** it uses plain HTML and CSS only
