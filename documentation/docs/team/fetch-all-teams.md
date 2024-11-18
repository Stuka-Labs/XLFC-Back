# fetchAllTeamsApp - Fetch All Teams

This API endpoint allows users to retrieve a list of all active teams. If a `searchQuery` is provided, the endpoint will return teams whose names match the search query. If no query is provided, all active teams will be returned.

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Description**: Retrieves a list of active teams. Optionally, filters the teams by name based on a search query.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates the request and attaches user credentials to `req`.

## Authorization

- Only authenticated users are allowed to access this endpoint. Unauthorized users will receive a 403 error.

## Request

### Headers

- **Authorization**: Bearer token with a valid token.

### Query Parameters

- `searchQuery` (string, optional): A string to search for in the names of the teams. If not provided, all active teams are returned.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Fetched All Teams Successfully.",
    "data": [
        {
            "id": "team123",
            "name": "Team A",
            "coachRef": "coach123",
            "description": "Team A Description",
            "active": true
        },
        {
            "id": "team124",
            "name": "Team B",
            "coachRef": "coach124",
            "description": "Team B Description",
            "active": true
        }
    ]
  }
  ```

### Error

#### 403 Forbidden: User is not authenticated.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 500 Internal Server Error: An error occurred while fetching the teams.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable To Fetch All Teams."
  }
  ```


### Example Request

```http
GET /?searchQuery=Team HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
