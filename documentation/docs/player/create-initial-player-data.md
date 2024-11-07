# SavePlayerInitialDataApp - Create Initial Player Data

This API endpoint allows authenticated players to submit their initial player data, including start weight, height, and BMI.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Saves the initial data of a player (e.g., start weight, height, BMI) if the data has not been set before.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates the request and attaches user credentials to `req`.

## Authorization

- The request must be made by an authenticated player. If the user is not authenticated as a player, a 403 error is returned.

## Request

### Headers

- **Authorization**: Bearer token with a valid token.

### Body Parameters

- **startWeight** (number, required): The starting weight of the player.
- **height** (number, required): The height of the player.
- **startBmi** (number, required): The starting BMI of the player.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Initial Player Data Created Successfully.",
    "data": null
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

#### 409 Bad Request: Initial player data has already been set.

- **Status Code**: 409
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 409,
    "message": "Error Occured: Player initial data has already been set."
  }
  ```

#### 500 Internal Server Error: An unexpected error occurred while saving the player data.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occured: Could not submit initial player data."
  }
  ```


### Example Request

```http
POST / HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "startWeight": 75,
  "height": 170,
  "startBmi": 25.95
}
```