# deleteTeamApp - Delete a Team

This API endpoint allows an admin to "delete" a team by marking it as inactive in the database. The team is not physically removed but is set to inactive. This action requires admin privileges.

## Endpoint

- **Path**: `/`
- **Method**: `DELETE`
- **Description**: Marks a team as inactive by setting its `active` field to `false`.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates the request and attaches user credentials to `req`.

## Authorization

- Only authenticated users with admin privileges can access this endpoint. If the user is unauthorized, a 403 error is returned.

## Request

### Headers

- **Authorization**: Bearer token with a valid token.

### Body Parameters

- `teamUid` (string): The UID of the team to be deleted.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Team created successfully"
  }
  ```

### Error

#### 403 Forbidden: User is not authenticated as an admin.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied For Delete Team Service"
  }
  ```

### Error

#### 404 Forbidden: The team with the provided UID does not exist.

- **Status Code**: 404
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 404,
    "message": "Unable to locate team with id <teamUid>"
  }
  ```

#### 500 Internal Server Error: An error occurred during the deletion process.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Could not Create Team."
  }
  ```

  ### Example Request

```http
DELETE / HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "teamUid": "team123"
}
```
