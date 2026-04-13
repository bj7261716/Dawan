@echo off
echo ================================================
echo   Dawan Pharmacy Admin System
echo ================================================
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found
    echo Please install Python 3.8+
    echo Download: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python installed
echo.

REM Create virtual environment
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo [OK] Virtual environment created
    echo.
)

REM Activate virtual environment
echo Starting virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -q Flask Flask-CORS Werkzeug
echo [OK] Dependencies installed
echo.

REM Initialize database
if not exist "backend\dawan.db" (
    echo Initializing database...
    cd backend
    python -c "import sys; sys.path.insert(0, '.'); from app import init_db; init_db()"
    echo [OK] Database initialized
    echo.

    echo Seeding data...
    python seed_data.py
    echo.
    cd ..
)

REM Start Flask
echo ================================================
echo   System Starting...
echo ================================================
echo.
echo   URL: http://localhost:5000
echo   Account: kuma
echo   Password: kuma!2022
echo.
echo   Press Ctrl+C to stop
echo ================================================
echo.

cd backend
python app.py

pause
