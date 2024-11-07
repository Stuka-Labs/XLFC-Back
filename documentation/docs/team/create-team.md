# createTeamApp - Create a New Team

This API endpoint allows an admin or super admin to create a new team, including the team’s name, description, coach, and logo. If a logo is provided, it is uploaded and stored, with validation of the logo's format.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Creates a new team with the specified name, description, coach, and optional logo.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates the request and attaches user credentials to `req`.

## Authorization

- Only authenticated users with admin or super admin privileges can access this endpoint. If the user is unauthorized, a 403 error is returned.

## Request

### Headers

- **Authorization**: Bearer token with a valid token.

### Body Parameters

- `teamName` (string): The name of the team (must be an alphabetic string).
- `coachUid` (string, optional): The UID of the coach to assign to the team.
- `teamDescription` (string): A brief description of the team (must be an alphabetic string).
- `teamLogo` (object, optional): The logo of the team. The object should contain:
  - `data` (string): The image data (base64 encoded).
  - `format` (string): The image format (e.g., "png", "jpg").
  - `contentType` (string): The content type of the image (e.g., "image/png").

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Team Created Successfully.",
  }
  ```

### Error

#### 403 Forbidden: User is not authenticated as an admin or super admin.

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 400 Bad Request: Invalid team name.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "teamName Provided Failed Validation"
  }
  ```

#### 400 Bad Request: The coach UID provided does not exist.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Coach Doesn't Exist."
  }
  ```

#### 400 Bad Request: Invalid image format.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occured: Logo image type is not a valid image. Valid image extensions are ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']"
  }
  ```

#### 500 Internal Server Error: An error occurred while creating the team.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable to create team."
  }
  ```


### Example Request

```http
POST / HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "teamName": "Warriors",
  "coachUid": "coach123",
  "teamDescription": "A championship-winning team",
  "teamLogo": {
    "data": "<base64 encoded data>",
    "format": "png",
    "contentType": "image/png"
  }
}
