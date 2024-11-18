# becomePlayerApp - Become a Player

This API endpoint allows an authenticated user to become a player. If the user is already a player, an error is returned. If successful, the user’s role is updated to `player` and they are added to the players collection.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Updates the user’s role to "player" and adds them to the players collection. This endpoint ensures the user is not already a player before making the change.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Accessible only by authenticated users. The user’s role must be verified to ensure they are not already a player.

## Request Body

- **None**: The request body is empty, but the user’s `uid` is derived from the authenticated session.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "User Became A Player Successfully.",
    "data": null
  }


### Error

#### 400 Bad Request: When the user is already a player.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: User Already Player."
  }
  ```

#### 403 Forbidden: When the user is not authenticated.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 500 Internal Server Error: When an error occurs during the process of making the user a player.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Become Player Request Failed."
  }
  ```

### Example Request

```http
POST /become-player HTTP/1.1
Content-Type: application/json
Authorization: Bearer <user_token>

