from django.core.management.base import BaseCommand
from routine_app.models import Membresia


class Command(BaseCommand):
    help = 'Create genres gym'

    def handle(self,*args, **kwargs):
        membresias = ['1 mes','3 meses','6 meses','12 meses']
        created_count = 0

        for membresia in membresias:
            obj,created = Membresia.objects.get_or_create(duracion=membresia)
            if created:
                created_count += 1
        
        self.stdout.write(self.style.SUCCESS(
            f'{created_count} membresias created successfully!'
        ))
        
      
