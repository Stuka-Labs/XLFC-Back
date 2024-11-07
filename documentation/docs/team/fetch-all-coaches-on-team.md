# fetchAllCoachesOnTeamApp - Fetch All Coaches on a Team

This API endpoint allows users to retrieve all coaches associated with a specific team. The endpoint requires the `teamId` query parameter to identify the team for which coaches should be fetched.

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Description**: Retrieves a list of all coaches associated with a specific team.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates the request and attaches user credentials to `req`.

## Authorization

- Only authenticated users are allowed to access this endpoint. Unauthorized users will receive a 403 error.

## Request

### Headers

- **Authorization**: Bearer token with a valid token.

### Query Parameters

- `teamId` (string, required): The unique identifier for the team whose associated coaches should be fetched.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Fetched All Coaches On Team Successfully.",
    "data": [
        {
            "id": "coach123",
            "name": "Coach A",
            "email": "coachA@example.com",
            "teamIds": ["team123", "team124"]
        },
        {
            "id": "coach124",
            "name": "Coach B",
            "email": "coachB@example.com",
            "teamIds": ["team123"]
        }
    ]
  }
  ```

### Error

#### 400 Bad Request: Team Does Not Exist 

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Team Doesn't Exist."
  }
  ```

#### 500 Internal Server Error: An error occurred while fetching coaches.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable To Fetch All Coaches On Team."
  }
  ```

### Example Request

```http
GET /?teamId=team123 HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
