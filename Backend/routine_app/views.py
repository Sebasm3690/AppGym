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
from django.db.models import Q, Sum, F,Value, DecimalField
from django.conf import settings
from django.db.models.functions import Coalesce

# SignUp trainer
@api_view(['POST'])
def trainerRegister(request):
	serializer = TrainerSerializer(data=request.data)

	if serializer.is_valid():
		entrenador = serializer.save()	
		token = Token.objects.create(user=entrenador.user)
		return Response({'token':token.key, "entrenador":serializer.data}, status=status.HTTP_201_CREATED)
	
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Signup cliente
@api_view(['POST'])
def clientRegister(request):
	serializer = ClientSerializer(data=request.data)

	if serializer.is_valid():
		cliente = serializer.save()	
		token = Token.objects.create(user=cliente.user)
		return Response({'token':token.key, "cliente":serializer.data}, status=status.HTTP_201_CREATED)
	
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




#Función para cerrar sesión
@api_view(['POST'])
@authentication_classes([TokenAuthentication]) #Método para autenticarse
@permission_classes({IsAuthenticated}) #se ve si la ruta está autenticada
def logout(request):
	request.user.auth_token.delete()
	return Response({"mensaje":"Cerraste sesión correctamente"}, status=status.HTTP_200_OK)



#Login Trainer
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


#Buscar entrenadores
class TrainerViewSet(viewsets.ModelViewSet):
	queryset = Entrenador.objects.all()
	serializer_class = TrainerSerializer

	def get_queryset(self):
		queryset = super().get_queryset() #Llama al método get_queryset del padre (viewsets.ModelViewSet) para obtener el conjunto de datos predeterminado. Este conjunto de datos inicial incluye todos los registros de Entrenador.

		id_admin = self.kwargs.get('id_administrador')

		queryset = queryset.filter(id_administrador=id_admin)

		nombre = self.request.query_params.get("nombre") 
		apellido = self.request.query_params.get("apellido")
		correo = self.request.query_params.get("correo")

		if nombre:
			queryset = queryset.filter(nombre__icontains=nombre)
		if apellido:
			queryset = queryset.filter(apellido__icontains=apellido)
		if correo:
			queryset = queryset.filter(user__email__icontains=correo) #Para acceder al correo que está dentro de user
		
		return queryset


#Buscar clientes
class ClientViewSet(viewsets.ModelViewSet):
	queryset = Cliente.objects.all()  
	serializer_class = ClientSerializer

	def get_queryset(self):
		queryset = super().get_queryset()

		id_entrenador = self.kwargs.get('id_entrenador')

		queryset = queryset.filter(id_entrenador=id_entrenador)

		# Obtiene los parámetros de consulta de la solicitud
		nombre = self.request.query_params.get("nombre") #query_params es un diccionario que contiene los parámetros de consulta (query parameters) enviados en la URL de la solicitud.
		apellido = self.request.query_params.get("apellido")
		correo = self.request.query_params.get("correo")


		# Filtra el queryset según los parámetros de consulta proporcionados
		if nombre:
			queryset = queryset.filter(nombre__icontains=nombre)
		if apellido:
			queryset = queryset.filter(apellido__icontains=apellido)
		if correo:
			queryset = queryset.filter(user__email__icontains=correo)

		# Devuelve el queryset filtrado
		return queryset
	

	
#Buscar rutinas
class RoutineViewSet(viewsets.ModelViewSet):
	queryset = Rutina.objects.all()
	serializer_class = RoutineSerializer

	def get_queryset(self):
		queryset = super().get_queryset()
		id_entrenador = self.kwargs.get('id_entrenador')
		queryset = queryset.filter(id_entrenador=id_entrenador)
		
		nombre = self.request.query_params.get("nombre")
		enfoque = self.request.query_params.get("enfoque")
		tipo = self.request.query_params.get("tipo")

		if nombre:
			queryset = queryset.filter(nombre__icontains=nombre)
		if enfoque:
			queryset = queryset.filter(enfoque__icontains=enfoque)
		if tipo:
			queryset = queryset.filter(tipo__icontains=tipo)

		# Devuelve el queryset filtrado
		return queryset
	




