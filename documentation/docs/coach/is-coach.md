# IsCoachApp - Determine If User Is a Coach

This API endpoint checks if the authenticated user has the coach role by verifying their custom claims. It returns `true` if the user is a coach, otherwise `false`. Accessible to all users who are authenticated.

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Description**: Determines whether the authenticated user is a coach by checking their custom claims in Firebase.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Accessible only by authenticated users, verified via `authIsUser`.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Retrieved Whether User Is Coach Successfully",
    "data": true | false
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

#### 500 Internal Server Error: When an unexpected error occurs while checking the user's coach status.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable to determine whether user is coach or not."
  }
  ```

### Example Request

```http
POST / HTTP/1.1
Content-Type: application/json


```

