import json
from django.core.management.base import BaseCommand
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Popula la tabla Ejercicio con ejercicios de isquiotibiales en español usando URLs públicas de Google Cloud Storage'

    # URL Base for your Google Cloud Storage bucket
    BASE_URL = "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Harmstring/Hamstring/"

    # Exercise data
    ejercicios = [
        {
            "nombre": "Empuje de cadera con cable",
            "musculo": "Isquiotibiales",
            "equipamento": "Polea",
            "instrucciones": [
                "Coloca una correa de tobillo en la polea baja y sujeta el cable a un tobillo.",
                "Inclínate ligeramente hacia adelante apoyándote en una superficie estable.",
                "Extiende la pierna hacia atrás contrayendo los glúteos y los isquiotibiales.",
                "Haz una pausa en la parte superior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "cable-pull-through.gif",
            "objetivo": "Fortalecer los isquiotibiales y glúteos con resistencia constante",
        },
        {
            "nombre": "Peso muerto con déficit",
            "musculo": "Isquiotibiales",
            "equipamento": "Barra",
            "instrucciones": [
                "Párate sobre una plataforma para aumentar el rango de movimiento.",
                "Sujeta una barra con un agarre prono, ligeramente más ancho que los hombros.",
                "Inclina las caderas hacia atrás y baja la barra mientras mantienes la espalda recta.",
                "Empuja las caderas hacia adelante para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "deficit-deadlift.gif",
            "objetivo": "Fortalecer los isquiotibiales y los glúteos mientras mejoras el rango de movimiento",
        },
        {
            "nombre": "Peso muerto con kettlebell",
            "musculo": "Isquiotibiales",
            "equipamento": "Kettlebell",
            "instrucciones": [
                "Párate con los pies separados al ancho de los hombros y una kettlebell en el suelo frente a ti.",
                "Inclina las caderas hacia atrás y baja el torso para sujetar la kettlebell con ambas manos.",
                "Empuja las caderas hacia adelante para levantar la kettlebell manteniendo la espalda recta.",
                "Haz una pausa en la parte superior y baja lentamente la kettlebell a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "how-to-kettlebell-deadlift.gif",
            "objetivo": "Fortalecer los isquiotibiales, glúteos y zona lumbar",
        },
        {
            "nombre": "Curl de pierna acostado",
            "musculo": "Isquiotibiales",
            "equipamento": "Máquina de curl de pierna",
            "instrucciones": [
                "Acuéstate boca abajo en la máquina de curl de pierna y ajusta el rodillo sobre los tobillos.",
                "Flexiona las rodillas para levantar el rodillo hacia los glúteos.",
                "Haz una pausa en la parte superior y baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "lying-leg-curl.gif",
            "objetivo": "Fortalecer los isquiotibiales de forma aislada",
        },
        {
            "nombre": "Curl de pierna sentado",
            "musculo": "Isquiotibiales",
            "equipamento": "Máquina de curl de pierna",
            "instrucciones": [
                "Siéntate en la máquina y ajusta el rodillo sobre los tobillos.",
                "Flexiona las rodillas para mover el rodillo hacia abajo.",
                "Haz una pausa en la parte inferior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "seated-leg-curl.gif",
            "objetivo": "Fortalecer los isquiotibiales de forma controlada",
        },
        {
            "nombre": "Peso muerto con piernas rectas",
            "musculo": "Isquiotibiales",
            "equipamento": "Barra",
            "instrucciones": [
                "Sujeta una barra con un agarre prono y mantén las piernas rectas pero no bloqueadas.",
                "Inclina las caderas hacia atrás y baja la barra manteniendo la espalda recta.",
                "Empuja las caderas hacia adelante para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "straight-leg-deadlift.gif",
            "objetivo": "Fortalecer los isquiotibiales y glúteos",
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
        self.stdout.write(self.style.SUCCESS('¡La tabla Ejercicio ha sido poblada exitosamente con ejercicios de isquiotibiales!'))
