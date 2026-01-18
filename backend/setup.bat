@echo off
echo Setting up Django Backend for Everest School ERP...

echo.
echo 1. Installing Python dependencies...
pip install Django==4.2.7 djangorestframework==3.14.0 django-cors-headers==4.3.1

echo.
echo 2. Creating database migrations...
python manage.py makemigrations

echo.
echo 3. Applying migrations...
python manage.py migrate

echo.
echo 4. Creating superuser (admin account)...
echo Please create an admin account:
python manage.py createsuperuser

echo.
echo 5. Starting Django development server...
echo.
echo Django Admin Panel will be available at: http://127.0.0.1:8000/admin/
echo API endpoints will be available at: http://127.0.0.1:8000/api/
echo.
python manage.py runserver