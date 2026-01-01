@echo off
echo ========================================
echo Voice Office Assistant - Project Test
echo ========================================
echo.

echo 1. Testing Backend Server...
curl -s http://localhost:3000/health > nul
if %errorlevel% equ 0 (
    echo ✓ Backend server is running on port 3000
) else (
    echo ✗ Backend server is not running
    echo   Start it with: npm run dev
)

echo.
echo 2. Testing Mobile App Dependencies...
if exist "mobile\node_modules" (
    echo ✓ Mobile app dependencies are installed
) else (
    echo ✗ Mobile app dependencies are missing
    echo   Install with: cd mobile && yarn install
)

echo.
echo 3. Testing Environment Configuration...
if exist ".env" (
    echo ✓ Environment file exists
) else (
    echo ✗ Environment file is missing
    echo   Create with: copy env.example .env
)

echo.
echo 4. Testing API Endpoints...
echo Testing chat endpoint...
curl -s -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d "{\"message\":\"Hello\"}" > nul
if %errorlevel% equ 0 (
    echo ✓ Chat API is working
) else (
    echo ✗ Chat API is not responding
)

echo.
echo ========================================
echo Test Complete!
echo ========================================
echo.
echo To start the mobile app:
echo 1. Open a new terminal
echo 2. cd mobile
echo 3. yarn start
echo 4. Scan QR code with Expo Go app
echo.
pause 