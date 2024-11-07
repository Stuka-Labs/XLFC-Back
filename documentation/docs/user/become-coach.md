# becomeCoachApp - Become a Coach

This API endpoint allows an authenticated user to request to become a coach. If a request already exists for the user, an error is returned. If the request is successful, the user's request is stored in the database for review.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Allows an authenticated user to request to become a coach. The request is added to the "becomeCoachRequests" collection in the database for future review and approval.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Accessible only by authenticated users. The user’s role must be verified to ensure they are a valid user.

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
    "message": "Submitted Become Coach Request Successfully.",
    "data": null
  }

### Error

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

#### 400 Bad Request: When the user has already submitted a request to become a coach.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Become Coach Request Already Exists."
  }
  ```

#### 500 Internal Server Error: When an error occurs while processing the request.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Become Coach Request Failed."
  }
  ```

### Example Request

```http
POST /become-coach HTTP/1.1
Content-Type: application/json
Authorization: Bearer <user_token>

