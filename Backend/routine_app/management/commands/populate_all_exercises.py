from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Ejecuta todos los scripts de población para llenar la tabla Ejercicio con todos los ejercicios'

    def handle(self,*args, **kwargs):
        try:
            scripts = [
                'populate_abductors',
                'populate_back',
                'populate_biceps',
                'populate_calves',
                'populate_chest',
                'populate_core',
                'populate_forearms',
                'populate_glutes',
                'populate_hamstrings',
                'populate_legs',
                'populate_shoulders',
                'populate_triceps'
            ]

            # Execute each script
            for script in scripts:
                self.stdout.write(f'Executing script {script}')
                call_command(script)
                self.stdout.write(self.style.SUCCESS(f'Script {script} executed successfully!'))
            
            self.stdout.write(self.style.SUCCESS('All scripts executed successfully!'))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f'An error occurred: {e}'))
