from django.core.management.base import BaseCommand
from routine_app.models import *
from django.db import transaction

class Command(BaseCommand):
    help = 'Seeds the database with catalog routines'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        # Ensure an entrenador exists
        try:
            entrenador = Entrenador.objects.first()
            if not entrenador:
                self.stdout.write(self.style.ERROR('No trainer found!'))
                return
        except Entrenador.DoesNotExist:
            self.stdout.write(self.style.ERROR('No trainer found!'))
            return

        # Example routines
        routine_data = [
            {
                "nombre": "Espalda y biceps - Entrenamiento A",
                "descripcion": "Rutina para trabajar la espalda y los biceps.",
                "enfoque": "Espalda",
                "tipo": "Catalogo",
                "ejercicios": [13, 7, 22, 16, 89]
            },
            {
                "nombre": "Espalda y biceps - Entrenamiento B",
                "descripcion": "Rutina para trabajar la espalda y los biceps.",
                "enfoque": "Espalda",
                "tipo": "Catalogo",
                "ejercicios": [12, 8, 15, 27, 83]
            },
            {
                "nombre": "Pecho y triceps - Entrenamiento A",
                "descripcion": "Rutina para trabajar el pecho y los triceps.",
                "enfoque": "Pecho",
                "tipo": "Catalogo",
                "ejercicios": [30, 41, 99, 97, 87, 85]
            },
            {
                "nombre": "Pecho y triceps - Entrenamiento B",
                "descripcion": "Rutina para trabajar el pecho y los triceps.",
                "enfoque": "Pecho",
                "tipo": "Catalogo",
                "ejercicios": [33, 45, 94, 95, 82, 86]
            },
            {
                "nombre": "Piernas - Entrenamiento A",
                "descripcion": "Rutina para trabajar piernas con énfasis en cuádriceps y glúteos.",
                "enfoque": "Piernas",
                "tipo": "Catalogo",
                "ejercicios": [72, 74, 77, 65, 28]  # Bodyweight squat, sumo squat, leg press, stiff-leg deadlift, calf raise seated
            },
            {
                "nombre": "Piernas - Entrenamiento B",
                "descripcion": "Rutina para trabajar piernas con énfasis en isquiotibiales y pantorrillas.",
                "enfoque": "Piernas",
                "tipo": "Catalogo",
                "ejercicios": [70, 67, 68, 29, 28]  # Leg curl seated, deficit deadlift, kettlebell deadlift, single-leg calf raise, calf raise seated
            },
            {
                "nombre": "Piernas - Entrenamiento C",
                "descripcion": "Rutina para trabajar abductores y glúteos.",
                "enfoque": "Piernas",
                "tipo": "Catalogo",
                "ejercicios": [1, 2, 63, 64, 60]  # Band hip abduction, lateral goblet squat, frog hip thrust, single-leg hip thrust, B-stance hip thrust
            },
            {
                "nombre": "Piernas - Entrenamiento D",
                "descripcion": "Rutina avanzada para piernas, glúteos, y pantorrillas.",
                "enfoque": "Piernas",
                "tipo": "Catalogo",
                "ejercicios": [76, 81, 78, 65, 60]  # Leg extension, straight-leg deadlift, pistol squat, stiff-leg deadlift, calf raise seated
            },
            {
                "nombre": "Piernas - Entrenamiento E",
                "descripcion": "Rutina de cuerpo completo de piernas con énfasis en glúteos y abductores.",
                "enfoque": "Piernas",
                "tipo": "Catalogo",
                "ejercicios": [72, 80, 61, 60]  # Lateral goblet squat, bodyweight squat, frog hip thrust, cable pull-through, B-stance hip thrust
            },
        ]

        # Seed routines and link exercises
        for routine in routine_data:
            # Check if routine already exists
            rutina, created = Rutina.objects.get_or_create(
                nombre=routine["nombre"],
                defaults={
                    "descripcion": routine["descripcion"],
                    "enfoque": routine["enfoque"],
                    "tipo": routine["tipo"],
                    "id_entrenador": entrenador
                },
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created routine: {routine["nombre"]}'))
                # Link exercises to the routine
                for ejercicio_id in routine["ejercicios"]:
                    try:
                        ejercicio = Ejercicio.objects.get(id_ejercicio=ejercicio_id)
                        Compuesta.objects.create(
                            id_rutina=rutina,
                            id_ejercicio=ejercicio
                        )
                    except Ejercicio.DoesNotExist:
                        self.stdout.write(self.style.ERROR(f'Exercise with id {ejercicio_id} does not exist!'))
            else:
                self.stdout.write(self.style.WARNING(f'Routine {routine["nombre"]} already exists!'))
