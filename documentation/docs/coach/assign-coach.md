# assignCoachApp 

This API endpoint allows an admin or super admin to assign a coach role to a user by setting custom claims and storing their details in the database. Only accessible to admins and super admins.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Assigns a coach role to a user by setting Firebase custom claims and saving the coach's record in Firestore.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Accessible only by users with admin or super admin privileges, verified via authIsAdmin or authIsSuperAdmin.


## Request Body

- `userUid` (string, required): The unique user ID of the user to be assigned the coach role.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "User Assigned Coach Successfully",
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
    "message": "Access Denied: Unauthorized"
  }
  ```

  #### 400 Bad Request: When userUid is missing or if the user is already a coach.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "userUid Provided Failed Validation"
  }
  ```

  #### 500 Internal Server Error:When coach assignment fails due to an unexpected server error.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable to assign provided user as coach."
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