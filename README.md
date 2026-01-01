# Voice Office Assistant

## Project Overview

Voice Office Assistant is a full-stack, voice-enabled office productivity application designed to streamline task management, calendar scheduling, and office communication through natural voice interaction and AI-powered assistance.

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Problem Statement

Modern office workers face several productivity challenges:

1. **Time-Consuming Manual Entry**: Creating tasks, reminders, and calendar events through traditional interfaces is inefficient
2. **Context Switching**: Switching between multiple productivity applications disrupts workflow
3. **Accessibility Barriers**: Traditional text-based interfaces limit accessibility for users who prefer or require voice interaction
4. **Lack of Intelligence**: Most productivity tools lack contextual understanding and proactive assistance

## Objectives

The Voice Office Assistant aims to address these challenges by:

1. **Enable Voice Interaction**: Provide hands-free task and schedule management through voice commands
2. **Centralize Productivity Tools**: Integrate task management, calendar, and reminders in a single application
3. **Leverage AI Assistance**: Use OpenAI GPT to understand context and provide intelligent responses
4. **Improve Accessibility**: Offer voice-based interface as an alternative to traditional text input
5. **Enhance Productivity**: Reduce time spent on routine office tasks through automation

---

## Features

### Core Functionality

**Voice Interaction**
- Speech-to-text for voice command input
- Text-to-speech for audio responses
- Natural language processing for command interpretation

**Task Management**
- Create, read, update, and delete tasks
- Priority levels (low, medium, high, urgent)
- Status tracking (pending, in-progress, completed, cancelled)
- Due date management
- Category and tag organization

**Calendar Integration**
- View calendar events
- Create and modify appointments
- Google Calendar synchronization
- Event reminders and notifications

**Reminder System**
- Set time-based reminders
- Recurring reminder support
- Notification delivery
- Reminder priority levels

**AI-Powered Conversations**
- Natural language understanding
- Context-aware responses
- Intent recognition
- Conversational task creation

**Real-time Communication**
- WebSocket-based instant updates
- Live task synchronization
- Real-time notification delivery

---

## Technology Stack

### Frontend (Mobile Application)

**Framework and Libraries**
- React Native 0.72+
- Expo SDK 49+
- React Navigation 6.x (bottom tabs and stack navigation)
- React Native Paper (Material Design components)

**Communication**
- Axios (HTTP client)
- Socket.IO Client (WebSocket communication)

**Voice Processing**
- React Native Voice (speech-to-text)
- Expo Speech (text-to-speech)

### Backend (Server)

**Runtime and Framework**
- Node.js 16+
- Express.js 4.x
- Socket.IO 4.x

**Artificial Intelligence**
- OpenAI API (GPT-3.5-turbo)

**External Integrations**
- Google Calendar API
- Google OAuth 2.0

**Security**
- JSON Web Tokens (JWT)
- bcryptjs (password hashing)
- Helmet.js (security headers)
- CORS (Cross-Origin Resource Sharing)

**Utilities**
- dotenv (environment variables)
- Winston (logging)
- Moment.js (date manipulation)

### Database

**Database Management System**
- Microsoft SQL Server (Express Edition or higher)
- SQL Server Management Studio (SSMS)

**Database Features**
- Relational data model
- Stored procedures
- Triggers for automatic updates
- Indexed queries for performance

### Development Tools

- Git (version control)
- Visual Studio Code (IDE)
- Postman (API testing)
- Android Studio / Xcode (mobile app testing)
- npm / yarn (package management)

---

## System Requirements

### Development Environment

**Software**
- Node.js version 16.0.0 or higher
- npm version 7.0.0 or higher
- Git version 2.30.0 or higher
- Microsoft SQL Server 2019 or higher
- Expo CLI (installed globally)

**Operating System**
- Windows 10/11
- macOS 11+ (for iOS development)
- Linux (Ubuntu 20.04+ or equivalent)

