@echo off
echo Starting Everest School ERP System...

echo.
echo 1. Starting Django Backend Server...
start "Django Backend" cmd /k "cd backend && python manage.py runserver"

timeout /t 3 /nobreak > nul

echo.
echo 2. Starting React Frontend Server...
start "React Frontend" cmd /k "npm run dev"

echo.
echo System is starting up...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo Admin Panel: http://localhost:8000/admin
echo.
echo Login Credentials:
echo Username: admin
echo Password: admin123
echo.
pause