# editTeamApp - Edit a Team

This API endpoint allows an admin to edit the details of an existing team, including its name, description, coach, and logo. The team must already exist, and the changes will be reflected in the database. This action requires admin privileges.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Updates an existing team's information, including its name, coach, description, and logo.

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

- `teamUid` (string): The UID of the team to edit.
- `teamName` (string): The new name of the team.
- `coachUid` (string, optional): The UID of the new coach for the team.
- `teamDescription` (string): The new description of the team.
- `teamLogo` (object, optional): The new logo for the team. The object must contain:
  - `data` (string): The image data.
  - `format` (string): The image format (e.g., PNG, JPG).
  - `contentType` (string): The content type of the image.


## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "Team Edited Successfully.",
    "data": null
  }
  ```

### Error

#### 403 Forbidden: User is not authenticated as an admin

- **Status Code**: 403
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 403,
    "message": "Access Denied: Unauthorized"
  }
  ```

#### 400 Bad Request: Team does not exist.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Team Doesn't Exist."
  }
  ```

#### 400 Bad Request: The provided coach does not exist.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occurred: Coach Doesn't Exist."
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

#### 400 Bad Request: Invalid team description.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "teamDescription Provided Failed Validation"
  }
  ```

#### 400 Bad Request:  Invalid image format.

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Error Occured: Logo image type is not a valid image. Valid image extensions are ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']"
  }
  ```

#### 500 Internal Server Error: An error occurred during the update process.

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred: Unable To Edit Team"
  }
  ```


### Example Request

```http
POST / HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "teamUid": "team123",
  "teamName": "New Team Name",
  "coachUid": "coach456",
  "teamDescription": "New team description",
  "teamLogo": {
    "data": "<base64_encoded_image>",
    "format": "png",
    "contentType": "image/png"
  }
}