**Hardware**
- Minimum 8GB RAM (16GB recommended)
- 10GB free disk space
- Microphone for voice testing
- Network connection for API integration

### Production Environment

**Backend Server**
- Node.js 16+ LTS
- 2GB RAM minimum
- Secure HTTPS connection
- WebSocket support

**Database Server**
- Microsoft SQL Server or Azure SQL Database
- 4GB RAM minimum
- Regular backup capability

**Mobile Deployment**
- iOS 13+ (for iOS app)
- Android 6.0+ (API level 23+)

---

## Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/aman7506/voice-office-assistant.git
cd voice-office-assistant
```

### Step 2: Install Backend Dependencies

```bash
npm install
```

### Step 3: Install Mobile Dependencies

```bash
cd mobile
npm install
cd ..
```

Alternatively, install all dependencies at once:

```bash
npm run install-all
```

### Step 4: Configure Environment Variables

Copy the environment template:

```bash
copy .env.example .env
```

Edit `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_key
DB_SERVER=YOUR_SERVER\SQLEXPRESS
DB_NAME=VoiceOfficeAssistant
```

Refer to the Configuration section for detailed environment variable descriptions.

### Step 5: Database Setup

Execute the SQL schema file in SQL Server Management Studio:

```sql
CREATE DATABASE VoiceOfficeAssistant;
GO
-- Execute remaining schema from docs/DATABASE_SCHEMA.md
```

Detailed database setup instructions are available in DEPLOYMENT_GUIDE.md.

### Step 6: Verify Installation

Test backend server:

```bash
npm run dev
```

Test mobile application:

```bash
npm run mobile
```

Access health check endpoint:

```
http://localhost:5000/health
```

---

## Configuration

### Backend Environment Variables

**Server Configuration**
- `PORT`: Server port number (default: 5000)
- `NODE_ENV`: Environment mode (development | production)

**OpenAI Configuration**
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: Model to use (default: gpt-3.5-turbo)

**Database Configuration**
- `DB_SERVER`: SQL Server instance name
- `DB_NAME`: Database name
- `DB_PORT`: Database port (default: 1433)
- `DB_USER`: Database username (for SQL authentication)
- `DB_PASSWORD`: Database password (for SQL authentication)

**Authentication Configuration**
- `JWT_SECRET`: Secret key for JWT signing (minimum 32 characters)
- `JWT_EXPIRES_IN`: Token expiration time (default: 24h)

**Google Calendar Configuration**
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: OAuth callback URL

**Security Configuration**
- `CORS_ORIGIN`: Allowed CORS origins (comma-separated)
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window (milliseconds)
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window

### Mobile Application Configuration

Edit `mobile/config.js`:

```javascript
const ENV = {
  development: {
    apiUrl: 'http://localhost:5000',
  },
  production: {
    apiUrl: 'https://your-production-api.com',
  },
};
```

---

## Usage

### Starting the Application

**Backend Server (Development)**

```bash
npm run dev
```

Server will start on http://localhost:5000

**Mobile Application (Development)**

```bash
npm run mobile
```

Scan QR code with Expo Go app on your mobile device.

**Mobile Application (Android Emulator)**

```bash
npm run mobile:android
```

**Mobile Application (iOS Simulator)**

```bash
npm run mobile:ios
```

### Voice Commands

The application supports natural language voice commands:

**Task Management**
- "Create a task to review the quarterly report"
- "Show my pending tasks"
- "Mark the project proposal task as complete"
- "Delete the old reminder"

**Calendar Management**
- "Schedule a meeting with John tomorrow at 2 PM"
- "What meetings do I have today"
- "Cancel the team meeting"

**General Queries**
- "What is my schedule for today"
- "Set a reminder to call the client"

---

## API Endpoints

### Health Check

```
GET /health
```

Returns server status and service availability.

### Chat and AI

```
POST /api/chat
```

Send messages to AI assistant and receive intelligent responses.

### Task Management

```
GET    /api/tasks          # Retrieve all tasks
GET    /api/tasks/:id      # Get specific task
POST   /api/tasks          # Create new task
PUT    /api/tasks/:id      # Update task
DELETE /api/tasks/:id      # Delete task
```

### Reminder Management

```
GET    /api/reminders          # Retrieve all reminders
GET    /api/reminders/:id      # Get specific reminder
POST   /api/reminders          # Create new reminder
PUT    /api/reminders/:id      # Update reminder
DELETE /api/reminders/:id      # Delete reminder
```

### Calendar Integration

```
GET    /api/calendar/events          # Retrieve calendar events
POST   /api/calendar/events          # Create new event
PUT    /api/calendar/events/:id      # Update event
DELETE /api/calendar/events/:id      # Delete event
GET    /api/calendar/auth            # Initiate Google OAuth
GET    /api/calendar/auth/callback   # OAuth callback handler
```

### Voice Processing

```
POST /api/voice/speech-to-text       # Convert audio to text
POST /api/voice/text-to-speech       # Convert text to audio
```

Complete API documentation available in `docs/API_DOCUMENTATION.md`.

---

## Project Structure

```
voice-office-assistant/
├── server/                  # Backend application
│   ├── index.js            # Server entry point
│   ├── config/             # Configuration files
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic
│   └── middleware/         # Custom middleware
├── mobile/                 # Mobile application
│   ├── App.js             # App entry point
│   ├── screens/           # Screen components
│   ├── services/          # API and socket services
│   └── assets/            # Images and static files
├── docs/                  # Documentation
│   ├── PROJECT_ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── DEPLOYMENT_GUIDE.md
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── package.json          # Backend dependencies
└── README.md             # This file
```

---

## Development Workflow

### Git Workflow

1. Create feature branch from main
2. Implement changes with frequent commits
3. Write tests for new functionality
4. Submit pull request for review
5. Merge after approval and passing tests

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(tasks): add priority filtering

- Implement priority filter in task list
- Add UI controls for filter selection
- Update API endpoint to support filtering

Closes #42
```

