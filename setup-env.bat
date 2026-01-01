@echo off
echo Setting up environment variables for Voice Office Assistant...
echo.

REM Copy the example environment file
copy env.example .env

echo.
echo Environment file created successfully!
echo.
echo IMPORTANT: You need to edit the .env file and add your OpenAI API key.
echo.
echo 1. Open the .env file in a text editor
echo 2. Replace "your_openai_api_key_here" with your actual OpenAI API key
echo 3. Save the file
echo.
echo To get an OpenAI API key:
echo 1. Go to https://platform.openai.com/
echo 2. Sign up or log in
echo 3. Go to API Keys section
echo 4. Create a new API key
echo 5. Copy the key to your .env file
echo.
pause 