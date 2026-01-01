# Voice Office Assistant - Setup Guide

This guide will help you set up and run the intermediate voice-enabled office assistant chatbot.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git**

## Step 1: Clone and Install Dependencies

```bash
# Clone the repository (if using git)
git clone <repository-url>
cd voice-office-chatbot

# Install backend dependencies
npm install

# Install mobile app dependencies
cd mobile
npm install
cd ..
```

## Step 2: Environment Configuration

1. **Copy the environment file:**
```bash
cp env.example .env
```

2. **Edit the `.env` file** with your API keys:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Google Calendar API (optional for now)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# JWT Secret (generate a random string)
JWT_SECRET=your_random_jwt_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Getting API Keys

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Create a new API key
5. Copy the key to your `.env` file

#### Google Calendar API (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add the client ID and secret to your `.env` file

## Step 3: Start the Backend Server

```bash
# Start the development server
npm run dev
```

You should see:
```
🚀 Voice Office Assistant server running on port 3000
📱 Health check: http://localhost:3000/health
```

## Step 4: Start the Mobile App

```bash
# In a new terminal, start the mobile app
npm run mobile
```

This will open the Expo development server. You can:
- **Scan the QR code** with Expo Go app on your phone
- **Press 'a'** to open on Android emulator
- **Press 'i'** to open on iOS simulator
- **Press 'w'** to open in web browser

## Step 5: Test the Application

### Backend Testing
1. Open your browser and go to `http://localhost:3000/health`
2. You should see: `{"status":"OK","message":"Voice Office Assistant is running!"}`

### Mobile App Testing
1. Open the app on your device/emulator
2. Grant microphone permissions when prompted
3. Tap the microphone button to test voice input
4. Type a message and press "Send" to test text input

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process using port 3000
npx kill-port 3000
# Then restart the server
npm run dev
```

#### 2. Expo CLI Not Found
```bash
npm install -g @expo/cli
```

#### 3. Mobile App Can't Connect to Backend
- Make sure the backend is running on port 3000
- Check that your device/emulator can reach `localhost:3000`
- For physical devices, you may need to use your computer's IP address

#### 4. Voice Recognition Not Working
- Ensure microphone permissions are granted
- Check that you're using a supported device/browser
- Try restarting the app

#### 5. OpenAI API Errors
- Verify your API key is correct
- Check your OpenAI account has sufficient credits
- Ensure the API key has the necessary permissions

### Development Tips

#### Backend Development
```bash
# Run with auto-restart on file changes
npm run dev

# Check server logs
# The server will log all API requests and errors
```

#### Mobile App Development
```bash
# Start with clear cache
expo start -c

# Run on specific platform
expo start --android
expo start --ios
```

#### API Testing
You can test the API endpoints using tools like:
- **Postman**
- **curl**
- **Thunder Client** (VS Code extension)

Example API test:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

## Project Structure

```
voice-office-chatbot/
├── server/                 # Backend Node.js server
│   ├── index.js           # Main server file
│   ├── routes/            # API routes
│   │   ├── chat.js        # Chat functionality
│   │   ├── voice.js       # Voice processing
│   │   ├── calendar.js    # Calendar integration
│   │   ├── tasks.js       # Task management
│   │   └── reminders.js   # Reminder system
├── mobile/                # React Native app
│   ├── App.js            # Main app component
│   ├── screens/          # App screens
│   │   └── ChatScreen.js # Main chat interface
│   └── services/         # API and utility services
├── package.json          # Backend dependencies
├── mobile/package.json   # Mobile app dependencies
├── .env                  # Environment variables
└── README.md            # Project documentation
```

## Next Steps

### Adding Real Voice Services
1. **Google Speech-to-Text**: Add Google Cloud Speech API
2. **Azure Speech Services**: Implement Microsoft's speech services
3. **AWS Transcribe**: Use Amazon's transcription service

### Adding Database
1. **SQLite**: For local development
2. **PostgreSQL**: For production
3. **MongoDB**: For document storage

### Adding Authentication
1. **JWT tokens**: For user authentication
2. **OAuth 2.0**: For Google/Microsoft integration
3. **Role-based access**: For team management

### Deployment
1. **Backend**: Deploy to Heroku, Railway, or AWS
2. **Mobile**: Build and publish to App Store/Play Store
3. **Database**: Set up cloud database

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all dependencies are properly installed
4. Verify your API keys are correct

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy coding! 🚀** 