#Login Admin
@api_view(['POST'])
def adminLogin(request):
	username = request.data.get('username')
	password = request.data.get('password')

	user = authenticate(username = username, password = password)

	if user is not None:
		try:
			administrador = Administrador.objects.get(user = user)
			token , created = Token.objects.get_or_create(user=user)
			serializer = AdminSerializer(instance = administrador)
			return Response({"token":token.key, "administrador":serializer.data}, status = status.HTTP_200_OK)
		
		except Administrador.DoesNotExist:
			return Response({"error":"Usuario no es un administrador"}, status=status.HTTP_404_NOT_FOUND)
	else:
		return Response({"error":"username o contraseña incorrecta"}, status=status.HTTP_400_BAD_REQUEST)
	return Response({"error":"Error inesperado en el servidor"},status = status.HTTP_500_INTERNAL_SERVER_ERROR)


#Login client
@api_view(['POST'])
def clientLogin(request):
	username = request.data.get("username")
	password = request.data.get("password")	

	user = authenticate(username = username, password = password)

	if user is not None:
		try:
			cliente = Cliente.objects.get(user = user)
			token,created = Token.objects.get_or_create(user = user)
			serializer = ClientSerializer(instance = cliente)
			return Response({"token":token.key, "cliente":serializer.data}, status= status.HTTP_200_OK)
		except Cliente.DoesNotExist:
			return Response({"error":"username o contraseña incorrecta"}, status=status.HTTP_400_BAD_REQUEST)
	

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





#Obtener comidas en FatSecret

def get_nutrition_data(request):
	query = request.GET.get('search')
	url = "https://fatsecret4.p.rapidapi.com/rest/server.api"

	querystring = {
        "method": "foods.search",
        "search_expression": query,
        "page_number": "0",
        "format": "json"
    }

	headers = {
		"x-rapidapi-key": settings.FATSECRET_API_KEY,
		"x-rapidapi-host": "fatsecret4.p.rapidapi.com",
		"Authorization": settings.FATSECRET_AUTH_TOKEN
	}

	response = requests.get(url, headers=headers, params=querystring)

	if response.status_code == 200:
		data = response.json()
		return JsonResponse(data)
	

#Obtener una comida en base al id en FatSecret

def get_food_by_id(request, food_id):
	query = request.GET.get('search','food')
	url = "https://fatsecret4.p.rapidapi.com/rest/server.api"

	querystring = {
        "method": "foods.search",
        "search_expression": query,
        "page_number": "0",
        "format": "json"
    }

	headers = {
		"x-rapidapi-key": settings.FATSECRET_API_KEY,
		"x-rapidapi-host": "fatsecret4.p.rapidapi.com",
		"Authorization": settings.FATSECRET_AUTH_TOKEN
	}

	# Perform the API request
	response = requests.get(url, headers=headers, params=querystring)

	if response.status_code != 200:
		return JsonResponse({"error": "Error al obtener los datos"}, status = response.status_code)

	# Parse the API response
	data = response.json()
	foods = data.get('foods',{}).get('food',[])

	# Filter the foods to find the one matching the given food_id
	filtered_food = next((food for food in foods if str(food.get('food_id')) == str(food_id)), None)

	if filtered_food:
		return JsonResponse(filtered_food)
	else:
		return JsonResponse({"error": f"No se encontró la comida con el ID {food_id}"},status=404)
	


