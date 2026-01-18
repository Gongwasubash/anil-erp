from rest_framework import serializers
from .models import FinancialYear, FeeHead, FeeBook, FeeStructure

class FinancialYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialYear
        fields = '__all__'

class FeeHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeHead
        fields = '__all__'

class FeeBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeBook
        fields = '__all__'

class FeeStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeStructure
        fields = '__all__'