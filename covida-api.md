# Covida API

The base part of the URI path for the groups covida is `/covida`.

The media type used in all requests and responses that have content on body is `applicaton/json`.

The following sections describe each covida resource.

---

## Check the api

```http
GET /
```

```curl
curl http://localhost:8000/covida/
```

- Request:
  - Body: none
- Response:
  - Success:
    - Status code: 200
    - Body example:

    ```json
      {
          "name": "covida api",
          "version": "1.0.0",
          "description": "PI covida api running"
      }
      ```

---

## Obtain all groups

```http
GET /groups/
```

```curl
curl http://localhost:8000/covida/groups
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
          }
        ]
      }
    ```

---

## Obtain a specific group

```http
GET /groups/{id}
```

```curl
curl http://localhost:8000/covida/groups/1
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
    - 404 (see Common Error Handling section)

---

## Create a group

```http
POST /groups
```

```curl
curl http://localhost:8000/covida/groups        \
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
    - Errors:
    - 400 (see Common Error Handling section)
  
---

## Edit a group

```http
PUT /groups/{id}
```

```curl
curl http://localhost:8000/covida/groups/2      \
    -X PUT                                      \
    -H 'Content-type: application/json'         \
    -d '{                                       \
      "name": "group11",                        \
      "description": "description of group 11", \
      "foo": 123234                             \
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
        "uri": "/covida/groups/2"
      }
    ```

  - Errors:
    - 400 and 404 (see Common Error Handling section)
  
---
## Add a game to a group

```http
PUT /groups/{id}/games/{gameId}
```

```curl
curl http://localhost:8000/covida/groups/2     \
    -X PUT                                     \

```

- Request:
  - Path parameters:
    - id - The group identifier
    - gameId - The game identifier
  - Body: none


- Response:
  - Success:
    - Status code: 200
    - Content-Type: application/json
    - Body example:
 
    ```json
      {
        "status" : "Game with id 1 added in group with id 2",
        "uri": "/covida/groups/2/games"
      }
    ```

  - Errors:
    - 400 and 404 (see Common Error Handling section)
  
---
## Remove a game from a group

```http
DELETE /groups/{id}/games/{gameId}
```

```curl
curl http://localhost:8000/covida/groups/2      \
    -X DELETE                                   \
```

- Request:
  - Path parameters:
    - id - The group identifier
    - gameId - The game identifier
  - Body: none

- Response:
  - Success:
    - Status code: 200
    - Content-Type: application/json
    - Body example:
 
    ```json
      {
        "status" : "Game with id 1 removed in group with id 2",
        "uri": "/covida/groups/2/games"
      }
    ```

  - Errors:
    - 400 and 404 (see Common Error Handling section)
  
---
## Obtain the games that have a total_rating between two values of a group 

```http
GET /groups/{id}/{min}/{max}
```

```curl
curl http://localhost:8000/covida/groups/70/90  
```


- Request:
  - Path parameters:
    - id - The groups identifier
    - min - minimum value of total_rating
    - max - maximum value of total_rating
  - Body: none
- Response:
  - Success:
    - Status code: 200
    - Body:

    ```json
        [
          {
            "id" : 1,
            "name": "first game",
            "total_rating" : 80,
            "summary":"Summary of the first game",
          },
          {
            "id" : 2,
            "name": "Second game",
            "total_rating" : 75,
            "summary": "Summary of the second game",
          }
        ]
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
        "error": "The respective error message"
      }
  ```

### 404 - Not found

Every time the request contains a URI for a resource not managed by the covida, the response has a 404 status code with the following sample body.

- Body:

  ```json
      {
        "error": "Resource not found",
      }

### 500 - Internal Server Error

Every time for some reason the operation isnt successful, but all user input are correct we admit that occured an internal error, in that cases the response has a 500 status code with the following sample body.

- Body:

  ```json
      {
        "error": "Something went wrong",
      }