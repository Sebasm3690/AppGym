import json
from django.core.management.base import BaseCommand
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Se encarga de poblar la tabla Ejercicio con ejercicios de abductores en español usando URLs públicas de Google Cloud Storage'

    # URL Base for your Google Cloud Storage bucket
    BASE_URL = "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Abductors/"


    # Ejercicios predefinidos para abductores
    ejercicios = [
        {
            "nombre": "Movimiento de abducción de cadera con banda",
            "musculo": "abductores",
            "equipamento": "banda",
            "instrucciones": [
                "Coloca la banda justo por encima de tus rodillas.",
                "Ponte de pie con los pies separados al ancho de los hombros.",
                "Da un paso hacia un lado, manteniendo la tensión en la banda.",
                "Haz una pausa y regresa a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "band-hip-abduction-movement.gif",
            "objetivo": "abductores de la cadera",
        },
        {
            "nombre": "Sentadilla lateral con pesa en copa",
            "musculo": "abductores",
            "equipamento": "mancuerna",
            "instrucciones": [
                "Sujeta una mancuerna a la altura del pecho.",
                "Da un paso grande hacia un lado.",
                "Realiza una sentadilla, manteniendo el peso centrado.",
                "Empuja hacia arriba para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "goblet-side-squat.gif",
            "objetivo": "abductores de la cadera",
        },
        {
            "nombre": "Máquina de abducción de cadera",
            "musculo": "abductores",
            "equipamento": "máquina",
            "instrucciones": [
                "Ajusta la máquina a la resistencia deseada.",
                "Siéntate y coloca las piernas contra las almohadillas.",
                "Empuja las piernas hacia afuera contra la resistencia.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "hip-abduction-machine.gif",
            "objetivo": "abductores de la cadera",
        },
        {
            "nombre": "Abducción de cadera sentado con banda",
            "musculo": "abductores",
            "equipamento": "banda",
            "instrucciones": [
                "Siéntate en un banco con la banda justo por encima de tus rodillas.",
                "Mantén los pies planos en el suelo.",
                "Empuja las rodillas hacia afuera, estirando la banda.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "seated-band-hip-abduction.gif",
            "objetivo": "abductores de la cadera",
        },
    ]

    # Poblar la base de datos
    def handle(self, *args, **kwargs):
        #Populate database with exercises 
        for ejercicio_data in self.ejercicios:
            #Construct the full URL for the image 
            imagen_url = f"{self.BASE_URL}{ejercicio_data['imagen']}"

            #Save to the ejercicio model
            ejercicio = Ejercicio(
                nombre=ejercicio_data["nombre"],
                musculo=ejercicio_data["musculo"],
                equipamento=ejercicio_data["equipamento"],
                instrucciones=json.dumps(ejercicio_data["instrucciones"], ensure_ascii=False),
                imagen=imagen_url,
                objetivo=ejercicio_data["objetivo"],
            )
            ejercicio.save()

        self.stdout.write(self.style.SUCCESS('¡La tabla Ejercicio ha sido poblada exitosamente con ejercicios de abductores!'))
