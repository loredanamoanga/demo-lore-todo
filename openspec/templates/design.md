## Context

## Decisions

## API
### `/v1/<endpoint>`
```yaml
openapi: 3.0.3
paths:
  /v1/<endpoint>:
    get:
      responses:
        "200":
          description: OK
```

### Example request
```http
GET /v1/<endpoint> HTTP/1.1
Host: example.local
```

### Example response
```http
HTTP/1.1 200 OK
Content-Type: application/json

{}
```
