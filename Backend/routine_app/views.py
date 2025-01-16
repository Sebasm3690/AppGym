import locale
from rest_framework import viewsets
from .serializer import *
from rest_framework.response import Response
from .models import Administrador
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import now, make_aware
from rest_framework import status
from datetime import datetime
from decimal import Decimal
from django.db.models import Case, When, Sum, F, DecimalField, Value
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
import requests
from django.contrib.auth import authenticate
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.http import JsonResponse
from datetime import date, datetime, timedelta
from django.db.models import Q, Sum, F,Value, DecimalField
from django.conf import settings
from django.db.models.functions import Coalesce
from datetime import date
import logging
from django.db import transaction
from django.db.models import Prefetch
from django.core.cache import cache
from .utils import get_fatsecret_token  # Import the token refresh function
from django.db.models.functions import TruncDay
from django.db.models import Avg, Max, Count, OuterRef, Subquery
from collections import defaultdict
from django.db.models.functions import TruncDate
import pytz
from dateutil.relativedelta import relativedelta
import traceback
import re
from calendar import monthrange
from django.core.serializers import serialize
import json
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_decode
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.http import HttpResponse
import logging
from rest_framework_simplejwt.tokens import RefreshToken
import os

# Set the locale globally (to Spanish)
locale.setlocale(locale.LC_TIME, "") 
#locale.setlocale(locale.LC_TIME, "es_ES.UTF-8")  # Use "es_ES.UTF-8" for Linux/Mac, "Spanish_Spain.1252" for Windows.
logger = logging.getLogger(__name__)

#logger = logging.getLogger(__name__)

