# deletePlayerApp - Delete a Player

This API endpoint allows an admin to delete a player from the database. The endpoint checks if the player exists before proceeding with the deletion.

## Endpoint

- **Path**: `/`
- **Method**: `DELETE`
- **Description**: Deletes a player document from the `players` collection in the database.

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

- **playerId** (string, required): The ID of the player to be deleted.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Player Deleted Successfully",
  }
  ```

### Error

#### 403 Forbidden: The specified player does not exist.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Could not find player with given id: player123"
  }
  ```

#### 500 Internal Server Error: An unexpected error occurred while deleting the player.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Could not delete player"
  }
  ```

### Example Request

```http
DELETE / HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "playerId": "player123"
}
