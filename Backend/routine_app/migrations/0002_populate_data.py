from django.db import migrations


def populate_nivel_actividad(apps, schema_editor):
    NivelActividad = apps.get_model('routine_app', 'NivelActividad')
    activity_levels = [
        ('Sedentario', 1.2),
        ('Ligeramente activo', 1.375),
        ('Moderadamente activo', 1.55),
        ('Muy activo', 1.725),
        ('Extra activo', 1.9),
    ]
    for nombre, factor in activity_levels:
        NivelActividad.objects.update_or_create(
            nombre=nombre, defaults={"factor": factor}
        )


def populate_genero(apps, schema_editor):
    Genero = apps.get_model('routine_app', 'Genero')
    genres = ['Masculino', 'Femenino']
    for genre in genres:
        Genero.objects.get_or_create(nombre=genre)


def populate_membresia(apps, schema_editor):
    Membresia = apps.get_model('routine_app', 'Membresia')
    memberships = ['1 mes', '3 meses', '6 meses', '12 meses']
    for membership in memberships:
        Membresia.objects.get_or_create(duracion=membership)


def populate_nivel_gym(apps, schema_editor):
    NivelGym = apps.get_model('routine_app', 'NivelGym')
    levels = ['Principiante', 'Intermedio', 'Avanzado']
    for level in levels:
        NivelGym.objects.get_or_create(nombre=level)


def populate_objetivo(apps, schema_editor):
    Objetivo = apps.get_model('routine_app', 'Objetivo')
    objectives = ['Perder peso', 'Ganar masa muscular', 'Mantener peso']
    for objective in objectives:
        Objetivo.objects.get_or_create(nombre=objective)


def populate_parte_dia(apps, schema_editor):
    ParteDia = apps.get_model('routine_app', 'ParteDia')
    partes_dia = ['Desayuno', 'Almuerzo', 'Merienda']
    iconos = ['faCoffee', 'faUtensils', 'faDrumstickBite']
    for i in range(len(partes_dia)):
        ParteDia.objects.update_or_create(
            nombre=partes_dia[i], defaults={'icono': iconos[i]}
        )


class Migration(migrations.Migration):
    dependencies = [
        ('routine_app', '0001_initial'),  # Adjust to your most recent migration
    ]

    operations = [
        migrations.RunPython(populate_nivel_actividad),
        migrations.RunPython(populate_genero),
        migrations.RunPython(populate_membresia),
        migrations.RunPython(populate_nivel_gym),
        migrations.RunPython(populate_objetivo),
        migrations.RunPython(populate_parte_dia),
    ]
