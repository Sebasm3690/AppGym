from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class AdminSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user.username')
	email = serializers.CharField(source='user.email')
	password = serializers.CharField(source='user.password')

	class Meta:
		model = Administrador
		fields = ['id_administrador','nombre','apellido','email', 'username', 'password','borrado']
	
	def create(self, validated_data): #validated_data contiene los datos que se han enviado a través de una solicitud HTTP
		user_data = validated_data.pop('user') #se elimina la clave 'user' de validated_data
		password = user_data.pop('password', None)
		user = User.objects.create(**user_data) 
		if password:
			user.set_password(password)
			user.save()
		administrador = Administrador.objects.create(user=user, **validated_data) 
		return administrador
		  

class TrainerSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user.username')
	email = serializers.CharField(source='user.email')
	password = serializers.CharField(source='user.password')

	class Meta:
		model = Entrenador 
		fields = ['id_entrenador', 'nombre', 'apellido' ,'email', 'username', 'password', 'id_administrador','borrado']
	
	def create(self, validated_data): #validated_data contiene los datos que se han enviado a través de una solicitud HTTP
		user_data = validated_data.pop('user') #se elimina la clave 'user' de validated_data
		password = user_data.pop('password', None)
		user = User.objects.create(**user_data) 
		if password:
			user.set_password(password)
			user.save()
		entrenador = Entrenador.objects.create(user=user, **validated_data)
		return entrenador


class ClientSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user.username')
	password = serializers.CharField(source='user.password')

	class Meta:
		model = Cliente
		fields = ['id_cliente','email', 'username', 'password', 'id_entrenador', 'id_genero', 'id_nivel_gym', 'id_nivel_actividad', 'id_objetivo', 'tmb', 'peso', 'altura', 'fecha_nacimiento', 'carbohidratos_g','proteina_g','grasas_g','borrado']

	def create(self,validated_data):
		user_data = validated_data.pop('user')
		user = User.objects.create(username=user_data['username'], password=user_data['password'])
		cliente = Cliente.objects.create(user=user, **validated_data)
		return cliente

class ConsumeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Consume
		fields = '__all__'


class FoodSerializer(serializers.ModelSerializer):
	class Meta: 
		model = Alimento
		fields = "__all__"

class GymLevelSerializer(serializers.ModelSerializer):
	class Meta:
		model = nivelGym
		fields = '__all__'

class ActivityLevelSerializer(serializers.ModelSerializer):
	class Meta:
		model = nivelActividad
		fields = '__all__'

class GenreSerializer(serializers.ModelSerializer):
	class Meta:
		model = Genero
		fields = '__all__'

class TargetSerializer(serializers.ModelSerializer):
	class Meta:
		model = Objetivo
		fields = '__all__'

class ExerciseSerializer(serializers.ModelSerializer):
	class Meta:
		model = Ejercicio
		fields = '__all__'

class RoutineSerializer(serializers.ModelSerializer):
	class Meta:
		model = Rutina
		fields = '__all__'

class CompoundSerializer(serializers.ModelSerializer):
	class Meta:
		model = Compuesta
		fields = '__all__'





	



