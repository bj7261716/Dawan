@echo off
echo Installing Dawan Admin System...
echo.

python -m venv venv
call venv\Scripts\activate
pip install Flask Flask-CORS

cd backend
python -c "from app import init_db; init_db()"
python seed_data.py

echo.
echo ================================================
echo Installation Complete!
echo.
echo To start the system, run: start.bat
echo Or manually run: python backend/app.py
echo ================================================
pause
