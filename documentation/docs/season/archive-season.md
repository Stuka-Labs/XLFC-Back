# archiveSeasonApp - Archive an Active Season

This API endpoint allows an admin or super admin to archive the most recent active season. It ensures that only one active season can be archived at a time.

## Endpoint

- **Path**: `/`
- **Method**: `DELETE`
- **Description**: Archives the latest active season, marking it as completed.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates the request and attaches user credentials to `req`.

## Authorization

- Only authenticated users with admin or super admin privileges can access this endpoint. If the user is unauthorized, a 403 error is returned.

## Request

### Headers

- **Authorization**: Bearer token with a valid token.

### Body Parameters

- No body parameters are required for this request.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Season Archived Successfully."
  }
  ```

### Error

#### 403 Forbidden: User is not authenticated as an admin or super admin.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 400 Bad Request: No active season to archive.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: No Active Season."
  }
  ```

#### 500 Internal Server Error: An error occurred while archiving the season.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable to archive season"
  }
  ```


### Example Request

```http
DELETE / HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
