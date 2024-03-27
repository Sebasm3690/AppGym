from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'admin', AdminView, 'admin') #api/v1/admin/
router.register(r'food',FoodView, 'food') 
router.register(r'consume', ConsumeView, 'consume') 
router.register(r'trainer', TrainerView, 'trainer') 
router.register(r'client',ClientView,'client')

urlpatterns = [
    # Rutas personalizadas primero
    path('trainerLogin/', trainerLogin),
    path('trainerRegister/', trainerRegister),
    path('clientRegister/', clientRegister),
    path('profile/', profile),
    path('getExcercises/<str:body_part>', get_exercises),
     # Incluye las rutas del router bajo un prefijo específico para evitar conflictos
    path( "api/v1/", include(router.urls)), #/api/v1/
    path("getFood/",FoodAPIView.as_view(),name='getFood'),
    path("addFood/<query_param>/",NutritionAPIView.as_view(), name='addFood'),
    path("consumeFood/",ConsumeView.as_view({'get':'list'}), name='consumeFood'),
    path("calcularTMB/<query_param>/",CalcularTMBAPIView.as_view(), name='calcularTMB'),
    path("calcularMacros/<query_param>/",calcularMacroNutrientes.as_view(), name='calcularMacros'),
    path("calcularTotalMacrosAlimentos/<query_param>/",calcularTotalMacrosAlimentos.as_view(), name='calcularTotalMacrosAlimentos)'),
    path('borradoLogicoEntrenador/<query_param>/', BorradoLogicoEntrenador.as_view(), name='borradoLogicoEntrenador'),
    path('borradoLogicoCliente/<query_param>/', BorradoLogicoCliente.as_view(), name='borradoLogicoCliente'),
    path("getExcercises/<query_param>/", ExerciseView.as_view({'get':'list'}), name='getExcercises'),
    path("getRoutine/",RoutineView.as_view({'get':'list'}), name='getRoutine'),
    
]
