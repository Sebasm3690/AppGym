from django.db import models

# Create your models here.

class Administrador(models.Model):
    id_administrador = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    ci = models.CharField(max_length=10,unique=True)
    contrasenia = models.CharField(max_length=15)


class Entrenador(models.Model):
    id_entrenador = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    ci = models.CharField(max_length=10,unique=True)
    contrasenia = models.CharField(max_length=15)
    id_administrador = models.ForeignKey('Administrador',on_delete=models.CASCADE)

class nivelGym(models.Model):
    id_nivel_gym = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

class nivelActividad(models.Model):
    id_nivel_actividad = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30)

class Genero(models.Model):
    id_genero = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=9)

class Objetivo(models.Model):
    id_objetivo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30)

class Cliente(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    ci = models.CharField(max_length=10,unique=True)
    contrasenia = models.CharField(max_length=15)
    edad = models.IntegerField()
    id_entrenador = models.ForeignKey('Entrenador',on_delete=models.CASCADE)
    id_nivel_gym = models.ForeignKey('nivelGym',on_delete=models.CASCADE)
    id_nivel_actividad = models.ForeignKey('nivelActividad',on_delete=models.CASCADE)
    id_genero = models.ForeignKey('Genero',on_delete=models.CASCADE)
    id_objetivo = models.ForeignKey('Objetivo',on_delete=models.CASCADE)


class Consume(models.Model):
    id_cliente = models.ForeignKey('Cliente',on_delete=models.CASCADE)
    id_alimento = models.ForeignKey('Alimento',on_delete=models.CASCADE)
    fecha = models.DateField()

class Alimento(models.Model):
    id_alimento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    calorias = models.IntegerField()
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