@echo off
echo ========================================
echo Voice Office Assistant - Android Launcher
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Android Studio/Android SDK is available
adb version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Android Debug Bridge (adb) not found
    echo Please make sure Android Studio is installed and ANDROID_HOME is set
    echo You can still run the server and use Expo Go app
)

REM Check if .env file exists, if not create from example
if not exist ".env" (
    echo 📝 Creating .env file from env.example...
    copy env.example .env
    echo ⚠️  Please edit .env file and add your OpenAI API key
    echo.
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    npm install
)

if not exist "mobile\node_modules" (
    echo 📦 Installing mobile dependencies...
    cd mobile
    npm install
    cd ..
)

echo.
echo 🚀 Starting Voice Office Assistant...
echo.

REM Start the server in background
echo 📡 Starting server...
start "Voice Office Assistant Server" cmd /k "npm run dev"

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Start the mobile app
echo 📱 Starting Android app...
cd mobile

REM Check if Android device/emulator is connected
adb devices | find "device$" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Android device/emulator detected
    echo 🚀 Launching on Android device...
    npm run android
) else (
    echo ⚠️  No Android device/emulator detected
    echo 📱 Starting Expo development server...
    echo 📱 You can scan the QR code with Expo Go app
    npm start
)

cd ..

echo.
echo ✅ Voice Office Assistant is now running!
echo.
echo 📡 Server: http://localhost:5000
echo 📱 Mobile: Check your Android device or Expo Go app
echo.
echo Press any key to stop all processes...
pause >nul

REM Kill background processes
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im cmd.exe >nul 2>&1

echo.
echo 👋 Voice Office Assistant stopped.
pause 