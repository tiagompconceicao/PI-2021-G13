# groups tracker (IT)

The base part of the URI path for the groups API is `/covida`.

The media type used in all requests and responses that have content on body is `applicaton/json`.

The following sections describe each API resource.

---

## Check the API

```http
GET /
```

```curl
curl http://localhost:1904/api/
```

- Request:
  - Body: none
- Response:
  - Success:
    - Status code: 200
    - Body example:

    ```json
      {
          "name": "groups api",
          "version": "1.0.0",
          "description": "PI groups API running"
      }
      ```

---

## Obtain all groups

```http
GET /groups/
```

```curl
curl http://localhost:1904/covida/groups
```


- Request:
  - Body: none
- Response:
  - Success:
    - Status code: 200
    - Body example:

    ```json
      {
        "groups": [
          {
            "id": 1,
            "name": "group1",
            "description": "description of group 1",
            "games" : [
                
            ]
          },
          {
            "id": 2,
            "name": "group2",
            "description": "description of group 2",
            "games" : [
                
            ]
          },
          ...
        ]
      }
    ```

---

## Obtain a specific group

```http
GET /groups/{id}
```

```curl
curl http://localhost:1904/api/groups/1
```


- Request:
  - Path parameters:
    - id - The groups identifier
  - Body: none
- Response:
  - Success:
    - Status code: 200
    - Body:

    ```json
        {
          "id": 1,
          "name": "group1",
          "description": "description of group 1",
          "games" : [

          ]
        }
    ```

  - Errors:
    - 400 and 404 (see Common Error Handling section)

---

## Create a group

```http
POST /groups
```

```curl
curl http://localhost:1904/covida/groups        \
  -X POST                                   \
  -H 'Content-type: application/json'       \
  -d '{                                     \
    "name": "group1",                        \
    "description": "description of group 1"  \
  }'  
```

- Request:
  - Body:
```json
  {
    "name": "group1",
    "description": "description of group 1"
  },  

```

- Response:
  - Success:
    - Status code: 200
    - Headers:
      - Location: `/covida/groups/2`
    - Content-Type: application/json
    - Body example:
 
    ```json
      {
        "status" : "group with id 3 created",
        "uri": "/covida/groups/3"
      }
    ```
  
---

## Update a groups

```http
PUT /groups/{id}
```

```curl
curl http://localhost:1904/api/groups/2         \
    -X PUT                                     \
    -H 'Content-type: application/json'        \
    -d '{                                      \
      "name": "group11",                        \
      "description": "description of group 11",\
      "foo": 123234                            \
    }'  
```

- Request:
  - Path parameters:
    - id - The group identifier
  - Body:

```json
  {
    "name": "group11",
    "description": "description of group 11"
  },  

```

- Response:
  - Success:
    - Status code: 200
    - Content-Type: application/json
    - Body example:
 
    ```json
      {
        "status" : "group wit id 2 updated",
        "uri": "/api/groups/2"
      }
    ```

  - Errors:
    - 400 and 404 (see Common Error Handling section)
  
---

## Delete a groups

```http
DELETE /groups/{id}
```

```curl
curl -X DELETE http://localhost:1904/covida/groups/1
```

- Request:
  - Path parameters:
    - id - The groups identifier
  - Content-Type: application/json
  - Body: none

- Response:
  - Success:
    - Status code: 200
    - Content-Type: application/json
    - Body example:
 
    ```json
      {
        "status" : "groups with id 2 deleted",
        "uri": "/api/groups/2"
      }
    ```

  - Errors:
    - 404 (see Common Error Handling section)
  
---

## Associate a groups with a group of groups

```http
PUT /groups/:id/:book-id
```

- Request:
  - Path parameters:
    - id - The groups identifier
    - book-id - The book identifier
  - Content-Type: application/json
  - Body: none

- Response:
  - Success:
    - Status code: 200
    - Content-Type: application/json
    - Body example:
 
    ```json
      {
        "status" : "Book associated with a groups deleted",
        "uri": `/api/groups/2`
      }
    ```

  - Errors:
    - 404 (see Common Error Handling section)
  
---

## Common Error Handling

This section describes the error handling that is done in every endpoint that produces these erros. This is presented in a separate section to avoid repeating these descriptions wherever it applies.

Every error response has an `application/json` body with the content described for each error.

### 400 - Bad request

Every time the request contains a URI with and invalid QueryString or a Body with invalid Json content for that specific request, the response has a 400 status code with the following sample body:

- Body:

  ```json
      {
        "error": "The request query string is invalid",
        "uri": "/b4/api/groups/?InvalidQueryString",
      }
  ```

### 404 - Not found

Every time the request contains a URI for a resource not managed by the API, the response has a 404 status code with the following sample body.

- Body:

  ```json
      {
        "error": "Resource not found",
        "uri": "/api/groups/notfoundgroups",
      }