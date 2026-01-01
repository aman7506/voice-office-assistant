# Voice Office Assistant - Project Architecture

## 📐 System Architecture Overview

The Voice Office Assistant is a full-stack application designed with a **client-server architecture** that enables real-time voice-based interactions for office productivity tasks.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MOBILE CLIENT                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          React Native + Expo Application                  │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │  │
│  │  │  Chat  │ │ Tasks  │ │Calendar│ │Reminders│ │Settings│ │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           ↕ HTTP/REST + Socket.IO
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Node.js + Express.js Server                     │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │  │
│  │  │  Chat  │ │ Tasks  │ │Calendar│ │Reminders│ │ Voice  │ │  │
│  │  │  API   │ │  API   │ │  API   │ │   API   │ │  API   │ │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           ↕ External Integrations
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ OpenAI   │ │ Google   │ │   SQL    │ │ Socket   │          │
│  │   GPT    │ │ Calendar │ │  Server  │ │   IO     │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Backend Architecture

### Technology Stack
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js 4.x
- **Real-time**: Socket.IO 4.x
- **Database**: Microsoft SQL Server
- **AI/ML**: OpenAI GPT-3.5-turbo
- **Security**: Helmet.js, CORS, JWT

### Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express Routes (HTTP Endpoints)                       │ │
│  │  - /api/chat      - /api/tasks      - /api/calendar   │ │
│  │  - /api/reminders - /api/voice                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Services & Controllers                                │ │
│  │  - Chat Service (OpenAI Integration)                   │ │
│  │  - Task Service (CRUD Operations)                      │ │
│  │  - Calendar Service (Google API)                       │ │
│  │  - Voice Service (Speech Processing)                   │ │
│  │  - Socket Service (Real-time Events)                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Database Configuration & Connection Pool              │ │
│  │  - SQL Server Connection Management                    │ │
│  │  - Query Execution & Transaction Handling             │ │
│  │  - Connection Pooling                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      PERSISTENCE LAYER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  SQL Server Database                                   │ │
│  │  - Users, Tasks, Reminders, Calendar Events           │ │
│  │  - Chat History, Voice Logs                           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Backend Directory Structure

```
server/
├── index.js                 # Main server entry point
├── config/                  # Configuration files
│   └── database.js         # Database connection management
├── routes/                  # API route handlers
│   ├── chat.js             # Chat & AI communication endpoints
│   ├── tasks.js            # Task management endpoints
│   ├── reminders.js        # Reminder management endpoints
│   ├── calendar.js         # Calendar integration endpoints
│   └── voice.js            # Voice processing endpoints
├── services/               # Business logic services
│   └── socketService.js   # Socket.IO real-time service
└── middleware/            # Custom middleware (if needed)
    └── auth.js           # JWT authentication (future)
```

### API Endpoints

#### **Health & Status**
- `GET /health` - Server health check with service status
- `GET /` - API information and available endpoints

#### **Chat & AI**
- `POST /api/chat` - Send message to AI chatbot
  - Body: `{ message: string, userId?: string }`
  - Response: `{ reply: string, timestamp: string }`

#### **Voice Processing**
- `POST /api/voice/speech-to-text` - Convert speech to text
  - Body: `{ audioData: base64 }`
  - Response: `{ text: string }`
- `POST /api/voice/text-to-speech` - Convert text to speech
  - Body: `{ text: string, voice?: string }`
  - Response: `{ audioUrl: string }`

#### **Task Management**
- `GET /api/tasks` - Retrieve all tasks
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### **Reminder Management**
- `GET /api/reminders` - Retrieve all reminders
- `GET /api/reminders/:id` - Get specific reminder
- `POST /api/reminders` - Create new reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

#### **Calendar Integration**
- `GET /api/calendar/events` - Retrieve calendar events
- `POST /api/calendar/events` - Create new event
- `PUT /api/calendar/events/:id` - Update event
- `DELETE /api/calendar/events/:id` - Delete event
- `GET /api/calendar/auth` - Initiate Google OAuth
- `GET /api/calendar/auth/callback` - OAuth callback handler

---

## 📱 Frontend Architecture (Mobile)

