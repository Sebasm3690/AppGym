import json
from django.core.management.base import BaseCommand
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Popula la tabla Ejercicio con ejercicios de glúteos en español usando URLs públicas de Google Cloud Storage'

    # URL Base for your Google Cloud Storage bucket
    BASE_URL = "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Glutes/"

    # Exercise data
    ejercicios = [
        {
            "nombre": "Empuje de cadera en posición B",
            "musculo": "Glúteos",
            "equipamento": "Banco y barra",
            "instrucciones": [
                "Apoya la parte superior de tu espalda en un banco estable.",
                "Coloca los pies en el suelo, separados a la anchura de los hombros, con un pie más adelantado que el otro.",
                "Coloca una barra sobre tus caderas y estabilízala con las manos.",
                "Empuja las caderas hacia arriba contrayendo los glúteos.",
                "Haz una pausa en la parte superior y baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "b-stance-hip-thrust.gif",
            "objetivo": "Fortalecer los glúteos y mejorar la estabilidad unilateral",
        },
        {
            "nombre": "Empuje de cadera con cable",
            "musculo": "Glúteos",
            "equipamento": "Polea",
            "instrucciones": [
                "Coloca una correa de tobillo en la polea baja y sujeta el cable a un tobillo.",
                "Inclínate ligeramente hacia adelante apoyándote en una superficie estable.",
                "Extiende la pierna hacia atrás contrayendo los glúteos.",
                "Haz una pausa en la parte superior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "cable-pull-through.gif",
            "objetivo": "Fortalecer los glúteos con resistencia constante",
        },
        {
            "nombre": "Peso muerto con déficit",
            "musculo": "Glúteos",
            "equipamento": "Barra",
            "instrucciones": [
                "Párate sobre una plataforma para aumentar el rango de movimiento.",
                "Sujeta una barra con un agarre prono, ligeramente más ancho que los hombros.",
                "Inclina las caderas hacia atrás y baja la barra mientras mantienes la espalda recta.",
                "Empuja las caderas hacia adelante para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "deficit-deadlift.gif",
            "objetivo": "Fortalecer los glúteos y los isquiotibiales mientras mejoras el rango de movimiento",
        },
        {
            "nombre": "Empuje de cadera estilo rana",
            "musculo": "Glúteos",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Acuéstate en el suelo con las plantas de los pies juntas y las rodillas hacia los lados.",
                "Empuja las caderas hacia arriba contrayendo los glúteos.",
                "Haz una pausa en la parte superior y luego baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "frog-hip-thrust.gif",
            "objetivo": "Aislar los glúteos en una posición de abducción",
        },
        {
            "nombre": "Empuje de cadera a una pierna",
            "musculo": "Glúteos",
            "equipamento": "Banco",
            "instrucciones": [
                "Apoya la parte superior de tu espalda en un banco estable y levanta una pierna.",
                "Empuja las caderas hacia arriba con la pierna de apoyo contrayendo los glúteos.",
                "Haz una pausa en la parte superior y baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "single-leg-hip-thrust-muscles.gif",
            "objetivo": "Fortalecer los glúteos y mejorar el equilibrio",
        },
        {
            "nombre": "Peso muerto con piernas rectas",
            "musculo": "Glúteos",
            "equipamento": "Barra",
            "instrucciones": [
                "Sujeta una barra con un agarre prono y mantén las piernas rectas pero no bloqueadas.",
                "Inclina las caderas hacia atrás y baja la barra manteniendo la espalda recta.",
                "Empuja las caderas hacia adelante para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "straight-leg-deadlift.gif",
            "objetivo": "Trabajar los glúteos y los isquiotibiales",
        },
    ]

    def handle(self, *args, **kwargs):
        # Populate database with exercises
        for ejercicio_data in self.ejercicios:
            # Construct the full URL for the image
            imagen_url = f"{self.BASE_URL}{ejercicio_data['imagen']}"
            
            # Save to the Ejercicio model
            ejercicio = Ejercicio(
                nombre=ejercicio_data["nombre"],
                musculo=ejercicio_data["musculo"],
                equipamento=ejercicio_data["equipamento"],
                instrucciones=json.dumps(ejercicio_data["instrucciones"], ensure_ascii=False),  # Save as JSON string
                imagen=imagen_url,
                objetivo=ejercicio_data["objetivo"],
            )
            ejercicio.save()

        # Success message
        self.stdout.write(self.style.SUCCESS('¡La tabla Ejercicio ha sido poblada exitosamente con ejercicios de glúteos!'))
