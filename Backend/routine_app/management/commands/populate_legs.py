import json
from django.core.management.base import BaseCommand
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Popula la tabla Ejercicio con ejercicios de piernas en español usando URLs públicas de Google Cloud Storage'

    # URL Base for your Google Cloud Storage bucket
    BASE_URL = "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Legs/"

    # Exercise data
    ejercicios = [
        {
            "nombre": "Sentadilla con peso corporal",
            "musculo": "Piernas",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Párate con los pies separados al ancho de los hombros.",
                "Baja las caderas hacia atrás y hacia abajo hasta que los muslos estén paralelos al suelo.",
                "Mantén el pecho erguido y las rodillas alineadas con los pies.",
                "Empuja a través de los talones para volver a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "bodyweight-squat.gif",
            "objetivo": "Fortalecer cuádriceps, glúteos e isquiotibiales",
        },
        {
            "nombre": "Split squat con mancuerna",
            "musculo": "Piernas",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Sujeta una mancuerna en cada mano y da un paso hacia adelante.",
                "Baja el cuerpo doblando ambas rodillas, manteniendo el torso recto.",
                "Empuja con el pie delantero para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "dumbbell-split-squat.gif",
            "objetivo": "Fortalecer cuádriceps, glúteos e isquiotibiales",
        },
        {
            "nombre": "Sentadilla sumo con mancuerna",
            "musculo": "Piernas",
            "equipamento": "Mancuerna",
            "instrucciones": [
                "Sujeta una mancuerna con ambas manos y coloca los pies más anchos que los hombros.",
                "Baja las caderas hacia abajo mientras mantienes el pecho erguido.",
                "Haz una pausa y empuja hacia arriba a través de los talones.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-sumo-squat.gif",
            "objetivo": "Fortalecer cuádriceps, glúteos y aductores",
        },
        {
            "nombre": "Estiramiento de músculos en posición de arrodillado",
            "musculo": "Piernas",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Arrodíllate en el suelo con una pierna hacia adelante.",
                "Empuja las caderas hacia adelante para estirar el músculo del muslo trasero.",
                "Mantén la posición durante 15-30 segundos y cambia de pierna."
            ],
            "imagen": "kneeling-lunge-stretch-muscles.gif",
            "objetivo": "Mejorar la flexibilidad y la movilidad de los músculos de las piernas",
        },
        {
            "nombre": "Extensión de piernas en máquina",
            "musculo": "Piernas",
            "equipamento": "Máquina de extensión de piernas",
            "instrucciones": [
                "Siéntate en la máquina y ajusta el rodillo para que quede sobre tus tobillos.",
                "Extiende las piernas hacia adelante completamente.",
                "Haz una pausa y baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "leg-extension-machine.gif",
            "objetivo": "Aislar y fortalecer los cuádriceps",
        },
        {
            "nombre": "Prensa de pierna",
            "musculo": "Piernas",
            "equipamento": "Máquina de prensa de pierna",
            "instrucciones": [
                "Siéntate en la máquina de prensa de pierna y coloca los pies en la plataforma.",
                "Empuja la plataforma hacia arriba extendiendo las piernas, sin bloquear las rodillas.",
                "Baja lentamente la plataforma hasta que las rodillas estén en un ángulo de 90 grados.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "leg-press.gif",
            "objetivo": "Fortalecer cuádriceps, glúteos e isquiotibiales",
        },
        {
            "nombre": "Sentadilla pistol",
            "musculo": "Piernas",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Párate sobre una pierna con la otra pierna extendida hacia adelante.",
                "Baja lentamente el cuerpo hacia abajo doblando la pierna de apoyo.",
                "Empuja hacia arriba a través del talón para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "pistol-squat-muscles.gif",
            "objetivo": "Fortalecer piernas y mejorar el equilibrio",
        },
        {
            "nombre": "Lunge con déficit inverso",
            "musculo": "Piernas",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Párate en una plataforma y da un paso hacia atrás con una pierna.",
                "Baja el cuerpo doblando ambas rodillas hasta que la pierna trasera toque el suelo.",
                "Empuja con el pie delantero para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "reverse-deficit-lunge.gif",
            "objetivo": "Fortalecer cuádriceps, glúteos e isquiotibiales",
        },
        {
            "nombre": "Sentadilla isométrica de 2 segundos",
            "musculo": "Piernas",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Párate con los pies separados al ancho de los hombros.",
                "Baja las caderas hacia abajo hasta que los muslos estén paralelos al suelo.",
                "Mantén la posición durante 2 segundos antes de regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "squat-hold-2-seconds.gif",
            "objetivo": "Fortalecer cuádriceps y mejorar la resistencia",
        },
        {
            "nombre": "Peso muerto con piernas rectas",
            "musculo": "Piernas",
            "equipamento": "Barra",
            "instrucciones": [
                "Sujeta una barra con un agarre prono y mantén las piernas rectas pero no bloqueadas.",
                "Inclina las caderas hacia atrás y baja la barra manteniendo la espalda recta.",
                "Empuja las caderas hacia adelante para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "straight-leg-deadlift.gif",
            "objetivo": "Fortalecer glúteos e isquiotibiales",
        },
        {
            "nombre": "V Squat",
            "musculo": "Piernas",
            "equipamento": "Máquina",
            "instrucciones": json.dumps([
                "Colócate en la máquina V Squat con los pies en la plataforma.",
                "Ajusta la posición para que los hombros estén asegurados debajo de los acolchados.",
                "Baja el cuerpo doblando las rodillas hasta que los muslos estén paralelos al suelo.",
                "Empuja a través de los talones para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ], ensure_ascii=False),
            "imagen": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Legs/v-squat.gif",
            "objetivo": "Fortalecer los cuádriceps, glúteos y mejorar la estabilidad en las piernas."},
        {
        "nombre": "Dumbbell Squat",
        "musculo": "Piernas",
        "equipamento": "Mancuernas",
        "instrucciones": json.dumps([
            "Toma una mancuerna en cada mano y mantén los brazos extendidos a los lados del cuerpo.",
            "Coloca los pies a la altura de los hombros con las puntas ligeramente hacia afuera.",
            "Dobla las rodillas y baja las caderas hacia abajo y hacia atrás como si estuvieras sentado en una silla.",
            "Mantén el peso en los talones mientras bajas, asegurándote de que las rodillas no sobrepasen los dedos de los pies.",
            "Empuja hacia arriba a través de los talones para regresar a la posición inicial.",
            "Repite el número deseado de repeticiones."
        ], ensure_ascii=False),
        "imagen": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Legs/dumbbell-squat.gif",
        "objetivo": "Fortalecer los cuádriceps, glúteos y estabilizar los músculos de las piernas."
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
        self.stdout.write(self.style.SUCCESS('¡La tabla Ejercicio ha sido poblada exitosamente con ejercicios de piernas!'))
