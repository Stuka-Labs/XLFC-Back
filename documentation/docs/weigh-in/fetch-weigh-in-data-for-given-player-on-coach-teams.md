# FetchWeighInDataForGivenPlayerOnCoachTeamsApp - Fetch Weigh-In Data for a Given Player on Coach's Teams

This API endpoint allows an authenticated coach to fetch the weigh-in data for a specified player who is part of one of their teams.

## Endpoint

- **Path**: `/`
- **Method**: `GET`
- **Description**: Retrieves weigh-in data for a specific player, ensuring that the player is associated with one of the authenticated coach's teams.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request.

## Authorization

- Accessible only by authenticated users verified as coaches. The endpoint checks user credentials and authorization status.

## Request Parameters

- **Query Parameter**:
  - `playerId` (string): The ID of the player whose weigh-in data is to be fetched. This parameter is required.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Fetched All Weigh In Data For Given Player On Coaches Teams Successfully.",
    "data": {
      "playerId": "player789",
      "teamId": "team123",
      "standardPoints": 100,
      "bonusPoints": 20,
      "weighInData": [
        {
          "id": "record1",
          "playerId": "player789",
          "seasonId": "season2024",
          "month": "05",
          "week": "15",
          "weight": 82.5,
          "dailyFoodDiaryComplete": true,
          "weeklyStepsCompleted": false,
          "parkRunParticipationCompleted": false,
          "timestamp": "2024-05-10T15:00:00Z",
          "streakType": "loss",
          "streakLength": 2
        }
      ],
      "weightChange": 0.5
    }
  }
  ```

### Error

#### 400 Bad Request: When the playerId is missing or the specified player is not found

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occured: Player ID is missing."
  }
  ```

#### 400 Bad Request: When the specified player is not found

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: No Players Found."
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
    "message": "Error Occurred: Unable To Fetch Weigh In Data For Given Player On Coaches Teams."
  }
  ```


### Example Request

```http
GET /fetch-weigh-in-data-for-given-player-on-coach-teams?playerId=player789 HTTP/1.1
Content-Type: application/json
Authorization: Bearer <coach_token>
```
