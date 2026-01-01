# Voice Office Assistant - Database Schema Documentation

## 📊 Database Overview

**Database Name**: `VoiceOfficeAssistant`  
**Database Type**: Microsoft SQL Server  
**Character Set**: Unicode (NVARCHAR)  
**Collation**: SQL_Latin1_General_CP1_CI_AS

---

## 🗂️ Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
└──────┬──────┘
       │
       │ 1:N relationships
       │
   ┌───┴────┬────────┬────────────┬──────────┐
   │        │        │            │          │
   ▼        ▼        ▼            ▼          ▼
┌──────┐ ┌──────┐ ┌─────────┐ ┌─────────┐ ┌──────┐
│Tasks │ │Reminders│ │Calendar │ │  Chat   │ │Voice │
│      │ │      │ │ Events  │ │ History │ │ Logs │
└──────┘ └──────┘ └─────────┘ └─────────┘ └──────┘
```

---

## 📋 Table Schemas

### 1. Users Table

**Purpose**: Store user account information and authentication data.

```sql
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255),
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    PhoneNumber NVARCHAR(20),
    ProfilePicture NVARCHAR(MAX),
    IsActive BIT DEFAULT 1,
    LastLoginAt DATETIME,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
```

#### Column Details

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `UserID` | INT | No | Primary key, auto-increment |
| `Username` | NVARCHAR(50) | No | Unique username |
| `Email` | NVARCHAR(100) | No | Unique email address |
| `PasswordHash` | NVARCHAR(255) | Yes | Bcrypt hashed password |
| `FirstName` | NVARCHAR(50) | Yes | User's first name |
| `LastName` | NVARCHAR(50) | Yes | User's last name |
| `PhoneNumber` | NVARCHAR(20) | Yes | Contact phone number |
| `ProfilePicture` | NVARCHAR(MAX) | Yes | URL or base64 of profile picture |
| `IsActive` | BIT | No | Account active status (default: 1) |
| `LastLoginAt` | DATETIME | Yes | Last login timestamp |
| `CreatedAt` | DATETIME | No | Account creation timestamp |
| `UpdatedAt` | DATETIME | No | Last update timestamp |

#### Indexes

```sql
CREATE UNIQUE INDEX idx_users_username ON Users(Username);
CREATE UNIQUE INDEX idx_users_email ON Users(Email);
CREATE INDEX idx_users_active ON Users(IsActive);
```

---

### 2. Tasks Table

**Purpose**: Store task and to-do items for users.

```sql
CREATE TABLE Tasks (
    TaskID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Status NVARCHAR(20) DEFAULT 'pending',
    Priority NVARCHAR(20) DEFAULT 'medium',
    Category NVARCHAR(50),
    Tags NVARCHAR(MAX),
    DueDate DATETIME,
    CompletedAt DATETIME,
    EstimatedMinutes INT,
    ActualMinutes INT,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT chk_tasks_status CHECK (Status IN ('pending', 'in-progress', 'completed', 'cancelled')),
    CONSTRAINT chk_tasks_priority CHECK (Priority IN ('low', 'medium', 'high', 'urgent'))
);
```

#### Column Details

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `TaskID` | INT | No | Primary key, auto-increment |
| `UserID` | INT | No | Foreign key to Users table |
| `Title` | NVARCHAR(200) | No | Task title/summary |
| `Description` | NVARCHAR(MAX) | Yes | Detailed task description |
| `Status` | NVARCHAR(20) | No | Task status (pending/in-progress/completed/cancelled) |
| `Priority` | NVARCHAR(20) | No | Priority level (low/medium/high/urgent) |
| `Category` | NVARCHAR(50) | Yes | Task category (work/personal/etc.) |
| `Tags` | NVARCHAR(MAX) | Yes | Comma-separated tags |
| `DueDate` | DATETIME | Yes | Task due date and time |
| `CompletedAt` | DATETIME | Yes | Completion timestamp |
| `EstimatedMinutes` | INT | Yes | Estimated time to complete (minutes) |
| `ActualMinutes` | INT | Yes | Actual time spent (minutes) |
| `CreatedAt` | DATETIME | No | Task creation timestamp |
| `UpdatedAt` | DATETIME | No | Last update timestamp |

#### Indexes

```sql
CREATE INDEX idx_tasks_userid ON Tasks(UserID);
CREATE INDEX idx_tasks_status ON Tasks(Status);
CREATE INDEX idx_tasks_priority ON Tasks(Priority);
CREATE INDEX idx_tasks_duedate ON Tasks(DueDate);
CREATE INDEX idx_tasks_created ON Tasks(CreatedAt);
```

#### Status Flow

```
pending → in-progress → completed
   ↓           ↓
