# Voice Office Assistant - Complete Project Structure

## 📁 Directory Tree

```
voice-office-chatbot/
│
├── 📄 README.md                          # Project overview and quick start guide
├── 📄 LICENSE                            # MIT License
├── 📄 .gitignore                         # Git ignore rules
├── 📄 .env                               # Environment variables (gitignored)
├── 📄 env.example                        # Environment template
├── 📄 package.json                       # Backend dependencies and scripts
├── 📄 package-lock.json                  # Locked dependency versions
│
├── 📄 PROJECT_SUMMARY.md                 # Project summary and roadmap
├── 📄 SETUP.md                           # Detailed setup instructions
├── 📄 SOLUTION.md                        # Solution architecture
│
├── 📄 run-android.bat                    # Windows batch script to run Android
├── 📄 run-android.ps1                    # PowerShell script for Android
├── 📄 setup-env.bat                      # Environment setup script
├── 📄 start-app.ps1                      # PowerShell app starter
├── 📄 test-project.bat                   # Project testing script
│
├── 📂 server/                            # Backend Node.js server
│   │
│   ├── 📄 index.js                       # Main server entry point
│   │   ├── Express.js setup
│   │   ├── Middleware configuration
│   │   ├── Route loading
│   │   ├── Socket.IO initialization
│   │   ├── Database connection
│   │   ├── Error handling
│   │   └── Server startup
│   │
│   ├── 📂 config/                        # Configuration files
│   │   └── 📄 database.js                # SQL Server connection pool
│   │       ├── Connection configuration
│   │       ├── getConnection()
│   │       ├── closeConnection()
│   │       └── Connection pool management
│   │
│   ├── 📂 routes/                        # API route handlers
│   │   │
│   │   ├── 📄 chat.js                    # Chat & AI endpoints
│   │   │   ├── POST /api/chat
│   │   │   ├── OpenAI GPT integration
│   │   │   ├── Conversation management
│   │   │   └── Response generation
│   │   │
│   │   ├── 📄 tasks.js                   # Task management endpoints
│   │   │   ├── GET /api/tasks
│   │   │   ├── GET /api/tasks/:id
│   │   │   ├── POST /api/tasks
│   │   │   ├── PUT /api/tasks/:id
│   │   │   ├── DELETE /api/tasks/:id
│   │   │   └── Database CRUD operations
│   │   │
│   │   ├── 📄 reminders.js               # Reminder management endpoints
│   │   │   ├── GET /api/reminders
│   │   │   ├── POST /api/reminders
│   │   │   ├── PUT /api/reminders/:id
│   │   │   ├── DELETE /api/reminders/:id
│   │   │   └── Notification scheduling
│   │   │
│   │   ├── 📄 calendar.js                # Calendar integration endpoints
│   │   │   ├── GET /api/calendar/events
│   │   │   ├── POST /api/calendar/events
│   │   │   ├── PUT /api/calendar/events/:id
│   │   │   ├── DELETE /api/calendar/events/:id
│   │   │   ├── GET /api/calendar/auth
│   │   │   ├── GET /api/calendar/auth/callback
│   │   │   └── Google Calendar OAuth
│   │   │
│   │   └── 📄 voice.js                   # Voice processing endpoints
│   │       ├── POST /api/voice/speech-to-text
│   │       ├── POST /api/voice/text-to-speech
│   │       ├── Audio processing
│   │       └── Speech recognition
│   │
│   ├── 📂 services/                      # Business logic services
│   │   └── 📄 socketService.js           # Socket.IO real-time service
│   │       ├── initSocket()
│   │       ├── Event handlers
│   │       ├── Room management
│   │       └── Real-time messaging
│   │
│   ├── 📂 middleware/                    # Custom middleware (future)
│   │   ├── 📄 auth.js                    # JWT authentication
│   │   ├── 📄 validation.js              # Input validation
│   │   └── 📄 rateLimit.js               # Rate limiting
│   │
│   ├── 📂 models/                        # Database models (future)
│   │   ├── 📄 User.js
│   │   ├── 📄 Task.js
│   │   ├── 📄 Reminder.js
│   │   └── 📄 CalendarEvent.js
│   │
│   ├── 📂 utils/                         # Utility functions (future)
│   │   ├── 📄 logger.js                  # Winston logger
│   │   ├── 📄 validation.js              # Data validation
│   │   └── 📄 errorHandler.js            # Error utilities
│   │
│   └── 📄 README-DB-CONNECTION.md        # Database connection guide
│
├── 📂 mobile/                            # React Native mobile application
│   │
│   ├── 📄 App.js                         # Main app component
│   │   ├── NavigationContainer
│   │   ├── Tab Navigator
│   │   ├── Permission checks
│   │   └── App initialization
│   │
│   ├── 📄 app.json                       # Expo configuration
│   │   ├── App name and slug
│   │   ├── Version info
│   │   ├── Orientation settings
│   │   ├── Icons and splash screens
│   │   └── Platform-specific configs
│   │
│   ├── 📄 config.js                      # App configuration
│   │   ├── API_URL
│   │   ├── Environment settings
│   │   └── Feature flags
│   │
│   ├── 📄 package.json                   # Mobile dependencies
│   ├── 📄 package-lock.json              # Locked versions
│   │
│   ├── 📂 screens/                       # Screen components
│   │   │
│   │   ├── 📄 ChatScreen.js              # Voice chat interface
│   │   │   ├── Voice recording button
│   │   │   ├── Message list
│   │   │   ├── Text input fallback
│   │   │   ├── Speech-to-text integration
│   │   │   ├── Text-to-speech output
│   │   │   └── AI response handling
│   │   │
│   │   ├── 📄 TasksScreen.js             # Task management UI
│   │   │   ├── Task list display
│   │   │   ├── Add task dialog
│   │   │   ├── Edit task functionality
│   │   │   ├── Task completion toggle
│   │   │   ├── Delete task action
│   │   │   ├── Filter by status/priority
│   │   │   └── Task details view
│   │   │
│   │   ├── 📄 CalendarScreen.js          # Calendar view
│   │   │   ├── Monthly calendar display
│   │   │   ├── Event list
│   │   │   ├── Add event dialog
│   │   │   ├── Edit event functionality
│   │   │   ├── Google Calendar sync
│   │   │   └── Event reminders
│   │   │
│   │   ├── 📄 RemindersScreen.js         # Reminder management UI
│   │   │   ├── Reminder list
│   │   │   ├── Add reminder dialog
│   │   │   ├── Date/time picker
│   │   │   ├── Repeat options
│   │   │   ├── Delete reminder
│   │   │   └── Notification settings
│   │   │
│   │   └── 📄 SettingsScreen.js          # App settings & preferences
│   │       ├── Voice settings
│   │       ├── Notification preferences
│   │       ├── API configuration
│   │       ├── Account settings
│   │       ├── Theme selection
│   │       ├── Language settings
│   │       └── About/Help section
│   │
│   ├── 📂 services/                      # Service layer
│   │   │
│   │   ├── 📄 apiService.js              # HTTP API client
│   │   │   ├── Axios configuration
│   │   │   ├── sendMessage()
│   │   │   ├── getTasks()
│   │   │   ├── createTask()
│   │   │   ├── updateTask()
│   │   │   ├── deleteTask()
│   │   │   ├── getReminders()
│   │   │   ├── createReminder()
│   │   │   ├── getCalendarEvents()
│   │   │   ├── Error handling
│   │   │   └── Request interceptors
│   │   │
│   │   ├── 📄 socketService.js           # WebSocket client
│   │   │   ├── Socket.IO client
│   │   │   ├── connect()
│   │   │   ├── disconnect()
│   │   │   ├── Event listeners
│   │   │   ├── Emit events
│   │   │   └── Real-time updates
│   │   │
│   │   └── 📄 permissionService.js       # Device permission handler
│   │       ├── checkPermissions()
│   │       ├── requestMicrophone()
│   │       ├── requestNotifications()
│   │       ├── requestCalendar()
│   │       └── Permission status checks
│   │
│   ├── 📂 components/                    # Reusable UI components (future)
│   │   ├── 📄 MessageBubble.js
│   │   ├── 📄 TaskItem.js
│   │   ├── 📄 EventCard.js
│   │   ├── 📄 ReminderItem.js
│   │   └── 📄 VoiceButton.js
│   │
│   ├── 📂 assets/                        # Static assets
│   │   ├── 🖼️ icon.png                   # App icon
│   │   ├── 🖼️ splash.png                 # Splash screen
│   │   ├── 🖼️ adaptive-icon.png          # Android adaptive icon
│   │   ├── 📂 images/                    # Image assets
│   │   └── 📂 fonts/                     # Custom fonts
│   │
│   ├── 📂 android/                       # Android native code
│   │   ├── 📂 app/
│   │   │   ├── 📂 src/
│   │   │   ├── 📄 build.gradle
│   │   │   └── 📄 AndroidManifest.xml
│   │   ├── 📄 build.gradle
│   │   └── 📄 settings.gradle
│   │
│   ├── 📂 ios/                           # iOS native code (if generated)
│   │   ├── 📂 VoiceAssistant/
│   │   ├── 📂 VoiceAssistant.xcodeproj/
│   │   └── 📄 Podfile
│   │
│   └── 📂 .expo/                         # Expo cache (gitignored)
│
├── 📂 docs/                              # Documentation
│   │
│   ├── 📄 PROJECT_ARCHITECTURE.md        # System architecture documentation
│   │   ├── High-level architecture
│   │   ├── Backend architecture
│   │   ├── Frontend architecture
│   │   ├── Data flow diagrams
│   │   ├── Database architecture
│   │   ├── Security architecture
│   │   ├── Deployment architecture
│   │   └── Design patterns
│   │
│   ├── 📄 API_DOCUMENTATION.md           # Complete API reference
│   │   ├── Endpoint documentation
│   │   ├── Request/response examples
│   │   ├── Error handling
│   │   ├── WebSocket events
│   │   ├── Rate limiting
│   │   └── Security guidelines
│   │
│   ├── 📄 DEVELOPMENT_GUIDE.md           # Developer setup guide
│   │   ├── Prerequisites
│   │   ├── Environment setup
│   │   ├── Running the app
│   │   ├── Testing guidelines
│   │   ├── Debugging tips
│   │   ├── Deployment instructions
│   │   └── Troubleshooting
│   │
│   ├── 📄 DATABASE_SCHEMA.md             # Database documentation
│   │   ├── ERD diagrams
│   │   ├── Table schemas
│   │   ├── Stored procedures
│   │   ├── Triggers
│   │   ├── Indexes
│   │   └── Optimization tips
│   │
│   ├── 📄 USER_GUIDE.md                  # End-user documentation (future)
│   ├── 📄 CONTRIBUTING.md                # Contribution guidelines (future)
│   ├── 📄 CHANGELOG.md                   # Version history (future)
│   └── 📂 images/                        # Documentation images
│
├── 📂 database/                          # Database scripts (future)
│   ├── 📄 schema.sql                     # Database schema
│   ├── 📄 sample_data.sql                # Sample data
│   ├── 📄 migrations/                    # Database migrations
│   └── 📄 backups/                       # Backup scripts
│
├── 📂 tests/                             # Test files (future)
│   ├── 📂 unit/                          # Unit tests
│   ├── 📂 integration/                   # Integration tests
│   ├── 📂 e2e/                           # End-to-end tests
│   └── 📄 jest.config.js                 # Jest configuration
│
├── 📂 scripts/                           # Utility scripts (future)
│   ├── 📄 setup.sh                       # Unix setup script
│   ├── 📄 deploy.sh                      # Deployment script
│   └── 📄 seed-db.js                     # Database seeder
│
├── 📂 .vscode/                           # VS Code settings
│   ├── 📄 settings.json                  # Editor settings
│   ├── 📄 launch.json                    # Debug configurations
│   └── 📄 extensions.json                # Recommended extensions
│
├── 📂 .github/                           # GitHub-specific files (future)
│   ├── 📂 workflows/                     # GitHub Actions
│   │   ├── 📄 ci.yml                     # Continuous Integration
│   │   └── 📄 deploy.yml                 # Deployment workflow
│   ├── 📄 ISSUE_TEMPLATE.md              # Issue template
│   └── 📄 PULL_REQUEST_TEMPLATE.md       # PR template
│
└── 📂 node_modules/                      # Dependencies (gitignored)
```

