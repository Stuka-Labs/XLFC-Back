# deleteCoachTeamApp - Remove Coach from Team

This API endpoint allows an admin or super admin to remove a coach from a specified team, given that both the coach and the team exist and that the coach is currently assigned to the team. Only accessible to admins and super admins.

## Endpoint

- **Path**: `/`
- **Method**: `DELETE`
- **Description**: Removes a coach from a team after verifying that the coach and team exist and that the coach is assigned to the team.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Accessible only to users with admin or super admin privileges.

## Request Body

- `coachUid` (string, required): The unique user ID of the coach to be removed from the team.
- `teamUid` (string, required): The unique user ID of the team from which the coach will be removed.

## Response

### Success

- **Status Code**: 204
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 204,
    "message": "Coach Deleted From Team Successfully.",
    "data": null
  }


### Error

#### 403 Forbidden: When the user does not have the required admin or super admin privileges.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 400 Bad Request: When the team or coach does not exist, or the coach is not assigned to the specified team.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Coach Doesn't Exist."
  }
  ```

- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Team Doesn't Exist."
  }
  ```

- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Coach is not on the provided team."
  }
  ```

#### 500 Internal Server Error: When an unexpected error occurs during the coach removal process.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Failed to delete coach from team"
  }
  ```

### Example Request

```http
POST / HTTP/1.1
Content-Type: application/json

{
  "coachUid": "coach123",
  "teamUid": "team456"
}
```

- **Response Body**:
  ```json
  {
    "statusCode": "204",
    "message": "Coach successfully removed from the team",
    "data": null
  }
  ```



