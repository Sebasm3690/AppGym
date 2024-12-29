import json
from django.core.management.base import BaseCommand
from routine_app.models import Ejercicio

class Command(BaseCommand):
    help = 'Popula la tabla Ejercicio con ejercicios de pecho en español usando URLs públicas de Google Cloud Storage'

    # URL Base for your Google Cloud Storage bucket
    BASE_URL = "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Chest/"

    # Exercise data
    ejercicios = [
        {
            "id_ejercicio": 100,  # Adjust the ID to the next available number
            "nombre": "Pin Bench Press",
            "musculo": "Pecho",
            "equipamento": "Barra",
            "instrucciones": json.dumps([
                "Ajusta los pines de seguridad de la máquina de power rack a la altura deseada.",
                "Acuéstate en un banco debajo de los pines y coloca una barra cargada en los pines.",
                "Empuja la barra hacia arriba desde los pines hasta que los brazos estén completamente extendidos.",
                "Haz una pausa en la parte superior y luego baja la barra lentamente hasta los pines.",
                "Repite el número deseado de repeticiones."
            ], ensure_ascii=False),
            "imagen": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Chest/pin-bench-press.gif",
            "objetivo": "Fortalecer el pecho, los tríceps y mejorar el bloqueo en el press de banca.",
            "nombre": "Press de banca con barra",
            "musculo": "Pecho",
            "equipamento": "Barra",
            "instrucciones": [
                "Acuéstate en un banco plano y sujeta la barra con un agarre ligeramente más ancho que los hombros.",
                "Baja la barra lentamente hacia el centro de tu pecho.",
                "Empuja la barra hacia arriba hasta que tus brazos estén completamente extendidos.",
                "Haz una pausa y repite el número deseado de repeticiones."
            ],
            "imagen": "barbell-bench-press.gif",
            "objetivo": "Fortalecer el pectoral mayor y los tríceps",
        },
        {
            "nombre": "Press declinado con barra",
            "musculo": "Pecho",
            "equipamento": "Barra",
            "instrucciones": [
                "Acuéstate en un banco declinado y sujeta la barra con un agarre ancho.",
                "Baja la barra hacia la parte inferior de tu pecho.",
                "Empuja la barra hacia arriba hasta que tus brazos estén completamente extendidos.",
                "Haz una pausa y repite el número deseado de repeticiones."
            ],
            "imagen": "barbell-decline-bench-press.gif",
            "objetivo": "Fortalecer la parte inferior del pectoral mayor",
        },
        {
            "nombre": "Cruce de cables de pie",
            "musculo": "Pecho",
            "equipamento": "Poleas",
            "instrucciones": [
                "Coloca las poleas en una posición alta y sujeta una manija en cada mano.",
                "Da un paso adelante con un pie para mantener el equilibrio.",
                "Lleva las manijas hacia el centro frente a tu pecho en un movimiento de cruce.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "cable-standing-crossover.gif",
            "objetivo": "Aislar y definir el pectoral mayor",
        },
        {
            "nombre": "Press de pecho en máquina",
            "musculo": "Pecho",
            "equipamento": "Máquina",
            "instrucciones": [
                "Siéntate en la máquina y ajusta los agarres a la altura de tu pecho.",
                "Empuja los agarres hacia adelante hasta que tus brazos estén completamente extendidos.",
                "Haz una pausa y luego regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "chest-press-machine.gif",
            "objetivo": "Fortalecer el pectoral mayor con un movimiento guiado",
        },
        {
            "nombre": "Press cerrado con barra",
            "musculo": "Pecho",
            "equipamento": "Barra",
            "instrucciones": [
                "Acuéstate en un banco plano y sujeta la barra con un agarre cerrado.",
                "Baja la barra hacia el centro de tu pecho.",
                "Empuja la barra hacia arriba hasta que tus brazos estén completamente extendidos.",
                "Haz una pausa y repite el número deseado de repeticiones."
            ],
            "imagen": "close-grip-bench-press-movement.gif",
            "objetivo": "Fortalecer el pectoral mayor y los tríceps",
        },
        {
            "nombre": "Aperturas con cable en declinación",
            "musculo": "Pecho",
            "equipamento": "Poleas",
            "instrucciones": [
                "Ajusta las poleas a una posición baja y sujeta una manija en cada mano.",
                "Da un paso adelante con un pie y inclina ligeramente el torso hacia adelante.",
                "Lleva las manijas hacia el centro en un movimiento de apertura.",
                "Haz una pausa y luego regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "decline-cable-fly.gif",
            "objetivo": "Aislar la parte inferior del pectoral mayor",
        },
        {
            "nombre": "Flexiones en declinación",
            "musculo": "Pecho",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Coloca tus pies en una superficie elevada y las manos en el suelo.",
                "Baja el pecho hacia el suelo manteniendo el torso recto.",
                "Empuja hacia arriba hasta que tus brazos estén completamente extendidos.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "decline-push-up.gif",
            "objetivo": "Trabajar la parte inferior del pectoral mayor",
        },
        {
            "nombre": "Flexiones con déficit",
            "musculo": "Pecho",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Coloca tus manos en plataformas o manijas elevadas.",
                "Baja el pecho más allá del nivel de tus manos.",
                "Empuja hacia arriba hasta que tus brazos estén completamente extendidos.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "deficit-push-ups.gif",
            "objetivo": "Aumentar el rango de movimiento y trabajar el pectoral mayor",
        },
        {
            "nombre": "Flexiones diamante",
            "musculo": "Pecho",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Coloca tus manos juntas formando un diamante debajo de tu pecho.",
                "Baja el torso hacia el suelo manteniendo el cuerpo recto.",
                "Empuja hacia arriba hasta que tus brazos estén completamente extendidos.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "diamond-pushup.gif",
            "objetivo": "Fortalecer el pectoral mayor y los tríceps",
        },
        {
            "nombre": "Aperturas con mancuerna",
            "musculo": "Pecho",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Acuéstate en un banco plano con una mancuerna en cada mano.",
                "Abre los brazos hacia los lados en un movimiento de apertura.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-chest-fly-muscles.gif",
            "objetivo": "Aislar el pectoral mayor",
        },
        {
            "nombre": "Press con agarre cerrado y mancuerna",
            "musculo": "Pecho",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Acuéstate en un banco plano con una mancuerna en cada mano.",
                "Mantén las mancuernas juntas y empuja hacia arriba.",
                "Haz una pausa y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-close-grip-press.gif",
            "objetivo": "Trabajar el pectoral mayor y los tríceps",
        },
         {
            "nombre": "Press de banca inclinada con barra",
            "musculo": "Pecho",
            "equipamento": "Barra",
            "instrucciones": [
                "Ajusta un banco inclinado a 30-45 grados y acuéstate sobre él.",
                "Sujeta la barra con un agarre ligeramente más ancho que el ancho de los hombros.",
                "Baja la barra hacia la parte superior de tu pecho.",
                "Empuja la barra hacia arriba hasta que tus brazos estén completamente extendidos.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "incline-barbell-bench-press.gif",
            "objetivo": "Fortalecer la parte superior del pectoral mayor",
        },        {
            "nombre": "Aperturas inclinadas con cable",
            "musculo": "Pecho",
            "equipamento": "Poleas",
            "instrucciones": [
                "Ajusta las poleas a una posición baja y toma una manija en cada mano.",
                "Siéntate en un banco inclinado y lleva las manijas hacia arriba frente a tu pecho.",
                "Regresa lentamente las manijas hacia abajo hasta que tus brazos estén abiertos pero no bloqueados.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "incline-cable-fly.gif",
            "objetivo": "Aislar la parte superior del pectoral mayor",
        },
 {
            "nombre": "Press hexagonal inclinado con mancuernas",
            "musculo": "Pecho",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Siéntate en un banco inclinado sosteniendo dos mancuernas juntas a la altura del pecho.",
                "Presiona las mancuernas hacia arriba manteniéndolas juntas durante todo el movimiento.",
                "Haz una pausa en la parte superior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "incline-dumbbell-hex-press.gif",
            "objetivo": "Fortalecer la parte superior del pectoral mayor",
        },  {
            "nombre": "Aperturas bajas con cable",
            "musculo": "Pecho",
            "equipamento": "Poleas",
            "instrucciones": [
                "Ajusta las poleas a una posición baja y toma una manija en cada mano.",
                "Inclínate ligeramente hacia adelante y lleva las manijas hacia el centro frente a tu pecho.",
                "Haz una pausa en la parte superior y luego regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "low-cable-chest-flys.gif",
            "objetivo": "Aislar la parte inferior del pectoral mayor",
        },
                {
            "nombre": "Aperturas en máquina (Pec Deck)",
            "musculo": "Pecho",
            "equipamento": "Máquina",
            "instrucciones": [
                "Siéntate en la máquina de aperturas y ajusta las manijas al nivel de tu pecho.",
                "Lleva las manijas hacia el centro frente a tu pecho.",
                "Haz una pausa en la parte superior y luego regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "pec-deck.gif",
            "objetivo": "Aislar el pectoral mayor con un movimiento controlado",
        },
        {
            "nombre": "Flexiones de pecho",
            "musculo": "Pecho",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Coloca las manos ligeramente más anchas que los hombros en el suelo.",
                "Baja el pecho hacia el suelo manteniendo el torso recto.",
                "Empuja hacia arriba hasta que tus brazos estén completamente extendidos.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "push-up.gif",
            "objetivo": "Fortalecer el pectoral mayor y los tríceps",
        },
        {
            "nombre": "Press de banca con agarre inverso",
            "musculo": "Pecho",
            "equipamento": "Barra",
            "instrucciones": [
                "Acuéstate en un banco plano y sujeta la barra con un agarre supino.",
                "Baja la barra hacia el centro de tu pecho.",
                "Empuja la barra hacia arriba hasta que tus brazos estén completamente extendidos.",
                "Haz una pausa y repite el número deseado de repeticiones."
            ],
            "imagen": "reverse-grip-bench-press.gif",
            "objetivo": "Trabajar el pectoral mayor y los tríceps con énfasis en la parte superior",
        },
        {
            "nombre": "Fondos en paralelas",
            "musculo": "Pecho",
            "equipamento": "Barras paralelas",
            "instrucciones": [
                "Sujeta las barras paralelas y levanta tu cuerpo hasta que tus brazos estén completamente extendidos.",
                "Baja el cuerpo doblando los codos hasta que los hombros estén al nivel de los codos.",
                "Empuja hacia arriba para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "tricep-dips.gif",
            "objetivo": "Fortalecer el pectoral mayor y los tríceps",
        },
        {
            "nombre": "Fondos con peso",
            "musculo": "Pecho",
            "equipamento": "Barras paralelas y peso adicional",
            "instrucciones": [
                "Usa un cinturón con peso o sostén una mancuerna entre tus pies.",
                "Sujeta las barras paralelas y levanta tu cuerpo.",
                "Baja el cuerpo doblando los codos hasta que los hombros estén al nivel de los codos.",
                "Empuja hacia arriba para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "weighted-dips.gif",
            "objetivo": "Aumentar la fuerza del pecho y los tríceps con resistencia adicional",
        },

    ]

    def handle(self, *args, **kwargs):
        for ejercicio_data in self.ejercicios:
            imagen_url = f"{self.BASE_URL}{ejercicio_data['imagen']}"
            ejercicio = Ejercicio(
                nombre=ejercicio_data["nombre"],
                musculo=ejercicio_data["musculo"],
                equipamento=ejercicio_data["equipamento"],
                instrucciones=json.dumps(ejercicio_data["instrucciones"], ensure_ascii=False),
                imagen=imagen_url,
                objetivo=ejercicio_data["objetivo"],
            )
            ejercicio.save()
        self.stdout.write(self.style.SUCCESS('¡La tabla Ejercicio ha sido poblada exitosamente con ejercicios de pecho!'))
