from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import FinancialYear, FeeHead, FeeBook, FeeStructure
from .serializers import FinancialYearSerializer, FeeHeadSerializer, FeeBookSerializer, FeeStructureSerializer

class FinancialYearViewSet(viewsets.ModelViewSet):
    queryset = FinancialYear.objects.all()
    serializer_class = FinancialYearSerializer

class FeeHeadViewSet(viewsets.ModelViewSet):
    queryset = FeeHead.objects.all()
    serializer_class = FeeHeadSerializer

class FeeBookViewSet(viewsets.ModelViewSet):
    queryset = FeeBook.objects.all()
    serializer_class = FeeBookSerializer

class FeeStructureViewSet(viewsets.ModelViewSet):
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer