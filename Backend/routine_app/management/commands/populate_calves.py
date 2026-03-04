import json
from django.core.management.base import BaseCommand
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Popula la tabla Ejercicio con ejercicios de pantorrillas en español usando URLs públicas de Google Cloud Storage'

    # URL Base for your Google Cloud Storage bucket
    BASE_URL = "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Calves/"

    # Exercise data
    ejercicios = [
        {
            "nombre": "Elevación de pantorrillas sentado",
            "musculo": "Pantorrillas",
            "equipamento": "Máquina",
            "instrucciones": [
                "Siéntate en la máquina con las puntas de los pies apoyadas en la plataforma.",
                "Ajusta el acolchado sobre tus muslos y libera el seguro de la máquina.",
                "Levanta los talones lo más alto posible mientras mantienes la tensión en las pantorrillas.",
                "Haz una pausa en la parte superior y luego baja lentamente los talones hasta la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "seated-calf-raise.gif",
            "objetivo": "Fortalecer el sóleo y los músculos de las pantorrillas",
        },
        {
            "nombre": "Elevación de pantorrillas a una pierna",
            "musculo": "Pantorrillas",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Colócate de pie en un escalón o plataforma con el talón sobresaliendo.",
                "Apóyate en una superficie estable para equilibrarte.",
                "Levanta una pierna, dejando el peso sobre la otra.",
                "Eleva el talón de la pierna de apoyo lo más alto posible.",
                "Haz una pausa y luego baja lentamente el talón hasta la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "single-leg-calf-raise.gif",
            "objetivo": "Aumentar fuerza y estabilidad en las pantorrillas de manera unilateral",
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
        self.stdout.write(self.style.SUCCESS('¡La tabla Ejercicio ha sido poblada exitosamente con ejercicios de pantorrillas!'))
