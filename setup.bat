@echo off
REM Survey App Quick Setup Script for Windows
REM This script sets up the project for development and deployment

echo.
echo ======================================
echo Survey App - Setup Script
echo ======================================
echo.

REM Check Node.js installation
echo Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

for /f "tokens=1" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js version: %NODE_VERSION%

for /f "tokens=1" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm version: %NPM_VERSION%
echo.

REM Navigate to frontend
cd frontend

if %ERRORLEVEL% NEQ 0 (
    echo X Failed to navigate to frontend directory
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo [OK] Dependencies installed successfully
) else (
    echo X Dependency installation failed
    pause
    exit /b 1
)

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo To start development server:
echo   cd frontend
echo   npm run dev
echo.
echo To build for production:
echo   cd frontend
echo   npm run build
echo.
echo For deployment information, see: DEPLOYMENT.md
echo.
pause