cancelled   cancelled
```

---

### 3. Reminders Table

**Purpose**: Store reminder notifications for users.

```sql
CREATE TABLE Reminders (
    ReminderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    ReminderTime DATETIME NOT NULL,
    RepeatType NVARCHAR(20) DEFAULT 'once',
    RepeatInterval INT,
    IsTriggered BIT DEFAULT 0,
    NotificationSent BIT DEFAULT 0,
    Priority NVARCHAR(20) DEFAULT 'medium',
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT chk_reminders_repeat CHECK (RepeatType IN ('once', 'daily', 'weekly', 'monthly', 'custom'))
);
```

#### Column Details

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `ReminderID` | INT | No | Primary key, auto-increment |
| `UserID` | INT | No | Foreign key to Users table |
| `Title` | NVARCHAR(200) | No | Reminder title |
| `Description` | NVARCHAR(MAX) | Yes | Detailed description |
| `ReminderTime` | DATETIME | No | When to trigger reminder |
| `RepeatType` | NVARCHAR(20) | No | Repeat frequency (once/daily/weekly/monthly/custom) |
| `RepeatInterval` | INT | Yes | Interval for custom repeats |
| `IsTriggered` | BIT | No | Whether reminder was triggered |
| `NotificationSent` | BIT | No | Whether notification was sent |
| `Priority` | NVARCHAR(20) | No | Priority level |
| `CreatedAt` | DATETIME | No | Creation timestamp |
| `UpdatedAt` | DATETIME | No | Last update timestamp |

#### Indexes

```sql
CREATE INDEX idx_reminders_userid ON Reminders(UserID);
CREATE INDEX idx_reminders_time ON Reminders(ReminderTime);
CREATE INDEX idx_reminders_triggered ON Reminders(IsTriggered);
CREATE INDEX idx_reminders_sent ON Reminders(NotificationSent);
```

---

### 4. CalendarEvents Table

**Purpose**: Store calendar events and meetings.

```sql
CREATE TABLE CalendarEvents (
    EventID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    Location NVARCHAR(200),
    IsAllDay BIT DEFAULT 0,
    EventType NVARCHAR(50) DEFAULT 'meeting',
    Attendees NVARCHAR(MAX),
    GoogleEventID NVARCHAR(100),
    MicrosoftEventID NVARCHAR(100),
    ReminderMinutes INT DEFAULT 15,
    IsRecurring BIT DEFAULT 0,
    RecurrenceRule NVARCHAR(MAX),
    Color NVARCHAR(7),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT chk_calendar_time CHECK (EndTime > StartTime)
);
```

#### Column Details

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `EventID` | INT | No | Primary key, auto-increment |
| `UserID` | INT | No | Foreign key to Users table |
| `Title` | NVARCHAR(200) | No | Event title |
| `Description` | NVARCHAR(MAX) | Yes | Event description |
| `StartTime` | DATETIME | No | Event start time |
| `EndTime` | DATETIME | No | Event end time (must be > StartTime) |
| `Location` | NVARCHAR(200) | Yes | Event location (physical or virtual) |
| `IsAllDay` | BIT | No | All-day event flag |
| `EventType` | NVARCHAR(50) | No | Event type (meeting/appointment/task/etc.) |
| `Attendees` | NVARCHAR(MAX) | Yes | JSON array of attendee emails |
| `GoogleEventID` | NVARCHAR(100) | Yes | Google Calendar event ID |
| `MicrosoftEventID` | NVARCHAR(100) | Yes | Microsoft Graph event ID |
| `ReminderMinutes` | INT | No | Minutes before event to remind |
| `IsRecurring` | BIT | No | Recurring event flag |
| `RecurrenceRule` | NVARCHAR(MAX) | Yes | iCal recurrence rule |
| `Color` | NVARCHAR(7) | Yes | Event color (hex code) |
| `CreatedAt` | DATETIME | No | Creation timestamp |
| `UpdatedAt` | DATETIME | No | Last update timestamp |

#### Indexes

```sql
CREATE INDEX idx_calendar_userid ON CalendarEvents(UserID);
CREATE INDEX idx_calendar_starttime ON CalendarEvents(StartTime);
CREATE INDEX idx_calendar_endtime ON CalendarEvents(EndTime);
CREATE INDEX idx_calendar_googleid ON CalendarEvents(GoogleEventID);
CREATE INDEX idx_calendar_msid ON CalendarEvents(MicrosoftEventID);
```

---

### 5. ChatHistory Table

**Purpose**: Store conversation history between users and the AI assistant.

```sql
CREATE TABLE ChatHistory (
    ChatID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
    SessionID NVARCHAR(100),
    Message NVARCHAR(MAX) NOT NULL,
    Response NVARCHAR(MAX),
    Intent NVARCHAR(50),
    Confidence DECIMAL(5,2),
    ProcessingTime INT,
    TokensUsed INT,
    Model NVARCHAR(50) DEFAULT 'gpt-3.5-turbo',
    Timestamp DATETIME DEFAULT GETDATE()
);
```

#### Column Details

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `ChatID` | INT | No | Primary key, auto-increment |
| `UserID` | INT | No | Foreign key to Users table |
| `SessionID` | NVARCHAR(100) | Yes | Conversation session identifier |
| `Message` | NVARCHAR(MAX) | No | User's message |
| `Response` | NVARCHAR(MAX) | Yes | AI's response |
| `Intent` | NVARCHAR(50) | Yes | Detected intent (e.g., "create_task") |
| `Confidence` | DECIMAL(5,2) | Yes | Intent detection confidence (0-100) |
| `ProcessingTime` | INT | Yes | Processing time in milliseconds |
| `TokensUsed` | INT | Yes | OpenAI tokens consumed |
| `Model` | NVARCHAR(50) | No | AI model used |
| `Timestamp` | DATETIME | No | Message timestamp |

#### Indexes

```sql
CREATE INDEX idx_chat_userid ON ChatHistory(UserID);
CREATE INDEX idx_chat_sessionid ON ChatHistory(SessionID);
CREATE INDEX idx_chat_timestamp ON ChatHistory(Timestamp);
CREATE INDEX idx_chat_intent ON ChatHistory(Intent);
```

---

### 6. VoiceLogs Table

**Purpose**: Store voice processing logs and metrics.

```sql
CREATE TABLE VoiceLogs (
    LogID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
    AudioDuration DECIMAL(10,2),
    AudioFormat NVARCHAR(20),
    TextOutput NVARCHAR(MAX),
    Confidence DECIMAL(5,2),
    Language NVARCHAR(10) DEFAULT 'en-US',
    ProcessingTime INT,
    ServiceUsed NVARCHAR(50),
    ErrorMessage NVARCHAR(MAX),
    Timestamp DATETIME DEFAULT GETDATE()
);
```

#### Column Details

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `LogID` | INT | No | Primary key, auto-increment |
| `UserID` | INT | No | Foreign key to Users table |
| `AudioDuration` | DECIMAL(10,2) | Yes | Audio length in seconds |
| `AudioFormat` | NVARCHAR(20) | Yes | Audio format (wav/mp3/etc.) |
| `TextOutput` | NVARCHAR(MAX) | Yes | Transcribed text |
| `Confidence` | DECIMAL(5,2) | Yes | Transcription confidence (0-100) |
| `Language` | NVARCHAR(10) | No | Language code (e.g., en-US) |
| `ProcessingTime` | INT | Yes | Processing time in milliseconds |
| `ServiceUsed` | NVARCHAR(50) | Yes | Speech service used (Google/Azure/etc.) |
| `ErrorMessage` | NVARCHAR(MAX) | Yes | Error message if failed |
| `Timestamp` | DATETIME | No | Processing timestamp |

#### Indexes

```sql
CREATE INDEX idx_voice_userid ON VoiceLogs(UserID);
CREATE INDEX idx_voice_timestamp ON VoiceLogs(Timestamp);
CREATE INDEX idx_voice_language ON VoiceLogs(Language);
```

---

## 🔑 Stored Procedures

### GetUserTasks

```sql
CREATE PROCEDURE GetUserTasks
    @UserID INT,
    @Status NVARCHAR(20) = NULL,
    @Priority NVARCHAR(20) = NULL
