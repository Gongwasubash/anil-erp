from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=100)
    photo_url = models.URLField(blank=True, null=True)
    student_class = models.CharField(max_length=20)
    section = models.CharField(max_length=10)
    roll_no = models.CharField(max_length=20)
    guardian_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    academic_year = models.CharField(max_length=10)
    status = models.CharField(max_length=10, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.student_class} ({self.roll_no})"