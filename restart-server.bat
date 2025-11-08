@echo off
echo Stopping any running servers on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo Stopping process %%a...
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo Starting Vite dev server...
echo Server will be available at: http://localhost:8080
echo.

npm start