### Code Style

- Follow ESLint configuration
- Use Prettier for code formatting
- Write descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused

---

## Testing

### Backend Testing

```bash
npm test
```

### API Testing

Use Postman collection provided in `docs/postman_collection.json` or test endpoints manually:

```bash
curl http://localhost:5000/health
```

### Mobile Testing

Test on physical device using Expo Go for best results:

1. Install Expo Go from app store
2. Run `npm run mobile`
3. Scan QR code with Expo Go
4. Test voice features with device microphone

---

## Deployment

### Backend Deployment (Railway/Render)

Detailed deployment instructions available in `docs/DEPLOYMENT_GUIDE.md`.

Quick steps:

1. Create account on Railway or Render
2. Connect GitHub repository
3. Configure environment variables
4. Deploy from main branch

### Mobile Deployment (Expo EAS)

```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

### Database Deployment (Azure SQL)

1. Create Azure SQL Database
2. Configure firewall rules
3. Update connection string in .env
4. Run database schema scripts

Complete deployment checklist available in DEPLOYMENT_GUIDE.md.

---

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Update documentation
6. Submit pull request

Ensure all tests pass and code follows project style guidelines.

---

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

## Contact

**Developer**: Aman Mishra

**GitHub**: https://github.com/aman7506

**Project Repository**: https://github.com/aman7506/voice-office-assistant

**Email**: Contact via GitHub profile

**Issues**: Report bugs and feature requests via GitHub Issues

**Documentation**: Complete documentation available in docs/ folder

---

## Acknowledgments

This project utilizes the following technologies and services:

- OpenAI for AI capabilities
- Google for Calendar API integration
- Microsoft for SQL Server database
- React Native and Expo communities for mobile framework
- Express.js and Node.js communities for backend framework

---

**Version**: 1.0.0

**Last Updated**: January 2026

**Status**: Production Ready