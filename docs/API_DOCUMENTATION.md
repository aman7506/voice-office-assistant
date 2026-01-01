# Voice Office Assistant - API Documentation

## 📌 Base URL

**Development**: `http://localhost:5000`  
**Production**: `https://your-domain.com`

All endpoints return JSON responses and follow RESTful conventions.

---

## 🔐 Authentication

Currently, the API uses basic authentication. JWT-based authentication is planned for future releases.

### Headers
```http
Content-Type: application/json
Authorization: Bearer {token}  # Future implementation
```

---

## 📡 API Endpoints

### 1. Health & Status

#### **GET /health**
Health check endpoint to verify server status and service availability.

**Request**
```http
GET /health HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK)
```json
{
  "status": "OK",
  "timestamp": "2026-01-01T14:09:54.000Z",
  "uptime": 1234,
  "environment": "development",
  "version": "1.0.0",
  "services": {
    "openai": "configured",
    "database": "connected",
    "socketio": "initialized"
  },
  "server": {
    "port": 5000,
    "cors": "configured"
  }
}
```

#### **GET /**
Root endpoint providing API information.

**Response** (200 OK)
```json
{
  "message": "Voice Office Assistant API",
  "status": "running",
  "version": "1.0.0",
  "timestamp": "2026-01-01T14:09:54.000Z",
  "endpoints": [
    "/health",
    "/api/chat",
    "/api/tasks",
    "/api/reminders",
    "/api/calendar",
    "/api/voice"
  ]
}
```

---

### 2. Chat & AI Endpoints

#### **POST /api/chat**
Send a message to the AI chatbot and receive an intelligent response.

**Request**
```http
POST /api/chat HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "message": "What's the weather like today?",
  "userId": "user123",
  "sessionId": "session456"
}
```

**Request Body Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | User's message to the chatbot |
| `userId` | string | No | User identifier for conversation tracking |
| `sessionId` | string | No | Session identifier for context management |

**Response** (200 OK)
```json
{
  "success": true,
  "reply": "I don't have real-time weather data, but I can help you check the weather by asking you to specify your location...",
  "timestamp": "2026-01-01T14:09:54.000Z",
  "sessionId": "session456"
}
```

**Error Response** (400 Bad Request)
```json
{
  "error": "Bad Request",
  "message": "Message is required",
  "timestamp": "2026-01-01T14:09:54.000Z"
}
```

**Error Response** (500 Internal Server Error)
```json
{
  "error": "OpenAI API Error",
  "message": "Failed to generate response",
  "timestamp": "2026-01-01T14:09:54.000Z"
}
```

---

### 3. Task Management Endpoints

#### **GET /api/tasks**
Retrieve all tasks for a user.

**Request**
```http
GET /api/tasks?userId=user123 HTTP/1.1
Host: localhost:5000
```

**Query Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | No | Filter tasks by user ID |
| `status` | string | No | Filter by status: `pending`, `completed`, `in-progress` |
| `priority` | string | No | Filter by priority: `low`, `medium`, `high` |

**Response** (200 OK)
```json
{
  "success": true,
  "tasks": [
    {
      "id": 1,
      "title": "Prepare quarterly report",
      "description": "Compile Q4 2025 financial data",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2026-01-15T18:00:00.000Z",
      "createdAt": "2025-12-20T10:30:00.000Z",
      "updatedAt": "2026-01-01T08:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Review project proposal",
      "description": "Review and approve new project documents",
      "status": "pending",
      "priority": "medium",
      "dueDate": "2026-01-10T12:00:00.000Z",
      "createdAt": "2025-12-28T14:20:00.000Z",
      "updatedAt": "2025-12-28T14:20:00.000Z"
    }
  ],
  "count": 2
}
```

#### **GET /api/tasks/:id**
Retrieve a specific task by ID.

**Request**
```http
GET /api/tasks/1 HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK)
```json
{
  "success": true,
  "task": {
    "id": 1,
    "title": "Prepare quarterly report",
    "description": "Compile Q4 2025 financial data",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-01-15T18:00:00.000Z",
    "createdAt": "2025-12-20T10:30:00.000Z",
    "updatedAt": "2026-01-01T08:00:00.000Z"
  }
}
```

