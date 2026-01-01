# Voice Office Assistant - System Architecture Documentation

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [System Components](#2-system-components)
3. [Application Architecture](#3-application-architecture)
4. [Data Architecture](#4-data-architecture)
5. [Communication Architecture](#5-communication-architecture)
6. [Security Architecture](#6-security-architecture)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Scalability and Performance](#8-scalability-and-performance)

---

## 1. Architecture Overview

### 1.1 Architectural Style

Voice Office Assistant implements a **Client-Server Architecture** with the following characteristics:

**Architecture Pattern**: Three-Tier Architecture
- **Presentation Tier**: React Native mobile application
- **Application Tier**: Node.js backend server with Express.js
- **Data Tier**: Microsoft SQL Server database

**Communication Patterns**:
- RESTful API for request-response operations
- WebSocket (Socket.IO) for real-time bidirectional communication
- Event-driven architecture for asynchronous operations

### 1.2 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         React Native Mobile Application                    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │  │
│  │  │   Chat   │ │  Tasks   │ │ Calendar │ │ Reminders│     │  │
│  │  │  Screen  │ │  Screen  │ │  Screen  │ │  Screen  │     │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / WSS
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │            Node.js + Express.js Server                     │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  API Routes (REST) + Socket.IO (WebSocket)           │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  Business Logic Services                             │ │  │
│  │  │  - Task Service    - Calendar Service                │ │  │
│  │  │  - Reminder Service - Chat Service                   │ │  │
│  │  │  - Voice Service   - Auth Service                    │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Protocol
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         Microsoft SQL Server Database                      │  │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐        │  │
│  │  │  Users  │ │  Tasks  │ │ Reminders│ │Calendar │        │  │
│  │  └─────────┘ └─────────┘ └──────────┘ └─────────┘        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES LAYER                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │   OpenAI    │ │   Google    │ │  Speech     │              │
│  │   GPT API   │ │  Calendar   │ │  Services   │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Architectural Principles

**Separation of Concerns**
- Clear boundaries between presentation, business logic, and data layers
- Each layer has distinct responsibilities
- Changes in one layer minimally affect others

**Modularity**
- Services are independent and loosely coupled
- Can be developed, tested, and deployed independently
- Facilitates code reuse and maintenance

**Scalability**
- Stateless API design allows horizontal scaling
- Database connection pooling for efficient resource usage
- Caching strategies for performance optimization

**Security**
- Defense in depth with multiple security layers
- Principle of least privilege
- Secure communication channels (HTTPS/WSS)

---

## 2. System Components

### 2.1 Frontend Components

**Mobile Application (React Native + Expo)**

Technology Stack:
- React Native 0.72+
- Expo SDK 49+
- React Navigation for routing
- React Native Paper for UI components

Core Components:
```
mobile/
├── App.js                    # Application entry point
├── screens/                  # Screen components
│   ├── ChatScreen.js         # Voice chat interface
│   ├── TasksScreen.js        # Task management
│   ├── CalendarScreen.js     # Calendar view
│   ├── RemindersScreen.js    # Reminders management
│   └── SettingsScreen.js     # App settings
├── services/                 # Service layer
│   ├── apiService.js         # HTTP client
│   ├── socketService.js      # WebSocket client
│   └── permissionService.js  # Device permissions
└── assets/                   # Static assets
```

**Key Features**:
- Cross-platform (iOS and Android)
- Native performance
- Over-the-air updates capability
- Device API access (microphone, notifications)

### 2.2 Backend Components

**Application Server (Node.js + Express.js)**

Technology Stack:
- Node.js 16+ LTS
- Express.js 4.x
- Socket.IO 4.x
- mssql (SQL Server driver)

Application Structure:
```
server/
├── index.js                 # Server entry point
├── config/                  # Configuration
│   └── database.js          # Database connection
├── routes/                  # API routes
│   ├── chat.js              # Chat endpoints
│   ├── tasks.js             # Task endpoints
│   ├── reminders.js         # Reminder endpoints
│   ├── calendar.js          # Calendar endpoints
│   └── voice.js             # Voice endpoints
├── services/                # Business logic
│   └── socketService.js     # Socket.IO service
└── middleware/              # Middleware functions
    └── auth.js              # Authentication
```

**Middleware Stack**:
1. Helmet (security headers)
2. CORS (cross-origin policy)
3. Body parser (JSON parsing)
4. Authentication (JWT validation)
5. Rate limiting
6. Error handling

### 2.3 Database Components

**Microsoft SQL Server**

Database Objects:
- 6 Tables (Users, Tasks, Reminders, CalendarEvents, ChatHistory, VoiceLogs)
- 4 Stored Procedures (GetUserTasks, GetUpcomingReminders, etc.)
- 3 Triggers (timestamp updates, completion tracking)
- 2 Views (ActiveTasksView, UpcomingEventsView)
- Multiple Indexes for query optimization

**Database Configuration**:
- Connection pooling (max 10 connections)
- Transaction isolation level: READ COMMITTED
- Encrypted connections in production
- Automated backups (daily)

### 2.4 External Services

**OpenAI API**
- Model: GPT-3.5-turbo
- Purpose: Natural language understanding and generation
- Integration: HTTP REST API
- Rate Limit Management: Token-based requests

**Google Calendar API**
- Version: Calendar API v3
- Authentication: OAuth 2.0
- Purpose: Calendar synchronization
- Scopes: calendar.events (read/write)

**Speech Services** (Future Enhancement)
- Google Speech-to-Text API
- Google Text-to-Speech API
- Alternative: Azure Cognitive Services

---

## 3. Application Architecture

### 3.1 Backend Application Layers

**Layer 1: Presentation Layer**

Responsibilities:
- HTTP request handling
- Request validation
- Response formatting
- Error handling

Components:
```javascript
// Express route handler example
router.post('/api/tasks', async (req, res) => {
  try {
    // Validate request
    const { title, description, priority } = req.body;
    
    // Call business logic
    const task = await taskService.createTask({
      title,
      description,
      priority
    });
    
    // Format response
    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    // Error handling
    res.status(500).json({
      error: error.message
    });
  }
});
```

**Layer 2: Business Logic Layer**

Responsibilities:
- Core application logic
- Data validation and transformation
- Business rules enforcement
- External service integration

Components:
```javascript
// Service layer example
class TaskService {
  async createTask(taskData) {
    // Validate business rules
    if (!taskData.title) {
      throw new Error('Title is required');
    }
    
    // Transform data
    const task = {
      ...taskData,
      status: 'pending',
      createdAt: new Date()
    };
    
    // Call data access layer
    return await taskRepository.create(task);
  }
}
```

**Layer 3: Data Access Layer**

Responsibilities:
- Database connections
- Query execution
- Transaction management
- Data mapping

Components:
```javascript
// Repository pattern example
class TaskRepository {
  async create(task) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('title', sql.NVarChar, task.title)
      .input('description', sql.NVarChar, task.description)
      .query(`
        INSERT INTO Tasks (Title, Description)
        VALUES (@title, @description);
        SELECT SCOPE_IDENTITY() AS TaskID;
      `);
    return result.recordset[0];
  }
}
```

### 3.2 Frontend Application Layers

**Layer 1: Component Layer**

Screen Components:
- Responsible for UI rendering
- User interaction handling
- State management

```javascript
// Screen component example
const TasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = async () => {
    const data = await apiService.getTasks();
    setTasks(data);
  };
  
  return (
    <View>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </View>
  );
};
```

**Layer 2: Service Layer**

API Service:
- HTTP request handling
- Request/response transformation
- Error handling

```javascript
// API service example
class ApiService {
  async getTasks() {
    try {
      const response = await axios.get(`${API_URL}/api/tasks`);
      return response.data.tasks;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  }
}
```

Socket Service:
- WebSocket connection management
- Event handling
- Real-time updates

```javascript
// Socket service example
class SocketService {
  connect() {
    this.socket = io(API_URL);
    
    this.socket.on('taskUpdated', (task) => {
      // Handle task update
    });
  }
}
```

---

## 4. Data Architecture

### 4.1 Data Model

**Entity Relationship Diagram**

```
Users (1) ─────── (N) Tasks
Users (1) ─────── (N) Reminders
Users (1) ─────── (N) CalendarEvents
Users (1) ─────── (N) ChatHistory
Users (1) ─────── (N) VoiceLogs
```

**Data Flow**

```
[User Action] → [Mobile App]
                     ↓
               [API Request]
                     ↓
             [Backend Server]
                     ↓
             [Validate & Process]
                     ↓
            [Database Query]
                     ↓
            [Database Server]
                     ↓
            [Return Results]
                     ↓
            [Backend Server]
                     ↓
            [Format Response]
                     ↓
            [API Response]
                     ↓
              [Mobile App]
                     ↓
             [Update UI]
```

### 4.2 Data Storage Strategy

**Primary Data Store: SQL Server**

Reasons for SQL Server:
- ACID compliance for data integrity
- Strong typing and schema enforcement
- Mature ecosystem and tooling
- Excellent Windows integration
- Enterprise-grade security

**Data Categories**:

1. **User Data**: Authentication credentials, profile information
2. **Task Data**: Task details, status, priorities
3. **Calendar Data**: Events, meetings, appointments
4. **Conversation Data**: Chat history, AI interactions
5. **Audit Data**: Voice logs, system events

**Data Retention Policies**:
- User data: Retained until account deletion
- Task data: Retained for 2 years after completion
- Chat history: Retained for 6 months
- Voice logs: Retained for 90 days
- Audit logs: Retained for 1 year

### 4.3 Caching Strategy (Future Enhancement)

**Redis Caching**:

Cache Layers:
```
1. Session Cache (JWT tokens, user sessions)
2. Query Cache (frequently accessed tasks, reminders)
3. API Response Cache (calendar events, static data)
```

Cache Invalidation:
- Time-based expiration (TTL)
- Event-based invalidation (on data update)
- Least Recently Used (LRU) eviction

---

## 5. Communication Architecture

### 5.1 REST API Communication

**Request-Response Pattern**

```
Client Request:
POST /api/tasks
Headers: {
  Authorization: Bearer <token>
  Content-Type: application/json
}
Body: {
  "title": "New Task",
  "priority": "high"
}

Server Response:
Status: 201 Created
Body: {
  "success": true,
  "task": {
    "id": 1,
    "title": "New Task",
    "priority": "high"
  }
}
```

**API Versioning Strategy** (Future):
```
/api/v1/tasks   # Version 1
/api/v2/tasks   # Version 2 (with breaking changes)
```

### 5.2 WebSocket Communication

**Socket.IO Architecture**

Connection Flow:
```
1. Client initiates WebSocket connection
2. Server authenticates client
3. Client joins user-specific room
4. Server and client exchange events
5. Connection maintained with heartbeat
```

Event Types:
```javascript
// Client to Server
socket.emit('newMessage', { message: 'Hello' });
socket.emit('taskUpdate', { taskId: 1 });

// Server to Client
socket.on('message', (data) => {});
socket.on('taskUpdated', (task) => {});
socket.on('reminderTriggered', (reminder) => {});
```

**Room Management**:
```
Each user has a dedicated room: user_{userId}
Broadcasts are targeted to specific rooms
Scaling: Use Redis adapter for multi-server deployments
```

### 5.3 External API Integration

**OpenAI API Integration**

Flow:
```
User Input → Mobile App → Backend Server
                              ↓
                        OpenAI API Request
                              ↓
                        GPT-3.5-turbo 
                              ↓
                        AI Response
                              ↓
                        Backend Processing
                              ↓
                        Return to Client
```

**Google Calendar Integration**

OAuth Flow:
```
1. User initiates calendar connection
2. Redirect to Google OAuth consent screen
3. User grants permissions
4. Google redirects to callback URL with code
5. Backend exchanges code for access token
6. Store encrypted tokens in database
7. Use tokens for API requests
```

---

## 6. Security Architecture

### 6.1 Authentication Architecture

**JWT Token Flow**

```
[User Login] → [Server validates credentials]
                        ↓
                [Generate JWT Token]
                        ↓
                [Return token to client]
                        ↓
                [Client stores token]
                        ↓
        [Subsequent requests include token]
                        ↓
        [Server validates token on each request]
```

Token Structure:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": 1,
    "username": "amanmishra",
    "iat": 1704024000,
    "exp": 1704110400
  }
}
```

### 6.2 Authorization Levels

**Access Control**:

1. **Public**: Health check, system information
2. **Authenticated**: All user-specific operations
3. **Admin**: User management, system configuration (future)

**Resource Ownership Validation**:
```javascript
// Ensure user can only access their own data
if (task.userId !== req.user.id) {
  return res.status(403).json({ error: 'Forbidden' });
}
```

### 6.3 Data Security

**Encryption**:

Data in Transit:
- HTTPS/TLS 1.2+ for all API communication
- WSS (WebSocket Secure) for Socket.IO
- Certificate pinning in mobile app (future)

Data at Rest:
- Password hashing with bcrypt (cost factor: 10)
- Encrypted database fields for sensitive data
- Secure key storage (environment variables)

**Input Validation**:
```javascript
const validateTaskInput = (data) => {
  const schema = {
    title: { type: 'string', required: true, max: 200 },
    description: { type: 'string', max: 5000 },
    priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] }
  };
  // Validation logic
};
```

### 6.4 Network Security

**Security Headers (Helmet.js)**:
```
Content-Security-Policy
X-DNS-Prefetch-Control
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
```

**CORS Policy**:
```javascript
{
  origin: ['https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}
```

**Rate Limiting**:
```
Window: 15 minutes
Max Requests: 100 per window per IP
```

---

## 7. Deployment Architecture

### 7.1 Development Environment

```
Developer Workstation
├── Local Database (SQL Server)
├── Backend Server (npm run dev)
├── Mobile App (Expo Development Server)
└── Testing Tools (Postman, React Native Debugger)
```

### 7.2 Production Environment

```
┌─────────────────────────────────────┐
│        Mobile Apps (Expo EAS)       │
│  ├── Android (Google Play)          │
│  └── iOS (App Store)                │
└─────────────────────────────────────┘
                 ↓ HTTPS/WSS
┌─────────────────────────────────────┐
│      Load Balancer / CDN            │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Backend Servers (Railway/Render)  │
│   ├── Server Instance 1             │
│   ├── Server Instance 2 (scaling)   │
│   └── Health Checks + Monitoring    │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Database (Azure SQL Database)     │
│   ├── Primary Instance              │
│   ├── Read Replicas (optional)      │
│   └── Automated Backups             │
└─────────────────────────────────────┘
```

### 7.3 CI/CD Pipeline (Future Implementation)

```
[Developer Commits] → [GitHub]
                         ↓
                   [GitHub Actions]
                         ↓
                   [Run Tests]
                         ↓
                   [Build Application]
                         ↓
                   [Deploy to Staging]
                         ↓
                   [Integration Tests]
                         ↓
                   [Manual Approval]
                         ↓
                   [Deploy to Production]
```

---

## 8. Scalability and Performance

### 8.1 Horizontal Scaling

**Application Server Scaling**:
- Deploy multiple server instances
- Load balancer distributes traffic
- Shared session store (Redis)
- Stateless API design

**Database Scaling**:
- Read replicas for read-heavy operations
- Database connection pooling
- Query result caching

### 8.2 Performance Optimization

**Backend Optimizations**:
- Database query optimization (indexes, query plans)
- Response compression (gzip)
- Connection pooling
- Asynchronous processing for long-running tasks

**Frontend Optimizations**:
- Component memoization (React.memo)
- Virtual lists for large datasets
- Image optimization and lazy loading
- Minimize bundle size

### 8.3 Monitoring and Alerting

**Application Monitoring**:
- Response time tracking
- Error rate monitoring
- Database query performance
- API endpoint usage statistics

**Infrastructure Monitoring**:
- Server CPU and memory usage
- Database connection pool status
- Network latency
- Disk I/O performance

**Alerting Thresholds**:
- Error rate > 1%
- Response time > 2 seconds
- Database connection pool utilization > 80%
- Server CPU usage > 90%

---

**Document Version**: 1.0

**Last Updated**: January 2026

**Author**: Aman Mishra
