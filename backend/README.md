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

# API Documentation - Emergency Contacts

## Base URL

http://localhost:5000/api/emergency-contacts

## Authentication

All endpoints require authentication. Include session cookie in requests.

## Endpoints

### GET /search

**Description:** Search for app users to add as emergency contacts. Excludes the current user from results.

**Query Parameters:**
- `search` (string, required): Name or email to search for

**Example Request:**
```
GET /api/emergency-contacts/search?search=joao
```

**Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "success": true,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "11999999999"
    }
  ]
}
```

**Error Responses:**
- **400 Bad Request:** Missing search parameter
- **401 Unauthorized:** User not logged in
- **500 Internal Server Error:** Server error

### POST /

**Description:** Add a new emergency contact (app user or external contact)

**Request Body:**
```json
{
  "contactType": "app_user",
  "appUserId": "507f1f77bcf86cd799439011"
}
```
OR
```json
{
  "contactType": "external",
  "externalContact": {
    "name": "Mãe",
    "phone": "11999999999",
    "email": "mae@email.com",
    "relationship": "Mãe"
  }
}
```

**Response:**
- **Status Code:** 201 Created
- **Body:**
```json
{
  "success": true,
  "message": "Contact added sucefully",
  "contact": {
    "_id": "692354301483afb1a08493e4",
    "user": "691e7f1a3e5121bf539578e9",
    "contactType": "external",
    "externalContact": {
      "name": "Mãe",
      "phone": "11999999999",
      "email": "mae@email.com",
      "relationship": "Mãe"
    },
    "notifications": {
      "routeAlerts": true,
      "emergencyAlerts": true
    },
    "createdAt": "2025-11-23T18:36:32.693Z",
    "updatedAt": "2025-11-23T18:36:32.693Z"
  }
}
```

**Error Responses:**
- **400 Bad Request:** Invalid data, missing required fields, or contact already exists
- **401 Unauthorized:** User not logged in
- **404 Not Found:** App user not found (when contactType is 'app_user')
- **500 Internal Server Error:** Server error

### GET /

**Description:** Get all emergency contacts for the logged-in user

**Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "success": true,
  "contacts": [
    {
      "id": "692354301483afb1a08493e4",
      "contactType": "external",
      "name": "Larissa Codes",
      "phoneNumber": "(71) 99879-9998",
      "email": "lari98yy@amil.com",
      "relationship": "irma",
      "isAppUser": false,
      "notifications": {
        "routeAlerts": true,
        "emergencyAlerts": true
      }
    },
    {
      "id": "69234fb92c883de678776640",
      "contactType": "app_user",
      "name": "User not found",
      "phoneNumber": "N/A",
      "email": "N/A",
      "isAppUser": true,
      "isInvalid": true,
      "notifications": {
        "routeAlerts": true,
        "emergencyAlerts": true
      }
    }
  ]
}
```

**Error Responses:**
- **401 Unauthorized:** User not logged in
- **500 Internal Server Error:** Server error

### PUT /:id

**Description:** Update an emergency contact

**URL Parameters:**
- `id` (string, required): ID of the contact to update

**Request Body:**
For app_user contacts:
```json
{
  "notifications": {
    "routeAlerts": false,
    "emergencyAlerts": true
  }
}
```

For external contacts:
```json
{
  "notifications": {
    "routeAlerts": true,
    "emergencyAlerts": false
  },
  "name": "Novo Nome",
  "email": "novo@email.com"
}
```

**Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "Contact updated sucefully",
  "contact": {
    "id": "692354301483afb1a08493e4",
    "contactType": "external",
    "name": "Novo Nome",
    "phoneNumber": "(71) 99879-9998",
    "email": "novo@email.com",
    "relationship": "irma",
    "isAppUser": false,
    "notifications": {
      "routeAlerts": true,
      "emergencyAlerts": false
    }
  }
}
```

**Error Responses:**
- **400 Bad Request:** Invalid data
- **401 Unauthorized:** User not logged in
- **403 Forbidden:** Contact does not belong to user
- **404 Not Found:** Contact not found
- **500 Internal Server Error:** Server error

### DELETE /:id

**Description:** Delete an emergency contact

**URL Parameters:**
- `id` (string, required): ID of the contact to delete

**Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "Contact deleted sucefully",
  "deletedContactId": "692354301483afb1a08493e4"
}
```

**Error Responses:**
- **401 Unauthorized:** User not logged in
- **403 Forbidden:** Contact does not belong to user
- **404 Not Found:** Contact not found
- **500 Internal Server Error:** Server error

# API Documentation - AI Risk Detection

## Base URL

http://localhost:5000/api/ai

## Authentication

All endpoints require authentication. Include session cookie in requests.

## Endpoints

### POST /listen/start

**Description:** Starts the AI audio listening process for risk detection. Initiates Python analysis in the background.

**Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "Listening session started successfully"
}
```

**Error Responses:**
- **400 Bad Request:** Listening already active
- **401 Unauthorized:** User not logged in
- **500 Internal Server Error:** Server error or Python process failed to start

### POST /listen/stop

**Description:** Stops the AI audio listening process.

**Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "success": true,
  "message": "Listening stopped sucefully"
}
```

**Error Responses:**
- **400 Bad Request:** No active listening session
- **401 Unauthorized:** User not logged in
- **500 Internal Server Error:** Server error

### GET /listen/status

**Description:** Checks if the AI listening process is currently active.

**Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "success": true,
  "isListening": true
}
```

**Error Responses:**
- **401 Unauthorized:** User not logged in
- **500 Internal Server Error:** Server error

### GET /risks

**Description:** Retrieves recent risk detection events for the authenticated user.

**Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "success": true,
  "risks": [
    {
      "riskLevel": "critical",
      "spokenWords": "socorro estou morrendo",
      "timestamp": "2025-11-23T14:52:30.123Z"
    },
    {
      "riskLevel": "high", 
      "spokenWords": "alguém me ajuda por favor",
      "timestamp": "2025-11-23T14:50:15.456Z"
    }
  ]
}
```

**Error Responses:**
- **401 Unauthorized:** User not logged in  
- **500 Internal Server Error:** Server error