# SignUp trainer
@api_view(['POST'])
def trainerRegister(request):
    # Check if email or username already exists
    correo = request.data.get('email')
    username = request.data.get('username')
    cedula = request.data.get('cedula')

    #if User.objects.filter(email=correo).exists():
        #return Response({'correo':'El correo ingresado ya ha sido registrado previamente'},status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'username':'El nombre de usuario ingresado ya ha sido registrado previamente'},status=status.HTTP_400_BAD_REQUEST)
    #if Entrenador.objects.filter(cedula=cedula).exists():
        #return Response({'cedula':'La cedula ingresada ya ha sido registrada previamente'},status=status.HTTP_400_BAD_REQUEST)

    # If email and username are unique, proceed with serialization
    serializer = TrainerSerializer(data=request.data)
    if serializer.is_valid():
        entrenador = serializer.save(imagen=request.FILES.get('imagen'))
        token = Token.objects.create(user=entrenador.user)
        return Response({'token':token.key, "entrenador":serializer.data}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Signup cliente
@api_view(['POST'])
def clientRegister(request):
    correo = request.data.get('email')
    username = request.data.get('username')
    cedula = request.data.get('cedula')
    print(cedula)

    if User.objects.filter(email=correo).exists():
        return Response({'correo':'El correo ingresado ya ha sido asignado a un administrador o entrenador'},status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'username':'El nombre de usuario ingresado ya ha sido asignado a un administrador o entrenador'},status=status.HTTP_400_BAD_REQUEST)
    if Administrador.objects.filter(cedula=cedula).exists() or Entrenador.objects.filter(cedula=cedula).exists() or Cliente.objects.filter(cedula=cedula).exists():
        return Response({'cedula':'La cedula ingresada ya ha sido asignada a un administrador o entrenador'},status=status.HTTP_400_BAD_REQUEST)
    
    # If email and username are unique, proceed with serialization
    serializer = ClientSerializer(data=request.data)

    if serializer.is_valid():
        cliente = serializer.save()	
        token = Token.objects.create(user=cliente.user)
        return Response({'token':token.key, "cliente":serializer.data}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Update trainer

@api_view(['PUT'])
def update_trainer(request,id):
    try:
        entrenador = Entrenador.objects.get(pk=id)
    except Entrenador.DoesNotExist:
        return Response({"details:":"Entrenador no encontrado"},status=status.HTTP_400_BAD_REQUEST)

    #Extract data
    correo = request.data.get('email','')
    username = request.data.get('username','')
    cedula = request.data.get('cedula','')

    print(request.data)

    #Check if another user has the same email or username
    #if User.objects.filter(email=correo).exclude(pk=entrenador.user.pk).exists():
        #return Response({'correo':'El correo ingresado ya ha sido registrado previamente'},status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exclude(pk=entrenador.user.pk).exists():
        return Response({'username':'El unsername ingresado ya ha sido registrado previamente'},status=status.HTTP_400_BAD_REQUEST)
    if Administrador.objects.filter(cedula=cedula).exists() or Entrenador.objects.filter(cedula=cedula).exclude(pk=entrenador.id_entrenador).exists():
        return Response({'cedula':'La cedula ingresada ya ha sido registrada previamente'},status=status.HTTP_400_BAD_REQUEST)
    
    #Perfom update if no conflicts are found
    serializer = TrainerSerializer(entrenador, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Update client

@api_view(['PUT'])
def update_client(request,id):
    try:
        cliente = Cliente.objects.get(pk=id)
    except Entrenador.DoesNotExist:
        return Response({"details:":"Cliente no encontrado"},status=status.HTTP_400_BAD_REQUEST)
    
    # Debugging request data and files
    print("Request DATA:", request.data)  # Ensure all fields are coming correctly
    print("Request FILES:", request.FILES)  # Check if 'imagen' is being sent as a file

    #Extract data
    correo = request.data.get('email')
    username = request.data.get('username')
    cedula = request.data.get('cedula')

    #Check if another user has the same email or username
    if User.objects.filter(email=correo).exclude(pk=cliente.user.pk).exists():
        return Response({'correo':'El correo ingresado ya ha sido registrado previamente'},status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exclude(pk=cliente.user.pk).exists():
        return Response({'username':'El unsername ingresado ya ha sido registrado previamente'},status=status.HTTP_400_BAD_REQUEST)
    if Administrador.objects.filter(cedula=cedula).exists() or Entrenador.objects.filter(cedula=cedula).exclude(pk=cliente.id_cliente).exists():
        return Response({'cedula':'La cedula ingresada ya ha sido registrada previamente'},status=status.HTTP_400_BAD_REQUEST)
    
    #Perfom update if no conflicts are found
    serializer = ClientSerializer(cliente, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    print("Serializer Errors:", serializer.errors)  # Log any serializer validation errors
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
            if (entrenador.borrado == True):
                return Response({"error":"Entrenador dado de baja por el administrador"}, status=status.HTTP_404_NOT_FOUND)
            else:
                token , created = Token.objects.get_or_create(user=user)
                serializer = TrainerSerializer(instance = entrenador)
                return Response({"token":token.key, "entrenador":serializer.data}, status = status.HTTP_200_OK)
        
        except Entrenador.DoesNotExist:
            return Response({"error":"Usuario no es un entrenador"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error":"username o contraseña incorrecta"}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error":"Error inesperado en el servidor"},status = status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def clientLogin(request):
    username = request.data.get("username")
    password = request.data.get("password")    

    logger.debug(f"Attempting login for username: {username}")
    user = authenticate(username=username, password=password)

    if user is not None:
        logger.debug(f"User authenticated: {user.username}")
        try:
            cliente = Cliente.objects.get(user=user)
            if cliente.borrado == True:
                return Response({"error": "Cliente dado de baja por el entrenador"}, status=status.HTTP_404_NOT_FOUND)
            
            #token, created = Token.objects.get_or_create(user=user)
            refresh = RefreshToken.for_user(user)
            serializer = ClientSerializer(instance=cliente)
            return Response({"refresh": str(refresh), "access": str(refresh.access_token),"cliente": serializer.data}, status=status.HTTP_200_OK)
        except Cliente.DoesNotExist:
            return Response({"error": "username o contraseña incorrecta"}, status=status.HTTP_400_BAD_REQUEST)

    # Add a response for failed authentication
    return Response({"error": "username o contraseña incorrecta"}, status=status.HTTP_400_BAD_REQUEST)

    #entrenador = get_object_or_404(Entrenador, user__email = request.data['email'])
    #if entrenador.password != request.data['password']: #Si el entrenador me retorna False o se falló en el intento de login 
        #return Response({"error":"Contraseña incorrecta"}, status=status.HTTP_400_BAD_REQUEST)
    
    #token, created = Token.objects.get_or_create(user=entrenador) #El created es un booleano que nos especifíca si se creó o no	
    #serializer = TrainerSerializer(instance=entrenador) #Me sirve para luego retornar un objeto entrenador en este caso
    #return Response({"token":token.key, "entrenador":serializer.data}, status=status.HTTP_200_OK) 



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
        cedula = self.request.query_params.get("cedula")

        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)
        if apellido:
            queryset = queryset.filter(apellido__icontains=apellido)
        if cedula:
            queryset = queryset.filter(cedula__icontains=cedula) #Para acceder al correo que está dentro de user
        
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
        tipo = self.request.query_params.get("tipo")
        queryset = queryset.filter(id_entrenador=id_entrenador, tipo=tipo)
        print(id_entrenador)
        print(tipo)
        nombre = self.request.query_params.get("nombre")
        enfoque = self.request.query_params.get("enfoque")
       
        if nombre:
            result = queryset.filter(nombre__icontains=nombre)
        elif enfoque:
            result = queryset.filter(enfoque__icontains=enfoque)
        else:
            result = queryset

     
        # Devuelve el queryset filtrado
        return result



#Buscar catalogos
class CatalogViewSet(viewsets.ModelViewSet):
    queryset = Rutina.objects.all()
    serializer_class = RoutineSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        id_entrenador = self.kwargs.get('id_entrenador')
        queryset = queryset.filter(id_entrenador=id_entrenador, tipo = "Catalogo")
        
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
    print("Si entra")
    logger.info(f"Request received: {request.body}")
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




@api_view(['POST'])
@authentication_classes([TokenAuthentication]) #Método para autenticarse
@permission_classes({IsAuthenticated}) #se ve si la ruta está autenticada
def profile(request):
    return Response({"Tu estas logueado como {}".format(request.user.username)}, status=status.HTTP_200_OK)





#Obtener comidas en FatSecret

def get_nutrition_data(request):
    """Fetch nutrition data from FatSecret API."""
    query = request.GET.get("search")
    if not query:
        return JsonResponse({"error": "Search query is required"}, status=400)

    url = "https://platform.fatsecret.com/rest/foods/search/v3"
    querystring = {
        "search_expression": query,
        "page_number": "0",
        "format": "json",
    }

    # Get the token dynamically
    token = get_fatsecret_token()
    headers = {
        "Authorization": token,
    }

    response = requests.get(url, headers=headers, params=querystring)

    if response.status_code == 200:
        data = response.json()
        return JsonResponse(data)
    else:
        return JsonResponse(
            {"error": "Failed to fetch data", "details": response.json()},
            status=response.status_code,
        )

#Obtener una comida en base al id en FatSecret

def get_food_by_id(request, food_id):
    query = request.GET.get('search','')
    url = "https://platform.fatsecret.com/rest/food/v4"

    querystring = {
        "food_id": food_id,
        "format": "json"
    }

     # Get the token dynamically
    token = get_fatsecret_token()

    headers = {
        "Authorization": token
    }

    # Perform the API request
    response = requests.get(url, headers=headers, params=querystring)

    # Check if the API request was successful

    if response.status_code == 200:
        data = response.json()
        return JsonResponse(data)
    else:
        return JsonResponse({"error": "Error al obtener los datos"}, status=response.status_code)


    #if response.status_code != 200:
        #return JsonResponse({"error": "Error al obtener los datos"}, status = response.status_code)

    # Parse the API response
    #data = response.json()
    #foods = data.get('foods',{}).get('food',[])

    # Filter the foods to find the one matching the given food_id
    #filtered_food = next((food for food in foods if str(food.get('food_id')) == str(food_id)), None)

    #if filtered_food:
        #return JsonResponse(filtered_food)
    #else:
        #return JsonResponse({"error": f"No se encontró la comida con el ID {food_id}"},status=404)
    


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
#class NutritionAPIView(APIView):
    #def post(self, request, query_param, *args, **kwargs):
        #id_cliente = query_param
        #query = request.data.get('query', '') #Se otiene el valor del parámetro 'query' enviado en la solicitud POST

        #if query:
            #nombre_alimento = query.split()[-1]
            #cantidad = query.split()[0]
            # Eliminar el último carácter (que en este caso sería "g")
            #cantidad_sin_unidad = cantidad[:-1]

            #alimento = Alimento.objects.filter(nombre=nombre_alimento, tamaño_porcion_g=cantidad_sin_unidad).first()  # Se utiliza filter para que devuelva la lista vacia, get devuelve Alimento.DoesnotExist
            #if not alimento: 
                #print("El alimento no existe")
                #api_url = 'https://api.api-ninjas.com/v1/nutrition?query='
                #api_key = '120T1ZhRsgzR6bTRBgrakw==9I1RDeQNeDEPGWIE'
                #api_request = requests.get(api_url + query, headers={'X-Api-Key': api_key})
                #try:
                    #api_response = api_request.json()
                    #for item in api_response:
                        #serializer = FoodSerializer(data={ #Crea una instancia del serializador AlimentoSerializer con los datos del elemento actual
                            #'nombre': item.get('name'),
                            #'calorias': item.get('calories'),
                            #'grasa_total_g': item.get('serving_size_g'),
                            #'proteina_g': item.get('fat_total_g'),
                            #'sodio_mg': item.get('sodium_mg'), 
                            #'potasio_mg': item.get('potassium_mg'), 
                            #'colesterol_mg': item.get('cholesterol_mg'),
                            #'total_carbohidratos_g': item.get('carbohydrates_total_g'),
                            #'total_fibra_g': item.get('fiber_g'),
                            #'grasa_total_saturada_g': item.get('fat_saturated_g'),
                            #'tamaño_porcion_g':	item.get('serving_size_g'),
                            #"azucar_total_g": item.get('sugar_g')
                        #})
                        #if serializer.is_valid():
                            #alimento = serializer.save()
                            #serializer2 = ConsumeSerializer(data={
                                #'id_alimento': alimento.id_alimento,
                                #'id_cliente': id_cliente,
                                #'fecha': now().date()
                            #})
                            #if serializer2.is_valid():
                                #serializer2.save()
                        #else:
                            #return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    #return Response(api_response, status = status.HTTP_201_CREATED)
                #except Exception as e:
                    #return Response({"error": "Hubo un error procesando la solicitud", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            #else:
                #print("El alimento si existe")
                #serializer = FoodSerializer(alimento)
                #print(serializer.data)
                #serializer2 = ConsumeSerializer(data={
                    #'id_alimento': alimento.id_alimento,
                    #'id_cliente': id_cliente,
                    #'fecha': now().date()
                #})
                #if serializer2.is_valid():	
                    #serializer2.save()
                    #return Response(serializer.data, status = status.HTTP_201_CREATED)
                #else:
                    #return Response(serializer2.errors, status=status.HTTP_400_BAD_REQUEST)
        #else:
            #return Response({"error","Sin query"}, status = status.HTTP_404_BAD_REQUEST)



class CalcularTMBAPIView(APIView):
    def post(self,request,query_param, *args, **kwargs):
        print("Si entra al calculo de TMB")
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
        print("Si entra a calcular los macronutrientes")
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
    def get(self, request, query_param, *args, **kwargs):
        cliente_id = query_param
        try:
            cliente = Cliente.objects.get(id_cliente=cliente_id)
        except Cliente.DoesNotExist:
            return Response({"error": "Cliente no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Extract and validate date range
        date_range = request.query_params.get('range', 'hoy')
        today = datetime.now().date()
        start_date, end_date = None, None

        if date_range == 'hoy':
            start_date = today
            end_date = today
        elif date_range == 'ayer':
            start_date = today - timedelta(days=1)
            end_date = today - timedelta(days=1)
        elif date_range == 'esta semana':
            start_date = today - timedelta(days=today.weekday())  # Start of the week (Monday)
            end_date = today
        elif date_range == 'semana pasada':
            start_date = today - timedelta(days=today.weekday() + 7)  # Last Monday
            end_date = today - timedelta(days=today.weekday() + 1)  # Last Sunday
        elif date_range.startswith('custom'):
            custom_start = request.query_params.get('start_date')
            custom_end = request.query_params.get('end_date')
            try:
                start_date = datetime.strptime(custom_start, '%Y-%m-%d').date()
                end_date = datetime.strptime(custom_end, '%Y-%m-%d').date()
            except (TypeError, ValueError):
                return Response(
                    {"error": "Rango de fechas invalido. Verifique 'start_date' y 'end_date'."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(
                {"error": "Rango de datos invalido. Opciones: 'hoy', 'ayer', 'esta semana', 'semana pasada', 'custom'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Ensure valid dates
        if not start_date or not end_date:
            return Response({"error": "Rango de fechas no asignado correctamente."}, status=status.HTTP_400_BAD_REQUEST)

        print(f"Start Date: {start_date}, End Date: {end_date}")

        # Aggregate macros
        consumo_hoy = Dispone.objects.filter(
            id_cliente=cliente_id,
            fecha__range=(start_date, end_date)
        ).aggregate(
            total_calorias=Coalesce(
                # Specify `output_field` as DecimalField to avoid mixed-type errors
                Sum(F('id_alimento__calorias') * F('cantidad'), output_field=DecimalField()),
                Value(0, output_field=DecimalField())  # Ensure fallback value is DecimalField
            ),
            total_proteina=Coalesce(
                # Specify `output_field` as DecimalField to avoid mixed-type errors
                Sum(F('id_alimento__proteina_g') * F('cantidad'), output_field=DecimalField()),
                Value(0, output_field=DecimalField())  # Ensure fallback value is DecimalField
            ),
            total_carbohidratos=Coalesce(
                # Specify `output_field` as DecimalField to avoid mixed-type errors
                Sum(F('id_alimento__carbohidratos_g') * F('cantidad'), output_field=DecimalField()),
                Value(0, output_field=DecimalField())  # Ensure fallback value is DecimalField
            ),
            total_grasa=Coalesce(
                # Specify `output_field` as DecimalField to avoid mixed-type errors
                Sum(F('id_alimento__grasa_g') * F('cantidad'), output_field=DecimalField()),
                Value(0, output_field=DecimalField())  # Ensure fallback value is DecimalField
            )
        )

        dias_rango = (end_date - start_date).days + 1 # +1 to include both start and end dates
        promedio_calorias = (
            consumo_hoy['total_calorias'] / dias_rango if dias_rango > 0 else 0
        )

        # Remaining macros
        consumo_restante = {
            "calorias_restantes": max(cliente.tmb - consumo_hoy['total_calorias'], 0),  # Ensure no negative values
            "proteina_restante": max(cliente.proteina_g - consumo_hoy['total_proteina'], 0),  # Ensure no negative values
            "carbohidratos_restantes": max(cliente.carbohidratos_g - consumo_hoy['total_carbohidratos'], 0),  # Ensure no negative values
            "grasas_restantes": max(cliente.grasas_g - consumo_hoy['total_grasa'], 0),  # Ensure no negative values
        }

        # Percentages
        consumo_logrado_porcentaje = {
            "calorias_logradas": consumo_hoy['total_calorias'] * 100 / cliente.tmb if cliente.tmb else 0,
            "proteina_lograda": consumo_hoy['total_proteina'] * 100 / cliente.proteina_g if cliente.proteina_g else 0,
            "carbohidratos_logrados": consumo_hoy['total_carbohidratos'] * 100 / cliente.carbohidratos_g if cliente.carbohidratos_g else 0,
            "grasa_lograda": consumo_hoy['total_grasa'] * 100 / cliente.grasas_g if cliente.grasas_g else 0,
        }

     
        return Response(
            {
                "consumo_hoy": consumo_hoy,
                "consumo_restante": consumo_restante,
                "consumo_logrado_porcentaje": consumo_logrado_porcentaje,
                "promedio_calorias": promedio_calorias,
            },
            status=status.HTTP_200_OK
        )



@api_view(['GET'])
def getFuerzaRutinaFecha(request):
    print("Si entra 1")
    id_rutina = request.query_params.get('id_rutina')
    id_cliente = request.query_params.get('id_cliente')
    date_range = request.query_params.get('range', 'hoy')
    month = request.query_params.get('month')
    year = request.query_params.get('year')
    tipo = "progreso"
    
    today = datetime.now().date()
    start_date = None
    end_date = None


    # 1. Process to get all dates
    if date_range == "mes" and month and year:
        try:
            start_date = datetime.strptime(f"{year}-{month}-01", "%Y-%m-%d").date()
            _, last_day = monthrange(int(year), int(month))
            end_date = start_date.replace(day=last_day)
        except ValueError:
            return Response({"error": "Mes o año invalido"}, status=status.HTTP_400_BAD_REQUEST)
    
    elif date_range == "año" and year:
        try:
            start_date = datetime.strptime(f"{year}-01-01", "%Y-%m-%d").date()
            end_date = datetime.strptime(f"{year}-12-31", "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Fecha invalida para año"}, status=status.HTTP_400_BAD_REQUEST)

    elif date_range == "custom":
        start_date = request.query_params.get('start_date') 
        end_date = request.query_params.get('end_date')
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()   
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Fecha inválida"}, status=status.HTTP_400_BAD_REQUEST)
  
    elif date_range == "hoy":
        start_date = today
        end_date = today
    elif date_range == "ayer":
        start_date = today - timedelta(days=1)
        end_date = today - timedelta(days=1)
    elif date_range == "esta semana":
        start_date = today - timedelta(days=today.weekday())  # Start of this week
        end_date = start_date + timedelta(days=6)  # End of this week
    elif date_range == "semana pasada":
        start_date = today - timedelta(days=today.weekday() + 7)  # Start of last week
        end_date = start_date + timedelta(days=6)  # End of last week
    else:
        return Response({"error": "Rango no reconocido"}, status=status.HTTP_400_BAD_REQUEST)
    
    start_date = make_aware(datetime.combine(start_date, datetime.min.time()))
    end_date = make_aware(datetime.combine(end_date, datetime.max.time()))

    print(f"Si entra 4: {start_date} -> {end_date}, Cliente ID: {id_cliente}, tipo: {tipo}, id_cliente: {id_cliente}, id_rutina: {id_rutina}")

    # Generate list of all dates in range
    current_date = start_date.date()
    date_list = []
    while current_date <= end_date.date():
        date_list.append(current_date)
        current_date += timedelta(days=1)

    # Filter SeAsigna entries
    seAsignas = SeAsigna.objects.filter(
        fecha__range=(start_date, end_date),
        id_cliente=id_cliente,
        tipo=tipo,
        id_rutina=id_rutina
    )


    # Process results to include all dates
    volumen_por_fecha = defaultdict(lambda: defaultdict(int))
    exercise_names = {}
    for seAsigna in seAsignas:
        fecha = seAsigna.fecha.date()
        id_ejercicio = seAsigna.id_ejercicio.id_ejercicio
        nombre_ejercicio = seAsigna.id_ejercicio.nombre
        
        if id_ejercicio not in exercise_names:
            exercise_names[id_ejercicio] = nombre_ejercicio

        volumen = seAsigna.peso * seAsigna.repeticiones
        volumen_por_fecha[fecha][id_ejercicio] += volumen

    print("Si entra 7")

    # Map results to all dates in the range
    volumen_data = []
    for date in date_list:
        if date in volumen_por_fecha:
            for id_ejercicio, volumen in volumen_por_fecha[date].items():
                volumen_data.append({
                    "fecha": str(date),
                    "id_ejercicio": id_ejercicio,
                    "nombre": exercise_names[id_ejercicio],
                    "volumen": volumen
                })
        else:
            volumen_data.append({
                "fecha": str(date),
                "id_ejercicio": None,
                "nombre": None,
                "volumen": 0
            })

    return Response({"volumen_por_fecha": volumen_data}, status=status.HTTP_200_OK)


@api_view(['GET'])
def getFuerzaRutina(request):
    id_rutina = request.query_params.get('id_rutina')
    id_cliente = request.query_params.get('id_cliente')
    tipo = "progreso"
    volumen = 0

    # Query SeAsigna entries
    seAsignas = SeAsigna.objects.filter(id_rutina=id_rutina,id_cliente=id_cliente,tipo=tipo)
    
    # Dictionary to group and sum volume by fecha (it works for only one attribute)
    #volumen_por_fecha = defaultdict(int)

    # Dictionary to group and sum volume by fecha and id_ejercicio []
    volumen_por_fecha = defaultdict(lambda: defaultdict(int))

    # Dictionary to store exercise names by id_ejercicio
    exercise_names = {}

    for seAsigna in seAsignas:
        fecha = seAsigna.fecha.date() # Use only the date part
        id_ejercicio = seAsigna.id_ejercicio.id_ejercicio
        nombre_ejercicio = seAsigna.id_ejercicio.nombre
        
        # Store the exercise name for the given id_ejercicio
        if id_ejercicio not in exercise_names:
            exercise_names[id_ejercicio] = nombre_ejercicio

        # Calculate volume and accumulate it by date and id_ejercicio
        volumen = seAsigna.peso * seAsigna.repeticiones
        volumen_por_fecha[fecha][id_ejercicio] += volumen # Accumulate volume for the date
       

    # Prepare the response data
    volumen_data = [
        {"fecha": str(fecha), "id_ejercicio": id_ejercicio, "nombre": exercise_names[id_ejercicio] ,"volumen": volumen}
        for fecha, ejercicios in volumen_por_fecha.items()
        for id_ejercicio, volumen in ejercicios.items()
    ]

    #print(volumen_data)

    # Prepare the response data (it works for only one attribute)
    #volumen_data = [
        #{"fecha": str(fecha), "volumen": volumen, "id_ejercicio":id_ejercicio}
        #for fecha, volumen, id_ejercicio in volumen_por_fecha.items()
    #]

    return Response({"volumen_por_fecha": volumen_data}, status=status.HTTP_200_OK)





@api_view(['GET'])
def getFuerzaEjercicio(request):
    id_ejercicio = request.query_params.get('id_ejercicio')
    id_cliente = request.query_params.get('id_cliente')
    date_range = request.query_params.get('range', 'hoy')
    month = request.query_params.get('month')
    year = request.query_params.get('year')
    tipo = "progreso"

    today = datetime.now().date()
    start_date = None
    end_date = None

    # 1. Process to get all dates
    if date_range == "mes" and month and year:
        try:
            start_date = datetime.strptime(f"{year}-{month}-01", "%Y-%m-%d").date()
            _, last_day = monthrange(int(year), int(month))
            end_date = start_date.replace(day=last_day)
        except ValueError:
            return Response({"error": "Mes o año invalido"}, status=status.HTTP_400_BAD_REQUEST)
    
    elif date_range == "año" and year:
        try:
            start_date = datetime.strptime(f"{year}-01-01", "%Y-%m-%d").date()
            end_date = datetime.strptime(f"{year}-12-31", "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Fecha invalida para año"}, status=status.HTTP_400_BAD_REQUEST)

    elif date_range == "custom":
        start_date = request.query_params.get('start_date') 
        end_date = request.query_params.get('end_date')
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()   
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Fecha inválida"}, status=status.HTTP_400_BAD_REQUEST)
  
    elif date_range == "hoy":
        start_date = today
        end_date = today
    elif date_range == "ayer":
        start_date = today - timedelta(days=1)
        end_date = today - timedelta(days=1)
    elif date_range == "esta semana":
        start_date = today - timedelta(days=today.weekday())  # Start of this week
        end_date = start_date + timedelta(days=6)  # End of this week
    elif date_range == "semana pasada":
        start_date = today - timedelta(days=today.weekday() + 7)  # Start of last week
        end_date = start_date + timedelta(days=6)  # End of last week
    else:
        return Response({"error": "Rango no reconocido"}, status=status.HTTP_400_BAD_REQUEST)
    
    start_date = make_aware(datetime.combine(start_date, datetime.min.time()))
    end_date = make_aware(datetime.combine(end_date, datetime.max.time()))

    print(f"Si entra 4: {start_date} -> {end_date}, Cliente ID: {id_cliente}, tipo: {tipo}, id_cliente: {id_cliente}")

    # Generate list of all dates in range
    current_date = start_date.date()
    date_list = []
    while current_date <= end_date.date():
        date_list.append(current_date)
        current_date += timedelta(days=1)


    # Dictionary to store volume grouped by date
    volumen_por_fecha = defaultdict(int)
    asignado_volumen_por_fecha = defaultdict(int)

    # Regex to extract "peso" and "repeticiones" from "asignado"
    asignado_regex = r"(\d+)kg x (\d+)"   

    # Query SeAsigna entries
        # Filter SeAsigna entries
    seAsignas = SeAsigna.objects.filter(
        fecha__range=(start_date, end_date),
        id_cliente=id_cliente,
        tipo=tipo,
        id_ejercicio=id_ejercicio,
    )


    for seAsigna in seAsignas:
        fecha = seAsigna.fecha.date() # Use only the date part

        # Calculate `volumen` directly from `peso` and `repeticiones`
        volumen = seAsigna.peso * seAsigna.repeticiones
        volumen_por_fecha[fecha] += volumen

        # Calculate `asignado_volumen` from the `asignado` field
        asignado_volumen = 0
        asignado = seAsigna.asignado  # Extract the 'asignado' field
        if asignado:
            match = re.match(asignado_regex, asignado)
            if match:
                peso = int(match.group(1))  # Extract the "peso" part
                repeticiones = int(match.group(2))  # Extract the "repeticiones" part
                asignado_volumen = peso * repeticiones

    
        # Accumulate volume and collect 'asignado' values for the 
        asignado_volumen_por_fecha[fecha] += asignado_volumen
        
    # Prepare the response data

    volumen_data = []
    for date in date_list:
        if date in volumen_por_fecha:
            volumen_data.append({
                'fecha': str(date),
                'volumen': volumen_por_fecha[date],
            })
        else:
            volumen_data.append({
                'fecha': str(date),
                'volumen': 0,
                })
            
    asignado_volumen_data = []
    for date in date_list:
        if date in asignado_volumen_por_fecha:
            asignado_volumen_data.append({
                'fecha': str(date),
                'asignado_volumen': asignado_volumen_por_fecha[date],
            })
        else:
            asignado_volumen_data.append({
                'fecha': str(date),
                'asignado_volumen': 0,
                })


    print("Si finaliza")
    
    
    return Response({"volumen_por_ejercicio": volumen_data, "volumen_asignado":asignado_volumen_data}, status=status.HTTP_200_OK)
        

@api_view(['GET'])
def getFuerzaEjercicioAsignado(request):
    id_ejercicio = request.query_params.get('id_ejercicio')
    id_cliente = request.query_params.get('id_cliente')
    tipo = "progreso"

    # Dictionary to store grouped data by date
    #data_por_fecha = defaultdict(lambda: {"volumen": 0, "asignados": []})

    # Regex to extract "peso" and "repeticiones" from "asignado"
    #asignado_regex = r"(\d+)kg x (\d+)" # Matches patterns like "40kg x 12"

    # Query SeAsigna entries
    #seAsignas = SeAsigna.objects.filter(id_ejercicio=id_ejercicio, id_cliente=id_cliente, tipo=tipo)

    #for seAsigna in seAsignas:
        #fecha = seAsigna.fecha.date()  # Use only the date part
        #asignado = seAsigna.asignado  # Extract the 'asignado' field

        # Parse 'asignado' to calculate its volume
        #asignado_volumen = 0
        #if asignado:
            #match = re.match(asignado_regex, asignado)
            #if match:
                #peso = int(match.group(1))  # Extract the "peso" part
                #repeticiones = int(match.group(2))  # Extract the "repeticiones" part
                #asignado_volumen = peso * repeticiones

        # Accumulate volume and collect 'asignado' values for the 
        #data_por_fecha[fecha]["volumen"] += asignado_volumen
        #if asignado:
            #data_por_fecha[fecha]["asignados"].append(asignado)
    
        # Prepare the response data
        #response_data = [
            #{
                #"fecha": str(fecha),
                #"volumen": data["volumen"], # Total calculated volume for the date
                #"asignados": data["asignados"],  # List of 'asignado' strings
            #}
            #for fecha,data in data_por_fecha.items()
        #]

    #return Response({"data_por_fecha": response_data}, status=status.HTTP_200_OK)



@api_view(['GET'])
def getHistorialCompletoFechas(request,query_param):

    #1. Filter all routines in date range provided

    print("Si entra 1")
    print(query_param)

    id_cliente = query_param
  
    # Extracting parameters
    date_range = request.query_params.get('range', 'hoy')

    try: 
        cliente = Cliente.objects.get(id_cliente=id_cliente)
    except Cliente.DoesNotExist:
        return Response({"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    today = datetime.now().date()
    start_date = None
    end_date = None

    print("Si entra 2")
    if date_range == "hoy":
        start_date = today
        end_date = today
        print("Si entra 3")
    elif date_range == "ayer":
        start_date = today - timedelta(days=1)
        end_date = today - timedelta(days=1)
        print("Si entra 3.1")
    elif date_range == "esta semana":
        start_date = today - timedelta(days=today.weekday())  # Start of this week
        end_date = start_date + timedelta(days=6)  # End of this week
    elif date_range == "semana pasada":
        start_date = today - timedelta(days=today.weekday()+7)  # Start of this week
        end_date = start_date + timedelta(days=6)  # End of this week
        print("Si entra 3.2")
    elif date_range == "custom":
        print("Si entra 3.4")
        custom_start = request.query_params.get("start_date")
        custom_end = request.query_params.get("end_date")
        try:
            start_date = datetime.strptime(custom_start, "%Y-%m-%d").date()
            end_date = datetime.strptime(custom_end, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Fecha inválida"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Fecha inválida o rango no reconocido"}, status=status.HTTP_400_BAD_REQUEST)
    
    if start_date and end_date:
        start_date = make_aware(datetime.combine(start_date, datetime.min.time()))
        end_date = make_aware(datetime.combine(end_date, datetime.max.time()))

    print(f"Si entra 4: {start_date} -> {end_date}, Cliente ID: {id_cliente}")

    # Filtering SeAsigna entries
    seAsignas = SeAsigna.objects.filter(
        fecha__range=(start_date, end_date),
        id_cliente=id_cliente,
        tipo="progreso"
    )

    if not seAsignas.exists():
        return Response({"routines": []}, status=status.HTTP_200_OK)

    #print(f"SeAsigna objects: {seAsignas}")

    # 2. Get all routines with its date and promedio

    ecuador_timezone = pytz.timezone('America/Guayaquil')

    # Fetching related routines
    rutina_ids = seAsignas.values_list("id_rutina", flat=True).distinct()
    rutinas = Rutina.objects.filter(id_rutina__in=rutina_ids)

    #This is a list to append elements []
    grouped_data = defaultdict(lambda: defaultdict(list))

    # This is a set to avoid repeated elements ()
    processed_exercises = defaultdict(lambda: set())

    # Calculate averages grouped by id_ejercicio 
    progresos = seAsignas.values("id_rutina","fecha","id_ejercicio","dia").annotate(
        avg_repeticiones=Avg("repeticiones"),
        avg_peso=Avg("peso"),
        max_repeticiones=Max("repeticiones"),
        max_peso=Max("peso"),
        max_serie=Count("serie")
    )

    for progreso in progresos:
         # Convert UTC datetime to Ecuador's timezone
        fecha_utc = progreso["fecha"]  # This is in UTC
        fecha_local = fecha_utc.astimezone(ecuador_timezone)  # Convert to Ecuador's timezone
        fecha = fecha_local.strftime("%Y-%m-%d")  # Format the date as a string
        #-----------------------------------------

        id_rutina = progreso["id_rutina"]
        id_ejercicio = progreso["id_ejercicio"]
        dia = progreso["dia"]

        if id_ejercicio in processed_exercises[(fecha,id_rutina)]:
            continue
        
        ejercicio = Ejercicio.objects.get(id_ejercicio = id_ejercicio)
        grouped_data[fecha][id_rutina].append({
            "id_ejercicio": progreso["id_ejercicio"],
            "nombre": ejercicio.nombre,
            "avg_repeticiones": progreso["avg_repeticiones"],
            "avg_peso" : progreso["avg_peso"],
            "max_repeticiones": progreso["max_repeticiones"],
            "max_peso": progreso["max_peso"],
            "max_serie": progreso["max_serie"],
            "dia": dia,
        })  

        processed_exercises[(fecha,id_rutina)].add(id_ejercicio)   

    historial = []
    for fecha, rutinas in grouped_data.items():
        rutinas_data = []
        for id_rutina, progreso in rutinas.items():
            rutina = Rutina.objects.get(id_rutina = id_rutina)
            rutinas_data.append({
                "id_rutina": rutina.id_rutina,
                "nombre": rutina.nombre,
                "enfoque": rutina.enfoque,
                "progreso": progreso,
                "descrpicion":rutina.descripcion,
            })
        historial.append({
            "fecha": fecha,
            "rutinas": rutinas_data
        })

    return Response({"historial":historial}, status=status.HTTP_200_OK) 








    # Use a set to track added routine IDs
    #datos = []
    #ids_rutinas = set()

    #for seAsigna in seAsignas:  
        #if seAsigna.id_rutina.id_rutina not in ids_rutinas:
            #rutina = rutinas.get(id_rutina=seAsigna.id_rutina.id_rutina) # This help to only get id_rutina value
            #datos.append({
                #"id_rutina": rutina.id_rutina,
                #"nombre": rutina.nombre,
                #"descripcion": rutina.descripcion,
                #"fecha": seAsigna.fecha,
                #"enfoque": rutina.enfoque,
                #"dia": seAsigna.dia,
            #})
            #ids_rutinas.add(seAsigna.id_rutina.id_rutina)
    
    print("Si entra 5")
    return Response({"routines": datos}, status=status.HTTP_200_OK)





class calcularTotalMacroAlimentosParteDia(APIView):
    def get(self, request, query_param, *args, **kwargs):
        cliente_id = query_param
        try:
            cliente = Cliente.objects.get(id_cliente=cliente_id)
        except Cliente.DoesNotExist:
            return Response({"error": "Cliente no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Get the date range from query parameters
        date_range = request.query_params.get('range', 'hoy')
        start_date = None
        end_date = None
        today = datetime.now().date()

        # Initialize date filters
        if date_range == "hoy":
            start_date = today
            end_date = today
        elif date_range == "ayer":
            start_date = today - timedelta(days=1)
            end_date = today - timedelta(days=1)
        elif date_range == "esta semana":
            start_date = today - timedelta(days=today.weekday())
            end_date = today
        elif date_range == "semana pasada":
            start_date = today - timedelta(days=today.weekday() + 7)
            end_date = today - timedelta(days=today.weekday() + 1)
        # Handle custom ranges (e.g., "18 Nov 24 - 24 Nov 24")
        elif date_range == "custom":
            custom_start = request.query_params.get("start_date")
            custom_end = request.query_params.get("end_date")
            try:
                start_date = datetime.strptime(custom_start, "%Y-%m-%d").date() # Converts it into a datetime object using datetime.strptime().
                end_date = datetime.strptime(custom_end, "%Y-%m-%d").date() # Converts it into a datetime object using datetime.strptime().
            except (TypeError, ValueError): 
                return Response({"error":"Rango de datos invalido"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                {"error": "Rango de datos invalido. Las opciones son: 'hoy', 'ayer', 'esta semana', 'semana pasada'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Debug the date range
        print(f"Start Date: {start_date}, End Date: {end_date}")

        # Initialize results
        daily_data = []

        # Fetch and group data by day
        grouped_data = (
            Dispone.objects.filter(
                id_cliente=cliente_id,
                fecha__range=(start_date, end_date),
            )
            .annotate(day=TruncDay("fecha"))
            .values("day")
            .annotate(
                desayuno_calorias=Coalesce(
                    Sum(
                        Case(
                            When(id_parte_dia=1, then=F("id_alimento__calorias") * F("cantidad"))
                        )
                    ),
                    Value(0),
                    output_field=DecimalField(),
                ),
                almuerzo_calorias=Coalesce(
                    Sum(
                        Case(
                            When(id_parte_dia=2, then=F("id_alimento__calorias") * F("cantidad"))
                        )
                    ),
                    Value(0),
                    output_field=DecimalField(),
                ),
                merienda_calorias=Coalesce(
                    Sum(
                        Case(
                            When(id_parte_dia=3, then=F("id_alimento__calorias") * F("cantidad"))
                        )
                    ),
                    Value(0),
                    output_field=DecimalField(),
                ),
            )
            .order_by("day")
        )

        # Debug grouped data
        print(f"Grouped Data: {list(grouped_data)}")

        # Prepare the response
        for day_data in grouped_data:
            daily_data.append(
                {
                    "date": day_data["day"].strftime("%A %d"),  # e.g., 'Monday 24'
                    "desayuno": day_data["desayuno_calorias"],
                    "almuerzo": day_data["almuerzo_calorias"],
                    "merienda": day_data["merienda_calorias"],
                }
            )

        # Final Debug
        print(f"Daily Data: {daily_data}")

        return Response({"daily_data": daily_data}, status=status.HTTP_200_OK)

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

class NivelActividadView(viewsets.ModelViewSet):
    serializer_class = NivelActividadSerializer
    queryset = NivelActividad.objects.all()

class MembresiaView(viewsets.ModelViewSet):
    serializer_class = MembresiaSerializer
    queryset = Membresia.objects.all()

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
        tiempo_descanso = datos.get('tiempo_descanso',180)
        notas = datos.get('notas')

        


        #Filtrar rutina y entrenador
        rutina = get_object_or_404(Rutina, id_rutina=rutina_id)
        entrenador = get_object_or_404(Entrenador,id_entrenador=id_entren)

        #Editar la rutina
        rutina.id_entrenador = entrenador	
        rutina.nombre = nombre
        rutina.descripcion = descripcion
        rutina.enfoque = enfoque 
        rutina.tiempo_descanso = tiempo_descanso
        rutina.notas = notas
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
    

#Eliminar ejercicio rutina
@api_view(['DELETE'])
def deleteExerciseRoutine(request,rutina_id,ejercicio_id):
    if request.method == 'DELETE':
        rutina = get_object_or_404(Rutina, id_rutina=rutina_id)



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
            notas = dato.get("notas")
            tiempo_descanso = dato.get("tiempoDescanso",180)
            asignado = f"{peso}kg x {repeticiones}"

            se_asigna, created = SeAsigna.objects.update_or_create(
                id_rutina = rutina,
                id_ejercicio = ejercicio,
                id_cliente = cliente,
                serie = serie,
                dia = dia,
                tipo = "asignacion",
                notas = notas,
                tiempo_descanso = tiempo_descanso,
                defaults = {
                    "repeticiones": repeticiones,
                    "peso": peso,   
                    "asignado": asignado,
                }
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
def mostrarEstadoRutina(request):
    id_cliente = request.query_params.get('id_cliente')

    if not id_cliente:
        return Response({"message": "id_cliente is required"}, status=400)
    
    rutinas = SeAsigna.objects.filter(id_cliente=id_cliente).values_list('id_rutina', flat=True).distinct()

    rutina_status = []

    for rutina in rutinas:
        asignas = SeAsigna.objects.filter(id_cliente=id_cliente, id_rutina=rutina, tipo="asignacion").order_by("-fecha","serie")
        progresos = SeAsigna.objects.filter(id_cliente=id_cliente, id_rutina=rutina, tipo="progreso").order_by("-fecha","serie")

        lastest_asigna = asignas.first()
        lastest_progreso = progresos.first()

        if lastest_asigna and lastest_progreso:
            if lastest_progreso.fecha > lastest_asigna.fecha:
                status = False
            else:
                status = True
        else:
            status = True #if there's not lastest_progreso

        rutina_status.append({
            'id_rutina': rutina,
            'status': status,
        })
   
     # Convert to JSON
    #asignas_json = json.loads(serialize('json', asignas[:1]))  # Serialize only the first record
    #progresos_json = json.loads(serialize('json', progresos[:1]))

    # Print serialized JSON
    #print(json.dumps(asignas_json, indent=4))
    #print(json.dumps(progresos_json, indent=4))

    return Response({'rutinas': rutina_status})



    
@api_view(['GET']) 
def obtenerRutinaAsignadaDetalleCompleto(request):
    if request.method == 'GET':
        id_cliente = request.query_params.get('id_cliente')
        dia = request.query_params.get('dia')
        id_rutina = request.query_params.get('id_rutina')

        lastest_asignas = SeAsigna.objects.filter(id_cliente=id_cliente,dia=dia,id_rutina=id_rutina,tipo="asignacion",id_ejercicio=OuterRef('id_ejercicio'),serie=OuterRef('serie')).order_by('-fecha').values('fecha')[:1]
        lastest_progresos = SeAsigna.objects.filter(id_cliente=id_cliente,dia=dia,id_rutina=id_rutina,tipo="progreso",id_ejercicio=OuterRef('id_ejercicio'),serie=OuterRef('serie')).order_by('-fecha').values('fecha')[:1]
       
        asignas = SeAsigna.objects.filter(id_cliente=id_cliente, dia=dia, id_rutina=id_rutina, tipo="asignacion", fecha=Subquery(lastest_asignas)).order_by("id_ejercicio","serie")
        progresos = SeAsigna.objects.filter(id_cliente=id_cliente, id_rutina=id_rutina, tipo="progreso", fecha = Subquery(lastest_progresos)).order_by("id_ejercicio","serie")


        ejercicios = Ejercicio.objects.all()

        # Zip between ejercicios and asignas
        images = []
        ejerciciosIds = []
        nombresEjercicios = []
        notas_asigna = []
        notas_progreso = []
        descansos_asigna = []
        descansos_progreso = []
        sets_data = {}

        # Create a dictionary for efficient lookup of exercises
        ejercicios_dict = {ejercicio.id_ejercicio: ejercicio for ejercicio in ejercicios}

        # Loop through assignments to populate response data
        for asigna in asignas:
            ejercicio = ejercicios_dict[asigna.id_ejercicio.id_ejercicio]
            progreso = progresos.filter(id_ejercicio=asigna.id_ejercicio, serie=asigna.serie).first()

            # Collect unique images, exercise IDs, and names
            if ejercicio.imagen not in images:
                images.append(ejercicio.imagen)
                ejerciciosIds.append(ejercicio.id_ejercicio)
                nombresEjercicios.append(ejercicio.nombre)
                if progreso:
                    print("Si entra a notas progreso")
                    notas_progreso.append(progreso.notas)
                    notas_asigna.append(asigna.notas)
                    descansos_progreso.append(progreso.tiempo_descanso)
                    descansos_asigna.append(asigna.tiempo_descanso)
                else:
                    notas_asigna.append(asigna.notas)
                    descansos_asigna.append(asigna.tiempo_descanso)
                    notas_progreso.append(None)
                    descansos_progreso.append(None)

            # Initialize sets_data if not already done
            if asigna.id_ejercicio.id_ejercicio not in sets_data:
                sets_data[asigna.id_ejercicio.id_ejercicio] = []

            # Add set data only if this specific serie does not already exist
            sets_data[asigna.id_ejercicio.id_ejercicio].append ({
                "serie":asigna.serie,
                "peso": asigna.peso or 0,
                "repeticiones": asigna.repeticiones or 0,
                "asignado": asigna.asignado or 0,
                "progresoPeso": progreso.peso if progreso else None,
                "progresoReps": progreso.repeticiones if progreso else None,
                #"notas": asigna.notas,
                #"descanso": asigna.tiempo_descanso,
                "completado": False,
            })

        # Convert sets_data to the required structure (list of sets)
        for key in sets_data.keys():
            sets_data[key].sort(key=lambda x: x['serie'])

        asignas_serializadas = AssignedSerializer(asignas, many=True)
        print(asignas_serializadas.data)
        return Response(
            {
                'asignas': asignas_serializadas.data,
                'imagenes': images,
                'ejerciciosIds': ejerciciosIds,
                'nombresEjercicios': nombresEjercicios,
                'sets': sets_data,
                'notas_asigna': notas_asigna,
                'notas_progreso': notas_progreso,
                'descansos_asigna': descansos_asigna,
                'descansos_progreso': descansos_progreso,
            },
            status=status.HTTP_200_OK,
        )



@api_view(['GET']) 
def obtenerRutinaProgresoDetalleCompleto(request):
    if request.method == 'GET':

        id_cliente = request.query_params.get('id_cliente')
        dia = request.query_params.get('dia')
        id_rutina = request.query_params.get('id_rutina')
        fecha_str = request.query_params.get('fecha')

        # Parse the `fecha` parameter and make it timezone-aware
        ecuador_timezone = pytz.timezone('America/Guayaquil')
        fecha = datetime.strptime(fecha_str, "%Y-%m-%d")  # Parse to naive datetime
        fecha = ecuador_timezone.localize(fecha)  # Convert to timezone-aware datetime


        lastest_asignas = SeAsigna.objects.filter(id_cliente=id_cliente,dia=dia,id_rutina=id_rutina,tipo="asignacion",id_ejercicio=OuterRef('id_ejercicio'),serie=OuterRef('serie')).order_by('-fecha').values('fecha')[:1]
        lastest_progresos = SeAsigna.objects.filter(id_cliente=id_cliente,dia=dia,id_rutina=id_rutina,tipo="progreso",id_ejercicio=OuterRef('id_ejercicio'),serie=OuterRef('serie')).order_by('-fecha').values('fecha')[:1]
     

        asignas = SeAsigna.objects.filter(id_cliente=id_cliente, dia=dia, id_rutina=id_rutina, tipo="asignacion", fecha=Subquery(lastest_asignas)).order_by("id_ejercicio","serie")
        progresos = SeAsigna.objects.filter(id_cliente=id_cliente, id_rutina=id_rutina, tipo="progreso", fecha = Subquery(lastest_progresos)).order_by("id_ejercicio","serie")

        # Convert to JSON
        asignas_json = json.loads(serialize('json', asignas))  # Serialize only the first record
        progresos_json = json.loads(serialize('json', progresos))

        # Print serialized JSON
        print(asignas_json)
        print(progresos_json)



        ejercicios = Ejercicio.objects.all()

        # Zip between ejercicios and asignas
        images = []
        ejerciciosIds = []
        nombresEjercicios = []
        notas_asigna = []
        notas_progreso = []
        descansos_asigna = []
        descansos_progreso = []
        sets_data = {}

        # Create a dictionary for efficient lookup of exercises
        ejercicios_dict = {ejercicio.id_ejercicio: ejercicio for ejercicio in ejercicios}

        # Loop through assignments to populate response data
        for asigna in asignas:
            ejercicio = ejercicios_dict[asigna.id_ejercicio.id_ejercicio]
            progreso = progresos.filter(id_ejercicio=asigna.id_ejercicio, serie=asigna.serie).first()

            # Collect unique images, exercise IDs, and names
            if ejercicio.imagen not in images:
                images.append(ejercicio.imagen)
                ejerciciosIds.append(ejercicio.id_ejercicio)
                nombresEjercicios.append(ejercicio.nombre)
                if progreso:
                    print("Si entra a notas progreso")
                    notas_progreso.append(progreso.notas)
                    notas_asigna.append(asigna.notas)
                    descansos_progreso.append(progreso.tiempo_descanso)
                    descansos_asigna.append(asigna.tiempo_descanso)
                else:
                    notas_asigna.append(asigna.notas)
                    descansos_asigna.append(asigna.tiempo_descanso)
                    notas_progreso.append(None)
                    descansos_progreso.append(None)

            # Initialize sets_data if not already done
            if asigna.id_ejercicio.id_ejercicio not in sets_data:
                sets_data[asigna.id_ejercicio.id_ejercicio] = {}

            # Add set data only if this specific serie does not already exist
            if asigna.serie not in sets_data[asigna.id_ejercicio.id_ejercicio]:
                sets_data[asigna.id_ejercicio.id_ejercicio][asigna.serie] = {
                    "peso": asigna.peso or 0,
                    "repeticiones": asigna.repeticiones or 0,
                    "asignado": progreso.asignado or 0,
                    "progresoPeso": progreso.peso if progreso else 0,
                    "progresoReps": progreso.repeticiones if progreso else 0,
                }

        # Convert sets_data to the required structure (list of sets)
        sets_data = {key: list(sets.values()) for key, sets in sets_data.items()}

        asignas_serializadas = AssignedSerializer(asignas, many=True)
        return Response(
            {
                'asignas': asignas_serializadas.data,
                'imagenes': images,
                'ejerciciosIds': ejerciciosIds,
                'nombresEjercicios': nombresEjercicios,
                'sets': sets_data,
                'notas_asigna': notas_asigna,
                'notas_progreso': notas_progreso,
                'descansos_asigna': descansos_asigna,
                'descansos_progreso': descansos_progreso,
            },
            status=status.HTTP_200_OK,
        )

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
    


@api_view(['DELETE'])
def eliminar_sets(request):
    try:
        set_id = request.data.get('id')  # ID of the set to delete
        id_ejercicio = request.data.get('id_ejercicio')
        serie = request.data.get('serie')

        print(set_id)
        print(id_ejercicio)
        print(serie)

        if set_id:
            # Delete the set based on its ID
            SeAsigna.objects.filter(pk=set_id).delete()
        else:
            # Delete based on alternative criteria (exercise ID and serie)
            SeAsigna.objects.filter(
                id_ejercicio=id_ejercicio, serie=serie
            ).delete()

        return Response(
            {"message": "Set deleted successfully"}, status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )



# Add progress routine from the trainer
@api_view(['PUT'])
def actualizar_rutinas(request):
    routines_data = request.data
    #updated_ids = [routine['id'] for routine in routines_data]
    #SeAsigna.objects.exclude(id__in=updated_ids).delete()
    
    for routine_data in routines_data:
        try:
            rutina_instance = Rutina.objects.get(pk=routine_data['id_rutina'])
            ejercicio_instance = Ejercicio.objects.get(pk=routine_data['id_ejercicio'])
            cliente_instance = Cliente.objects.get(pk=routine_data['id_cliente'])
            tiempoDescanso = routine_data.get('tiempo_descanso')
            notas = routine_data.get('notas')

            asignado = routine_data.get('asignado')
            today = datetime.now().date()

            SeAsigna.objects.create(
                id_rutina = rutina_instance,
                id_ejercicio = ejercicio_instance,
                id_cliente = cliente_instance,
                serie = routine_data['serie'],
                tipo = "asignacion",
                fecha = today,
                repeticiones = routine_data['repeticiones'],
                peso = routine_data['peso'],
                dia = routine_data['dia'],
                asignado = asignado,
                tiempo_descanso = tiempoDescanso,
                notas = notas
            )
                
        except SeAsigna.DoesNotExist:
            return Response({"error":"Rutina asignada no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"message":"Rutina asignada actualizada exitosamente"}, status=status.HTTP_200_OK)


#Update progress from the trainer
@api_view(['PUT'])
def update_rutinas(request):
    routines_data = request.data
    # Convert to JSON
    print("Si entra a update")
    #routines_json = json.loads(serialize('json', routines_data))  # Serialize only the first record

    # Print serialized JSON
    #print(json.dumps(routines_json, indent=4))
    print(request.data)
  
    try:
        with transaction.atomic():
            for routine_data in routines_data:
                rutina_instance = Rutina.objects.get(pk=routine_data['id_rutina'])
                cliente_instance = Cliente.objects.get(pk=routine_data['id_cliente'])
                ejercicio_instance = Ejercicio.objects.get(pk=routine_data['id_ejercicio'])
                dia = routine_data['dia']
                tiempo_descanso = routine_data.get('tiempoDescanso',180)
                notas = routine_data.get('notas')

                lastest_asignas = SeAsigna.objects.filter(id_cliente=cliente_instance,dia=dia,id_rutina=rutina_instance,tipo="asignacion",id_ejercicio=ejercicio_instance,serie = routine_data['serie'],).order_by('-fecha').values('fecha')[:1]
                asigna = SeAsigna.objects.filter(id_cliente=cliente_instance, dia=dia, id_rutina=rutina_instance, tipo="asignacion", id_ejercicio=ejercicio_instance,serie = routine_data['serie'], fecha=Subquery(lastest_asignas)).order_by("-fecha","serie").first()
                
                if asigna:
                    asigna.repeticiones = routine_data.get('repeticiones',asigna.repeticiones)
                    asigna.peso = routine_data.get('peso',asigna.peso)
                    asigna.fecha = datetime.now()
                    asigna.tiempo_descanso = routine_data.get('tiempo_descanso',asigna.tiempo_descanso)
                    asigna.notas = routine_data.get('notas',asigna.notas)
                    asigna.save()
                else:
                    # Create a new set if it doesn't exist
                    SeAsigna.objects.create(
                        id_cliente=cliente_instance,
                        id_rutina=rutina_instance,
                        id_ejercicio=ejercicio_instance,
                        dia=routine_data['dia'],
                        serie=routine_data['serie'],
                        repeticiones=routine_data['repeticiones'],
                        peso=routine_data['peso'],
                        fecha=datetime.now(),
                        tipo="asignacion",  # Always set to "asignacion" type
                        asignado=f"{routine_data['peso']}kg x {routine_data['repeticiones']}",
                        tiempo_descanso=tiempo_descanso,
                        notas=notas
                    )
                    
        return Response({"message":"Rutina asignada actualizada exitosamente"}, status=status.HTTP_200_OK)

    except Rutina.DoesNotExist:
        return Response({"error":"Rutina asignada no encontrada"}, status=status.HTTP_404_NOT_FOUND)                    
        
    
@api_view(['GET'])
def allowUpdate(request):
    id_cliente = request.query_params.get('id_cliente')
    id_rutina = request.query_params.get('id_rutina')

    if not id_cliente:
        return Response({"message": "id_cliente is required"}, status=400)

    if not id_rutina:
        return Response({"message": "id_rutina is required"}, status=400)

    progresos = SeAsigna.objects.filter(id_cliente=id_cliente, id_rutina=id_rutina, tipo="progreso").order_by("-fecha","serie")
    lastest_progreso = progresos.first()
    asignas = SeAsigna.objects.filter(id_cliente=id_cliente, id_rutina=id_rutina, tipo="asignacion").order_by("-fecha","serie")
    lastest_asignacion = asignas.first()

    if lastest_progreso and lastest_asignacion:
        if lastest_asignacion.fecha > lastest_progreso.fecha:
            allow = True
        else:
            allow = False
    else:
        allow = True
    return Response({'allow': allow})


    



@api_view(['POST'])
def agregar_alimento(request):
    if request.method == 'POST':
        print(request.data)
        today = date.today()

        datos = request.data
        id_alimento = datos.get('id_alimento')
        id_cliente = datos.get('id_cliente')
        parte_dia = datos.get('parte_dia')
        cantidad = Decimal(datos.get('cantidad',0))
        porcion = datos.get('porcion')
        measurement_type = datos.get('measurementType')
        metric =  Decimal(datos.get('metric',0))
        metric_serving_unit = datos.get('metric_serving_unit',"")
        gramsEnabled = datos.get('gramsEnabled',False)

        
        if measurement_type == 'grams': 
            cantidad = cantidad/metric
            gramos = cantidad * metric
            if metric_serving_unit == 'oz':
                print("Si entra")
                cantidad = cantidad / Decimal(28.3495)
            else:
                print("No entra")
        elif measurement_type == "portion":
            if gramsEnabled == False:
                gramos = 0
            else:
                gramos = cantidad * metric 


        print(parte_dia)

        #--Alimento

        with transaction.atomic():

            if not Alimento.objects.filter(api_id_referencia = id_alimento).exists():
                nombre = datos.get('nombre')
                calorias = datos.get('calorias')
                
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
                    metrica_g = metric,
                    api_id_referencia = id_alimento,
                    unidad_medida = metric_serving_unit
                )
            else:
                #--Consume
                alimento = Alimento.objects.get(api_id_referencia = id_alimento)

            cliente = get_object_or_404(Cliente, id_cliente=id_cliente)
            parte_dia_obj = ParteDia.objects.get(nombre=parte_dia)


            # Check if the Consume record already exists
            consume, _= Consume.objects.get_or_create(
                id_cliente = cliente,
                id_alimento = alimento,
            )


            # Check if Dispone entry exists; create if not
            dispone, dispone_created = Dispone.objects.get_or_create(
                id_cliente = cliente,
                id_alimento = alimento,
                id_parte_dia = parte_dia_obj,
                fecha = today,
                defaults={'cantidad':cantidad, 'tamaño_porcion_g':porcion, 'gramos': gramos},
            )

            if not dispone_created:
                dispone.cantidad += cantidad
                dispone.gramos += gramos
                dispone.save()

    
        return Response({"mensaje":"Alimento consume y dispone creados o actualizados exitosamente"}, status=status.HTTP_200_OK)
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
    


#Filter everything

@api_view(['GET'])
def obtenerDisponeCliente(request,query_param):
    if request.method == 'GET':
        id_cliente = query_param
        dispone = Dispone.objects.filter(id_cliente=id_cliente).select_related('id_alimento','id_cliente','id_parte_dia') #Select_related allows to add all alimento atributtes inside consumo, also I have to modify the serializer to chase that
        dispone_serializado = DisponeSerializer(dispone,many=True)
        return Response({"dispone":dispone_serializado.data}, status=status.HTTP_200_OK)
    else:
        return Response({"error":"Metodo no permitido"},status=status.HTTP_405_METHOD_NOT_ALL)
    


@api_view(['GET'])
def obtener_consumoCliente(request):
    if request.method == 'GET':
        id_cliente = request.query_params.get('id_cliente')
        consumo = Consume.objects.filter(id_cliente=id_cliente)
        consumo_serializado = ConsumeSerializer(consumo, many=True)
        return Response({"consumo":consumo_serializado.data}, status=status.HTTP_200_OK)
    else:
        return Response({"error":"Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


#Filter only one	
@api_view(['GET'])
def obtener_datos_dispone_actual(request):
    if request.method == 'GET':
        #datos = request.data
        id_cliente = request.query_params.get('id_cliente')
        id_alimento = request.query_params.get('id_alimento')
        id_parte_dia = request.query_params.get('id_parte_dia')
        fecha = request.query_params.get('fecha')

        print(f"Received data: id_cliente={id_cliente}, id_alimento={id_alimento}, id_parte_dia={id_parte_dia}, fecha={fecha}")

        dispone = Dispone.objects.get(id_cliente=id_cliente, id_alimento=id_alimento, id_parte_dia=id_parte_dia, fecha=fecha)	
        dispone_serializado = DisponeSerializer(dispone)
        return Response({"dispone":dispone_serializado.data}, status=status.HTTP_200_OK)

    else:
        return Response({"error":"Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
def update_food(request):
    if request.method == 'POST':
        datos = request.data 
        print(datos)
        id_cliente = datos.get('id_cliente')
        id_alimento = datos.get('id_alimento')
        id_parte_dia = datos.get('id_parte_dia')
        fecha = datos.get('fecha')
        cantidad = Decimal(datos.get('cantidad'))
        gramos = Decimal(datos.get('gramos'))
        measurement_type = datos.get('measurementType')
        metric =  Decimal(datos.get('metric',0))
        metric_serving_unit = datos.get('metric_serving_unit',"")
        gramsEnabled = datos.get('gramsEnabled',False)

        
        if measurement_type == 'grams': 
            cantidad = gramos/metric
            if metric_serving_unit == 'oz':
                print("Si entra")
                cantidad = cantidad / Decimal(28.3495)
            else:
                print("No entra")
        elif measurement_type == "portion":
            if gramsEnabled == False:
                gramos = 0
            else:
                gramos = cantidad * metric 


        print(f"Received data: id_cliente={id_cliente}, id_alimento={id_alimento}, id_parte_dia={id_parte_dia}, fecha={fecha}")

        dispone = Dispone.objects.get(id_cliente=id_cliente, id_alimento=id_alimento, id_parte_dia=id_parte_dia, fecha=fecha)
        dispone.cantidad = cantidad
        dispone.gramos = gramos
        dispone.save()
        dispone_serializado = DisponeSerializer(dispone)
        return Response({"mensaje":"Alimento actualizado correctamente", "dispone":dispone_serializado.data}, status=status.HTTP_200_OK)
    else:
        return Response({"error":"Método no permitido"}, status=status.HTTP_405_METHOD_NOT)
    
@api_view(['DELETE'])
def delete_food(request):
    if request.method == 'DELETE':
        datos = request.data
        id_cliente = datos.get('id_cliente')
        id_alimento = datos.get('id_alimento')
        id_parte_dia = datos.get('id_parte_dia')
        fecha = datos.get('fecha')

        print(f"Received data to delete: id_cliente={id_cliente}, id_alimento={id_alimento}, id_parte_dia={id_parte_dia}, fecha={fecha}")

        dispone = Dispone.objects.get(id_cliente=id_cliente, id_alimento=id_alimento, id_parte_dia=id_parte_dia, fecha=fecha)
        dispone.delete()
        return Response({"mensaje":"Alimento eliminado correctamente"}, status=status.HTTP_200_OK)
    else:
        return Response({"error":"Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
@api_view(['GET']) 
def obtener_tmb(request, query_param):
    if request.method == 'GET':
        cliente = Cliente.objects.get(id_cliente = query_param)
        tmb = cliente.tmb
        return Response({"tmb":tmb}, status=status.HTTP_200_OK) 

@api_view(['GET']) 
def obtener_rutinas_dia_cliente(request):
    if request.method == 'GET':
         id_cliente = request.query_params.get('id_cliente')
         dia = request.query_params.get('dia')
         seAsignas = SeAsigna.objects.filter(id_cliente=id_cliente,dia=dia)
         rutinas = Rutina.objects.filter(id_rutina__in=[seAsigna.id_rutina.id_rutina for seAsigna in seAsignas])
         rutinas_serializadas = RoutineSerializer(rutinas, many=True)
         return Response({'rutinas':rutinas_serializadas.data}, status=status.HTTP_200_OK)
             


#Asignar rutina de ejercicios
@api_view(['POST'])
def agregarProgreso(request):

    # Get Ecuador timezone
    ecuador_timezone = pytz.timezone('America/Guayaquil')

     # Localized datetime for Ecuador
    ecuador_time = datetime.now(ecuador_timezone)

    print(f"Ecuador datetime (localized): {ecuador_time}")

    datos = request.data
   
    id_rutina = datos[0].get("routineId")
    id_cliente = datos[0].get("clientId")
    dia = datos[0].get("day")
    rutina = Rutina.objects.get(id_rutina=id_rutina)
    cliente = Cliente.objects.get(id_cliente=id_cliente)
    today = datetime.now().date()

    for dato in datos:
        print(dato)
        # Parse the date and make it timezone-aware
        naive_date = datetime.combine(today, datetime.min.time())
        aware_date = pytz.timezone('America/Guayaquil').localize(naive_date)

        id_ejercicio = dato.get("exerciseId")
        ejercicio = Ejercicio.objects.get(id_ejercicio=id_ejercicio)
        cliente = Cliente.objects.get(id_cliente=id_cliente)
        serie = dato.get("set")
        repeticiones = dato.get("reps")
        peso = dato.get("weight")
        peso_asignado = dato.get("peso")
        repeticiones_asignadas = dato.get("repeticiones")
        exercise_timers = dato.get("exerciseTimers",{})

        # Match the frontend keys
        initial_time = exercise_timers.get("initialTime",0)
        final_time = exercise_timers.get("timeLeft",0)


        notas = dato.get("notas")
        rest_time = max(0,initial_time - final_time) 
        print(notas)
        print(f"Initial time: {initial_time}")
        print(f"Final time: {final_time}")
        print(f"Rest time: {rest_time}")

        SeAsigna.objects.create(
            id_rutina = rutina,
            id_ejercicio = ejercicio,
            id_cliente = cliente,
            serie = serie,
            notas = notas,
            tiempo_descanso = rest_time,
            dia = dia,
            fecha = aware_date,
            tipo = "progreso",
            repeticiones = repeticiones,
            peso = peso,
            asignado = f"{peso_asignado}kg x {repeticiones_asignadas}",
        )

    return Response({"mensaje":"Rutina asignada correctamente"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def getHistorialCliente(request):
    ecuador_timezone = pytz.timezone('America/Guayaquil')

    # Retrieve query parameters
    id_cliente = request.query_params.get('id_cliente')
    id_rutina = request.query_params.get('id_rutina')
    dia = request.query_params.get('day')
    tipo = "progreso"
    mes = request.query_params.get('mes')

    print("Si llega 1")
    if not mes:
        current_date = datetime.now()
        mes = current_date.strftime("%Y-%m")  # Format as "YYYY-MM"
        
    print("Si llega 2")
    # Validate required parameters
    if not (id_cliente and id_rutina and dia):
        return Response({"mensaje": "Faltan parámetros"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        #Parse the end parameter 
        # Example: year_month = "2024-12"
        # Result: start_date = datetime(2024, 12, 1, 0, 0)
        try:
            start_date = datetime.strptime(mes, "%Y-%m").replace(day=1) 
            print("Si llega 3")
            # Get the timezone for Ecuador and localize the start_date to include timezone information
            # Result: start_date = datetime(2024, 12, 1, 0, 0, tzinfo=<DstTzInfo 'America/Guayaquil' LMT-1 day, 19:07:00 STD>)
            ecuador_timezone = pytz.timezone("America/Guayaquil")
            print("Si llega 4")
            # Add one month to start_date, subtract one day to get the last day of the month
            start_date = ecuador_timezone.localize(start_date)
            print("Si llega 5")
            # Add one month to start_date, subtract one day to get the last day of the month
            # Result: end_date = datetime(2024, 12, 31, 0, 0, tzinfo=<DstTzInfo 'America/Guayaquil' LMT-1 day, 19:07:00 STD>)
            end_date = (start_date + relativedelta(months=1) - timedelta(days=1)) 
            print("Si llega 6")   
           
        except Exception as e:
            print(f"Error in parsing or localizing dates:{e}")
            traceback.print_exc()
            return Response({"error": str(e)}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({"mensaje":"Formato de mes invalido"}, status=status.HTTP_400_BAD_REQUEST )

         # Fetch all progress records for the client
        seAsignas = SeAsigna.objects.filter(id_cliente = id_cliente, tipo = tipo, dia = dia, id_rutina = id_rutina, fecha__range = (start_date, end_date) ).order_by("-fecha","serie")

        if not seAsignas.exists():
            return Response({"mensaje": "No hay datos para mostrar"}, status=status.HTTP_204_NO_CONTENT)
        
        #This is a list to append elements []
        grouped_data = defaultdict(lambda: defaultdict(list))


        # This is a set to avoid repeated elements ()
        processed_exercises = defaultdict(lambda: set())

        print("Si llega 7")   
        # Calculate averages grouped by id_ejercicio 
        progresos = seAsignas.values("id_rutina","fecha","id_ejercicio").annotate(
            avg_repeticiones=Avg("repeticiones"),
            avg_peso=Avg("peso"),
            max_repeticiones=Max("repeticiones"),
            max_peso=Max("peso"),
            max_serie=Count("serie")
        )


        for progreso in progresos:
             # Convert UTC datetime to Ecuador's timezone
            fecha_utc = progreso["fecha"]  # This is in UTC
            fecha_local = fecha_utc.astimezone(ecuador_timezone)  # Convert to Ecuador's timezone
            fecha = fecha_local.strftime("%Y-%m-%d")  # Format the date as a string
            #-----------------------------------------

            id_rutina = progreso["id_rutina"]
            id_ejercicio = progreso["id_ejercicio"]

            if id_ejercicio in processed_exercises[(fecha,id_rutina)]:
                continue
            
            ejercicio = Ejercicio.objects.get(id_ejercicio = id_ejercicio)
            grouped_data[fecha][id_rutina].append({
                "id_ejercicio": progreso["id_ejercicio"],
                "nombre": ejercicio.nombre,
                "avg_repeticiones": progreso["avg_repeticiones"],
                "avg_peso" : progreso["avg_peso"],
                "max_repeticiones": progreso["max_repeticiones"],
                "max_peso": progreso["max_peso"],
                "max_serie": progreso["max_serie"],
            })  

            processed_exercises[(fecha,id_rutina)].add(id_ejercicio)   


        historial = []
        for fecha, rutinas in grouped_data.items():
            rutinas_data = []
            for id_rutina, progreso in rutinas.items():
                rutina = Rutina.objects.get(id_rutina = id_rutina)
                rutinas_data.append({
                    "id_rutina": rutina.id_rutina,
                    "nombre": rutina.nombre,
                    "enfoque": rutina.enfoque,
                    "progreso": progreso,
                    "descrpicion":rutina.descripcion,
                })
            historial.append({
                "fecha": fecha,
                "rutinas": rutinas_data
            })

        print("Si llega hasta el final")   

        return Response({"historial":historial}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def controlClienteMembresia(request):
    today = datetime.now().date()
    count = 0
    if request.method == 'POST':
        clientes = Cliente.objects.all()
        for cliente in clientes:
            if cliente.fecha_fin <= today:
                cliente.borrado = True
                cliente.save()
                count += 1
        print(count)
        return Response({"success":"Control de mebresias realizado exitosamente"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def allowDelete(request):
    id_cliente = request.query_params.get('id_cliente')
    id_rutina = request.query_params.get('id_rutina')

    if not id_cliente:
        return Response({"message": "id_cliente is required"}, status=400)

    if not id_rutina:
        return Response({"message": "id_rutina is required"}, status=400)

    progresos = SeAsigna.objects.filter(id_cliente=id_cliente, id_rutina=id_rutina, tipo="progreso").order_by("-fecha","serie")
    lastest_progreso = progresos.first()

    if lastest_progreso:
        allow = False
    else:
        allow = True

    print(allow)
       
    return Response({'allow': allow})

@api_view(['GET'])
def getRestClient(request):
    if request.method == 'GET':
        id_cliente = request.query_params.get('id_cliente')
        id_ejercicio = request.query_params.get('id_ejercicio')
        id_rutina = request.query_params.get('id_rutina')
        dia = request.query_params.get('dia')
        print(f"Los datos son:",id_cliente, id_ejercicio, id_rutina, dia)

        if not id_cliente:
            return Response({"message": "id_cliente is required"}, status=400)
        if not id_ejercicio:
            return Response({"message": "id_ejercicio is required"}, status=400)
        if not id_rutina:
            return Response({"message": "id_rutina is required"}, status=400)
        

        lastest_asignas = SeAsigna.objects.filter(id_cliente=id_cliente,dia=dia,id_rutina=id_rutina,tipo="asignacion",id_ejercicio=id_ejercicio,serie=OuterRef('serie')).order_by('-fecha').values('fecha')[:1]
        asignas = SeAsigna.objects.filter(id_cliente=id_cliente, dia=dia, id_rutina=id_rutina, tipo="asignacion", id_ejercicio=id_ejercicio, fecha=Subquery(lastest_asignas)).order_by("id_ejercicio","serie")
     
        lastest_asigna = asignas.first()
        if lastest_asigna:
            if lastest_asigna.tiempo_descanso:
                descanso = lastest_asigna.tiempo_descanso 
            else:
                descanso = 180

        return Response({'tiempoDescanso': descanso})

#Link to allows the user recover their password
@api_view(['POST'])
def reset_password_request(request):
    userType = request.data.get('userType')
    print(userType)
    email = request.data.get('email')
 
    if not email:
        return Response({"error": "El email es requerido"}, status=status.HTTP_400_BAD_REQUEST)
    
    if userType not in ['Administrador','Entrenador','Cliente']:
        return Response({"error": "Tipo de usuario inválido"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)

        if userType == 'Administrador':
            Administrador.objects.get(user=user)
        elif userType == 'Entrenador':
            Entrenador.objects.get(user=user)
        else:
            Cliente.objects.get(user=user)

    except User.DoesNotExist:
        return Response({"error": "El usuario no existe"}, status=status.HTTP_400_BAD_REQUEST)
    except (Administrador.DoesNotExist, Entrenador.DoesNotExist, Cliente.DoesNotExist):
        return Response({"error": f"El usuario no pertenece al tipo '{userType}'"}, status=status.HTTP_400_BAD_REQUEST)
    
    #Generate a resete token
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    frontend_url = os.getenv("FRONTEND_URL","http://localhost")
    reset_link = f"{frontend_url}/reset-password/{uid}/{token}/"

    print("Generated Reset Link:", reset_link)


    #Prepare email content
    subject = "Restablece tu contraseña"
    from_email = "admin@fitness.com"
    recipient_list = [email]

    # Render HTML email template    
    html_content = render_to_string('emails/reset_password.html', {'reset_link': reset_link})
    text_content = f"Para restablecer tu contraseña, haz clic en el siguiente enlace: {reset_link}"
    
    # Create and send email
    email_message = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    email_message.attach_alternative(html_content, "text/html")
    email_message.send()


    #Send email
    #send_mail(
        #subject="Reset Password",
        #message = f"Para resetear tu contraseña, haz click en el siguiente enlace: {reset_link}",
        #from_email="admin@fitness.com",
        #recipient_list=[email],
    #)

    return Response({"mensaje": "El email de reseteo de contraseña ha sido enviado a tu correo"}, status=status.HTTP_200_OK) 


#After the user clicks the link, this function will be called
@api_view(['POST'])
def reset_password_confirm(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"error":"Token o Id de usuario invlido"}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({"error":"Token invalido"}, status=status.HTTP_400_BAD_REQUEST)

    new_password = request.data.get('password')
    if not new_password:
        return Response({"error": "La contraseña es requerida"}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()

    return Response({"mensaje": "Contraseña reseteada exitosamente"}, status=status.HTTP_200_OK)

def home(request):
    return HttpResponse("Hola, estás en la página de inicio")
        
