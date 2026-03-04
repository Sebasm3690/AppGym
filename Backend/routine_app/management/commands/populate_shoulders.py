import json
from django.core.management.base import BaseCommand
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Popula la tabla Ejercicio con ejercicios de hombros en español usando URLs públicas de Google Cloud Storage'

    # URL Base for your Google Cloud Storage bucket
    BASE_URL = "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Shoulders/"

    # Exercise data
    ejercicios = [
        {
            "nombre": "Press Arnold",
            "musculo": "Hombros",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Sujeta una mancuerna en cada mano a la altura de los hombros con las palmas mirando hacia ti.",
                "Empuja las mancuernas hacia arriba mientras giras las muñecas, terminando con las palmas mirando hacia afuera.",
                "Baja las mancuernas lentamente a la posición inicial invirtiendo el movimiento.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "arnold-presses.gif",
            "objetivo": "Fortalecer los deltoides y mejorar la movilidad del hombro",
        },
        {
            "nombre": "Jalón de cara con banda",
            "musculo": "Hombros",
            "equipamento": "Banda",
            "instrucciones": [
                "Sujeta una banda a una superficie estable a la altura del pecho.",
                "Agarra los extremos de la banda con ambas manos con las palmas hacia abajo.",
                "Jala la banda hacia tu cara mientras mantienes los codos hacia afuera.",
                "Haz una pausa en la contracción y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "banded-face-pull.gif",
            "objetivo": "Fortalecer la parte trasera del deltoide y mejorar la postura",
        },
        {
            "nombre": "Remo vertical con barra de pie",
            "musculo": "Hombros",
            "equipamento": "Barra",
            "instrucciones": [
                "Sujeta una barra con un agarre prono a la anchura de los hombros.",
                "Levanta la barra hacia la barbilla manteniendo los codos hacia arriba y hacia afuera.",
                "Haz una pausa en la parte superior y baja lentamente la barra.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "barbell-upright-row-standing.gif",
            "objetivo": "Fortalecer los deltoides laterales y el trapecio",
        },
        {
            "nombre": "Elevación lateral con cable a un brazo",
            "musculo": "Hombros",
            "equipamento": "Polea",
            "instrucciones": [
                "Coloca el mango de la polea baja en una mano.",
                "Levanta el brazo hacia un lado hasta que esté paralelo al suelo.",
                "Haz una pausa y baja lentamente el brazo a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de brazo."
            ],
            "imagen": "cable-one-arm-lateral-raise.gif",
            "objetivo": "Fortalecer los deltoides laterales",
        },
        {
            "nombre": "Variaciones de elevación lateral con mancuerna",
            "musculo": "Hombros",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Sujeta una mancuerna en cada mano con los brazos a los costados.",
                "Levanta ambos brazos hacia los lados hasta que estén paralelos al suelo.",
                "Haz una pausa en la parte superior y baja lentamente las mancuernas.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-lateral-raise-variations.gif",
            "objetivo": "Aislar y fortalecer los deltoides laterales",
        },
        {
            "nombre": "Press de hombros en máquina",
            "musculo": "Hombros",
            "equipamento": "Máquina",
            "instrucciones": [
                "Siéntate en la máquina y ajusta la posición de los agarres.",
                "Empuja los agarres hacia arriba hasta que los brazos estén completamente extendidos.",
                "Baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "machine-shoulder-press.gif",
            "objetivo": "Fortalecer los deltoides con apoyo",
        },
        {
            "nombre": "Press militar",
            "musculo": "Hombros",
            "equipamento": "Barra",
            "instrucciones": [
                "Sujeta una barra con un agarre prono a la altura de los hombros.",
                "Empuja la barra hacia arriba hasta que los brazos estén completamente extendidos.",
                "Baja la barra lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "military-press.gif",
            "objetivo": "Fortalecer los deltoides y el trapecio superior",
        },
        {
            "nombre": "Elevación trasera sentado con mancuerna",
            "musculo": "Hombros",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Siéntate en un banco y sujeta una mancuerna en cada mano.",
                "Inclina el torso hacia adelante hasta que quede paralelo al suelo.",
                "Levanta los brazos hacia los lados mientras mantienes un ligero arco en los codos.",
                "Haz una pausa en la parte superior y baja lentamente las mancuernas.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "seated-reverse-fly.gif",
            "objetivo": "Fortalecer la parte trasera del deltoide",
        },
        {
            "nombre": "Press con barra en landmine",
            "musculo": "Hombros",
            "equipamento": "Landmine y barra",
            "instrucciones": [
                "Sujeta el extremo de una barra asegurada en una landmine.",
                "Empuja la barra hacia arriba con un brazo hasta que esté completamente extendido.",
                "Baja lentamente la barra a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de brazo."
            ],
            "imagen": "standing-landmine-press.gif",
            "objetivo": "Fortalecer los deltoides y el core",
        },
        {
            "nombre": "Press de hombros en máquina Smith",
            "musculo": "Hombros",
            "equipamento": "Máquina Smith",
            "instrucciones": [
                "Sujeta la barra de la máquina Smith a la altura de los hombros.",
                "Empuja la barra hacia arriba hasta que los brazos estén completamente extendidos.",
                "Baja lentamente la barra a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "standing-smith-machine-shoulder-press.gif",
            "objetivo": "Fortalecer los deltoides con soporte de la máquina",
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
        self.stdout.write(self.style.SUCCESS('¡La tabla Ejercicio ha sido poblada exitosamente con ejercicios de hombros!'))
