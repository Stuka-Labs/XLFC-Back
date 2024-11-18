# respondBecomeCoachRequestApp - Respond to "Become a Coach" Requests

This API endpoint allows admin or super-admin users to respond to "become a coach" requests. They can either approve or reject the request, and it marks the request as reviewed.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Approves or rejects a "become a coach" request based on the provided request ID and approval status.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Accessible only to users verified as **admin** or **super-admin**.

## Request

### Body Parameters

- **`requestId`** (string, required): The unique identifier of the "become a coach" request.
- **`approved`** (boolean, required): The approval status (`true` for approval, `false` for rejection).

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
    "message": "Responded To Become Coach Request Successfully.",
  }
  ```

### Error

#### 403 Forbidden: User not authorized as an admin or super-admin.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 400 Bad Request: Missing or invalid requestId or approved flag.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Invalid request ID or approved flag"
  }
  ```

#### 404 Not Found: The provided requestId does not exist.

- **Status Code**: 404
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 404,
    "message": "Error Occurred: Failed To Fetch Become Coach Requests"
  }
  ```

#### 500 Internal Server Error: An unexpected error occurred.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable to respond to become coach request"
  }
  ```

### Example Request

```http
POST / HTTP/1.1
Content-Type: application/json

{
  "requestId": "abc123",
  "approved": true
}
```


