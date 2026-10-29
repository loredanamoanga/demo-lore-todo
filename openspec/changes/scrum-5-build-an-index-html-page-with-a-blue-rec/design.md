## Context
SCRUM-5 introduces the first visible frontend entry page for the demo. The scope is intentionally minimal: a root `index.html` that shows one blue rectangle and nothing else.

## Decisions
- Use a single root HTML entrypoint for the feature.
- Keep the page static and dependency-free so the result is plain HTML and CSS only.
- Render one `300px` by `300px` blue rectangle and leave positioning unconstrained.
- Exclude all other visible page content, including labels, controls, and navigation.

## API
No HTTP API is introduced by this change.

### OpenAPI fragment
```yaml
openapi: 3.0.3
info:
  title: Frontend Entry Page
  version: 1.0.0
paths: {}
```

### Example request
```http
GET /index.html HTTP/1.1
Host: example.local
```

### Example response
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<!doctype html>
<html>
  <head><meta charset="utf-8"><title></title></head>
  <body>
    <div></div>
  </body>
</html>
```
