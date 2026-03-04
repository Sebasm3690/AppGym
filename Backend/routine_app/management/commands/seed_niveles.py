from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = 'Ejecuta todos los comandos de llenado inicial'

    def handle(self, *args, **kwargs):
        comandos = [
            'llenarGeneros',
            'llenarMembresia',
            'llenarNivelesActividad',
            'llenarNivelesGym',
            'llenarObjetivos',
            'llenarParteDia',
            'llenarTareas',
            # Agrega más si tienes otros
        ]

        for comando in comandos:
            self.stdout.write(self.style.WARNING(f'→ Ejecutando: {comando}'))
            try:
                call_command(comando)
            except Exception as e:
                self.stderr.write(self.style.ERROR(f'✗ Error ejecutando {comando}: {e}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'✓ Comando {comando} ejecutado correctamente'))
