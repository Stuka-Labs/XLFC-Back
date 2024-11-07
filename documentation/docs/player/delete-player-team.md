# deletePlayerTeamApp - Remove Player from a Team

This API endpoint allows an admin to remove a player from an assigned team. The endpoint verifies the existence of the player and the team before performing the operation.

## Endpoint

- **Path**: `/`
- **Method**: `DELETE`
- **Description**: Removes a player from their team by updating the `teamId` field in the `players` collection in the database.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates the request and attaches user credentials to `req`.

## Authorization

- The request must be made by an authenticated admin. If not, a 403 error is returned.

## Request

### Headers

- **Authorization**: Bearer token with a valid token.

### Body Parameters

- **teamId** (string, required): The ID of the team the player is being removed from.
- **playerId** (string, required): The ID of the player being removed from the team.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Player Removed From Team Successfully."
  }
  ```

### Error

#### 403 Forbidden: User is not authenticated as an admin.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied For Delete Player Team Service."
  }
  ```

- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Error Occurred: Team Doesn't Exist."
  }
  ```

- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Error Occurred: Player Doesn't Exist."
  }
  ```

#### 500 Internal Server Error: An unexpected error occurred while removing the player from the team.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "An error occurred while trying to remove the player from the team."
  }
  ```


### Example Request

```http
POST / HTTP/1.1
Content-Type: application/json

{
  "teamId": "team123",
  "playerId": "player456"
}
```


