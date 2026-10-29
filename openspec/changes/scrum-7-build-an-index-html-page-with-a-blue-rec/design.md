## Context
The repository has no implemented application yet, and this change defines only the browser entry page. The page must be a plain static `index.html` at the repository root and must not introduce any HTTP API.

## Decisions
- Use a single root `index.html` file as the browser entry point.
- Use only plain HTML and CSS to render the required rectangle.
- Keep the page empty aside from the visible blue square.
- Do not add any API routes, data fetching, or interactive controls.

## API
This change introduces no HTTP API.

```yaml
openapi: 3.0.0
info:
  title: Static Entry Page API
  version: 1.0.0
paths: {}
```

Example request:
```http
GET /v1/index.html
```

Example response:
```http
HTTP/1.1 200 OK
Content-Type: text/html
```
