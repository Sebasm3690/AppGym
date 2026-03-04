from django.core.management.base import BaseCommand
from routine_app.models import Genero


class Command(BaseCommand):
    help = 'Create genres gym'

    def handle(self,*args, **kwargs):
        genres = ['Masculino','Femenino']
        created_count = 0

        for genre in genres:
            obj,created = Genero.objects.get_or_create(nombre=genre)
            if created:
                created_count += 1
        
        self.stdout.write(self.style.SUCCESS(
            f'{created_count} genres created successfully!'
        ))
        
      