AS
BEGIN
    SELECT 
        TaskID, Title, Description, Status, Priority, 
        Category, DueDate, CreatedAt, UpdatedAt
    FROM Tasks
    WHERE UserID = @UserID
        AND (@Status IS NULL OR Status = @Status)
        AND (@Priority IS NULL OR Priority = @Priority)
    ORDER BY 
        CASE Priority
            WHEN 'urgent' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            WHEN 'low' THEN 4
        END,
        DueDate ASC;
END;
```

### GetUpcomingReminders

```sql
CREATE PROCEDURE GetUpcomingReminders
    @UserID INT,
    @Hours INT = 24
AS
BEGIN
    SELECT 
        ReminderID, Title, Description, ReminderTime,
        Priority, RepeatType
    FROM Reminders
    WHERE UserID = @UserID
        AND IsTriggered = 0
        AND ReminderTime BETWEEN GETDATE() AND DATEADD(HOUR, @Hours, GETDATE())
    ORDER BY ReminderTime ASC;
END;
```

### GetCalendarEventsInRange

```sql
CREATE PROCEDURE GetCalendarEventsInRange
    @UserID INT,
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SELECT 
        EventID, Title, Description, StartTime, EndTime,
        Location, EventType, Attendees, IsAllDay, Color
    FROM CalendarEvents
    WHERE UserID = @UserID
        AND (
            (StartTime BETWEEN @StartDate AND @EndDate)
            OR (EndTime BETWEEN @StartDate AND @EndDate)
            OR (StartTime <= @StartDate AND EndTime >= @EndDate)
        )
    ORDER BY StartTime ASC;
