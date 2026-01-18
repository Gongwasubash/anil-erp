from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('Super Admin', 'Super Admin'),
        ('Admin', 'Admin'),
        ('Accountant', 'Accountant'),
        ('Teacher', 'Teacher'),
        ('Student', 'Student'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Student')
    status = models.CharField(max_length=10, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')
    last_login_time = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.username} ({self.role})"