### Technology Stack
- **Framework**: React Native with Expo
- **Navigation**: React Navigation 6.x
- **UI Library**: React Native Paper
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Voice**: React Native Voice, Expo Speech

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        APP ROOT                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  App.js (NavigationContainer + PaperProvider)          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     NAVIGATION LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Tab Navigator (Bottom Tabs)                           │ │
│  │  - Chat  - Tasks  - Calendar  - Reminders  - Settings │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      SCREEN COMPONENTS                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │   Chat   │ │  Tasks   │ │ Calendar │ │ Reminders│      │
│  │  Screen  │ │  Screen  │ │  Screen  │ │  Screen  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐                                                │
│  │ Settings │                                                │
│  │  Screen  │                                                │
│  └──────────┘                                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │   API    │ │  Socket  │ │Permission│                    │
│  │ Service  │ │ Service  │ │ Service  │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Directory Structure

```
mobile/
├── App.js                   # Main application component
├── app.json                # Expo configuration
├── config.js               # Environment configuration
├── screens/                # Screen components
│   ├── ChatScreen.js       # Voice chat interface
│   ├── TasksScreen.js      # Task management UI
│   ├── CalendarScreen.js   # Calendar view
│   ├── RemindersScreen.js  # Reminder management UI
│   └── SettingsScreen.js   # App settings & preferences
├── services/               # Service layer
│   ├── apiService.js       # HTTP API client
│   ├── socketService.js    # Real-time communication
│   └── permissionService.js # Device permission handler
├── assets/                 # Static assets
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
└── android/                # Android native code (if needed)
```

### Screen Components Detail

#### 1. **ChatScreen** (Voice Assistant)
**Purpose**: Voice-enabled chat interface with AI
- **Features**:
  - Voice input via microphone button
  - Text input as fallback
  - AI-powered responses
  - Speech output (TTS)
  - Conversation history
- **State Management**:
  - `messages`: Chat history
  - `isListening`: Voice recording state
  - `isLoading`: API call state

#### 2. **TasksScreen** (Task Management)
**Purpose**: CRUD operations for tasks
- **Features**:
  - List all tasks
  - Add new task
  - Mark task as complete
  - Edit task details
  - Delete task
- **State Management**:
  - `tasks`: Task array
  - `showDialog`: Modal visibility
  - `selectedTask`: Task being edited

#### 3. **CalendarScreen** (Calendar Integration)
**Purpose**: View and manage calendar events
- **Features**:
  - Monthly calendar view
  - Event list
  - Create/edit events
  - Google Calendar sync
- **State Management**:
  - `events`: Event array
  - `selectedDate`: Currently selected date
  - `showEventDialog`: Modal state

#### 4. **RemindersScreen** (Reminder System)
**Purpose**: Set and manage reminders
- **Features**:
  - List reminders
  - Add new reminder
  - Set time/date
  - Delete reminder
  - Push notifications
- **State Management**:
  - `reminders`: Reminder array
  - `showDialog`: Modal visibility

#### 5. **SettingsScreen** (App Configuration)
**Purpose**: User preferences and app settings
- **Features**:
  - Voice settings (TTS/STT)
  - Notification preferences
  - API configuration
  - Account settings
  - About/Help section
- **State Management**:
  - `settings`: Settings object

---

## 🔄 Data Flow Architecture

### Request-Response Flow

```
┌──────────────┐
│ Mobile App   │
│ (User Input) │
└──────────────┘
       ↓
  HTTP POST/GET
       ↓
┌──────────────┐
│   Express    │
│   Routes     │
└──────────────┘
       ↓
  Middleware Chain
  (CORS, Auth, etc.)
       ↓
┌──────────────┐
│   Route      │
│   Handler    │
└──────────────┘
       ↓
  Business Logic
       ↓
┌──────────────┐
│   Service    │
│   Layer      │
└──────────────┘
       ↓
  External API / DB Query
       ↓
┌──────────────┐
│  Database/   │
│  External API│
└──────────────┘
       ↓
  Response Transformation
       ↓
┌──────────────┐
│   JSON       │
│   Response   │
└──────────────┘
       ↓
┌──────────────┐
│  Mobile App  │
│  (UI Update) │
└──────────────┘
```

### Real-time Communication (Socket.IO)

```
┌─────────────┐                    ┌─────────────┐
│ Mobile App  │←══════════════════→│   Server    │
│   Client    │   WebSocket        │  Socket.IO  │
└─────────────┘   Connection       └─────────────┘
       ↓                                  ↓
  Emit Events                       On Events
       ↓                                  ↓
  - newMessage                      - message
  - taskUpdate                      - taskUpdated
  - reminderAlert                   - reminderTriggered
```

