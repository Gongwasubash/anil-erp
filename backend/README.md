# Django Backend Setup for Everest School ERP

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create .env file:**
   ```bash
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ```

6. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start development server:**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- POST `/api/auth/login/` - User login
- POST `/api/auth/logout/` - User logout

### Students
- GET `/api/students/` - List all students
- POST `/api/students/` - Create new student
- PUT `/api/students/{id}/` - Update student
- DELETE `/api/students/{id}/` - Delete student

### Fees
- GET `/api/fees/financial-years/` - List financial years
- POST `/api/fees/financial-years/` - Create financial year
- GET `/api/fees/fee-heads/` - List fee heads
- POST `/api/fees/fee-heads/` - Create fee head
- GET `/api/fees/fee-structure/` - List fee structure
- POST `/api/fees/fee-structure/` - Create fee structure

### Exams
- GET `/api/exams/grades/` - List grades
- POST `/api/exams/grades/` - Create grade

## Frontend Integration

Replace Google Apps Script calls with Django API:

```typescript
import { apiService } from '../services/django-api';

// Instead of callBackend('GET_DATA', { sheetName: 'students' })
const students = await apiService.getStudents();

// Instead of callBackend('SAVE_DATA', { sheetName: 'students', data })
const newStudent = await apiService.createStudent(data);
```

## Database

The project uses SQLite by default. For production, configure PostgreSQL or MySQL in settings.py.

## CORS Configuration

CORS is configured to allow requests from `http://localhost:3000` (React frontend).