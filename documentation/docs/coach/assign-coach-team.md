# assignCoachTeamApp - Assign Coach to a Team

This API endpoint allows an admin, super admin, or coach to assign a coach to a specific team. It checks if the coach and team exist and if the coach is not already assigned to the team. Only accessible to coaches (for their own team), admins, and super admins.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Assigns a coach to a team after verifying if the coach and team exist and ensuring the coach isn't already assigned to the team.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Accessible to:
  - Coaches (can assign themselves to teams)
  - Admins (can assign any coach to a team)
  - Super admins (can assign any coach to a team)

## Request Body

- `coachUid` (string, optional): The unique user ID of the coach to be assigned to the team. Required for admins and super admins.
- `teamUid` (string, required): The unique user ID of the team to which the coach will be assigned.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Coach Assign To Team Successfully.",
    "data": {
      "coachUid": "coachUid",
      "teamUid": "teamUid"
    }
  }

### Error

#### 403 Forbidden: When the user does not have the required privileges (not a coach, admin, or super admin).

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 400 Bad Request: When the team or coach does not exist, or the coach is already assigned to the team.

- **Status Code**: 400
- **Response Format**: JSON
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
    "message": "Error Occurred: Coach Doesn't Exist."
  }
  ```

- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Coach Already On Team."
  }
  ```

#### 500 Internal Server Error: When an unexpected error occurs during the coach-team assignment process.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable to assign coach to team."
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
    "statusCode": 200,
    "message": "Coach assigned to team successfully",
    "data": {
      "coachUid": "coach123",
      "teamUid": "team456"
    }
  }

  


