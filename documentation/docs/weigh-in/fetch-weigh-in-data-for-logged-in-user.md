# FetchWeighInDataForLoggedInUserApp - Fetch Weigh-In Data for Logged-In User

This API endpoint allows an authenticated player to fetch their weigh-in data, including details such as points, weight changes, and weigh-in history.

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Description**: Retrieves weigh-in data for the logged-in player, providing insights into their weigh-in records, team association, and performance points.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request.

## Authorization

- Accessible only by authenticated users who are verified as players. The endpoint checks user credentials and authorization status.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Fetched Weigh In Data For Logged In User Successfully.",
    "data": {
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
  }
  ```

### Error

#### 400 Bad Request: When the player's record is not found or there is no weigh-in data available.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: No Players Found"
  }
  ```

#### 400 Bad Request: When there is no weigh-in data available.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: No Player Weigh In Data Found."
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

#### 500 Internal Server Error: When an unexpected error occurs while fetching weigh-in data.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable to fetch weigh in data for logged in user."
  }
  ```

### Example Request

```http
GET /fetch-weigh-in-data-for-logged-in-user HTTP/1.1
Content-Type: application/json
Authorization: Bearer <user_token>
```
