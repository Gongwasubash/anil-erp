from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FinancialYearViewSet, FeeHeadViewSet, FeeBookViewSet, FeeStructureViewSet

router = DefaultRouter()
router.register(r'financial-years', FinancialYearViewSet)
router.register(r'fee-heads', FeeHeadViewSet)
router.register(r'fee-books', FeeBookViewSet)
router.register(r'fee-structure', FeeStructureViewSet)

urlpatterns = [
    path('', include(router.urls)),
]