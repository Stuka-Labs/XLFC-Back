# FetchCoachTeamsApp - Retrieve Teams for a Coach

This API endpoint retrieves a list of active teams that a given coach is associated with. The endpoint ensures the user is a coach and returns relevant team data.

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Description**: Fetches all active teams for which the authenticated coach is responsible.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Accessible only to users who are verified as coaches.

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
    "message": "Retrieved Teams Assigned Under Coach Successfully.",
    "data": [
      {
        "id": "team123",
        "name": "Team Alpha",
        "active": true,
        "coach": "coach123",
        ...
      },
      {
        "id": "team456",
        "name": "Team Beta",
        "active": true,
        "coach": "coach123",
        ...
      }
    ]
  }

### Error

#### 403 Forbidden: When the user is not authorized as a coach.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

  #### 404 Not Found: When no teams are found for the coach.

- **Status Code**: 404
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 404,
    "message": "Error Occurred: No Teams Found For Coach"
  }
  ```

#### 500 Internal Server Error: When an unexpected error occurs while fetching teams.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Failed To Fetch Teams Assigned To Coach."
  }
  ```

  ### Example Request

```http
POST / HTTP/1.1
Content-Type: application/json


