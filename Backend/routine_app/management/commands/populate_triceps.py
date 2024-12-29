import json
from django.core.management.base import BaseCommand
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Popula la tabla Ejercicio con ejercicios de tríceps en español usando URLs públicas de Google Cloud Storage'

    # URL Base for your Google Cloud Storage bucket
    BASE_URL = "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Triceps/"

    # Exercise data
    ejercicios = [
        {
            "nombre": "Dips en banco",
            "musculo": "Tríceps",
            "equipamento": "Banco",
            "instrucciones": [
                "Siéntate en el borde de un banco con las manos apoyadas a los lados.",
                "Extiende las piernas frente a ti con los talones apoyados en el suelo.",
                "Desciende el cuerpo doblando los codos hasta que los brazos formen un ángulo de 90 grados.",
                "Empuja hacia arriba con los brazos para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "bench-dip.gif",
            "objetivo": "Fortalecer los tríceps y mejorar la estabilidad del hombro",
        },
        {
            "nombre": "Patada de tríceps con cable",
            "musculo": "Tríceps",
            "equipamento": "Polea",
            "instrucciones": [
                "Coloca un mango en la polea alta y sujétalo con una mano.",
                "Inclínate ligeramente hacia adelante con la espalda recta.",
                "Extiende el brazo hacia atrás mientras contraes el tríceps.",
                "Haz una pausa y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de brazo."
            ],
            "imagen": "cable-tricep-kickback.gif",
            "objetivo": "Fortalecer los tríceps con resistencia constante",
        },
        {
            "nombre": "Press de banca con agarre cerrado",
            "musculo": "Tríceps",
            "equipamento": "Barra",
            "instrucciones": [
                "Acuéstate en un banco plano y sujeta una barra con un agarre estrecho.",
                "Baja la barra hacia el pecho manteniendo los codos cerca del cuerpo.",
                "Empuja la barra hacia arriba hasta que los brazos estén completamente extendidos.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "close-grip-bench-press-movement.gif",
            "objetivo": "Fortalecer los tríceps, pectorales y deltoides",
        },
        {
            "nombre": "Skull crusher en banco plano",
            "musculo": "Tríceps",
            "equipamento": "Barra EZ",
            "instrucciones": [
                "Acuéstate en un banco plano sujetando una barra EZ con un agarre prono.",
                "Baja lentamente la barra hacia la frente doblando los codos.",
                "Extiende los brazos hacia arriba regresando a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "flat-bench-skull-crusher.gif",
            "objetivo": "Fortalecer los tríceps de manera aislada",
        },
        {
            "nombre": "Skull crusher inclinado",
            "musculo": "Tríceps",
            "equipamento": "Barra EZ",
            "instrucciones": [
                "Acuéstate en un banco inclinado sujetando una barra EZ con un agarre prono.",
                "Baja lentamente la barra hacia la frente doblando los codos.",
                "Extiende los brazos hacia arriba regresando a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "incline-skullcrusher.gif",
            "objetivo": "Fortalecer los tríceps desde un ángulo diferente",
        },
        {
            "nombre": "Extensión de tríceps con cable por encima de la cabeza",
            "musculo": "Tríceps",
            "equipamento": "Polea",
            "instrucciones": [
                "Sujeta un mango en la polea alta con ambas manos.",
                "Da un paso adelante y extiende los brazos por encima de la cabeza.",
                "Dobla los codos para llevar el mango detrás de la cabeza.",
                "Extiende los brazos nuevamente regresando a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "overhead-cable-tricep-extension.gif",
            "objetivo": "Fortalecer los tríceps con enfoque en la cabeza larga",
        },
        {
            "nombre": "Extensión de tríceps por encima de la cabeza",
            "musculo": "Tríceps",
            "equipamento": "Mancuerna",
            "instrucciones": [
                "Sujeta una mancuerna con ambas manos por detrás de la cabeza.",
                "Extiende los brazos hacia arriba completamente.",
                "Baja lentamente la mancuerna detrás de la cabeza doblando los codos.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "tricep-overhead-extensions.gif",
            "objetivo": "Fortalecer los tríceps con un movimiento completo",
        },
        {
            "nombre": "Pushdown de tríceps con barra en V",
            "musculo": "Tríceps",
            "equipamento": "Polea",
            "instrucciones": [
                "Sujeta una barra en V conectada a la polea alta.",
                "Empuja la barra hacia abajo hasta que los brazos estén completamente extendidos.",
                "Haz una pausa y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "v-bar-tricep-pushdown.gif",
            "objetivo": "Fortalecer los tríceps con enfoque en la cabeza lateral",
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
        self.stdout.write(self.style.SUCCESS('¡La tabla Ejercicio ha sido poblada exitosamente con ejercicios de tríceps!'))
