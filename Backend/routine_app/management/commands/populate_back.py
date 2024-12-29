import json
from django.core.management.base import BaseCommand
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Popula la tabla Ejercicio con ejercicios de espalda en español usando URLs públicas de Google Cloud Storage'

    # URL Base for your Google Cloud Storage bucket
    BASE_URL = "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Back/"

    # Exercise data
    ejercicios = [
            {
                "nombre": "Polea al pecho con banda",
                "musculo": "Espalda",
                "equipamento": "Banda",
                "instrucciones": [
                    "Sujeta la banda a un punto elevado y siéntate en el suelo.",
                    "Toma los extremos de la banda con ambas manos.",
                    "Jala la banda hacia tu pecho, apretando los omóplatos.",
                    "Regresa lentamente a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "band-lat-pulldown.gif",
                "objetivo": "Fortalecer los dorsales y la parte superior de la espalda",
            },
            {
                "nombre": "Remo inclinado con barra",
                "musculo": "Espalda",
                "equipamento": "Barra",
                "instrucciones": [
                    "Coloca una barra en el suelo y carga el peso deseado.",
                    "Inclina el torso hacia adelante manteniendo la espalda recta.",
                    "Sujeta la barra con ambas manos y jálala hacia tu abdomen.",
                    "Haz una pausa y luego regresa lentamente a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "barbell-bent-over-row.gif",
                "objetivo": "Fortalecer los dorsales, trapecios y romboides",
            },
            {
                "nombre": "Jalón en polea alta",
                "musculo": "Espalda",
                "equipamento": "Polea",
                "instrucciones": [
                    "Siéntate en la máquina de polea alta con los pies planos en el suelo.",
                    "Sujeta la barra con un agarre por encima, más ancho que los hombros.",
                    "Jala la barra hacia tu pecho, apretando los omóplatos.",
                    "Regresa lentamente a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "cable-lat-pulldown.gif",
                "objetivo": "Fortalecer los dorsales y la parte superior de la espalda",
            },
            {
                "nombre": "Remo sentado en máquina",
                "musculo": "Espalda",
                "equipamento": "Máquina",
                "instrucciones": [
                    "Siéntate en la máquina de remo con los pies apoyados.",
                    "Sujeta las manijas con ambas manos.",
                    "Jala las manijas hacia tu abdomen, apretando los omóplatos.",
                    "Regresa lentamente a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "cable-seated-row.gif",
                "objetivo": "Fortalecer los dorsales y los romboides",
            },
            {
                "nombre": "Encogimiento de hombros con polea",
                "musculo": "Espalda",
                "equipamento": "Polea",
                "instrucciones": [
                    "Ponte de pie frente a la polea baja y sujeta la barra con ambas manos.",
                    "Levanta los hombros hacia tus orejas lo más alto posible.",
                    "Haz una pausa y luego regresa a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "cable-shrug.gif",
                "objetivo": "Fortalecer el trapecio",
            },
            {
                "nombre": "Remo invertido",
                "musculo": "Espalda",
                "equipamento": "Barra fija",
                "instrucciones": [
                    "Coloca una barra fija a la altura de tu cintura.",
                    "Acuéstate debajo de la barra con los pies extendidos.",
                    "Sujeta la barra con ambas manos y jala tu pecho hacia la barra.",
                    "Regresa lentamente a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "inverted-row.gif",
                "objetivo": "Fortalecer los dorsales y los romboides",
            },
            {
                "nombre": "Jalón neutral en polea alta",
                "musculo": "Espalda",
                "equipamento": "Polea",
                "instrucciones": [
                    "Siéntate en la máquina de polea alta con los pies planos en el suelo.",
                    "Sujeta las manijas con un agarre neutral (palmas enfrentadas).",
                    "Jala las manijas hacia tu pecho, apretando los omóplatos.",
                    "Regresa lentamente a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "neutral-grip-lat-pulldown.gif",
                "objetivo": "Fortalecer los dorsales y la parte superior de la espalda",
            },
            {
            "nombre": "Dominadas",
            "musculo": "Espalda",
            "equipamento": "Barra fija",
            "instrucciones": [
                "Agarra la barra con un agarre por encima, ligeramente más ancho que los hombros.",
                "Cuelga completamente con los brazos extendidos.",
                "Jala tu cuerpo hacia arriba hasta que tu barbilla pase la barra.",
                "Haz una pausa y luego regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "pull-up.gif",
            "objetivo": "Fortalecer los dorsales y los músculos de la parte superior de la espalda",
        },
        {
            "nombre": "Remo con barra en T",
            "musculo": "Espalda",
            "equipamento": "Barra en T",
            "instrucciones": [
                "Coloca la barra en T en el suelo y carga el peso deseado.",
                "Sujeta la barra con ambas manos en el mango de remo.",
                "Inclina el torso hacia adelante mientras mantienes la espalda recta.",
                "Jala la barra hacia tu abdomen, apretando los omóplatos.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "t-bar-row-muscles.gif",
            "objetivo": "Fortalecer los dorsales, trapecios y romboides",
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
        self.stdout.write(self.style.SUCCESS('¡La tabla Ejercicio ha sido poblada exitosamente con ejercicios de espalda!'))
