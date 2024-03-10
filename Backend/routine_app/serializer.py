from rest_framework import serializers
from .models import *


class AdminSerializer(serializers.ModelSerializer):
	class Meta:
		model = "Administrador"
		fields = '__all__'     
	

