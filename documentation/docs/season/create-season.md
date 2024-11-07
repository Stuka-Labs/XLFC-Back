# createSeasonApp - Create a New Season

This API endpoint allows an admin or super admin to create a new season. It ensures that only one active season can be in progress at a time and increments the season number if necessary.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Creates a new season if there is no current season in progress.

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
    "message": "New Season Created Successfully.",
        "data": {
        "archived": false,
        "season": 1,
        "year": 2024
    }
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

#### 400 Bad Request: A season is already in progress.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Season Currently In Progress."
  }
  ```

#### 500 Internal Server Error: An error occurred while creating a new season.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable to create season."
  }
  ```


### Example Request

```http
POST / HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
