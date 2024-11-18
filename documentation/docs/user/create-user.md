# createUserApp - Create User

This API endpoint allows an authenticated user to create a new user account. The endpoint validates the provided user details such as email, password, first name, surname, and phone number. It ensures the email and phone number are unique and not already in use.

## Endpoint

- **Path**: `/`
- **Method**: `POST`
- **Description**: Creates a new user with the provided details if all validation checks pass.

## Middleware

- `bodyParser.json()`: Parses incoming request bodies as JSON.
- `cors`: Enables CORS with all origins allowed.
- `getUserCredentialsMiddleware`: Authenticates the request and attaches user credentials to `req`.

## Request

### Request Body (JSON)

The body of the request must contain the following fields:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "John",
  "surName": "Doe",
  "phoneNumber": "+1234567890"
}
```

## Response

### Success

- **Status Code**: 200
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 200,
    "message": "User created successfully.",
    "data": null
  }
  ```

### Error

#### 400 Bad Request: Invalid Email Format

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Email Address Provided is not in a valid email format."
  }
  ```

#### 400 Bad Request: Invalid Password

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Password Provided Failed Security Validation" +
    " or Didn't Match the Confirmation Password."
  }
  ```

### Error

#### 400 Bad Request: Invalid First Name

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "First Name Provided Failed Validation."
  }
  ```

### Error

#### 400 Bad Request: Invalid Surname

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Sur Name Provided Failed Validation."
  }
  ```

#### 400 Bad Request: Invalid Phone Number

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Phone Number Provided Failed Validation."
  }
  ```

#### 400 Bad Request: Phone Number Already Exists

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Phone Number Provided Already Exists."
  }
  ```

#### 400 Bad Request: Email Already Exists

- **Status Code**: 400
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "message": "Email Address Provided Already Exists."
  }
  ```

#### 500 Internal Server Error: Error Creating User

- **Status Code**: 500
- **Response Format**: JSON
- **Response Body**:
  ```json
  {
    "statusCode": 500,
    "message": "Error Occurred When Attempting To Create User."
  }
  ```

### Example Request

```http
POST / HTTP/1.1
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "newpassword123",
  "confirmPassword": "newpassword123",
  "firstName": "Jane",
  "surName": "Doe",
  "phoneNumber": "+1234567890"
}
```