**Error Response** (404 Not Found)
```json
{
  "error": "Not Found",
  "message": "Task with ID 1 not found",
  "timestamp": "2026-01-01T14:09:54.000Z"
}
```

#### **POST /api/tasks**
Create a new task.

**Request**
```http
POST /api/tasks HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "title": "Schedule team meeting",
  "description": "Organize weekly sync meeting",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2026-01-05T10:00:00.000Z",
  "userId": "user123"
}
```

**Request Body Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Task title (max 200 chars) |
| `description` | string | No | Detailed description |
| `status` | string | No | Task status (default: `pending`) |
| `priority` | string | No | Priority level (default: `medium`) |
| `dueDate` | string (ISO 8601) | No | Task due date |
| `userId` | string | No | User identifier |

**Response** (201 Created)
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "id": 3,
    "title": "Schedule team meeting",
    "description": "Organize weekly sync meeting",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2026-01-05T10:00:00.000Z",
    "createdAt": "2026-01-01T14:09:54.000Z",
    "updatedAt": "2026-01-01T14:09:54.000Z"
  }
}
```

#### **PUT /api/tasks/:id**
Update an existing task.

**Request**
```http
PUT /api/tasks/1 HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "status": "completed",
  "priority": "high"
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "title": "Prepare quarterly report",
    "description": "Compile Q4 2025 financial data",
    "status": "completed",
    "priority": "high",
    "dueDate": "2026-01-15T18:00:00.000Z",
    "createdAt": "2025-12-20T10:30:00.000Z",
    "updatedAt": "2026-01-01T14:09:54.000Z"
  }
}
```

#### **DELETE /api/tasks/:id**
Delete a task.

**Request**
```http
DELETE /api/tasks/1 HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### 4. Reminder Management Endpoints

#### **GET /api/reminders**
Retrieve all reminders.

**Request**
```http
GET /api/reminders?userId=user123 HTTP/1.1
Host: localhost:5000
```

**Query Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | No | Filter reminders by user ID |
| `isTriggered` | boolean | No | Filter by trigger status |

