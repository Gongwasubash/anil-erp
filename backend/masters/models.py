from django.db import models


class Branch(models.Model):
    branch_name = models.CharField(max_length=100)
    country = models.CharField(max_length=50, default='Nepal')
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    phone_no = models.CharField(max_length=20)
    address = models.TextField()
    email = models.EmailField()
    website_url = models.URLField(blank=True, null=True)
    short_name = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.branch_name

    class Meta:
        db_table = 'masters_branch'