# API Documentation - Users

## Base URL

http://localhost:5000/api/users

## Endpoints

### POST /register

**Description:** Creates a new user account.

**Request Body:**
```json
{
  "name": "Samira Codes",
  "age": 18,
  "email": "samira4333@gmail.com",
  "password_hash": "sami2333",
  "gender": "female",
  "address": {
    "city": "Salvador",
    "neighborhood": "Graça"
  },
  "phoneNumber": "(11) 98888-7790"
}
```
**Response:**
- **Status Code:** 201 Created
- **Body:**
```json

{
  "success": true,
  "message": "User created successfully.",
  "user": {
    "id": "6910e7c47a2628fb101103b3",
    "name": "Samira Codes",
    "email": "samira4333@gmail.com",
    "age": 18,
    "gender": "female",
    "address": {
      "city": "Salvador",
      "neighborhood": "Graça"
    },
    "phoneNumber": "(11) 98888-7790",
    "createdAt": "2025-11-09T19:13:08.422Z"
  }
}
```
**Error Responses:**

- **400 Bad Request:** Validation errors, missing required fields, or email already exists
- **409 Conflict:** Already registered users
- **500 Internal Server Error:** Server error during user creation

**Required Fields:**

- name (string)

- email (string, valid email format)

- password_hash (string)

- age (number)

- gender (string)

- phoneNumber (string)

**Optional Fields:**

- address (object with city and neighborhood)

### GET /profile ###

**Description:** Retrieves the authenticated user's profile information. Requires user to be logged in.

**Response:**

- **Status Code:** 200 OK
- **Body:**

```json
{
  "success": true,
  "user": {
    "address": {
      "city": "Salvador",
      "neighborhood": "Graça"
    },
    "_id": "6910e7c47a2628fb101103b3",
    "name": "Samira Codes",
    "email": "samira4333@gmail.com",
    "gender": "female",
    "age": 18,
    "phoneNumber": "(11) 98888-7790",
    "createdAt": "2025-11-09T19:13:08.422Z",
    "updatedAt": "2025-11-09T19:13:08.422Z",
    "__v": 0
  }
}
```

**Error Responses:**

- **401 Unauthorized:** User not logged in or invalid session
- **500 Internal Server Error:** Server error

### PUT /profile ###

**Description:** Updates user account information

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "age": 25,
  "email": "newemail@example.com",
  "gender": "male",
  "address": {
    "city": "New City",
    "neighborhood": "New Neighborhood"
  },
  "phoneNumber": "(11) 99999-9999"
}
```
**Response:**

- **Status Code:** 200 OK
- **Body:**

```json

  {
  "success": true,
  "message": "Account updated successfully",
  "user": {
    "address": {
      "city": "New City",
      "neighborhood": "New Neighborhood"
    },
    "_id": "6910e7c47a2628fb101103b3",
    "name": "Updated Name",
    "email": "newemail@example.com",
    "gender": "male",
    "age": 25,
    "phoneNumber": "(11) 99999-9999",
    "createdAt": "2025-11-09T19:13:08.422Z",
    "updatedAt": "2025-11-10T10:30:00.000Z",
    "__v": 0
  }
}
  

```

**Error Responses:**

- **400 Bad Request:** Invalid data provided
- **401 Unauthorized:** User not logged in or invalid session
- **500 Internal Server Error:** Server error

### DELETE /account

**Description:** Permanently deletes the user's account and all associated data.

**Response:**

- **Status Code:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Error Responses:**

- **401 Unauthorized:** User not logged in or invalid session
- **500 Internal Server Error:** Server error

### POST /login

**Description:** Authenticates a user and creates a session.

**Request Body:**
```json
{
  "email": "samira4333@gmail.com",
  "password_hash": "sami2333"
}
```
**Response:**

- **Status Code:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "id": "691e7f1a3e5121bf539578e9",
    "name": "Samira Codes",
    "email": "samira4333@gmail.com",
    "age": 18,
    "gender": "female",
    "address": {
      "city": "Salvador",
      "neighborhood": "Graça"
    },
    "phoneNumber": "(11) 98888-7790"
  },
  "session": {
    "isLoggedIn": true,
    "sessionId": "5QOQOU-5i1-qUEZzvMU2t0WXdx0jb7cZ"
  }
}
```

**Error Responses:**

- **400 Bad Request:** Missing email or password
- **401 Unauthorized:** User not logged in or invalid session
- **500 Internal Server Error:** Server error

### POST /logout

**Description:** Logs out the user and destroys the session.

**Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "Logout successfully"
}
```

**Error Responses:**

- **401 Unauthorized:** User not logged in or invalid session
- **500 Internal Server Error:** Server error

### GET /check

**Description:** Checks if the user is currently logged in and returns session status.

**Response:**
- **Status Code:** 200 OK

**When user is logged in:**
```json
{
  "success": true,
  "isLoggedIn": true,
  "user": {
    "id": "691e7f1a3e5121bf539578e9",
    "name": "Samira Codes",
    "email": "samira4333@gmail.com",
    "age": 18,
    "gender": "female",
    "address": {
      "city": "Salvador",
      "neighborhood": "Graça"
    }
  }
}
```
**When user is not logged in:**
```json
{
   "success": true,
  "isLoggedIn": false,
  "user": null
}
```
**Error Responses:**

- **500 Internal Server Error:** Server error