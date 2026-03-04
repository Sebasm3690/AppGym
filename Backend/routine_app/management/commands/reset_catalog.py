from django.core.management.base import BaseCommand
from django.db import connection
from routine_app.models import Rutina

class Command(BaseCommand):
    "Delete all catalog routines and reset their primary key IDs"
    def handle(self, *args, **options):
        # Step 1: Delete all catalog routines
        Rutina.objects.filter(tipo='Catalogo').delete()
        self.stdout.write("All catalog routines have been deleted.")

        # Step 2: Reset the primary key sequence
        with connection.cursor() as cursor:
            cursor.execute("ALTER SEQUENCE routine_app_rutina_id_rutina_seq RESTART WITH 1;")
        self.stdout.write("The ID of the catalogs has been reset to 1.")