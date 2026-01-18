from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GradeViewSet, SubjectViewSet, ExamTypeViewSet, ExamViewSet

router = DefaultRouter()
router.register(r'grades', GradeViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'exam-types', ExamTypeViewSet)
router.register(r'exams', ExamViewSet)

urlpatterns = [
    path('', include(router.urls)),
]