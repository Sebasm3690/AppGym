from rest_framework import viewsets
from .serializer import *
from rest_framework.response import Response
from .models import Administrador
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import now
from rest_framework import status
from datetime import datetime
from decimal import Decimal
from django.db.models import Sum
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
import requests
from django.contrib.auth import authenticate
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.http import JsonResponse
from datetime import date

# SignUp
@api_view(['POST'])
def trainerRegister(request):
	serializer = TrainerSerializer(data=request.data)

	if serializer.is_valid():
		entrenador = serializer.save()	
		token = Token.objects.create(user=entrenador.user)
		return Response({'token':token.key, "entrenador":serializer.data}, status=status.HTTP_201_CREATED)
	
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def clientRegister(request):
	serializer = ClientSerializer(data=request.data)

	if serializer.is_valid():
		cliente = serializer.save()	
		token = Token.objects.create(user=cliente.user)
		return Response({'token':token.key, "cliente":serializer.data}, status=status.HTTP_201_CREATED)
	
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#Login
@api_view(['POST'])
def trainerLogin(request):
	username = request.data.get('username')
	password = request.data.get('password')

	user = authenticate(username = username, password = password)

	if user is not None:
		try:
			entrenador = Entrenador.objects.get(user = user)
			token , created = Token.objects.get_or_create(user=user)
			serializer = TrainerSerializer(instance = entrenador)
			return Response({"token":token.key, "entrenador":serializer.data}, status = status.HTTP_200_OK)
		
		except Entrenador.DoesNotExist:
			return Response({"error":"Usuario no es un entrenador"}, status=status.HTTP_404_NOT_FOUND)
	else:
		return Response({"error":"username o contraseña incorrecta"}, status=status.HTTP_400_BAD_REQUEST)
	return Response({"error":"Error inesperado en el servidor"},status = status.HTTP_500_INTERNAL_SERVER_ERROR)
	

	#entrenador = get_object_or_404(Entrenador, user__email = request.data['email'])
	#if entrenador.password != request.data['password']: #Si el entrenador me retorna False o se falló en el intento de login 
		#return Response({"error":"Contraseña incorrecta"}, status=status.HTTP_400_BAD_REQUEST)
	
	#token, created = Token.objects.get_or_create(user=entrenador) #El created es un booleano que nos especifíca si se creó o no	
	#serializer = TrainerSerializer(instance=entrenador) #Me sirve para luego retornar un objeto entrenador en este caso
	#return Response({"token":token.key, "entrenador":serializer.data}, status=status.HTTP_200_OK) 


@api_view(['POST'])
@authentication_classes([TokenAuthentication]) #Método para autenticarse
@permission_classes({IsAuthenticated}) #se ve si la ruta está autenticada
def profile(request):
	return Response({"Tu estas logueado como {}".format(request.user.username)}, status=status.HTTP_200_OK)


#Ver comidas
class FoodAPIView(APIView):
	def get(self, request, *args, **kwargs):
		query = request.data.get('query', '')

		if query:
			api_url = 'https://api.api-ninjas.com/v1/nutrition?query='
			api_key = '120T1ZhRsgzR6bTRBgrakw==9I1RDeQNeDEPGWIE'
			api_request = requests.get(api_url + query, headers={'X-Api-Key': api_key})
			api_response = api_request.json()
			return Response(api_response, status = status.HTTP_200_OK)
		
		else:
			return Response({"error","Sin query"}, status = status.HTTP_404_BAD_REQUEST)

#Agregar comidas
class NutritionAPIView(APIView):
	def post(self, request, query_param, *args, **kwargs):
		id_cliente = query_param
		query = request.data.get('query', '') #Se otiene el valor del parámetro 'query' enviado en la solicitud POST

		if query:
			nombre_alimento = query.split()[-1]
			cantidad = query.split()[0]
			# Eliminar el último carácter (que en este caso sería "g")
			cantidad_sin_unidad = cantidad[:-1]

			alimento = Alimento.objects.filter(nombre=nombre_alimento, tamaño_porcion_g=cantidad_sin_unidad).first()  # Se utiliza filter para que devuelva la lista vacia, get devuelve Alimento.DoesnotExist
			if not alimento: 
				print("El alimento no existe")
				api_url = 'https://api.api-ninjas.com/v1/nutrition?query='
				api_key = '120T1ZhRsgzR6bTRBgrakw==9I1RDeQNeDEPGWIE'
				api_request = requests.get(api_url + query, headers={'X-Api-Key': api_key})
				try:
					api_response = api_request.json()
					for item in api_response:
						serializer = FoodSerializer(data={ #Crea una instancia del serializador AlimentoSerializer con los datos del elemento actual
							'nombre': item.get('name'),
							'calorias': item.get('calories'),
							'grasa_total_g': item.get('serving_size_g'),
							'proteina_g': item.get('fat_total_g'),
							'sodio_mg': item.get('sodium_mg'), 
							'potasio_mg': item.get('potassium_mg'), 
							'colesterol_mg': item.get('cholesterol_mg'),
							'total_carbohidratos_g': item.get('carbohydrates_total_g'),
							'total_fibra_g': item.get('fiber_g'),
							'grasa_total_saturada_g': item.get('fat_saturated_g'),
							'tamaño_porcion_g':	item.get('serving_size_g'),
							"azucar_total_g": item.get('sugar_g')
						})
						if serializer.is_valid():
							alimento = serializer.save()
							serializer2 = ConsumeSerializer(data={
								'id_alimento': alimento.id_alimento,
								'id_cliente': id_cliente,
								'fecha': now().date()
							})
							if serializer2.is_valid():
								serializer2.save()
						else:
							return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
					return Response(api_response, status = status.HTTP_201_CREATED)
				except Exception as e:
					return Response({"error": "Hubo un error procesando la solicitud", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
			else:
				print("El alimento si existe")
				serializer = FoodSerializer(alimento)
				print(serializer.data)
				serializer2 = ConsumeSerializer(data={
					'id_alimento': alimento.id_alimento,
					'id_cliente': id_cliente,
					'fecha': now().date()
				})
				if serializer2.is_valid():	
					serializer2.save()
					return Response(serializer.data, status = status.HTTP_201_CREATED)
				else:
					return Response(serializer2.errors, status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response({"error","Sin query"}, status = status.HTTP_404_BAD_REQUEST)



class CalcularTMBAPIView(APIView):
	def post(self,request,query_param, *args, **kwargs):
		id_cli = query_param
		cliente = Cliente.objects.get(id_cliente=id_cli) #Get es mejor que filter porque solo se obtendrá un objeto y no varios 
		edad = calcularEdad(cliente.fecha_nacimiento)

		if cliente.id_genero.nombre == 'Masculino':
			tmb = (Decimal('10') * cliente.peso) + (Decimal('6.25') * cliente.altura) - (Decimal('5') * edad) + Decimal('5') #La altura debe estar en cm
		else:
			tmb = (Decimal('10') * cliente.peso) + (Decimal('6.25') * cliente.altura) - (Decimal('5') * edad) - Decimal('161')
		tmb = tmb * cliente.id_nivel_actividad.factor
		if cliente.id_objetivo.nombre == 'Ganar masa muscular':
			tmb = tmb + (tmb * Decimal('0.20')) 
		elif cliente.id_objetivo.nombre == 'Perder peso':
			tmb = tmb - (tmb * Decimal('0.20'))
		cliente.tmb = tmb	
		cliente.save()		

		return Response({"tmb": tmb}, status=status.HTTP_200_OK)


class BorradoLogicoEntrenador(APIView):
	def post(self,request,query_param,*args,**kwargs):
		id_entr = query_param 
		entrenador = Entrenador.objects.get(id_entrenador=id_entr)
		entrenador.borrado = True
		entrenador.save()
		return Response({"mensaje":"Borrado del entrenador realizado correctamente"}, status=status.HTTP_200_OK)


class BorradoLogicoCliente(APIView):
	def post(self,request,query_param,*args,**kwargs):
		id_cli = query_param 
		cliente = Cliente.objects.get(id_cliente=id_cli)
		cliente.borrado = True
		cliente.save()
		return Response({"mensaje":"Borrado del cliente realizado correctamente"}, status=status.HTTP_200_OK)

class calcularMacroNutrientes(APIView):
	def post(self,request,query_param,*args,**kwargs):
		id_cli = query_param
		proteina = 0
		grasas = 0
		carbohidratos = 0
		cliente = Cliente.objects.get(id_cliente=id_cli)
		#print(f"Objetivo del cliente: {cliente.id_objetivo.nombre}")

		if cliente.id_objetivo.nombre == 'Ganar masa muscular':
			proteina = cliente.peso * Decimal('1.8') #  1.8 - 2.2
			grasas = cliente.peso * Decimal('1') #  1 - 1.2
			#carbohidratos = cliente.peso * 3 # 3 - 4
			carbohidratos = (cliente.tmb - (proteina*4 + grasas*9))/4
		elif cliente.id_objetivo.nombre == 'Perder peso':
			proteina = cliente.peso * Decimal('2.2') # 2.2 - 2.7
			grasas = cliente.peso * Decimal('0.8') # 0.8 - 1
			#carbohidratos = cliente.peso * Decimal('1') #1 - 1.5
			carbohidratos = (cliente.tmb - (proteina*4 + grasas*9))/4
		elif cliente.id_objetivo.nombre == 'Mantener peso':
			proteina = cliente.peso * Decimal('1.8') #  1.8 - 2.2
			grasas = cliente.peso * Decimal('1') #  1 - 1.2
			#carbohidratos = cliente.peso * 2.5 # 2.5 - 3.5
			carbohidratos = (cliente.tmb - (proteina*4 + grasas*9))/4
		cliente.carbohidratos_g = carbohidratos
		cliente.proteina_g = proteina
		cliente.grasas_g = grasas
		cliente.save()

		return Response({"carbohidratos":carbohidratos, "proteina":proteina, "grasas":grasas}, status=status.HTTP_200_OK)



class calcularTotalMacrosAlimentos(APIView):
	def get(self,request,query_param,*args,**kwargs):
		cliente_id = query_param
		cliente = Cliente.objects.get(id_cliente=cliente_id)
		consume = Consume.objects.filter(id_cliente=cliente_id, fecha=datetime.now().date()) #Me saca todos los alimentos consumidos por el cliente en el día de hoy

		#Macros totales
		consumo_hoy = Consume.objects.filter(
			id_cliente = cliente_id,
			fecha = datetime.now().date()
		).aggregate(
			total_Calorias = Sum('id_alimento__calorias'),
			total_Proteina = Sum('id_alimento__proteina_g'),
			total_Grasas = Sum('id_alimento__grasa_total_g'),
			total_Carbohidratos = Sum('id_alimento__total_carbohidratos_g')
		)
		#Macros restantes
		consumo_restante = {
			"calorias_restantes": cliente.tmb - consumo_hoy['total_Calorias'],
			"proteina_restante": cliente.proteina_g - consumo_hoy['total_Proteina'],
			"grasas_restantes": cliente.grasas_g - consumo_hoy['total_Grasas'],
			"carbohidratos_restantes": cliente.grasas_g - consumo_hoy['total_Carbohidratos']
		}

		return Response({"consumo_hoy":consumo_hoy,"consumo_restante":consumo_restante}, status=status.HTTP_200_OK)



class AdminView(viewsets.ModelViewSet):
	serializer_class = AdminSerializer
	queryset = Administrador.objects.all()

class FoodView(viewsets.ModelViewSet):
	serializer_class = FoodSerializer
	queryset = Alimento.objects.all()

class ConsumeView(viewsets.ModelViewSet):
	serializer_class = ConsumeSerializer
	queryset = Consume.objects.all()

class TrainerView(viewsets.ModelViewSet):
	serializer_class = TrainerSerializer
	queryset = Entrenador.objects.all()

class ClientView(viewsets.ModelViewSet):
	serializer_class = ClientSerializer
	queryset = Cliente.objects.all()

class RoutineView(viewsets.ModelViewSet):
	serializer_class = RoutineSerializer
	queryset = Rutina.objects.all()

class ExerciseView(viewsets.ModelViewSet):
	serializer_class = ExerciseSerializer
	queryset = Ejercicio.objects.all()

class CompoundView(viewsets.ModelViewSet):
	serializer_class = CompoundSerializer
	queryset = Compuesta.objects.all()


# Ver Ejercicios

@api_view(['GET'])
def get_exercises(request, body_part):
    url = f"https://exercisedb.p.rapidapi.com/exercises/bodyPart/{body_part}"
    
    querystring = {"limit":"10"}
    
    headers = {
        'X-RapidAPI-Key': "891b93fa0emsh072b1fbe8965257p128f0ajsn2fee5da1207b",
        'X-RapidAPI-Host': "exercisedb.p.rapidapi.com"
    }
    
    response = requests.request("GET", url, headers=headers, params=querystring)
    
    # Si la respuesta es exitosa, devolvemos los datos en formato JSON
    if response.status_code == 200:
        data = response.json()
        return JsonResponse(data, safe=False)  # safe=False es necesario si la respuesta no es un diccionario
    else:
        return JsonResponse({'error': 'Hubo un problema al obtener los ejercicios'}, status=response.status_code)


#Agregar ejercicios

#class AddExcercises(viewsets.ModelViewSet):
	#def post(self,request):


	

def calcularEdad(fecha_nacimiento):
		hoy = date.today()
		edad = hoy.year - fecha_nacimiento.year
		return edad