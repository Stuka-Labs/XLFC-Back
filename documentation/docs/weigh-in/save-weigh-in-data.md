# saveWeighInDataApp - Save Weigh-In Data

This API endpoint allows a coach to save weigh-in data for a player, including weight and related progress data. It validates the data, checks coach authorization, and updates the player’s weight log and points.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Allows an authenticated coach to submit weigh-in data for a player, including weight, progress on tasks (daily food diary, weekly steps, park run participation), and calculates points based on the player's progress.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates and attaches user credentials to the request, including `uid` and custom claims.

## Authorization

- Accessible only by authenticated coaches. The user's role must be verified to ensure they are a coach for the player’s team.

## Request Body

- `playerId` (string, required): The ID of the player whose weigh-in data is being submitted.
- `seasonId` (string, required): The ID of the season during which the weigh-in is being recorded.
- `month` (string, required): The month of the weigh-in. Valid format: `"MM"`.
- `week` (string, required): The week of the weigh-in. Valid format: `"WW"`.
- `weight` (number, required): The player’s weight for this week’s weigh-in.
- `dailyFoodDiaryComplete` (boolean, required): Whether the player completed their daily food diary.
- `weeklyStepsComplete` (boolean, required): Whether the player completed their weekly steps goal.
- `parkRunParticipationComplete` (boolean, required): Whether the player participated in the park run.

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "message": "Player Weigh In Data Submitted Successfully"
  }


### Error

#### 400 Bad Request: When required fields are missing or invalid.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occured: All weigh-in fields are required."
  }
  ```


#### 400 Bad Request: When the player does not exist.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Player Doesn't Exist."
  }
  ```

#### 400 Bad Request: When the season does not exist.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Season Doesn't Exist.
  }
  ```
#### 400 Bad Request: When the coach is not authorized for the player’s team.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: You Are Not The Coach Of The Provided Players Team."
  }
  ```

#### 400 Bad Request: When one of the fields is invalid (month, week, weight, or boolean fields)

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occured: Invalid month. Must be between 1 and 12."
  }
  ```

#### 403 Forbidden: When the user is not a coach.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied. Unauthorized"
  }
  ```

#### 500 Internal Server Error: When an unexpected error occurs while processing the weigh-in data.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Could not submit weigh in data."
  }
  ```

### Example Request

```http
POST /save-weigh-in-data HTTP/1.1
Content-Type: application/json
Authorization: Bearer <coach_token>

{
  "playerId": "player123",
  "seasonId": "season2024",
  "month": "03",
  "week": "10",
  "weight": 75.5,
  "dailyFoodDiaryComplete": true,
  "weeklyStepsComplete": true,
  "parkRunParticipationComplete": false
}
```





