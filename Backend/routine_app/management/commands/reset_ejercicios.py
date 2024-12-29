from django.core.management.base import BaseCommand
from django.db import connection
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Delete all ejercicios and reset their primary key IDs'

    def handle(self, *args, **kwargs):
        # Step 1: Delete all rows
        Ejercicio.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Todos los ejercicios han sido eliminados.'))

        # Step 2: Reset the primary key sequence
        with connection.cursor() as cursor:
            cursor.execute("ALTER SEQUENCE routine_app_ejercicio_id_ejercicio_seq RESTART WITH 1;")
        self.stdout.write(self.style.SUCCESS('El ID de los ejercicios ha sido reiniciado a 1.'))
