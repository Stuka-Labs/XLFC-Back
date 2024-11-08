# createAdminApp - Is-Admin

This API endpoint checks if logged in user is admin or not

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Description**: Checks if logged in user is admin or not

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Only accessible if user is logged in.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Retrieved Whether User Is Admin Successfully.",
    "data": true
  }
  ```

### Error

#### 403 Unauthorized: When the user does is not logged in.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 500 Forbidden: Unable to determine whether user is admin or not.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable to determine whether user is admin or not."
  }
  ```

### Example Request

```http
GET / HTTP/1.1
```