END;
```

### GetChatHistory

```sql
CREATE PROCEDURE GetChatHistory
    @UserID INT,
    @SessionID NVARCHAR(100) = NULL,
    @Limit INT = 50
AS
BEGIN
    SELECT TOP (@Limit)
        ChatID, Message, Response, Intent, Confidence, Timestamp
    FROM ChatHistory
    WHERE UserID = @UserID
        AND (@SessionID IS NULL OR SessionID = @SessionID)
    ORDER BY Timestamp DESC;
END;
```

---

## 🔄 Triggers

### Update Timestamp Trigger (Tasks)

```sql
CREATE TRIGGER trg_tasks_update
ON Tasks
AFTER UPDATE
AS
BEGIN
    UPDATE Tasks
    SET UpdatedAt = GETDATE()
    WHERE TaskID IN (SELECT TaskID FROM inserted);
END;
```

### Update Timestamp Trigger (Users)

```sql
CREATE TRIGGER trg_users_update
ON Users
AFTER UPDATE
AS
BEGIN
    UPDATE Users
    SET UpdatedAt = GETDATE()
    WHERE UserID IN (SELECT UserID FROM inserted);
END;
```

### Task Completion Trigger

```sql
CREATE TRIGGER trg_task_completed
ON Tasks
AFTER UPDATE
AS
BEGIN
    UPDATE Tasks
    SET CompletedAt = GETDATE()
    WHERE TaskID IN (
        SELECT i.TaskID 
        FROM inserted i 
        INNER JOIN deleted d ON i.TaskID = d.TaskID
        WHERE i.Status = 'completed' AND d.Status <> 'completed'
    );
