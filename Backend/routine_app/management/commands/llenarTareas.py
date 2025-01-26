from django.core.management.base import BaseCommand
from routine_app.models import Tarea


class Command(BaseCommand):
    help = 'Create gym tasks'

    def handle(self, *args, **kwargs):
        tasks = [
            "Iniciar sesión",
            "Agregar entrenador",
            "Recuperar contraseña",
            "Agregar cliente",
            "Buscar cliente",
            "Agregar rutina",
            "Asignar rutina",
            "Agregar seguimiento",
            "Visualizar historial del cliente",
            "Visualizar progreso del cliente",
            "Buscar alimento",
            "Agregar alimento",
            "Visualizar calorías y macronutrientes semanalmente",
            "Agregar progreso",
            "Ver historial",
        ]
        created_count = 0

        for task in tasks:
            obj, created = Tarea.objects.get_or_create(nombre=task)
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'{created_count} tasks created successfully!'
        ))
