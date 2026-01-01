# Voice Office Assistant - Android Launcher (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Voice Office Assistant - Android Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Android Studio/Android SDK is available
try {
    adb version | Out-Null
    Write-Host "✅ Android Debug Bridge (adb) found" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Android Debug Bridge (adb) not found" -ForegroundColor Yellow
    Write-Host "Please make sure Android Studio is installed and ANDROID_HOME is set" -ForegroundColor Yellow
    Write-Host "You can still run the server and use Expo Go app" -ForegroundColor Yellow
}

# Check if .env file exists, if not create from example
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from env.example..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "⚠️  Please edit .env file and add your OpenAI API key" -ForegroundColor Yellow
    Write-Host ""
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "mobile\\node_modules")) {
    Write-Host "📦 Installing mobile dependencies..." -ForegroundColor Yellow
    Set-Location "mobile"
    npm install
    Set-Location ".."
}

Write-Host ""
Write-Host "🚀 Starting Voice Office Assistant..." -ForegroundColor Green
Write-Host ""

# Start the server in background
Write-Host "📡 Starting server..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "npm run dev" -WindowStyle Normal

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Start the mobile app
Write-Host "📱 Starting Android app..." -ForegroundColor Yellow
Set-Location "mobile"

# Check if Android device/emulator is connected
try {
    $devices = adb devices | Select-String "device$"
    if ($devices) {
        Write-Host "✅ Android device/emulator detected" -ForegroundColor Green
        Write-Host "🚀 Launching on Android device..." -ForegroundColor Green
        npm run android
    } else {
        Write-Host "⚠️  No Android device/emulator detected" -ForegroundColor Yellow
        Write-Host "📱 Starting Expo development server..." -ForegroundColor Yellow
        Write-Host "📱 You can scan the QR code with Expo Go app" -ForegroundColor Yellow
        npm start
    }
} catch {
    Write-Host "⚠️  No Android device/emulator detected" -ForegroundColor Yellow
    Write-Host "📱 Starting Expo development server..." -ForegroundColor Yellow
    Write-Host "📱 You can scan the QR code with Expo Go app" -ForegroundColor Yellow
    npm start
}

Set-Location ".."

Write-Host ""
Write-Host "✅ Voice Office Assistant is now running!" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Server: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📱 Mobile: Check your Android device or Expo Go app" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to stop all processes..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Kill background processes
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "cmd" -ErrorAction SilentlyContinue | Stop-Process -Force
} catch {
    Write-Host "Note: Some processes may still be running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Voice Office Assistant stopped." -ForegroundColor Green
Read-Host "Press Enter to exit"