#Ver comidas
class FoodAPIView(APIView):
    def get(self, request, *args, **kwargs):
        query = request.data.get('query', '')

        if query:
            # Consulta a la API de Nutrición
            api_url = 'https://api.api-ninjas.com/v1/nutrition?query='
            api_key = '120T1ZhRsgzR6bTRBgrakw==9I1RDeQNeDEPGWIE'  # Idealmente, mover a una variable de entorno o configuración segura
            api_request = requests.get(api_url + query, headers={'X-Api-Key': api_key})
            if api_request.status_code == 200:
                api_response = api_request.json()
                
                # Aquí deberías iterar sobre api_response para extraer los nombres de alimentos
                # y hacer la traducción con la API de traducción de tu elección.
                # Asegúrate de revisar la documentación de la API de traducción para la implementación correcta.
                # Este es un paso conceptual, necesitarías adaptarlo a la API específica que elijas.
                
                # Por ejemplo, usando Google Translate API de manera muy simplificada:
                translate_url = "https://translation.googleapis.com/language/translate/v2"
                for item in api_response:
                    text = item["food_name"]  # Asumiendo que este campo existe en tu respuesta
                    translate_params = {
                        "q": text,
                        "source": "en",
                        "target": "es",
                        "format": "text"
                    }
                    translate_headers = {"Authorization": "Bearer tu_token_de_acceso"}
                    translate_response = requests.post(translate_url, params=translate_params, headers=translate_headers)
                    translated_text = translate_response.json()['data']['translations'][0]['translatedText']
                    item["food_name"] = translated_text

                return Response(api_response, status=status.HTTP_200_OK)
            else:
                # Manejo en caso de que la API de Nutrición no responda correctamente
                return Response({"error": "Error al consultar la API de Nutrición"}, status=api_request.status_code)
        else:
            return Response({"error": "Sin query"}, status=status.HTTP_404_BAD_REQUEST)


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

		#Macros totales
		consumo_hoy = Consume.objects.filter(
			id_cliente = cliente_id,  #All foods consumed by the client today
			fecha = datetime.now().date()
		).aggregate(
			total_calorias = Coalesce(Sum(F('id_alimento__calorias')* F('cantidad'), output_field=DecimalField()), Value(0, output_field=DecimalField())), #Value 0 is a value by default in case it can't find any value and avoid an error
			total_proteina = Coalesce(Sum(F('id_alimento__proteina_g') * F('cantidad'), output_field=DecimalField()), Value(0, output_field=DecimalField())),
			total_carbohidratos = Coalesce(Sum(F('id_alimento__carbohidratos_g') * F('cantidad'), output_field=DecimalField()), Value(0, output_field=DecimalField())),
			total_grasa = Coalesce(Sum(F('id_alimento__grasa_g') * F('cantidad'),output_field=DecimalField()),Value(0, output_field=DecimalField()))
		)
		 # Macros restantes (use max() to ensure the value is never less than 0)
		consumo_restante = {
			"calorias_restantes": cliente.tmb - consumo_hoy['total_calorias'],
			"proteina_restante": cliente.proteina_g - consumo_hoy['total_proteina'],
			"carbohidratos_restantes": cliente.carbohidratos_g - consumo_hoy['total_carbohidratos'],
			"grasas_restantes": cliente.grasas_g - consumo_hoy['total_grasa']
		}

		consumo_logrado_porcentaje = {
			"calorias_logradas": consumo_hoy['total_calorias'] * 100 / cliente.tmb if cliente.tmb else 0, #"If" in this case allows to avoid an error in case cliente.tmb doesn't exist
			"proteina_lograda": consumo_hoy['total_proteina'] * 100 / cliente.proteina_g if cliente.proteina_g else 0,
			"carbohidratos_logrados": consumo_hoy['total_carbohidratos'] * 100 / cliente.carbohidratos_g if cliente.carbohidratos_g else 0,
			"grasa_lograda": consumo_hoy['total_grasa'] * 100 / cliente.grasas_g if cliente.grasas_g else 0
		}

		return Response({"consumo_hoy":consumo_hoy,"consumo_restante":consumo_restante,"consumo_logrado_porcentaje":consumo_logrado_porcentaje}, status=status.HTTP_200_OK)




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


