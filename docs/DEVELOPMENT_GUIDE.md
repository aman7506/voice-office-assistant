# Voice Office Assistant - Development Guide

## 🚀 Getting Started

This guide will help you set up your development environment and start contributing to the Voice Office Assistant project.

---

## 📋 Prerequisites

### Required Software

1. **Node.js** (v16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (v7 or higher) or **yarn**
   - Comes with Node.js
   - Verify: `npm --version`

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify: `git --version`

4. **SQL Server** (Express Edition or higher)
   - Download from [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
   - SQL Server Management Studio (SSMS) recommended

5. **Expo CLI** (for mobile development)
   ```bash
   npm install -g expo-cli
   ```

6. **Code Editor**
   - Visual Studio Code (recommended)
   - Plugins: ESLint, Prettier, React Native Tools

### Optional Tools

- **Postman** - API testing ([postman.com](https://www.postman.com/))
- **Android Studio** - Android emulator
- **Xcode** - iOS simulator (Mac only)
- **React DevTools** - React debugging

---

## 🔧 Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/voice-office-chatbot.git
cd voice-office-chatbot
```

### 2. Install Dependencies

#### Root Dependencies (Backend)
```bash
npm install
```

#### Mobile Dependencies
```bash
cd mobile
npm install
cd ..
```

**Or install all at once:**
```bash
npm run install-all
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Google Calendar OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/calendar/auth/callback

# JWT Configuration
JWT_SECRET=your_random_jwt_secret_here
JWT_EXPIRES_IN=24h

# Database Configuration (Windows Authentication)
DB_SERVER=YOUR_SERVER\\SQLEXPRESS
DB_NAME=VoiceOfficeAssistant
DB_PORT=1433
DB_INSTANCE=SQLEXPRESS

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:19006

# Socket.IO Configuration
SOCKET_CORS_ORIGIN=http://localhost:3000,http://localhost:19006
```

### 4. Database Setup

#### Create Database

Open SQL Server Management Studio (SSMS) and run:

```sql
CREATE DATABASE VoiceOfficeAssistant;
GO

USE VoiceOfficeAssistant;
GO
```

#### Create Tables

```sql
-- Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Tasks Table
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

-- Reminders Table
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

-- CalendarEvents Table
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

-- ChatHistory Table
CREATE TABLE ChatHistory (
    ChatID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Message NVARCHAR(MAX) NOT NULL,
    Response NVARCHAR(MAX),
    Timestamp DATETIME DEFAULT GETDATE()
);

-- VoiceLogs Table (Optional)
CREATE TABLE VoiceLogs (
    LogID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    AudioInput NVARCHAR(MAX),
    TextOutput NVARCHAR(MAX),
    Confidence DECIMAL(5,2),
    ProcessingTime INT,
    Timestamp DATETIME DEFAULT GETDATE()
);
```

#### Insert Sample Data (Optional)

```sql
-- Sample User
INSERT INTO Users (Username, Email, PasswordHash)
VALUES ('testuser', 'test@example.com', 'hashed_password_here');

-- Sample Tasks
INSERT INTO Tasks (UserID, Title, Description, Status, Priority, DueDate)
VALUES 
    (1, 'Prepare quarterly report', 'Compile Q4 2025 financial data', 'in-progress', 'high', '2026-01-15'),
    (1, 'Review project proposal', 'Review and approve new project', 'pending', 'medium', '2026-01-10');

-- Sample Reminders
INSERT INTO Reminders (UserID, Title, Description, ReminderTime)
VALUES 
    (1, 'Team meeting', 'Weekly team sync', '2026-01-02 09:00:00'),
    (1, 'Submit report', 'Monthly status report', '2026-01-05 17:00:00');
```

### 5. Test Database Connection

```bash
npm run test-db
```

Expected output:
```
✅ Database connection successful
Database: VoiceOfficeAssistant
Server: YOUR_SERVER\SQLEXPRESS
```

---

## 🏃 Running the Application

### Development Mode

#### Option 1: Start Backend and Frontend Separately

**Terminal 1 - Backend Server:**
```bash
npm run dev
```

**Terminal 2 - Mobile App:**
```bash
npm run mobile
```

#### Option 2: Using Convenience Scripts

**Windows (PowerShell):**
```powershell
.\start-app.ps1
```

**Windows (Batch):**
```batch
.\run-android.bat
```

### Production Mode

```bash
# Start backend in production
npm start

# Build mobile app
cd mobile
expo build:android
expo build:ios
```

---

## 🧪 Testing

### Backend Testing

#### Manual API Testing with cURL

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Send Chat Message:**
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, assistant!"}'
```

**Get Tasks:**
```bash
curl http://localhost:5000/api/tasks
```

**Create Task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task",
    "description": "Testing API",
    "priority": "medium"
  }'
```

#### Using Postman

1. Import the collection: `docs/postman_collection.json`
2. Set environment variables
3. Run requests

### Mobile App Testing

#### On Real Device (Recommended)

1. Install Expo Go app from Play Store/App Store
2. Run `npm run mobile`
3. Scan QR code with Expo Go

#### On Emulator/Simulator

**Android Emulator:**
```bash
npm run mobile:android
```

**iOS Simulator (Mac only):**
```bash
npm run mobile:ios
```

**Web Browser:**
```bash
npm run mobile:web
```

---

## 📂 Project Structure

```
voice-office-chatbot/
├── server/                      # Backend Node.js server
│   ├── index.js                 # Main server file
│   ├── config/                  # Configuration files
│   │   └── database.js          # Database connection
│   ├── routes/                  # API route handlers
│   │   ├── chat.js              # Chat endpoints
│   │   ├── tasks.js             # Task management
│   │   ├── reminders.js         # Reminder management
│   │   ├── calendar.js          # Calendar integration
│   │   └── voice.js             # Voice processing
│   ├── services/                # Business logic
│   │   └── socketService.js     # Socket.IO service
│   └── middleware/              # Custom middleware
│       └── auth.js              # Authentication (future)
│
├── mobile/                      # React Native mobile app
│   ├── App.js                   # Main app component
│   ├── app.json                 # Expo configuration
│   ├── config.js                # App configuration
│   ├── screens/                 # Screen components
│   │   ├── ChatScreen.js        # Voice chat interface
│   │   ├── TasksScreen.js       # Task management UI
│   │   ├── CalendarScreen.js    # Calendar view
│   │   ├── RemindersScreen.js   # Reminder UI
│   │   └── SettingsScreen.js    # App settings
│   ├── services/                # Service layer
│   │   ├── apiService.js        # HTTP API client
│   │   ├── socketService.js     # WebSocket client
│   │   └── permissionService.js # Device permissions
│   ├── components/              # Reusable components (future)
│   ├── assets/                  # Images, fonts, etc.
│   └── android/                 # Android native code
│
├── docs/                        # Documentation
│   ├── PROJECT_ARCHITECTURE.md  # System architecture
│   ├── API_DOCUMENTATION.md     # API reference
│   ├── DEVELOPMENT_GUIDE.md     # This file
│   └── DATABASE_SCHEMA.md       # Database structure
│
├── .env                         # Environment variables (gitignored)
├── .gitignore                   # Git ignore rules
├── package.json                 # Backend dependencies
├── README.md                    # Project overview
└── LICENSE                      # MIT License
```

---

## 🛠️ Development Workflow

### Branch Strategy

```
main (production)
  ↓
develop (integration)
  ↓
feature/feature-name (new features)
bugfix/bug-name (bug fixes)
hotfix/critical-fix (urgent production fixes)
```

### Git Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/voice-improvements
   ```

2. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "feat: improve voice recognition accuracy"
   ```

3. **Push to remote:**
   ```bash
   git push origin feature/voice-improvements
   ```

4. **Create Pull Request** on GitHub

5. **Code Review** and merge

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code refactoring
test: adding tests
chore: maintain dependencies, build scripts
```

**Examples:**
```
feat(chat): add typing indicator
fix(tasks): resolve task deletion bug
docs(api): update API documentation
refactor(voice): improve speech processing
```

---

## 🔍 Debugging

### Backend Debugging

#### Enable Debug Logging

Set `LOG_LEVEL=debug` in `.env`

#### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/server/index.js",
      "envFile": "${workspaceFolder}/.env"
    }
  ]
}
```

#### Console Debugging

```javascript
console.log('Debug info:', variable);
console.error('Error:', error);
console.warn('Warning:', message);
```

### Mobile App Debugging

#### React Native Debugger

1. Install: [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
2. Open app in Expo
3. Shake device → "Debug Remote JS"

#### Console Logs

```javascript
console.log('Mobile debug:', data);
console.warn('Mobile warning:', message);
console.error('Mobile error:', error);
```

#### Expo Developer Tools

```bash
npm run mobile
# Opens browser with Expo DevTools
```

---

## 📦 Building for Production

### Backend Deployment

#### Prepare for Production

1. Update `.env`:
   ```env
   NODE_ENV=production
   PORT=80
   ```

2. Build (if using TypeScript):
   ```bash
   npm run build
   ```

3. Start production server:
   ```bash
   npm start
   ```

#### Deploy to Cloud Platform

**Heroku:**
```bash
heroku create voice-assistant-api
git push heroku main
heroku config:set OPENAI_API_KEY=your_key
```

**Railway:**
```bash
railway login
railway init
railway up
```

**Azure:**
```bash
az webapp create --name voice-assistant --resource-group myResourceGroup
```

### Mobile App Deployment

#### Build APK (Android)

```bash
cd mobile
expo build:android
```

**Options:**
- APK for direct installation
- AAB for Google Play Store

#### Build IPA (iOS)

```bash
cd mobile
expo build:ios
```

**Requirements:**
- Apple Developer Account
- Valid certificates

#### Expo Application Services (EAS)

```bash
npm install -g eas-cli
eas build --platform all
eas submit --platform android
eas submit --platform ios
```

---

## 🔐 API Keys Setup

### Get OpenAI API Key

1. Visit [platform.openai.com](https://platform.openai.com/)
2. Create account or sign in
3. Navigate to API Keys
4. Create new secret key
5. Copy to `.env` as `OPENAI_API_KEY`

### Get Google Calendar Credentials

1. Visit [console.cloud.google.com](https://console.cloud.google.com/)
2. Create new project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:5000/api/calendar/auth/callback`
6. Copy Client ID and Secret to `.env`

