import json
from django.core.management.base import BaseCommand
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Popula la tabla Ejercicio con ejercicios de core en español usando URLs públicas de Google Cloud Storage'

    # URL Base for your Google Cloud Storage bucket
    BASE_URL = "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Core/"

    # Exercise data
    ejercicios = [
        {
            "nombre": "Abdominales mariposa",
            "musculo": "Core",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Acuéstate en el suelo con las plantas de los pies juntas y las rodillas hacia los lados.",
                "Coloca las manos detrás de la cabeza o en el pecho.",
                "Levanta el torso hacia las piernas contrayendo los abdominales.",
                "Baja lentamente de vuelta a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "butterfly-sit-up.gif",
            "objetivo": "Fortalecer los músculos abdominales",
        },
        {
            "nombre": "Crunch en polea de rodillas",
            "musculo": "Core",
            "equipamento": "Polea",
            "instrucciones": [
                "Ajusta una polea alta con una cuerda y arrodíllate frente a ella.",
                "Sujeta la cuerda con ambas manos a la altura de la cabeza.",
                "Inclina el torso hacia abajo contrayendo los abdominales.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "cable-knee-crunch.gif",
            "objetivo": "Trabajar los músculos abdominales superiores",
        },
        {
            "nombre": "Elevación de piernas en silla romana",
            "musculo": "Core",
            "equipamento": "Silla romana",
            "instrucciones": [
                "Apóyate en la silla romana con los antebrazos y la espalda firmemente contra el respaldo.",
                "Levanta las piernas rectas o ligeramente dobladas hacia el pecho.",
                "Haz una pausa y luego baja lentamente las piernas a la posición inicial.",
                "Evita balancearte y mantén el control durante todo el movimiento.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "captains-chair-leg-raise.gif",
            "objetivo": "Fortalecer los músculos abdominales inferiores",
        },
        {
            "nombre": "Crunch en el suelo",
            "musculo": "Core",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Acuéstate en el suelo con las rodillas dobladas y los pies planos en el suelo.",
                "Coloca las manos detrás de la cabeza o cruzadas sobre el pecho.",
                "Levanta el torso contrayendo los abdominales.",
                "Haz una pausa en la parte superior y luego regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "crunch-floor.gif",
            "objetivo": "Fortalecer los músculos abdominales superiores",
        },
        {
            "nombre": "Abdominales en declive",
            "musculo": "Core",
            "equipamento": "Banco declinado",
            "instrucciones": [
                "Ajusta un banco en declive y siéntate con los pies asegurados.",
                "Cruza las manos sobre el pecho o colócalas detrás de la cabeza.",
                "Levanta el torso contrayendo los abdominales.",
                "Haz una pausa en la parte superior y luego baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "decline-sit-up.gif",
            "objetivo": "Trabajar los abdominales superiores e inferiores",
        },
        {
            "nombre": "Plancha",
            "musculo": "Core",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Colócate en una posición de plancha apoyando los antebrazos y los pies en el suelo.",
                "Mantén el cuerpo en línea recta desde la cabeza hasta los pies.",
                "Aprieta los músculos abdominales y mantén la posición durante el tiempo deseado.",
                "Evita que las caderas caigan o se eleven demasiado."
            ],
            "imagen": "plank.gif",
            "objetivo": "Fortalecer el core y mejorar la estabilidad general",
        },
        {
            "nombre": "Lat Pulldown con agarre ancho",
            "musculo": "Core y dorsales",
            "equipamento": "Máquina de polea",
            "instrucciones": [
                "Siéntate en la máquina con las rodillas aseguradas y sujeta la barra con un agarre ancho.",
                "Jala la barra hacia el pecho manteniendo los codos hacia abajo y apretando los músculos del core.",
                "Haz una pausa y luego regresa lentamente la barra a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "wide-grip-lat-pulldown.gif",
            "objetivo": "Fortalecer el core mientras trabajas los dorsales",
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
        self.stdout.write(self.style.SUCCESS('¡La tabla Ejercicio ha sido poblada exitosamente con ejercicios de core!'))