---

## 📊 File Statistics

### Total File Count
- **Backend Files**: ~50 files
- **Mobile Files**: ~100 files
- **Documentation**: 10+ files
- **Configuration**: 15+ files

### Lines of Code (Approximate)
- **Backend**: ~5,000 lines
- **Mobile**: ~3,000 lines
- **Total**: ~8,000 lines

### File Size
- **Project Size**: ~150 MB (with node_modules)
- **Core Code**: ~500 KB
- **Dependencies**: ~150 MB

---

## 🔑 Important Files

### Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| `.env` | Environment variables | Root |
| `package.json` | Backend dependencies | Root |
| `mobile/package.json` | Mobile dependencies | mobile/ |
| `mobile/app.json` | Expo configuration | mobile/ |
| `mobile/config.js` | App settings | mobile/ |

### Entry Points

| File | Purpose | Port/Platform |
|------|---------|---------------|
| `server/index.js` | Backend server | Port 5000 |
| `mobile/App.js` | Mobile app | iOS/Android |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `SETUP.md` | Setup instructions |
| `PROJECT_SUMMARY.md` | Project summary |
| `docs/PROJECT_ARCHITECTURE.md` | Architecture |
| `docs/API_DOCUMENTATION.md` | API reference |
| `docs/DEVELOPMENT_GUIDE.md` | Development guide |
| `docs/DATABASE_SCHEMA.md` | Database schema |

