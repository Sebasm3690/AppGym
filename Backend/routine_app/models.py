from django.db import models
from django.contrib.auth.models import User

class Administrador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id_administrador = models.AutoField(primary_key=True)
    borrado = models.BooleanField(default=False)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)

class Entrenador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id_entrenador = models.AutoField(primary_key=True)
    borrado = models.BooleanField(default=False)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    id_administrador = models.ForeignKey(Administrador, on_delete=models.CASCADE)

class NivelGym(models.Model):
    id_nivel_gym = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

class NivelActividad(models.Model):
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
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    tmb = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    altura = models.DecimalField(decimal_places=2, max_digits=5, default=0)
    peso = models.DecimalField(decimal_places=2, max_digits=5, default=0)
    fecha_nacimiento = models.DateField()
    carbohidratos_g = models.DecimalField(decimal_places=2, max_digits=7, default=0)
    proteina_g = models.DecimalField(decimal_places=2, max_digits=7, default=0)
    grasas_g = models.DecimalField(decimal_places=2, max_digits=7, default=0)
    borrado = models.BooleanField(default=False)
    id_entrenador = models.ForeignKey(Entrenador, on_delete=models.CASCADE)
    id_nivel_gym = models.ForeignKey(NivelGym, on_delete=models.CASCADE)
    id_nivel_actividad = models.ForeignKey(NivelActividad, on_delete=models.CASCADE)
    id_genero = models.ForeignKey(Genero, on_delete=models.CASCADE)
    id_objetivo = models.ForeignKey(Objetivo, on_delete=models.CASCADE)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


class Alimento(models.Model):
    id_alimento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    calorias = models.DecimalField(decimal_places=2, max_digits=7)
    proteina_g = models.DecimalField(decimal_places=2, max_digits=6)
    carbohidratos_g = models.DecimalField(decimal_places=2, max_digits=6)
    grasa_g = models.DecimalField(decimal_places=2, max_digits=6)
    tamaño_porcion_g = models.IntegerField()
    api_id_referencia = models.CharField(max_length=10)


class Consume(models.Model):
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    id_alimento = models.ForeignKey(Alimento, on_delete=models.CASCADE)
    fecha = models.DateField(auto_now_add=True)
    cantidad = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['id_cliente', 'id_alimento'], name='unique_cliente_alimento')
        ]


class ParteDia(models.Model):
    id_parte_dia = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30)
    icono = models.CharField(max_length=50)


class Dispone(models.Model):
    id_dispone = models.AutoField(primary_key=True) 
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE,related_name='cliente_dispone')
    id_alimento = models.ForeignKey(Alimento, on_delete=models.CASCADE,related_name='alimento_dispone')
    id_parte_dia = models.ForeignKey(ParteDia, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['id_cliente', 'id_alimento','id_parte_dia'], name='unique_dispone_cliente_alimento_partedia')
        ]


class Rutina(models.Model):
    id_rutina = models.AutoField(primary_key=True)
    id_entrenador = models.ForeignKey(Entrenador, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=200)
    enfoque = models.CharField(max_length=50)
    tipo = models.CharField(max_length=20)

class Compuesta(models.Model):
    id_compuesta = models.AutoField(primary_key=True) 
    id_rutina = models.ForeignKey(Rutina, on_delete=models.CASCADE)
    id_ejercicio = models.ForeignKey('Ejercicio', on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['id_rutina', 'id_ejercicio'], name='unique_compuesta_rutina_ejercicio')
        ]

class Ejercicio(models.Model):
    id_ejercicio = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    musculo = models.CharField(max_length=200)
    equipamento = models.CharField(max_length=1000)
    instrucciones = models.JSONField(max_length=1000)
    imagen = models.URLField(max_length=500, blank=True, null=True)
    objetivo = models.CharField(max_length=100)

class SeAsigna(models.Model):
    id_rutina = models.ForeignKey(Rutina, on_delete=models.CASCADE)
    id_ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE)
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    serie = models.IntegerField()
    repeticiones = models.IntegerField()
    peso = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)
    dia = models.CharField(max_length=30)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['id_rutina', 'id_ejercicio', 'id_cliente', 'serie'], name='unique_seasigna_rutina_ejercicio_cliente_serie')
        ]
