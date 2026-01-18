from accounts.models import User
from students.models import Student
from fees.models import FinancialYear, FeeHead, FeeStructure
from exams.models import Grade
from django.utils import timezone

# Create sample grades
grades_data = [
    {'grade_name': 'E', 'min_percent': 0, 'max_percent': 19.99, 'grade_point': 0.8, 'min_g_point': 0, 'max_g_point': 0.8, 'description': 'Very Insufficient'},
    {'grade_name': 'D', 'min_percent': 20, 'max_percent': 29.99, 'grade_point': 1.2, 'min_g_point': 0.81, 'max_g_point': 1.2, 'description': 'Insufficient'},
    {'grade_name': 'D+', 'min_percent': 30, 'max_percent': 39.99, 'grade_point': 1.6, 'min_g_point': 1.21, 'max_g_point': 1.6, 'description': 'Partially Acceptable'},
    {'grade_name': 'C', 'min_percent': 40, 'max_percent': 49.99, 'grade_point': 2.0, 'min_g_point': 1.61, 'max_g_point': 2.0, 'description': 'Acceptable'},
    {'grade_name': 'C+', 'min_percent': 50, 'max_percent': 59.99, 'grade_point': 2.4, 'min_g_point': 2.01, 'max_g_point': 2.4, 'description': 'Satisfactory'},
    {'grade_name': 'B', 'min_percent': 60, 'max_percent': 69.99, 'grade_point': 2.8, 'min_g_point': 2.41, 'max_g_point': 2.8, 'description': 'Good'},
    {'grade_name': 'B+', 'min_percent': 70, 'max_percent': 79.99, 'grade_point': 3.2, 'min_g_point': 2.81, 'max_g_point': 3.2, 'description': 'Very Good'},
    {'grade_name': 'A', 'min_percent': 80, 'max_percent': 89.99, 'grade_point': 3.6, 'min_g_point': 3.21, 'max_g_point': 3.6, 'description': 'Excellent'},
    {'grade_name': 'A+', 'min_percent': 90, 'max_percent': 100, 'grade_point': 4.0, 'min_g_point': 3.61, 'max_g_point': 4.0, 'description': 'Outstanding'},
]

for grade_data in grades_data:
    Grade.objects.get_or_create(**grade_data)

# Create sample financial year
fy, created = FinancialYear.objects.get_or_create(
    financial_year='2080/81',
    defaults={
        'name': 'Current FY',
        'start_date': '2023-04-01',
        'end_date': '2024-03-31',
        'status': 'Active'
    }
)

# Create sample fee heads
fee_heads_data = [
    {'fee_head': 'Monthly Fee', 'short_name': 'MF', 'fee_type': 'general'},
    {'fee_head': 'Exam Fee', 'short_name': 'EF', 'fee_type': 'occasionally'},
    {'fee_head': 'Transportation Fee', 'short_name': 'TF', 'fee_type': 'variable'},
]

for fee_head_data in fee_heads_data:
    FeeHead.objects.get_or_create(**fee_head_data)

print("Sample data created successfully!")
print("Admin credentials:")
print("Username: admin")
print("Password: admin123")