---

## 🧹 Code Quality

### Linting

**Install ESLint:**
```bash
npm install --save-dev eslint
npx eslint --init
```

**Run Linter:**
```bash
npm run lint
```

### Formatting

**Install Prettier:**
```bash
npm install --save-dev prettier
```

**Format Code:**
```bash
npx prettier --write "**/*.{js,json,md}"
```

### Pre-commit Hooks

**Install Husky:**
```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run lint"
```

---

## 📊 Performance Optimization

### Backend Optimization

1. **Database Indexing**
   ```sql
   CREATE INDEX idx_tasks_userid ON Tasks(UserID);
   CREATE INDEX idx_reminders_time ON Reminders(ReminderTime);
   ```

2. **API Response Caching**
   ```javascript
   const cache = require('node-cache');
   const myCache = new cache({ stdTTL: 600 });
   ```

3. **Connection Pooling**
   - Already configured in `database.js`

### Mobile Optimization

1. **Lazy Loading**
   ```javascript
   const TasksScreen = lazy(() => import('./screens/TasksScreen'));
   ```

2. **Memoization**
   ```javascript
   const MemoizedComponent = React.memo(Component);
   ```

3. **Image Optimization**
   - Use WebP format
   - Compress images
   - Lazy load images

---

## 🐛 Common Issues & Solutions