class RecuperarEntrenador(APIView):
	def post(self,request,query_param,*args,**kwargs):
		id_entr = query_param 
		entrenador = Entrenador.objects.get(id_entrenador=id_entr)
		entrenador.borrado = False
		entrenador.save()
		return Response({"mensaje":"Recuperación del entrenador realizado correctamente"}, status=status.HTTP_200_OK)


class RecuperarCliente(APIView):
	def post(self,request,query_param,*args,**kwargs):
		id_cli = query_param 
		cliente = Cliente.objects.get(id_cliente=id_cli)
		cliente.borrado = False
		cliente.save()
		return Response({"mensaje":"Recuperación del cliente realizado correctamente"}, status=status.HTTP_200_OK)


class BorradoLogicoCliente(APIView):
	def post(self,request,query_param,*args,**kwargs):
		id_cli = query_param 
		cliente = Cliente.objects.get(id_cliente=id_cli)
		cliente.borrado = True
		cliente.save()
		return Response({"mensaje":"Borrado del cliente realizado correctamente"}, status=status.HTTP_200_OK)
	

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
	queryset = Entrenador.objects.all()
	serializer_class = TrainerSerializer

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

class GenreView(viewsets.ModelViewSet):
	serializer_class = GenreSerializer
	queryset = Genero.objects.all()

class GymLevelView(viewsets.ModelViewSet):
	serializer_class = GymLevelSerializer
	queryset = NivelGym.objects.all()

class GymActivityView(viewsets.ModelViewSet):
	serializer_class = ActivityLevelSerializer
	queryset = NivelActividad.objects.all()

class TargetView(viewsets.ModelViewSet):
	serializer_class = TargetSerializer
	queryset = Objetivo.objects.all()

class AssignedView(viewsets.ModelViewSet):
	serializer_class = AssignedSerializer
	queryset = SeAsigna.objects.all()

class PartOfDayView(viewsets.ModelViewSet):
	serializer_class = PartOfDaySerializer
	queryset = ParteDia.objects.all()

class DisponeView(viewsets.ModelViewSet):
	serializer_class = DisponeSerializer
	queryset = Dispone.objects.all()



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



def calcularEdad(fecha_nacimiento):
		hoy = date.today()
		edad = hoy.year - fecha_nacimiento.year
		return edad



#Agregar rutina

