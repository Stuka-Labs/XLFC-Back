# assignPlayerTeamApp - Assign Player to a Team

This API endpoint allows an authenticated player to be assigned to a team. The endpoint verifies the existence of the team and ensures that the player is not already assigned to a team.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Assigns a player to a specified team by updating the `players` collection in the database.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates the request and attaches user credentials to `req`.

## Authorization

- The request must be made by an authenticated player. If not, a 403 error is returned.

## Request

### Headers

- **Authorization**: Bearer token with a valid token.

### Body Parameters

- **teamId** (string, required): The ID of the team to which the player will be assigned.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Player Assigned To Team Successfully.",
  }
  ```

### Error

#### 403 Forbidden: User is not authenticated as a player.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 400 Bad Request: The specified team does not exist.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Team Doesn't Exist."
  }
  ```

- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Player Already On Team."
  }
  ```

#### 500 Internal Server Error: An unexpected error occurred while assigning the player to the team.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable to assign provided player to provided team"
  }
  ```

### Example Request

```http
POST / HTTP/1.1
Content-Type: application/json

{
  "teamId": "team123"
}
```