### Issue: Database Connection Error

**Solution:**
1. Verify SQL Server is running
2. Check `DB_SERVER`, `DB_NAME` in `.env`
3. Ensure Windows Authentication is enabled
4. Run: `npm run test-db`

### Issue: OpenAI API Error

**Solution:**
1. Verify API key in `.env`
2. Check API quota/billing
3. Test with curl:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

### Issue: Mobile App Connection Failed

**Solution:**
1. Ensure backend is running
2. Update `API_URL` in `mobile/config.js`
3. Use device's local IP (not `localhost`)
4. Check firewall settings

### Issue: Voice Recognition Not Working

**Solution:**
1. Grant microphone permissions
2. Test on physical device (not emulator)
3. Check `permissionService.js`

---

## 📚 Additional Resources

### Documentation
- [Node.js Docs](https://nodejs.org/docs)
- [React Native Docs](https://reactnative.dev/docs)
- [Expo Docs](https://docs.expo.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [OpenAI API Docs](https://platform.openai.com/docs)

### Tutorials
- [Building REST APIs with Express](https://www.youtube.com/results?search_query=express+rest+api)
- [React Native Full Course](https://www.youtube.com/results?search_query=react+native+tutorial)
- [Socket.IO Tutorial](https://socket.io/docs/v4/tutorial)

### Community
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)
- [React Native Community](https://www.reactnative.dev/community/overview)
- [Expo Forums](https://forums.expo.dev/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit pull request

**Code Review Checklist:**
- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console.log in production code
- [ ] Environment variables documented
- [ ] Error handling implemented

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details

---

**Last Updated**: January 1, 2026  
**Maintainer**: Development Team
