from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.


class Administrador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id_administrador = models.AutoField(primary_key=True)
    email = models.EmailField('email', unique=True)
    #nombre = models.CharField(max_length=50)
    #apellido = models.CharField(max_length=50)
    #contrasenia = models.CharField(max_length=15)
    # Configurando 'email' como el campo de identificación principal para la autenticación.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
   

class Entrenador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id_entrenador = models.AutoField(primary_key=True)
    #nombre = models.CharField(max_length=50)
    #apellido = models.CharField(max_length=50)
    #contrasenia = models.CharField(max_length=15)
    id_administrador = models.ForeignKey('Administrador',on_delete=models.CASCADE)


class nivelGym(models.Model):
    id_nivel_gym = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

class nivelActividad(models.Model):
    id_nivel_actividad = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30)
    factor = models.DecimalField(decimal_places=2, max_digits=5)

class Genero(models.Model):
    id_genero = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=9)

class Objetivo(models.Model):
    id_objetivo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30)

class Cliente(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id_cliente = models.AutoField(primary_key=True)
    #nombre = models.CharField(max_length=50)
    #apellido = models.CharField(max_length=50)
    email = models.EmailField('email', unique=True)
    #contrasenia = models.CharField(max_length=15)
    tmb = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    edad = models.IntegerField()
    altura = models.DecimalField(decimal_places=2, max_digits=5, default=0)
    peso = models.DecimalField(decimal_places=2, max_digits=5, default=0) 
    carbohidratos_g = models.DecimalField(decimal_places=2, max_digits=7, default=0)
    proteina_g = models.DecimalField(decimal_places=2, max_digits=7, default=0)
    grasas_g = models.DecimalField(decimal_places=2, max_digits=7, default=0)
    id_entrenador = models.ForeignKey('Entrenador',on_delete=models.CASCADE)
    id_nivel_gym = models.ForeignKey('nivelGym',on_delete=models.CASCADE)
    id_nivel_actividad = models.ForeignKey('nivelActividad',on_delete=models.CASCADE)
    id_genero = models.ForeignKey('Genero',on_delete=models.CASCADE)
    id_objetivo = models.ForeignKey('Objetivo',on_delete=models.CASCADE)
    # Configurando 'email' como el campo de identificación principal para la autenticación.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


class Consume(models.Model):
    id_cliente = models.ForeignKey('Cliente',on_delete=models.CASCADE)
    id_alimento = models.ForeignKey('Alimento',on_delete=models.CASCADE)
    fecha = models.DateField()

class Alimento(models.Model):
    id_alimento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    calorias = models.DecimalField(decimal_places=2, max_digits=5)
    grasa_total_g = models.IntegerField()
    proteina_g = models.DecimalField(decimal_places=2, max_digits=5)
    sodio_mg = models.DecimalField(decimal_places=2, max_digits=5)
    potasio_mg = models.DecimalField(decimal_places=2, max_digits=5)
    colesterol_mg = models.DecimalField(decimal_places=2, max_digits=5)
    total_carbohidratos_g = models.DecimalField(decimal_places=2, max_digits=5)
    total_fibra_g = models.DecimalField(decimal_places=2, max_digits=5)
    azucar_total_g = models.DecimalField(decimal_places=2, max_digits=5)
    grasa_total_saturada_g = models.DecimalField(decimal_places=2, max_digits=5)
    tamaño_porcion_g = models.IntegerField()


class Meta: 
    unique_together = (('id_cliente','id_alimento'),)