END;
```

---

## 📊 Views

### ActiveTasksView

```sql
CREATE VIEW ActiveTasksView AS
SELECT 
    u.UserID, u.Username, u.Email,
    t.TaskID, t.Title, t.Status, t.Priority, t.DueDate,
    DATEDIFF(DAY, GETDATE(), t.DueDate) AS DaysUntilDue
FROM Users u
INNER JOIN Tasks t ON u.UserID = t.UserID
WHERE t.Status IN ('pending', 'in-progress')
    AND u.IsActive = 1;
```

### UpcomingEventsView

```sql
CREATE VIEW UpcomingEventsView AS
SELECT 
    u.UserID, u.Username,
    e.EventID, e.Title, e.StartTime, e.EndTime, e.Location,
    DATEDIFF(MINUTE, GETDATE(), e.StartTime) AS MinutesUntilStart
FROM Users u
INNER JOIN CalendarEvents e ON u.UserID = e.UserID
WHERE e.StartTime > GETDATE()
    AND e.StartTime <= DATEADD(DAY, 7, GETDATE())
    AND u.IsActive = 1;
```

---

## 🔒 Security Considerations

### Row-Level Security (Future Enhancement)

```sql
CREATE SECURITY POLICY UserDataPolicy
ADD FILTER PREDICATE dbo.fn_SecurityPredicate(UserID)
ON dbo.Tasks,
ON dbo.Reminders,
ON dbo.CalendarEvents,
ON dbo.ChatHistory
WITH (STATE = ON);
```

### Encryption

- **Passwords**: Hashed using bcrypt (implemented in application)
- **Sensitive Data**: Consider using Always Encrypted for production
- **Connection**: Use TLS/SSL for database connections

---

## 📈 Performance Optimization

### Indexing Strategy

1. **Primary Keys**: Clustered indexes (auto-created)
2. **Foreign Keys**: Non-clustered indexes
3. **Frequent Searches**: Indexes on `UserID`, `Status`, `DueDate`, etc.
4. **Timestamps**: Indexes for date range queries

### Query Optimization Tips

1. Use stored procedures for complex queries
2. Avoid `SELECT *`, specify columns
3. Use appropriate JOIN types
4. Leverage indexed columns in WHERE clauses
5. Use NOLOCK hint for read operations (carefully)

### Maintenance

```sql
-- Update statistics
UPDATE STATISTICS Tasks;
UPDATE STATISTICS Reminders;
UPDATE STATISTICS CalendarEvents;

-- Rebuild indexes
ALTER INDEX ALL ON Tasks REBUILD;
ALTER INDEX ALL ON Reminders REBUILD;
ALTER INDEX ALL ON CalendarEvents REBUILD;
```

---

## 💾 Backup & Recovery

### Backup Script

```sql
BACKUP DATABASE VoiceOfficeAssistant
TO DISK = 'C:\Backups\VoiceOfficeAssistant_Full.bak'
WITH FORMAT, INIT, NAME = 'Full Backup', COMPRESSION;
```

### Restore Script

```sql
RESTORE DATABASE VoiceOfficeAssistant
FROM DISK = 'C:\Backups\VoiceOfficeAssistant_Full.bak'
WITH REPLACE;
```

---

## 🧪 Sample Data Scripts

Located in: `database/sample_data.sql`

---

## 📝 Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-01 | Initial database schema |

---

**Last Updated**: January 1, 2026  
**Database Version**: 1.0
