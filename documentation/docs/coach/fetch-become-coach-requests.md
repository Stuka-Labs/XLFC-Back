# fetchBecomeCoachRequestsApp - Retrieve Pending Become-Coach Requests

This API endpoint retrieves all pending "become a coach" requests that have not yet been reviewed. The endpoint is restricted to use by admin or super-admin users.

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Description**: Fetches all unreviewed "become a coach" requests.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Accessible only to users verified as **admin** or **super-admin**.

## Request Parameters

- **Headers**: Authorization header with a valid token.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Retrieved Become Coach Requests Successfully.",
    "data": [
      {
        "id": "request123",
        "userId": "user456",
        "reviewed": false,
        "additionalInfo": "Request details..."
      },
      {
        "id": "request789",
        "userId": "user101",
        "reviewed": false,
        "additionalInfo": "Request details..."
      }
    ]
  }

### Error

#### 403 Forbidden: When the user is not authorized as an admin or super-admin.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 500 Internal Server Error: When an unexpected error occurs while fetching requests.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Failed To Fetch Become Coach Requests"
  }
  ```

### Example Request

```http
POST / HTTP/1.1
Content-Type: application/json