**Response** (200 OK)
```json
{
  "success": true,
  "reminders": [
    {
      "id": 1,
      "title": "Call client",
      "description": "Follow up on project status",
      "reminderTime": "2026-01-02T09:00:00.000Z",
      "isTriggered": false,
      "createdAt": "2026-01-01T10:00:00.000Z",
      "updatedAt": "2026-01-01T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### **POST /api/reminders**
Create a new reminder.

**Request**
```http
POST /api/reminders HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "title": "Submit expense report",
  "description": "Monthly expense reimbursement",
  "reminderTime": "2026-01-05T17:00:00.000Z",
  "userId": "user123"
}
```

**Request Body Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Reminder title (max 200 chars) |
| `description` | string | No | Detailed description |
| `reminderTime` | string (ISO 8601) | Yes | When to trigger reminder |
| `userId` | string | No | User identifier |

**Response** (201 Created)
```json
{
  "success": true,
  "message": "Reminder created successfully",
  "reminder": {
    "id": 2,
    "title": "Submit expense report",
    "description": "Monthly expense reimbursement",
    "reminderTime": "2026-01-05T17:00:00.000Z",
    "isTriggered": false,
    "createdAt": "2026-01-01T14:09:54.000Z",
    "updatedAt": "2026-01-01T14:09:54.000Z"
  }
}
```

#### **PUT /api/reminders/:id**
Update a reminder.

**Request**
```http
PUT /api/reminders/1 HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "reminderTime": "2026-01-02T10:00:00.000Z",
  "isTriggered": true
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "Reminder updated successfully",
  "reminder": {
    "id": 1,
    "title": "Call client",
    "description": "Follow up on project status",
    "reminderTime": "2026-01-02T10:00:00.000Z",
    "isTriggered": true,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T14:09:54.000Z"
  }
}
```

#### **DELETE /api/reminders/:id**
Delete a reminder.

**Request**
```http
DELETE /api/reminders/1 HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "Reminder deleted successfully"
}
```

---

### 5. Calendar Integration Endpoints

#### **GET /api/calendar/events**
Retrieve calendar events.

**Request**
```http
GET /api/calendar/events?startDate=2026-01-01&endDate=2026-01-31 HTTP/1.1
Host: localhost:5000
```

**Query Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string (ISO 8601) | No | Filter events from this date |
| `endDate` | string (ISO 8601) | No | Filter events until this date |
| `userId` | string | No | Filter by user ID |

**Response** (200 OK)
```json
{
  "success": true,
  "events": [
    {
      "id": 1,
      "title": "Team Standup",
      "description": "Daily team sync meeting",
      "startTime": "2026-01-02T09:00:00.000Z",
      "endTime": "2026-01-02T09:30:00.000Z",
      "location": "Conference Room A",
      "googleEventId": "abc123xyz",
      "createdAt": "2025-12-28T08:00:00.000Z",
      "updatedAt": "2025-12-28T08:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### **POST /api/calendar/events**
Create a new calendar event.

**Request**
```http
POST /api/calendar/events HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "title": "Client Meeting",
  "description": "Discuss project requirements",
  "startTime": "2026-01-05T14:00:00.000Z",
  "endTime": "2026-01-05T15:00:00.000Z",
  "location": "Client Office",
  "userId": "user123"
}
```

**Request Body Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Event title (max 200 chars) |
| `description` | string | No | Event description |
| `startTime` | string (ISO 8601) | Yes | Event start time |
| `endTime` | string (ISO 8601) | Yes | Event end time |
| `location` | string | No | Event location |
| `userId` | string | No | User identifier |

**Response** (201 Created)
```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "id": 2,
    "title": "Client Meeting",
    "description": "Discuss project requirements",
    "startTime": "2026-01-05T14:00:00.000Z",
    "endTime": "2026-01-05T15:00:00.000Z",
    "location": "Client Office",
    "googleEventId": null,
    "createdAt": "2026-01-01T14:09:54.000Z",
    "updatedAt": "2026-01-01T14:09:54.000Z"
  }
}
```

#### **PUT /api/calendar/events/:id**
Update a calendar event.

**Request**
```http
PUT /api/calendar/events/1 HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "startTime": "2026-01-02T10:00:00.000Z",
  "endTime": "2026-01-02T10:30:00.000Z"
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "Event updated successfully",
  "event": {
    "id": 1,
    "title": "Team Standup",
    "description": "Daily team sync meeting",
    "startTime": "2026-01-02T10:00:00.000Z",
    "endTime": "2026-01-02T10:30:00.000Z",
    "location": "Conference Room A",
    "googleEventId": "abc123xyz",
    "createdAt": "2025-12-28T08:00:00.000Z",
    "updatedAt": "2026-01-01T14:09:54.000Z"
  }
}
```

#### **DELETE /api/calendar/events/:id**
Delete a calendar event.

**Request**
```http
DELETE /api/calendar/events/1 HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

#### **GET /api/calendar/auth**
Initiate Google Calendar OAuth flow.

**Request**
```http
GET /api/calendar/auth HTTP/1.1
Host: localhost:5000
```

**Response** (302 Redirect)
Redirects to Google OAuth consent screen.

#### **GET /api/calendar/auth/callback**
Handle Google OAuth callback.

**Request**
```http
GET /api/calendar/auth/callback?code=4/0AY0e-g7... HTTP/1.1
Host: localhost:5000
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "Calendar connected successfully",
  "accessToken": "ya29.a0AfH6..."
}
```

---

### 6. Voice Processing Endpoints

#### **POST /api/voice/speech-to-text**
Convert speech audio to text.

**Request**
```http
POST /api/voice/speech-to-text HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "audioData": "base64_encoded_audio_data",
  "language": "en-US"
}
```

**Request Body Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `audioData` | string (base64) | Yes | Base64-encoded audio file |
| `language` | string | No | Language code (default: `en-US`) |

**Response** (200 OK)
```json
{
  "success": true,
  "text": "What's on my schedule today?",
  "confidence": 0.95,
  "language": "en-US"
}
```

#### **POST /api/voice/text-to-speech**
Convert text to speech audio.

**Request**
```http
POST /api/voice/text-to-speech HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "text": "You have 3 meetings scheduled today",
  "voice": "en-US-Standard-A",
  "speed": 1.0
}
```

**Request Body Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to convert to speech |
| `voice` | string | No | Voice identifier |
| `speed` | number | No | Speech speed (0.5-2.0, default: 1.0) |

**Response** (200 OK)
```json
{
  "success": true,
  "audioUrl": "https://storage.googleapis.com/tts/output.mp3",
  "duration": 2.5
}
```

---

## 🔌 WebSocket Events (Socket.IO)

### Connection
```javascript
const socket = io('http://localhost:5000');
```

### Client → Server Events

#### **newMessage**
Send a new chat message.
```javascript
socket.emit('newMessage', {
  userId: 'user123',
  message: 'Hello, assistant!'
});
```

#### **taskUpdate**
Notify about task changes.
```javascript
socket.emit('taskUpdate', {
  taskId: 1,
  status: 'completed'
});
```

### Server → Client Events

#### **message**
Receive chat message response.
```javascript
socket.on('message', (data) => {
  console.log(data.reply);
});
```

#### **taskUpdated**
Receive task update notification.
```javascript
socket.on('taskUpdated', (task) => {
  console.log('Task updated:', task);
});
```

#### **reminderTriggered**
Receive reminder notification.
```javascript
socket.on('reminderTriggered', (reminder) => {
  console.log('Reminder:', reminder.title);
});
```

---

## ⚠️ Error Handling

### Standard Error Response Format
```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "timestamp": "2026-01-01T14:09:54.000Z",
  "path": "/api/tasks",
  "stack": "Error stack trace (development only)"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