---

## 🎨 File Naming Conventions

### JavaScript Files
- **Components**: PascalCase (e.g., `ChatScreen.js`)
- **Services**: camelCase (e.g., `apiService.js`)
- **Routes**: camelCase (e.g., `tasks.js`)
- **Configuration**: camelCase (e.g., `database.js`)

### Documentation
- **Markdown**: UPPERCASE (e.g., `README.md`)
- **Guides**: UPPERCASE_WITH_UNDERSCORES (e.g., `DEVELOPMENT_GUIDE.md`)

### Scripts
- **PowerShell**: kebab-case.ps1 (e.g., `start-app.ps1`)
- **Batch**: kebab-case.bat (e.g., `run-android.bat`)

---

## 📦 Package Management

### Backend Dependencies (package.json)

**Production:**
- `express` - Web framework
- `socket.io` - Real-time communication
- `openai` - AI integration
- `mssql` - SQL Server driver
- `axios` - HTTP client
- `cors` - CORS middleware
- `helmet` - Security headers
- `dotenv` - Environment variables
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `winston` - Logging
- `googleapis` - Google APIs
- `moment` - Date manipulation

**Development:**
- `nodemon` - Auto-restart server
- `jest` - Testing framework
- `supertest` - API testing
- `eslint` - Code linting
- `prettier` - Code formatting

