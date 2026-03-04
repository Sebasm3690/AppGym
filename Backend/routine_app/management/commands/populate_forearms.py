import json
from django.core.management.base import BaseCommand
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Popula la tabla Ejercicio con ejercicios de antebrazos en español usando URLs públicas de Google Cloud Storage'

    # URL Base for your Google Cloud Storage bucket
    BASE_URL = "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Forearms/"

    # Exercise data
    ejercicios = [
        {
            "nombre": "Curl de muñeca detrás de la espalda",
            "musculo": "Antebrazos",
            "equipamento": "Barra",
            "instrucciones": [
                "Sujeta una barra con las palmas hacia arriba detrás de tu espalda.",
                "Deja que las muñecas cuelguen por completo.",
                "Levanta la barra flexionando las muñecas lo más alto posible.",
                "Haz una pausa y luego baja lentamente la barra.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "behind-the-back-wrist-curl.gif",
            "objetivo": "Fortalecer los músculos flexores del antebrazo",
        },
        {
            "nombre": "Curl de muñeca con mancuerna",
            "musculo": "Antebrazos",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Siéntate en un banco con una mancuerna en cada mano.",
                "Apoya los antebrazos en los muslos con las muñecas extendiéndose más allá del borde.",
                "Flexiona las muñecas hacia arriba levantando las mancuernas.",
                "Haz una pausa y luego baja lentamente las mancuernas.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-wrist-curl.gif",
            "objetivo": "Fortalecer los flexores del antebrazo",
        },
        {
            "nombre": "Curl inverso con barra EZ",
            "musculo": "Antebrazos",
            "equipamento": "Barra EZ",
            "instrucciones": [
                "Sujeta una barra EZ con un agarre prono (palmas hacia abajo).",
                "Mantén los codos cerca del torso y realiza un curl levantando la barra hacia los hombros.",
                "Haz una pausa en la parte superior y luego baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "ez-bar-reverse-grip-curl.gif",
            "objetivo": "Fortalecer los extensores del antebrazo y el braquiorradial",
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
        self.stdout.write(self.style.SUCCESS('¡La tabla Ejercicio ha sido poblada exitosamente con ejercicios de antebrazos!'))
