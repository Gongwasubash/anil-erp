from django.db import models
from students.models import Student

class FinancialYear(models.Model):
    financial_year = models.CharField(max_length=20)
    name = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=10, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')
    
    def __str__(self):
        return self.financial_year

class FeeHead(models.Model):
    TYPE_CHOICES = [
        ('variable', 'Variable'),
        ('general', 'General'),
        ('occasionally', 'Occasionally'),
    ]
    
    fee_head = models.CharField(max_length=100)
    short_name = models.CharField(max_length=20)
    fee_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    
    def __str__(self):
        return self.fee_head

class FeeBook(models.Model):
    college = models.CharField(max_length=100)
    financial_year = models.ForeignKey(FinancialYear, on_delete=models.CASCADE)
    book_no = models.CharField(max_length=50)
    order_no = models.CharField(max_length=50)
    book_no_from = models.CharField(max_length=20)
    book_no_to = models.CharField(max_length=20)
    status = models.CharField(max_length=10, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')
    
    def __str__(self):
        return f"{self.book_no} - {self.college}"

class FeeStructure(models.Model):
    school = models.CharField(max_length=100)
    branch = models.CharField(max_length=100)
    batch = models.CharField(max_length=20)
    student_class = models.CharField(max_length=20)
    month_name = models.CharField(max_length=20)
    fee_head = models.ForeignKey(FeeHead, on_delete=models.CASCADE)
    apply_dd_charges = models.CharField(max_length=10, choices=[('None', 'None'), ('Must', 'Must')], default='None')
    general = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    twenty_five_percent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    fifty_percent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    out_of_three = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def __str__(self):
        return f"{self.student_class} - {self.fee_head.fee_head}"