### Mobile Dependencies (mobile/package.json)

**Production:**
- `react` - UI library
- `react-native` - Mobile framework
- `expo` - Development platform
- `@react-navigation/native` - Navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `react-native-paper` - UI components
- `axios` - HTTP client
- `socket.io-client` - WebSocket client
- `@expo/vector-icons` - Icons
- `expo-speech` - Text-to-speech
- `react-native-voice` - Speech-to-text

---

## 🔐 Gitignore Highlights

```gitignore
# Environment
.env
.env.local

# Dependencies
node_modules/
mobile/node_modules/

# Expo
.expo/
.expo-shared/

# Build outputs
dist/
build/
*.apk
*.ipa

# Logs
*.log
npm-debug.log*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

---

## 🚀 Quick Navigation

### For Developers
1. Start here: `DEVELOPMENT_GUIDE.md`
2. API reference: `API_DOCUMENTATION.md`
3. Architecture: `PROJECT_ARCHITECTURE.md`
4. Database: `DATABASE_SCHEMA.md`

### For Users
1. Start here: `README.md`
2. Setup: `SETUP.md`
3. Features: `PROJECT_SUMMARY.md`

### For Contributors
1. Guidelines: `CONTRIBUTING.md` (future)
2. Code style: `.eslintrc.js` (future)
3. Testing: `tests/` (future)

---

## 🔄 Continuous Updates

This project structure is designed to be:
- ✅ **Scalable** - Easy to add new features
- ✅ **Maintainable** - Clear organization
- ✅ **Documented** - Comprehensive docs
- ✅ **Modular** - Independent components
- ✅ **Testable** - Test-friendly structure

---

## 📈 Future Additions

Planned directories and files:
- `tests/` - Comprehensive test suite
- `docker/` - Docker containers
- `.github/workflows/` - CI/CD pipelines
- `scripts/` - Automation scripts
- `docs/USER_GUIDE.md` - End-user documentation
- `CONTRIBUTING.md` - Contribution guidelines

---

**Last Updated**: January 1, 2026  
**Project Version**: 1.0.0
