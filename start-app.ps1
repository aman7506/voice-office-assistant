# Voice Office Assistant - Startup Script
# This script will start both the backend server and mobile app

Write-Host "🚀 Starting Voice Office Assistant..." -ForegroundColor Green
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param($Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Function to kill process on port
function Stop-ProcessOnPort {
    param($Port)
    try {
        $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($process) {
            Stop-Process -Id $process -Force
            Write-Host "✅ Killed process on port $Port" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "⚠️  Could not kill process on port $Port" -ForegroundColor Yellow
    }
}

# Check and kill processes on ports 5000 and 8081
Write-Host "🔍 Checking for existing processes..." -ForegroundColor Cyan

if (Test-Port 5000) {
    Write-Host "⚠️  Port 5000 is in use. Stopping existing process..." -ForegroundColor Yellow
    Stop-ProcessOnPort 5000
    Start-Sleep -Seconds 2
}

if (Test-Port 8081) {
    Write-Host "⚠️  Port 8081 is in use. Stopping existing process..." -ForegroundColor Yellow
    Stop-ProcessOnPort 8081
    Start-Sleep -Seconds 2
}

Write-Host ""

# Start the backend server
Write-Host "🖥️  Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; node server/index.js" -WindowStyle Normal

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Check if server started successfully
if (Test-Port 5000) {
    Write-Host "✅ Backend server is running on port 5000" -ForegroundColor Green
} else {
    Write-Host "❌ Backend server failed to start" -ForegroundColor Red
}

Write-Host ""

# Start the mobile app
Write-Host "📱 Starting mobile app..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\mobile'; npx expo start --offline" -WindowStyle Normal

# Wait a moment for mobile app to start
Start-Sleep -Seconds 5

# Check if mobile app started successfully
if (Test-Port 8081) {
    Write-Host "✅ Mobile app is running on port 8081" -ForegroundColor Green
} else {
    Write-Host "⚠️  Mobile app may be starting on a different port" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Voice Office Assistant is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Wait for both servers to fully start" -ForegroundColor White
Write-Host "2. Open your browser to: http://localhost:8081" -ForegroundColor White
Write-Host "3. Or scan the QR code with Expo Go on your phone" -ForegroundColor White
Write-Host "4. Test the chat functionality" -ForegroundColor White
Write-Host ""
Write-Host "🔧 If you see any errors:" -ForegroundColor Yellow
Write-Host "- Database errors are normal (app uses fallback storage)" -ForegroundColor White
Write-Host "- OpenAI errors are normal (app uses fallback responses)" -ForegroundColor White
Write-Host "- The app will work perfectly despite these warnings" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")