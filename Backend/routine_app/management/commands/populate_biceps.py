import json
from django.core.management.base import BaseCommand
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Popula la tabla Ejercicio con ejercicios de bíceps en español usando URLs públicas de Google Cloud Storage'

    # URL Base for your Google Cloud Storage bucket
    BASE_URL = "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Biceps/"

    # Exercise data
    ejercicios = [
        {
            "nombre": "Curl Bayesiano",
            "musculo": "Bíceps",
            "equipamento": "Banda",
            "instrucciones": [
                "Fija una banda elástica en un punto bajo.",
                "Toma el extremo de la banda con una mano y da un paso hacia atrás para generar tensión.",
                "Mantén el codo fijo y realiza un curl, llevando la mano hacia el hombro.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "bayesian-curl.gif",
            "objetivo": "Fortalecer el bíceps braquial",
        },
        {
            "nombre": "Curl en polea con arrastre",
            "musculo": "Bíceps",
            "equipamento": "Polea",
            "instrucciones": [
                "Ajusta la polea a una posición baja y sujeta la barra con ambas manos.",
                "Mantén los codos cerca del torso y realiza un curl, llevando la barra hacia los hombros.",
                "Inclina ligeramente el torso hacia atrás para un rango completo.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "cable-drag-curl.gif",
            "objetivo": "Fortalecer el bíceps con un enfoque en la parte larga",
        },
        {
            "nombre": "Curl Martillo Cruzado",
            "musculo": "Bíceps",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Sujeta una mancuerna en cada mano con un agarre neutral (palmas enfrentadas).",
                "Levanta una mancuerna hacia el hombro opuesto, manteniendo el codo cerca del torso.",
                "Regresa lentamente a la posición inicial y repite con el otro brazo.",
                "Alterna los brazos en cada repetición.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "cross-body-hammer-curl.gif",
            "objetivo": "Trabajar el braquiorradial y fortalecer el bíceps",
        },
        {
            "nombre": "Curl con arrastre",
            "musculo": "Bíceps",
            "equipamento": "Polea",
            "instrucciones": [
                "Coloca la polea a una posición baja.",
                "Sujeta la barra con ambas manos y jala hacia tus hombros.",
                "Mantén los codos hacia atrás y el torso inclinado ligeramente.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "drag-curl.gif",
            "objetivo": "Enfocar el trabajo en la parte larga del bíceps",
        },
        {
            "nombre": "Curl Inclinado con Mancuerna",
            "musculo": "Bíceps",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Siéntate en un banco inclinado con una mancuerna en cada mano.",
                "Mantén los codos cerca del torso y realiza un curl, levantando las mancuernas hacia los hombros.",
                "Regresa lentamente a la posición inicial.",
                "Asegúrate de no balancear los brazos para mantener la tensión en los bíceps.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "incline-dumbbell-curl.gif",
            "objetivo": "Aislar los bíceps para un rango de movimiento completo",
        },
        {
            "nombre": "Curl Zottman",
            "musculo": "Bíceps",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Sujeta una mancuerna en cada mano con las palmas hacia arriba.",
                "Realiza un curl llevando las mancuernas hacia los hombros.",
                "Gira las palmas hacia abajo en la parte superior del movimiento.",
                "Baja lentamente las mancuernas con las palmas hacia abajo.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-seated-zottman-curl.gif",
            "objetivo": "Trabajar tanto el bíceps como el braquiorradial",
        },
        {
            "nombre": "Curl con mancuerna inclinado hacia adelante",
            "musculo": "Bíceps",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Inclínate hacia adelante mientras sostienes una mancuerna en cada mano.",
                "Mantén los codos estables y realiza un curl, levantando las mancuernas hacia los hombros.",
                "Haz una pausa en la parte superior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-bent-over-curl.gif",
            "objetivo": "Trabajar el bíceps y aumentar su definición",
        },
        {
            "nombre": "Curl de concentración con mancuerna",
            "musculo": "Bíceps",
            "equipamento": "Mancuerna",
            "instrucciones": [
                "Siéntate en un banco y coloca el codo de tu brazo de trabajo en la parte interna del muslo.",
                "Sujeta una mancuerna con la palma hacia arriba.",
                "Realiza un curl levantando la mancuerna hacia tu hombro.",
                "Haz una pausa en la parte superior y luego regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de brazo."
            ],
            "imagen": "dumbbell-concentration-curl.gif",
            "objetivo": "Aislar el bíceps y mejorar la definición",
        },
        {
            "nombre": "Curl de bíceps en predicador con barra EZ",
            "musculo": "Bíceps",
            "equipamento": "Barra EZ",
            "instrucciones": [
                "Coloca tus brazos en la almohadilla de la máquina de predicador.",
                "Sujeta una barra EZ con un agarre supino.",
                "Realiza un curl llevando la barra hacia los hombros.",
                "Haz una pausa en la parte superior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "ez-bar-preacher-curl.gif",
            "objetivo": "Aislar los bíceps y mejorar su pico",
        },
        {
            "nombre": "Encogimiento de muñeca con mancuerna",
            "musculo": "Bíceps y antebrazo",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Siéntate en un banco con una mancuerna en cada mano.",
                "Deja que las muñecas cuelguen del borde con las palmas hacia arriba.",
                "Flexiona las muñecas hacia arriba lo más alto posible.",
                "Haz una pausa y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-wrist-curl.gif",
            "objetivo": "Fortalecer los antebrazos y los bíceps",
        },
                {
            "nombre": "Curl de bíceps por encima de la cabeza",
            "musculo": "Bíceps",
            "equipamento": "Polea",
            "instrucciones": [
                "Ajusta las poleas a una posición alta y sujeta las manijas con ambas manos.",
                "Párate en el centro con los brazos extendidos hacia los lados.",
                "Realiza un curl llevando las manijas hacia la parte superior de tu cabeza.",
                "Haz una pausa en la parte superior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "overhead-cable-curl.gif",
            "objetivo": "Trabajar la cabeza larga del bíceps para desarrollar tamaño y definición",
        },
            {
            "nombre": "Curl de bíceps lateral",
            "musculo": "Bíceps",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Sujeta una mancuerna en cada mano con las palmas hacia adelante.",
                "Levanta ambas mancuernas hacia los lados en un movimiento de curl.",
                "Mantén los codos cerca del torso mientras subes las pesas.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "lateral-bicep-curls.gif",
            "objetivo": "Fortalecer el bíceps enfocándose en su cabeza larga",
        },
         {
        "nombre": "Curl martillo con mancuerna",
        "musculo": "Bíceps",
        "equipamento": "Mancuernas",
        "instrucciones": [
            "Sujeta una mancuerna en cada mano con un agarre neutro (palmas enfrentadas).",
            "Levanta ambas mancuernas hacia los hombros manteniendo el agarre neutro.",
            "Haz una pausa en la parte superior y baja lentamente las mancuernas.",
            "Repite el número deseado de repeticiones."
        ],
        "imagen": "dumbbell-hammer-curl.gif",
        "objetivo": "Fortalecer el braquiorradial y los bíceps",
    },
    {
        "nombre": "Curl de araña",
        "musculo": "Bíceps",
        "equipamento": "Mancuernas",
        "instrucciones": [
            "Acuéstate boca abajo en un banco inclinado y sujeta una mancuerna en cada mano.",
            "Deja que los brazos cuelguen perpendicularmente al suelo.",
            "Levanta las mancuernas hacia los hombros mientras contraes los bíceps.",
            "Haz una pausa en la parte superior y baja lentamente las mancuernas.",
            "Repite el número deseado de repeticiones."
        ],
        "imagen": "spider-curls.gif",
        "objetivo": "Aislar y fortalecer los bíceps desde un ángulo único",
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
        self.stdout.write(self.style.SUCCESS('¡La tabla Ejercicio ha sido poblada exitosamente con ejercicios de bíceps!'))
