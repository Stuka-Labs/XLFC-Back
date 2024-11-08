# fetchWeighInDataForCoachTeamsApp - Fetch Weigh-In Data for Coach's Teams

This API endpoint allows an authenticated coach to fetch weigh-in data for all players on all teams that the coach manages.

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Description**: Retrieves weigh-in data for all players in teams managed by the authenticated coach, including their points and weight change details.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Only accessible by authenticated coaches. The endpoint verifies the user's role to confirm they are a coach with assigned teams.

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
        "standardPoints": 100,
        "bonusPoints": 20,
        "weighInData": [
          {
            "id": "record1",
            "playerId": "player123",
            "seasonId": "season2024",
            "month": "03",
            "week": "10",
            "weight": 75.5,
            "dailyFoodDiaryComplete": true,
            "weeklyStepsCompleted": true,
            "parkRunParticipationCompleted": false,
            "timestamp": "2024-03-10T14:00:00Z",
            "streakType": "loss",
            "streakLength": 5
          }
        ],
        "weightChange": 3.5
      }
    ]
  }
  ```

#### 400 Bad Request: When no teams are found for the authenticated coach.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: No Teams Found For Coach"
  }
  ```

#### 403 Forbidden: When the user is not a coach.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 500 Internal Server Error: When an unexpected error occurs while fetching weigh-in data.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable To Retrieve Weigh In Data For Coaches Teams."
  }
  ```

### Example Request

```http
GET /fetch-weigh-in-data-for-coach-teams HTTP/1.1
Content-Type: application/json
Authorization: Bearer <coach_token>
```