---

## 🚦 Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Header**: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

When rate limit is exceeded:
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 15 minutes.",
  "retryAfter": 900,
  "timestamp": "2026-01-01T14:09:54.000Z"
}
```

---

## 📝 Request/Response Examples

### Example: Creating a Task via Voice Command

**Step 1**: Convert voice to text
```http
POST /api/voice/speech-to-text
{
  "audioData": "..."
}

Response:
{
  "text": "Create a task to review the project proposal"
}
```

**Step 2**: Send to AI for intent parsing
```http
POST /api/chat
{
  "message": "Create a task to review the project proposal"
}

Response:
{
  "reply": "I'll create that task for you.",
  "intent": "create_task",
  "extracted": {
    "title": "Review project proposal"
  }
}
```

**Step 3**: Create the task
```http
POST /api/tasks
{
  "title": "Review project proposal",
  "priority": "medium"
}

Response:
{
  "success": true,
  "task": { ... }
}
```

---

## 🔒 Security Best Practices

1. Always use HTTPS in production
2. Validate and sanitize all inputs
3. Implement proper authentication
4. Use environment variables for secrets
5. Enable CORS only for trusted origins
6. Implement rate limiting
7. Log all API requests
8. Use parameterized queries for SQL

---

## 📚 Additional Resources

- [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) - System architecture
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database structure
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Development setup

---

**Last Updated**: January 1, 2026  
**API Version**: 1.0.0
