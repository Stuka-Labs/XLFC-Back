# createAdminApp - Create Admin User

This API endpoint allows a super admin to create a new admin user by setting custom claims and storing their details in the database. Only accessible to super admins.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Creates a new admin user by setting Firebase custom claims and saving the admin's record in Firestore.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Only accessible by users with super admin privileges, verified via `authIsSuperAdmin`.

## Request Body

- `userUid` (string, required): The unique user ID of the user to be granted admin privileges.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Admin created successfully",
    "data": "userUid"
  }
  ```

### Error

#### 403 Forbidden: When the user does not have super admin privileges.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied For Admin Creation Service"
  }
  ```

#### 400 Bad Request: When userUid is missing or if the user is already an admin.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "userUid Provided Failed Validation"
  }
  ```

#### 500 Internal Server Error: When admin creation fails due to an unexpected server error.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Admin Failed To Be Created Successfully"
  }
  ```

### Example Request

```http
POST / HTTP/1.1
Content-Type: application/json

{
  "userUid": "uniqueUserId123"
}
```
