# userInfoApp - Get User Information

This API endpoint allows users to retrieve their account information, including their associated user data and account type. The user is authenticated, and the account type is determined based on the user’s role.

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Description**: Retrieves the information of the authenticated user, including user data and account type.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates the request and attaches user credentials to `req`.

## Authorization

- The request must include a valid authentication token, and the user must be authorized to access their information.

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
    "message": "Retrieved User Info Successfully.",
    "userData": {
        "name": "John Doe",
        "email": "johndoe@example.com",
        "uid": "user123"
    },
    "accountType": "admin"
  }
  ```

### Error

#### 403 Forbidden: User is not authenticated.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied For User Type Service"
  }
  ```

#### 403 Forbidden: User is not authorized.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 500 Internal Server Error: An error occurred while fetching user information.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable to retrieve user info."
  }
  ```



### Example Request

```http
GET / HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
