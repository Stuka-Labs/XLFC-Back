# fetchWeighInDataForGivenTeamApp - Fetch Weigh-In Data for a Given Team

This API endpoint allows an authenticated user to fetch weigh-in data for all players on a specified team.

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Query Parameter**: `teamId` (string) - The ID of the team for which to fetch weigh-in data.
- **Description**: Retrieves weigh-in data for all players in the specified team, including their points and weight change details.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request.

## Authorization

- Accessible by authenticated users. The endpoint verifies user credentials to allow access.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Fetched All Weigh In Data For Coaches Teams Successfully.",
    "data": [
      {
        "playerId": "player123",
        "teamId": "team456",
        "standardPoints": 120,
        "bonusPoints": 15,
        "weighInData": [
          {
            "id": "record1",
            "playerId": "player123",
            "seasonId": "season2024",
            "month": "04",
            "week": "12",
            "weight": 80.0,
            "dailyFoodDiaryComplete": false,
            "weeklyStepsCompleted": true,
            "parkRunParticipationCompleted": true,
            "timestamp": "2024-04-15T15:00:00Z",
            "streakType": "gain",
            "streakLength": 3
          }
        ],
        "weightChange": -1.2
      }
    ]
  }
  ```

### Error

#### 400 Bad Request: When the given teamId does not exist.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Team Doesn't Exist."
  }
  ```

#### 403 Forbidden: When the user is not authorized to access the endpoint.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 500 Internal Server Error: When an unexpected error occurs while fetching weigh-in data for the team.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable To Fetch Weigh In Data For Given Team."
  }
  ```

### Example Request

```http
POST /fetch-weigh-in-data-for-given-team?teamId=team456 HTTP/1.1
Content-Type: application/json
Authorization: Bearer <user_token>
```
