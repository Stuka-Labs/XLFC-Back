# deleteUserApp - Delete User

This API endpoint allows the deletion of a user account. An authenticated user can delete their own account, or an admin can delete any user account. The endpoint removes the user from both the Firebase Authentication system and the Firestore database.

## Endpoint

- **Path**: `/`
- **Method**: `DELETE`
- **Description**: Deletes a user account from both Firebase Authentication and Firestore.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates the request and attaches user credentials to `req`.

## Request

### Request Body (JSON)

The body of the request must contain the following field if the requester is an admin:

```json
{
  "userUid": "USER_UID_TO_BE_DELETED"
}
```

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Successfully Deleted"
  }
  ```

### Error

#### 403 Forbidden: Access Denied for Unauthenticated User

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied. Unauthenticated"
  }
  ```

#### 500 Internal Server Error: Could Not Delete User

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Could not delete user"
  }
  ```

### Example Request

Admin Deletes User

```http
DELETE / HTTP/1.1
Content-Type: application/json

{
  "userUid": "USER_UID_TO_BE_DELETED"
}
```

Regular User Deletes Their Own Account

```http
DELETE / HTTP/1.1
Content-Type: application/json
