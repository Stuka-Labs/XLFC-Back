# fetchAllPlayersOnTeamApp - Fetch All Players on a Team

This API endpoint allows users to retrieve all players associated with a specific team. The endpoint requires the `teamId` query parameter to identify the team for which players should be fetched.

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Description**: Retrieves a list of all players associated with a specific team.

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

- `teamId` (string, required): The unique identifier for the team whose associated players should be fetched.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Fetched All Players On Team Successfully.",
    "data": [
    {
      "id": "player123",
      "name": "Player A",
      "email": "playerA@example.com",
      "teamId": "team123"
    },
    {
      "id": "player124",
      "name": "Player B",
      "email": "playerB@example.com",
      "teamId": "team123"
    }
  ]
  }
  ```

  ### Error

#### 400 Bad Request: Team Does Not Exist

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Team Doesn't Exist."
  }
  ```

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

#### 500 Internal Server Error: An error occurred while fetching players.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable To Fetch All Players On Team."
  }
  ```

### Example Request

```http
GET /?teamId=team123 HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
