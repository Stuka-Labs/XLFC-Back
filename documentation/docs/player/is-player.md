# IsPlayerApp - Check Player Status

This API endpoint is used to verify if the authenticated user is a player. It returns a boolean value indicating the user's player status.

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Description**: Checks if the authenticated user is recognized as a player in the system.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates the request and attaches user credentials to `req`.

## Authorization

- The request must be made by an authenticated user. If the user is not recognized, a 403 error is returned.

## Request

### Headers

- **Authorization**: Bearer token with a valid token.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Retrieved Whether User Is Player Successfully.",
    "data": true
  }
  ```

- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Retrieved Whether User Is Player Successfully.",
    "data": false
  }
  ```

### Error

#### 403 Forbidden: User is not authorized as a recognized user.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 500 Internal Server Error: An unexpected error occurred while processing the request.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable to determine whether user is player or not."
  }
  ```

### Example Request

```http
POST / HTTP/1.1
Content-Type: application/json