@api_view(['POST'])
def addRoutine(request):
	if request.method == 'POST':
		datos = request.data 
		nombre = datos.get('nombre')	
		descripcion = datos.get('descripcion')
		enfoque = datos.get('enfoque')
		ejercicios = datos.get('ejercicios',[])
		id_entren = datos.get('id_entrenador')

		#Crear la rutina
		entrenador = Entrenador.objects.get(id_entrenador=id_entren)
		rutina = Rutina.objects.create(
			id_entrenador= entrenador,
			nombre = nombre,
			descripcion = descripcion,
			enfoque = enfoque,
			tipo = 'Creada'
		)

		#Agregar ejercicios a la rutina
		for ejercicio in ejercicios:
			ej = Ejercicio.objects.get(id_ejercicio=ejercicio)
			Compuesta.objects.create(
				id_rutina = rutina,
				id_ejercicio = ej
			)

		return Response({"mensaje":"Rutina creada correctamente"}, status=status.HTTP_201_CREATED)
	else:
		return Response({"error":"Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
	

#Editar rutina

@api_view(['PUT'])
def updateRoutine(request,rutina_id):
	if request.method == 'PUT':
		datos = request.data
		nombre = datos.get('nombre')
		descripcion = datos.get('descripcion')
		enfoque = datos.get('enfoque')
		ejercicios = datos.get('ejercicios',[])
		id_entren = datos.get('id_entrenador')

		#Filtrar rutina y entrenador
		rutina = get_object_or_404(Rutina, id_rutina=rutina_id)
		entrenador = get_object_or_404(Entrenador,id_entrenador=id_entren)

		#Editar la rutina
		rutina.id_entrenador = entrenador	
		rutina.nombre = nombre
		rutina.descripcion = descripcion
		rutina.enfoque = enfoque 
		rutina.save()

		#Limpiar ejercicios antiguos 
		Compuesta.objects.filter(id_rutina=rutina).delete()
		
		#Agregar ejercicios a la rutina
		for ejercicio in ejercicios:
			ej = Ejercicio.objects.get(id_ejercicio=ejercicio)
			Compuesta.objects.create(
				id_rutina = rutina,
				id_ejercicio = ej
			)

		return Response({"mensaje":"Rutina editada correctamente"}, status=status.HTTP_200_OK)
	else:
		return Response({"error":"Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
	
	

@api_view(['GET'])
def obtenerEjerciciosRutina(request, query_param):
    try:
        rutina = Rutina.objects.get(id_rutina=int(query_param))
        rutinas_compuesta = Compuesta.objects.filter(id_rutina=rutina) # Encuentra las compuestas de las rutina
        ejercicios = [compuesta.id_ejercicio for compuesta in rutinas_compuesta] #Encuentra los ejercicios de las compuestas de los ejerciocios  
        ejercicios_serializados = ExerciseSerializer(ejercicios, many=True)
        return Response({'ejercicios': ejercicios_serializados.data}, status=status.HTTP_200_OK)
    except Rutina.DoesNotExist:
        return Response({'error': 'Rutina no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    except ValueError:
        return Response({'error': 'El parámetro de consulta debe ser un entero'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	

#Asignar rutina de ejercicios

@api_view(['POST'])
def asignarRutina(request):
	if request.method == 'POST':
		datos = request.data
		id_rutina = datos[0].get("routineId")
		id_cliente = datos[0].get("clientId")
		dia = datos[0].get("day")
		
		
		cliente = Cliente.objects.get(id_cliente=id_cliente)
		rutina = Rutina.objects.get(id_rutina=id_rutina)

		for dato in datos:
			id_ejercicio = dato.get("exerciseId")
			ejercicio = Ejercicio.objects.get(id_ejercicio=id_ejercicio)

			serie = dato.get("set")
			repeticiones = dato.get("reps")
			peso = dato.get("weight")

			se_asigna, created = SeAsigna.objects.update_or_create(
				id_rutina = rutina,
				id_ejercicio = ejercicio,
				id_cliente = cliente,
				serie = serie,
				repeticiones = repeticiones,
				peso = peso,
				dia = dia,
			)
		return Response({"mensaje":"Rutina asignada correctamente"}, status=status.HTTP_201_CREATED)
	else:
		return Response({"error":"Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def obtenerRutinasCliente(request):
	if request.method == 'GET':
		id_cliente = request.query_params.get('id_cliente')
		dia = request.query_params.get('dia')
	
		if not id_cliente or not dia:
			return Response({"error":"El id del cliente y el dia son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

	try:
		asignas = SeAsigna.objects.filter(id_cliente = id_cliente,dia=dia)
		
		# Obtener rutinas únicas por ID
		rutinas_dict = {}
		for asigna in asignas: 
			rutina = asigna.id_rutina
			if rutina.id_rutina not in rutinas_dict:
				rutinas_dict[rutina.id_rutina] = rutina

		# Convertir a lista de rutinas
		rutinas = list(rutinas_dict.values())
		rutinas_serializadas = RoutineSerializer(rutinas, many=True)
		print(rutinas_serializadas.data)
		return Response({'rutinas':rutinas_serializadas.data},status=status.HTTP_200_OK)
	except Exception as e:
		return Response({"error",str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def obtenerTodasRutinasCliente(request):
    if request.method == 'GET':
        id_cliente = request.query_params.get('id_cliente')
        try:
            asignas = SeAsigna.objects.filter(id_cliente=id_cliente)
            
            # Obtener rutinas únicas por ID y añadir días
            rutinas_por_dia = []
            rutina_ids = set()
            for asigna in asignas:
                rutina = asigna.id_rutina
                if rutina.id_rutina not in rutina_ids:
                    rutina_data = {
                        'id_rutina': rutina.id_rutina,
                        'nombre': rutina.nombre,
                        'descripcion': rutina.descripcion,
                        'enfoque': rutina.enfoque,
                        'tipo': rutina.tipo,
                        'id_entrenador': rutina.id_entrenador.id_entrenador,
                        'dia': asigna.dia
                    }
                    rutinas_por_dia.append(rutina_data)
                    rutina_ids.add(rutina.id_rutina)

            # Serializar rutinas con día
            rutinas_serializadas = RoutineWithDaysSerializer(rutinas_por_dia, many=True)
            
            # Imprimir rutinas serializadas en consola
            #print(rutinas_serializadas.data)
            
            return Response({'rutinas': rutinas_serializadas.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

	
@api_view(['GET'])
def obtenerRutinaAsignadaDetalleCompleto(request):
	if request.method == 'GET':
		id_cliente = request.query_params.get('id_cliente')
		dia = request.query_params.get('dia')
		id_rutina = request.query_params.get('id_rutina')

		asignas = SeAsigna.objects.filter(id_cliente = id_cliente, dia = dia, id_rutina = id_rutina)
		ejercicios = Ejercicio.objects.all()

		#Zip between ejercicios and asignas
		images = []
		ejerciciosIds = []
		nombresEjercicios = []
		ejercicios_dict = {ejercicio.id_ejercicio:ejercicio for ejercicio in ejercicios}
		for asigna in asignas:
			ejercicio = ejercicios_dict[asigna.id_ejercicio.id_ejercicio]
			imagen = ejercicio.imagen
			if imagen not in images:
				images.append(imagen)
				ejerciciosIds.append(ejercicio.id_ejercicio)
				nombresEjercicios.append(ejercicio.nombre)
		asignas_serializadas = AssignedSerializer(asignas, many=True)
		return Response({'asignas':asignas_serializadas.data, 'imagenes':images, "ejerciciosIds":ejerciciosIds, 'nombresEjercicios':nombresEjercicios}, status=status.HTTP_200_OK)
	

@api_view(['DELETE'])
def eliminarRutinaAsignada(request, id_rutina, id_cliente):
	if request.method == 'DELETE':
		print("Si entra a eliminar")
		print(id_rutina)
		print(id_cliente)
		SeAsigna.objects.filter(id_rutina=id_rutina,id_cliente=id_cliente).delete()
		return Response({"mensaje":"Rutina eliminada correctamente"}, status=status.HTTP_200_OK)
	else:
		return Response({"error":"Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



@api_view(['PUT'])
def actualizar_rutinas(request):
	routines_data = request.data 
	for routine_data in routines_data:
		try:
			seAsigna = SeAsigna.objects.get(id=routine_data['id'])
			seAsigna.serie = routine_data['serie']
			seAsigna.repeticiones = routine_data['repeticiones']
			seAsigna.peso = routine_data['peso']
			seAsigna.save()
		except SeAsigna.DoesNotExist:
			return Response({"error":"Rutina asignada no encontrada"}, status=status.HTTP_404_NOT_FOUND)
	return Response({"message":"Rutina asignada actualizada exitosamente"}, status=status.HTTP_200_OK)



@api_view(['POST'])
def agregar_alimento(request):
	if request.method == 'POST':
		datos = request.data
		id_alimento = datos.get('id_alimento')
		id_cliente = datos.get('id_cliente')
		parte_dia = datos.get('parte_dia')
		cantidad = datos.get('cantidad')

		print(parte_dia)

		#--Alimento

		if not Alimento.objects.filter(api_id_referencia = id_alimento).exists():
			nombre = datos.get('nombre')
			calorias = datos.get('calorias')
			porcion = datos.get('porcion')
			grasa = datos.get('grasa')
			carbohidratos = datos.get('carbohidratos')
			proteina = datos.get('proteina')

			#Create alimento

			alimento = Alimento.objects.create(
				nombre = nombre,
				calorias = calorias,
				proteina_g = proteina,
				carbohidratos_g = carbohidratos,
				grasa_g = grasa,
				tamaño_porcion_g = porcion,
				api_id_referencia = id_alimento
			)
			
			cliente = get_object_or_404(Cliente, id_cliente=id_cliente)
			alimento = get_object_or_404(Alimento, id_alimento=alimento.id_alimento)
		
		else:

			#--Consume

			alimento = Alimento.objects.get(api_id_referencia = id_alimento)
			cliente = get_object_or_404(Cliente, id_cliente=id_cliente)

			#When the client consumed another food in the same day part

		if Consume.objects.filter(id_cliente=id_cliente, id_alimento=alimento.id_alimento).exists():
			#Update cantidad if client has already been consumed the food in the same parte_dia
			consume = Consume.objects.get(id_cliente=id_cliente, id_alimento=alimento.id_alimento)
			consume.cantidad = consume.cantidad + cantidad
		else:
			consume = Consume.objects.create(
				id_cliente = cliente,
				id_alimento = alimento,
				cantidad = cantidad
			)
			
			#Parte del dia 

			parte_dia = ParteDia.objects.get(nombre=parte_dia)

			print(parte_dia.id_parte_dia)

			dispone = Dispone.objects.create(
				id_cliente = cliente,
				id_alimento = alimento,
				id_parte_dia = parte_dia,
			)

			dispone.save()
		consume.save()

		return Response({"mensaje":"Alimento y consume creado exitosamente"}, status=status.HTTP_200_OK)
	else:
		return Response({"error":"Metodo no permitido"},status=status.HTTP_405_METHOD_NOT_ALLOWED)	


@api_view(['GET'])
def obtenerConsumoCliente(request,query_param):
	if request.method == 'GET':
		id_cliente = query_param
		consumo = Consume.objects.filter(id_cliente=id_cliente).select_related('id_alimento') #Select_related allows to add all alimento atributtes inside consumo, also I have to modify the serializer to chase that
		consumo_serializado = ConsumeSerializer(consumo,many=True)
		return Response({"consumo":consumo_serializado.data}, status=status.HTTP_200_OK)
	else:
		return Response({"error":"Metodo no permitido"},status=status.HTTP_405_METHOD_NOT_ALLOWED)

	
@api_view(['GET'])
def obtener_consumoCliente(request):
	if request.method == 'GET':
		id_cliente = request.query_params.get('id_cliente')
		consumo = Consume.objects.filter(id_cliente=id_cliente)
		consumo_serializado = ConsumeSerializer(consumo, many=True)
		return Response({"consumo":consumo_serializado.data}, status=status.HTTP_200_OK)
	else:
		return Response({"error":"Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

	

# 	@api_view(['POST'])
# def addRoutine(request):
# 	if request.method == 'POST':
# 		datos = request.data 
# 		nombre = datos.get('nombre')	
# 		descripcion = datos.get('descripcion')
# 		enfoque = datos.get('enfoque')
# 		ejercicios = datos.get('ejercicios',[])
# 		id_entren = datos.get('id_entrenador')

# 		#Crear la rutina
# 		entrenador = Entrenador.objects.get(id_entrenador=id_entren)
# 		rutina = Rutina.objects.create(
# 			id_entrenador= entrenador,
# 			nombre = nombre,
# 			descripcion = descripcion,
# 			enfoque = enfoque,
# 			tipo = 'Creada'
# 		)

# 		#Agregar ejercicios a la rutina
# 		for ejercicio in ejercicios:
# 			ej = Ejercicio.objects.get(id_ejercicio=ejercicio)
# 			Compuesta.objects.create(
# 				id_rutina = rutina,
# 				id_ejercicio = ej
# 			)

# 		return Response({"mensaje":"Rutina creada correctamente"}, status=status.HTTP_201_CREATED)
# 	else:
# 		return Response({"error":"Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
	
