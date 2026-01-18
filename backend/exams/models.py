from django.db import models
from students.models import Student

class Grade(models.Model):
    grade_name = models.CharField(max_length=5)
    min_percent = models.DecimalField(max_digits=5, decimal_places=2)
    max_percent = models.DecimalField(max_digits=5, decimal_places=2)
    grade_point = models.DecimalField(max_digits=3, decimal_places=1)
    min_g_point = models.DecimalField(max_digits=3, decimal_places=2)
    max_g_point = models.DecimalField(max_digits=3, decimal_places=2)
    description = models.CharField(max_length=100)
    teacher_remarks = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.grade_name} ({self.min_percent}-{self.max_percent}%)"

class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    student_class = models.CharField(max_length=20)
    full_marks = models.IntegerField()
    pass_marks = models.IntegerField()
    has_practical = models.BooleanField(default=False)
    theory_fm = models.IntegerField()
    practical_fm = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} - {self.student_class}"

class ExamType(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class Exam(models.Model):
    name = models.CharField(max_length=100)
    exam_type = models.ForeignKey(ExamType, on_delete=models.CASCADE)
    student_class = models.CharField(max_length=20)
    start_date = models.DateField()
    end_date = models.DateField()
    
    def __str__(self):
        return f"{self.name} - {self.student_class}"