---

## 🗄️ Database Architecture

### Database Schema (SQL Server)

#### **Users Table**
```sql
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
```

#### **Tasks Table**
```sql
CREATE TABLE Tasks (
    TaskID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Status NVARCHAR(20) DEFAULT 'pending',
    Priority NVARCHAR(20) DEFAULT 'medium',
    DueDate DATETIME,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
```

#### **Reminders Table**
```sql
CREATE TABLE Reminders (
    ReminderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    ReminderTime DATETIME NOT NULL,
    IsTriggered BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
```

#### **CalendarEvents Table**
```sql
CREATE TABLE CalendarEvents (
    EventID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    Location NVARCHAR(200),
    GoogleEventID NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
```

#### **ChatHistory Table**
```sql
CREATE TABLE ChatHistory (
    ChatID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Message NVARCHAR(MAX) NOT NULL,
    Response NVARCHAR(MAX),
    Timestamp DATETIME DEFAULT GETDATE()
);
```

---

## 🔐 Security Architecture

### Security Layers

1. **Transport Security**
   - HTTPS/TLS encryption for all API calls
   - WSS (WebSocket Secure) for Socket.IO

2. **Authentication & Authorization**
   - JWT token-based authentication
   - Token refresh mechanism
   - Role-based access control (RBAC)

3. **API Security**
   - Helmet.js for HTTP headers security
   - CORS policy enforcement
   - Rate limiting (100 requests per 15 minutes)
   - Input validation & sanitization

4. **Data Security**
   - Password hashing with bcrypt
   - Sensitive data encryption
   - SQL injection prevention (parameterized queries)
   - XSS protection

### Security Middleware Stack

```
Request → CORS → Helmet → Rate Limit → JWT Auth → Route Handler
```

---

## 🚀 Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                      CLOUD PLATFORM                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Frontend   │  │   Backend    │  │   Database   │      │
│  │  (Expo EAS)  │  │  (Railway/   │  │ (Azure SQL)  │      │
│  │              │  │   Heroku)    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   OpenAI     │  │   Google     │  │   SendGrid   │      │
│  │   API        │  │   Calendar   │  │   (Email)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Scalability Considerations

1. **Horizontal Scaling**
   - Load balancer for multiple server instances
   - Stateless API design
   - Session management with Redis

2. **Vertical Scaling**
   - Database connection pooling
   - Caching layer (Redis)
   - CDN for static assets

3. **Performance Optimization**
   - Database indexing
   - Query optimization
   - API response caching
   - Lazy loading in mobile app

---

## 📊 Monitoring & Logging

### Logging Architecture

```
Application Logs
     ↓
Winston Logger
     ↓
┌────────────────┐
│  Log Levels:   │
│  - Error       │
│  - Warn        │
│  - Info        │
│  - Debug       │
└────────────────┘
     ↓
┌────────────────────────────┐
│  Log Destinations:         │
│  - Console (Development)   │
│  - Files (Production)      │
│  - Cloud Logging Service   │
└────────────────────────────┘
```

### Monitoring Metrics

- **Server Metrics**: CPU, Memory, Request rate
- **Database Metrics**: Connection pool, Query performance
- **API Metrics**: Response time, Error rate
- **Business Metrics**: Active users, Task completion rate

---

## 🔄 CI/CD Pipeline (Future)

```
Code Commit → GitHub Actions → Build → Test → Deploy
                                  ↓        ↓       ↓
                              Unit Tests  Integration  Production
                              Linting     Tests        Environment
```

---

## 📝 Design Patterns Used

1. **MVC Pattern** - Separation of concerns (Model-View-Controller)
2. **Service Layer Pattern** - Business logic abstraction
3. **Repository Pattern** - Data access abstraction
4. **Singleton Pattern** - Database connection pool
5. **Observer Pattern** - Socket.IO event handling
6. **Middleware Pattern** - Express.js request processing

---

## 🎯 Performance Benchmarks (Target)

- **API Response Time**: < 200ms (95th percentile)
- **Database Query Time**: < 50ms (average)
- **Voice Processing**: < 2s (speech-to-text)
- **Real-time Latency**: < 100ms (Socket.IO)
- **Mobile App Load Time**: < 3s (initial load)

---

**Last Updated**: January 1, 2026
