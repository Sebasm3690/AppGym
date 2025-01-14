from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from .views import *
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'admin', AdminView, 'admin') #api/v1/admin/
router.register(r'food',FoodView, 'food') 
router.register(r'consume', ConsumeView, 'consume') 
router.register(r'trainer', TrainerView, 'trainer') 
router.register(r'client',ClientView,'client')
router.register(r'entrenador',TrainerViewSet) #Buscar entrenador
router.register(r'genero',GenreView,'genero')
router.register(r'nivelGym',GymLevelView,'nivelGym')
router.register(r'nivelActividad',GymActivityView,'nivelActividad')
router.register(r'objetivo',TargetView,'objetivo')
router.register(r'rutina',RoutineView,'rutina')
router.register(r'ejercicio',ExerciseView,'ejercicio')
router.register(r'compuesta',CompoundView,'compuesta')
router.register(r'seAsigna',AssignedView,'seAsigna')
router.register(r'parteDia',PartOfDayView,'parteDia')
router.register(r'dispone',DisponeView,'dispone')
router.register(r'nivelActividad',NivelActividadView,'nivelActividad')
router.register(r'membresia',MembresiaView,'membresia')



urlpatterns = [
    # Rutas personalizadas primero
    path('trainerLogin/', trainerLogin),
    path('trainerRegister/', trainerRegister),
    path('clientRegister/', clientRegister),
    path('profile/', profile),
    path('getExcercises/<str:body_part>', get_exercises),
    path('adminLogin/',adminLogin),
    path('clientLogin/',clientLogin),
     # Incluye las rutas del router bajo un prefijo específico para evitar conflictos
    path( "api/v1/", include(router.urls)), #/api/v1/
    path("getFood/",FoodAPIView.as_view(),name='getFood'),
    #path("addFood/<query_param>/",NutritionAPIView.as_view(), name='addFood'),
    path("consumeFood/",ConsumeView.as_view({'get':'list'}), name='consumeFood'),
    path("calcularTMB/<query_param>/",CalcularTMBAPIView.as_view(), name='calcularTMB'),
    path("calcularMacros/<query_param>/",calcularMacroNutrientes.as_view(), name='calcularMacros'),
    path("calcularTotalMacrosAlimentos/<int:query_param>/",calcularTotalMacrosAlimentos.as_view(), name='calcularTotalMacrosAlimentos)'),
    path('borradoLogicoEntrenador/<query_param>/', BorradoLogicoEntrenador.as_view(), name='borradoLogicoEntrenador'),
    path('borradoLogicoCliente/<query_param>/', BorradoLogicoCliente.as_view(), name='borradoLogicoEntrenador'),
    path('borradoLogicoCliente/<query_param>/', BorradoLogicoCliente.as_view(), name='borradoLogicoCliente'),
    path("getExcercises/<query_param>/", ExerciseView.as_view({'get':'list'}), name='getExcercises'),
    path("getRoutine/",RoutineView.as_view({'get':'list'}), name='getRoutine'),
    path("recuperarEntrenador/<query_param>/",RecuperarEntrenador.as_view(), name='recuperarEntrenador'),
    path("recuperarCliente/<query_param>/",RecuperarCliente.as_view(), name='recuperarCliente'),
    path("cerrarSesion/",logout,name="cerrarSesion"),
    path("buscarClientes/<int:id_entrenador>/",ClientViewSet.as_view({'get':'list'}, name="cliente-buscar")),
    path("buscarEntrenadores/<int:id_administrador>/",TrainerViewSet.as_view({'get':'list'}, name="entrenador-buscar")),
    path("addRoutine/",addRoutine,name="agregar-rutina"),
    path("ejerciciosRutina/<query_param>/",obtenerEjerciciosRutina,name="ejerciciosRutina"),
    path("updateRoutine/<int:rutina_id>", updateRoutine, name="actualizarRutina"),
    path("buscarRutinas/<int:id_entrenador>/",RoutineViewSet.as_view({'get':'list'},name="rutina-buscar")),
    path("asignarRutina/",asignarRutina,name="asignar-rutina"),
    path("obtenerRutinasCliente/",obtenerRutinasCliente, name="obtener-rutinas"),
    path("obtenerTodasRutinasCliente/",obtenerTodasRutinasCliente, name="obtener-todas-rutinas"),
    path("obtenerRutinaAsignadaDetalleCompleto/",obtenerRutinaAsignadaDetalleCompleto,name="obtener-rutina-asignada-detalle-completo"),
    path("eliminarRutinaAsignada/<int:id_rutina>/<int:id_cliente>/",eliminarRutinaAsignada,name="eliminarRutinaAsignada"),
    path("actualizarRutinaAsignada/",actualizar_rutinas,name="actualizarRutinaAsignada"),
    path('nutrition/', get_nutrition_data, name='nutrition_data'),
    path('food/<int:food_id>/', get_food_by_id, name='get_food_details'),
    path("addFood/",agregar_alimento, name="addFood"),
    path("obtenerConsumoCliente/<query_param>/",obtenerConsumoCliente,name="obtenerConsumoCliente"),
    path("obtenerDisponeCliente/<query_param>/", obtenerDisponeCliente, name="obtenerDisponeCliente"),
    path("obtenerDatosDisponeActual/",obtener_datos_dispone_actual, name="obtenerDatosDisponeActual"),
    path("updateFood/",update_food, name="updateFood"),
    path("deleteFood/",delete_food, name="deleteFood"),
    path("updateTrainer/<int:id>/",update_trainer, name="updateTrainer"),
    path("updateClient/<int:id>/",update_client, name="updateClient"),
    path("calcularTotalMacroAlimentosParteDia/<query_param>/",calcularTotalMacroAlimentosParteDia.as_view(), name="calcularTotalMacroAlimentosParteDia"),
    path("obtenerTMB/<int:query_param>/",obtener_tmb, name="obtenerTMB"),
    path("clienteRutinas/",obtener_rutinas_dia_cliente, name="clienteRutinas"),
    path("agregarProgreso/", agregarProgreso, name="agregarProgreso"),
    path("historialCliente/", getHistorialCliente, name="historialCliente"),
    path("obtenerRutinaProgresoDetalleCompleto/", obtenerRutinaProgresoDetalleCompleto, name="obtenerRutinaProgresoDetalleCompleto"),
    path("getHistorialCompletoFechas/<int:query_param>/", getHistorialCompletoFechas,name="getHistorialCompletoFechas"),
    path("getFuerzaRutina/", getFuerzaRutina,name="getFuerzaRutina"),
    path("getFuerzaEjercicio/", getFuerzaEjercicio,name="getFuerzaRutinaDetalle"),
    path("getFuerzaEjercicioAsignado/", getFuerzaEjercicioAsignado,name="getFuerzaEjercicioAsignado"),
    path("getFuerzaRutinaFecha/", getFuerzaRutinaFecha,name="getFuerzaRutinaFecha"),
    path("mostrarEstadoRutina/", mostrarEstadoRutina,name="mostrarEstadoRutina"),
    path("controlClienteMembresia/",controlClienteMembresia, name="controlClienteMembresia"),
    path("allowDelete/",allowDelete,name="allowDelete"),
    path("updateRutina/",update_rutinas,name="updateRutina"),
    path("allowUpdate/",allowUpdate,name="allowUpdate"),
    path("eliminarSets/",eliminar_sets,name="eliminar_sets"),
    path("getRestClient/",getRestClient,name="getRestClient"),
    path("reset-password-request/", reset_password_request, name="reset_password_request"),
    path("reset-password/<uidb64>/<token>/", reset_password_confirm, name="reset_password_confirm"),
    path("",home,name="home"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
