from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/students/', include('students.urls')),
    path('api/fees/', include('fees.urls')),
    path('api/exams/', include('exams.urls')),
    path('api/masters/', include('masters.urls')),
]