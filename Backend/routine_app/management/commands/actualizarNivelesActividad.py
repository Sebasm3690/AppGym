from django.core.management.base import BaseCommand
from routine_app.models import NivelActividad


class Command(BaseCommand):
    help = 'Create initial activity levels'

    def handle(self,*args, **kwargs):
        activity_levels = [('Sedentario',1.2),('Ligeramente activo',1.375),('Moderadamente activo',1.55),('Muy activo',1.725),('Extra activo',1.9)]
        created_count = 0
        updated_count = 0

        for nombre,factor in activity_levels:
            nivel, created = NivelActividad.objects.update_or_create(
                nombre=nombre,
                defaults = {"factor": factor}
            )
            if created:
                created_count += 1
            else:
                nivel.factor = factor
                nivel.save()
                updated_count += 1
        self.stdout.write(self.style.SUCCESS(
        f'{created_count} levels created, {updated_count} levels updated successfully!'
    ))
    