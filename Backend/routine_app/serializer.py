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
	password = serializers.CharField(source='user.password',write_only=True, required=False)

	class Meta:
		model = Entrenador 
		fields = ['id_entrenador', 'nombre', 'apellido' ,'email', 'username', 'password', 'id_administrador','borrado']
	
	def create(self, validated_data): #validated_data contiene datos validados y limpiados provenientes del cliente
		# Extraemos los datos del usuario del diccionario validated_data
		user_data = validated_data.pop('user') #se elimina la clave 'user' de validated_data
		password = user_data.pop('password', None)
		user = User.objects.create(**user_data) 
		if password:
			user.set_password(password)
			user.save()
		# Creamos una nueva instancia de Cliente utilizando el usuario creado y los datos restantes validados
		entrenador = Entrenador.objects.create(user=user, **validated_data)
		return entrenador
	
	def update(self, instance, validated_data): #Instance es la instancia del modelo que se está actualizando con los nuevos datos en validated_data (por ejemplo aqui instance es la instancia del modelo que se está actualizando y validated_data contiene los nuevos datos que deben ser aplicados a esa instancia)
		# Extraer los datos del usuario
		user_data = validated_data.pop('user', None)
		if user_data:
			user = instance.user
			user.username = user_data.get('username', user.username)
			user.email = user_data.get('email', user.email)
			password = user_data.get('password', None)
			if password:
				user.set_password(password)
			user.save()

		# Actualizar los datos del entrenador
		instance.nombre = validated_data.get('nombre', instance.nombre)
		instance.apellido = validated_data.get('apellido', instance.apellido)
		instance.id_administrador = validated_data.get('id_administrador', instance.id_administrador)
		instance.borrado = validated_data.get('borrado', instance.borrado)
		instance.save()
		return instance


class GenreSerializer(serializers.ModelSerializer):
	class Meta:
		model = Genero
		fields = '__all__'

class GymLevelSerializer(serializers.ModelSerializer):
	class Meta:
		model = NivelGym
		fields = '__all__'

class ActivityLevelSerializer(serializers.ModelSerializer):
	class Meta:
		model = NivelActividad
		fields = '__all__'

class TargetSerializer(serializers.ModelSerializer):
	class Meta:
		model = Objetivo
		fields = '__all__'



#class ClientSerializer(serializers.ModelSerializer):
	#username = serializers.CharField(source='user.username')
	#email = serializers.CharField(source='user.email')
	#password = serializers.CharField(source='user.password',write_only=True, required=False) 

	#class Meta: 
		#model = Cliente
		#fields = ['id_cliente','nombre','apellido','email', 'username', 'password', 'id_entrenador', 'id_genero', 'id_nivel_gym', 'id_nivel_actividad', 'id_objetivo', 'tmb', 'peso', 'altura', 'fecha_nacimiento', 'carbohidratos_g','proteina_g','grasas_g','borrado']

	#def create(self, validated_date):
		#user_data = validated_date.pop('user')
		#password = user_data.pop('password',None)
		#user = User.objects.create(**user_data)
		#if password:
			#user.set_password(password)
			#user.save()
		#cliente = Cliente.objects.create(user=user, **validated_date)
		#return cliente


class ClientSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user.username')
	email = serializers.CharField(source='user.email')
	password = serializers.CharField(source='user.password')
	 #Los 4 serializer de abajo me permiten obtener los nombres en el frontend mediante "client.id_genero.nombre"
	id_genero = serializers.PrimaryKeyRelatedField(queryset=Genero.objects.all())
	id_nivel_gym = serializers.PrimaryKeyRelatedField(queryset=NivelGym.objects.all())
	id_nivel_actividad = serializers.PrimaryKeyRelatedField(queryset=NivelActividad.objects.all())
	id_objetivo = serializers.PrimaryKeyRelatedField(queryset=Objetivo.objects.all())

	#Serializadores para las respuestas get 
	genero = GenreSerializer(source='id_genero', read_only=True)
	nivel_gym = GymLevelSerializer(source='id_nivel_gym', read_only=True)
	nivel_actividad = ActivityLevelSerializer(source='id_nivel_actividad', read_only=True)
	objetivo = TargetSerializer(source='id_objetivo',read_only=True)


	class Meta:
		model = Cliente
		fields = ['id_cliente','nombre','apellido','email', 'username', 'password', 'id_entrenador', 'id_genero', 'id_nivel_gym', 'id_nivel_actividad', 'id_objetivo', 'tmb', 'peso', 'altura', 'fecha_nacimiento', 'carbohidratos_g','proteina_g','grasas_g','borrado','genero','nivel_gym','nivel_actividad','objetivo']

	def create(self,validated_data):
		user_data = validated_data.pop('user')
		user = User.objects.create(username=user_data['username'], password=user_data['password'])
		cliente = Cliente.objects.create(user=user, **validated_data)
		return cliente
	
	def update(self,instance,validated_data):
		 # Extraemos los datos del usuario del diccionario validated_data, si existen
		user_data = validated_data.pop('user',None)

		# Si hay datos de usuario, actualizamos el usuario asociado a la instancia del cliente
		if user_data:
			user = instance.user
			user.username = user_data.get('username', user.username)
			user.email = user_data.get('email',user.email)
			user.password = user_data.get('password', user.password)
			user.save()

		 # Actualizamos los campos de la instancia del cliente con los datos validados
		instance.nombre = validated_data.get('nombre', instance.nombre) #intenta obtener el valor asociado con la clave 'nombre' del diccionario validated_data.   # instance.nombre es el valor por defecto que se usa si 'nombre' no se encuentra en validated_data.
		instance.apellido = validated_data.get('apellido', instance.apellido)
		instance.peso = validated_data.get('peso', instance.peso)
		instance.altura = validated_data.get('altura', instance.altura)
		instance.fecha_nacimiento = validated_data.get('fecha_nacimiento', instance.fecha_nacimiento)
		instance.id_entrenador = validated_data.get('id_entrenador', instance.id_entrenador)
		instance.id_genero = validated_data.get('id_genero', instance.id_genero)
		instance.id_nivel_gym = validated_data.get('id_nivel_gym', instance.id_nivel_gym)
		instance.id_nivel_actividad = validated_data.get('id_nivel_actividad', instance.id_nivel_actividad)
		instance.id_objetivo = validated_data.get('id_objetivo', instance.id_objetivo)

		# Guardamos la instancia actualizada
		instance.save()

		# Devolvemos la instancia actualizada
		return instance


class RoutineWithDaysSerializer(serializers.Serializer):
	id_rutina = serializers.IntegerField()
	nombre = serializers.CharField()
	descripcion = serializers.CharField()
	enfoque = serializers.CharField()
	tipo = serializers.CharField()
	id_entrenador = serializers.IntegerField()
	dia = serializers.CharField()



class AssignWithImageSerializar(serializers.Serializer):
	id_rutina = serializers.IntegerField()
	id_ejercicio = serializers.IntegerField()
	id_cliente = serializers.IntegerField()
	serie = serializers.IntegerField()
	repeticiones = serializers.IntegerField()
	peso = serializers.IntegerField()
	fecha = serializers.DateField()
	dia = serializers.CharField()
	imagen = serializers.ImageField()  # Add this line to include the 'imagen' field
	

class FoodSerializer(serializers.ModelSerializer):
	class Meta: 
		model = Alimento
		fields = "__all__"


class ConsumeSerializer(serializers.ModelSerializer):
	id_alimento = FoodSerializer()

	class Meta:
		model = Consume
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

class AssignedSerializer(serializers.ModelSerializer):
	class Meta:
		model = SeAsigna
		fields = '__all__'

class PartOfDaySerializer(serializers.ModelSerializer):
	class Meta:
		model = ParteDia
		fields = '__all__'

class DisponeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Dispone
		fields = '__all__'





	



