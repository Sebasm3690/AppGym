from django.core.management.base import BaseCommand
from routine_app.models import NivelGym


class Command(BaseCommand):
    help = 'Create initial gym levels'

    def handle(self,*args, **kwargs):
        levels = ['Principiante','Intermedio','Avanzado']
        created_count = 0

        for level in levels:
            obj,created = NivelGym.objects.get_or_create(nombre=level)
            if created:
                created_count += 1
        
        self.stdout.write(self.style.SUCCESS(
            f'{created_count} levels created successfully!'
        ))
        