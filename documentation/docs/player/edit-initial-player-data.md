# EditPlayerInitialDataApp - Edit Initial Player Data

This API endpoint allows authenticated players to edit their initial data, such as start weight, height, and BMI.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Updates the initial player data (e.g., start weight, height, BMI) for an authenticated player.

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

- **startWeight** (number, required): The updated starting weight of the player.
- **height** (number, required): The updated height of the player.
- **startBmi** (number, required): The updated starting BMI of the player.

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "message": "Player Initial Data Updated Successfully",
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
    "message": "Access Denied For Edit Player Initial Data Service"
  }
  ```

#### 500 Internal Server Error: An unexpected error occurred while updating the player data.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Could not Update initial player data."
  }
  ```

### Example Request

```http
POST / HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "startWeight": 78,
  "height": 172,
  "startBmi": 26.38
}
