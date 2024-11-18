# deleteCoachApp

This API endpoint allows an admin or super admin to delete a coach user from the system. It ensures that the coach exists before deletion and removes their associated data from Firestore. Only accessible to admins and super admins.

## Endpoint

- **Path**: `/`
- **Method**: `DELETE`
- **Description**: Deletes a coach user by removing their record from Firestore and clearing their custom claims.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Accessible only by users with admin or super admin privileges, verified via `authIsAdmin` or `authIsSuperAdmin`.

## Request Body

- `coachUid` (string, required): The unique user ID of the coach to be deleted.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Coach Deleted Successfully.",
    "data": {
      "coachUid": "uniqueCoachId123"
    }
  }


### Error

#### 403 Forbidden: When the user does not have super admin privileges.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized."
  }


#### 400 Bad Request: When the coach does not exist or there is an error during the deletion process.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Failed to delete coach."
  }
  ```

#### 500 Internal Server Error: When an unexpected error occurs during the deletion process.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Failed to delete coach."
  }
  ```

  ### Example Request

```http
POST / HTTP/1.1
Content-Type: application/json

{
  "coachUid": "uniqueCoachId123"
}
```