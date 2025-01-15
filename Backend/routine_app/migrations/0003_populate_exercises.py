import json
from django.db import migrations

def populate_ejercicios(apps, schema_editor):
    Ejercicio = apps.get_model('routine_app', 'Ejercicio')

    # List of exercise data for different muscle groups
    data = [
        {
            "base_url": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Abductors/",
            "ejercicios": [
                {
                    "nombre": "Movimiento de abducción de cadera con banda",
                    "musculo": "Abductores",
                    "equipamento": "Banda",
                    "instrucciones": [
                        "Coloca la banda justo por encima de tus rodillas.",
                        "Ponte de pie con los pies separados al ancho de los hombros.",
                        "Da un paso hacia un lado, manteniendo la tensión en la banda.",
                        "Haz una pausa y regresa a la posición inicial.",
                        "Repite el número deseado de repeticiones."
                    ],
                    "imagen": "band-hip-abduction-movement.gif",
                    "objetivo": "Fortalecer los abductores de la cadera",
                },
                {
                    "nombre": "Sentadilla lateral con pesa en copa",
                    "musculo": "Abductores",
                    "equipamento": "Mancuerna",
                    "instrucciones": [
                        "Sujeta una mancuerna a la altura del pecho.",
                        "Da un paso grande hacia un lado.",
                        "Realiza una sentadilla, manteniendo el peso centrado.",
                        "Empuja hacia arriba para regresar a la posición inicial.",
                        "Repite el número deseado de repeticiones."
                    ],
                    "imagen": "goblet-side-squat.gif",
                    "objetivo": "Fortalecer los abductores de la cadera",
                },
                 {
            "nombre": "Máquina de abducción de cadera",
            "musculo": "abductores",
            "equipamento": "máquina",
            "instrucciones": [
                "Ajusta la máquina a la resistencia deseada.",
                "Siéntate y coloca las piernas contra las almohadillas.",
                "Empuja las piernas hacia afuera contra la resistencia.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "hip-abduction-machine.gif",
            "objetivo": "abductores de la cadera",
        },
          {
            "nombre": "Abducción de cadera sentado con banda",
            "musculo": "abductores",
            "equipamento": "banda",
            "instrucciones": [
                "Siéntate en un banco con la banda justo por encima de tus rodillas.",
                "Mantén los pies planos en el suelo.",
                "Empuja las rodillas hacia afuera, estirando la banda.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "seated-band-hip-abduction.gif",
            "objetivo": "abductores de la cadera",
        },
            ]
    },
        {
            "base_url": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Back/",
            "ejercicios": [
                {
                    "nombre": "Polea al pecho con banda",
                    "musculo": "Espalda",
                    "equipamento": "Banda",
                    "instrucciones": [
                        "Sujeta la banda a un punto elevado y siéntate en el suelo.",
                        "Toma los extremos de la banda con ambas manos.",
                        "Jala la banda hacia tu pecho, apretando los omóplatos.",
                        "Regresa lentamente a la posición inicial.",
                        "Repite el número deseado de repeticiones."
                    ],
                    "imagen": "band-lat-pulldown.gif",
                    "objetivo": "Fortalecer los dorsales y la parte superior de la espalda",
                },
                {
                "nombre": "Remo inclinado con barra",
                "musculo": "Espalda",
                "equipamento": "Barra",
                "instrucciones": [
                    "Coloca una barra en el suelo y carga el peso deseado.",
                    "Inclina el torso hacia adelante manteniendo la espalda recta.",
                    "Sujeta la barra con ambas manos y jálala hacia tu abdomen.",
                    "Haz una pausa y luego regresa lentamente a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "barbell-bent-over-row.gif",
                "objetivo": "Fortalecer los dorsales, trapecios y romboides",
            },
            {
                "nombre": "Jalón en polea alta",
                "musculo": "Espalda",
                "equipamento": "Polea",
                "instrucciones": [
                    "Siéntate en la máquina de polea alta con los pies planos en el suelo.",
                    "Sujeta la barra con un agarre por encima, más ancho que los hombros.",
                    "Jala la barra hacia tu pecho, apretando los omóplatos.",
                    "Regresa lentamente a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "cable-lat-pulldown.gif",
                "objetivo": "Fortalecer los dorsales y la parte superior de la espalda",
            },
            {
                "nombre": "Remo sentado en máquina",
                "musculo": "Espalda",
                "equipamento": "Máquina",
                "instrucciones": [
                    "Siéntate en la máquina de remo con los pies apoyados.",
                    "Sujeta las manijas con ambas manos.",
                    "Jala las manijas hacia tu abdomen, apretando los omóplatos.",
                    "Regresa lentamente a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "cable-seated-row.gif",
                "objetivo": "Fortalecer los dorsales y los romboides",
            },
            {
                "nombre": "Encogimiento de hombros con polea",
                "musculo": "Espalda",
                "equipamento": "Polea",
                "instrucciones": [
                    "Ponte de pie frente a la polea baja y sujeta la barra con ambas manos.",
                    "Levanta los hombros hacia tus orejas lo más alto posible.",
                    "Haz una pausa y luego regresa a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "cable-shrug.gif",
                "objetivo": "Fortalecer el trapecio",
            },
            {
                "nombre": "Remo invertido",
                "musculo": "Espalda",
                "equipamento": "Barra fija",
                "instrucciones": [
                    "Coloca una barra fija a la altura de tu cintura.",
                    "Acuéstate debajo de la barra con los pies extendidos.",
                    "Sujeta la barra con ambas manos y jala tu pecho hacia la barra.",
                    "Regresa lentamente a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "inverted-row.gif",
                "objetivo": "Fortalecer los dorsales y los romboides",
            },
            {
                "nombre": "Jalón neutral en polea alta",
                "musculo": "Espalda",
                "equipamento": "Polea",
                "instrucciones": [
                    "Siéntate en la máquina de polea alta con los pies planos en el suelo.",
                    "Sujeta las manijas con un agarre neutral (palmas enfrentadas).",
                    "Jala las manijas hacia tu pecho, apretando los omóplatos.",
                    "Regresa lentamente a la posición inicial.",
                    "Repite el número deseado de repeticiones."
                ],
                "imagen": "neutral-grip-lat-pulldown.gif",
                "objetivo": "Fortalecer los dorsales y la parte superior de la espalda",
            },
            {
            "nombre": "Dominadas",
            "musculo": "Espalda",
            "equipamento": "Barra fija",
            "instrucciones": [
                "Agarra la barra con un agarre por encima, ligeramente más ancho que los hombros.",
                "Cuelga completamente con los brazos extendidos.",
                "Jala tu cuerpo hacia arriba hasta que tu barbilla pase la barra.",
                "Haz una pausa y luego regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "pull-up.gif",
            "objetivo": "Fortalecer los dorsales y los músculos de la parte superior de la espalda",
        },
        {
            "nombre": "Remo con barra en T",
            "musculo": "Espalda",
            "equipamento": "Barra en T",
            "instrucciones": [
                "Coloca la barra en T en el suelo y carga el peso deseado.",
                "Sujeta la barra con ambas manos en el mango de remo.",
                "Inclina el torso hacia adelante mientras mantienes la espalda recta.",
                "Jala la barra hacia tu abdomen, apretando los omóplatos.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "t-bar-row-muscles.gif",
            "objetivo": "Fortalecer los dorsales, trapecios y romboides",
        },
            ]
        },


        {
            "base_url": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Biceps/",
            "ejercicios": [
                {
            "nombre": "Curl Bayesiano",
            "musculo": "Bíceps",
            "equipamento": "Banda",
            "instrucciones": [
                "Fija una banda elástica en un punto bajo.",
                "Toma el extremo de la banda con una mano y da un paso hacia atrás para generar tensión.",
                "Mantén el codo fijo y realiza un curl, llevando la mano hacia el hombro.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "bayesian-curl.gif",
            "objetivo": "Fortalecer el bíceps braquial",
        },
        {
            "nombre": "Curl en polea con arrastre",
            "musculo": "Bíceps",
            "equipamento": "Polea",
            "instrucciones": [
                "Ajusta la polea a una posición baja y sujeta la barra con ambas manos.",
                "Mantén los codos cerca del torso y realiza un curl, llevando la barra hacia los hombros.",
                "Inclina ligeramente el torso hacia atrás para un rango completo.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "cable-drag-curl.gif",
            "objetivo": "Fortalecer el bíceps con un enfoque en la parte larga",
        },
        {
            "nombre": "Curl Martillo Cruzado",
            "musculo": "Bíceps",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Sujeta una mancuerna en cada mano con un agarre neutral (palmas enfrentadas).",
                "Levanta una mancuerna hacia el hombro opuesto, manteniendo el codo cerca del torso.",
                "Regresa lentamente a la posición inicial y repite con el otro brazo.",
                "Alterna los brazos en cada repetición.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "cross-body-hammer-curl.gif",
            "objetivo": "Trabajar el braquiorradial y fortalecer el bíceps",
        },
        {
            "nombre": "Curl con arrastre",
            "musculo": "Bíceps",
            "equipamento": "Polea",
            "instrucciones": [
                "Coloca la polea a una posición baja.",
                "Sujeta la barra con ambas manos y jala hacia tus hombros.",
                "Mantén los codos hacia atrás y el torso inclinado ligeramente.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "drag-curl.gif",
            "objetivo": "Enfocar el trabajo en la parte larga del bíceps",
        },
        {
            "nombre": "Curl Inclinado con Mancuerna",
            "musculo": "Bíceps",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Siéntate en un banco inclinado con una mancuerna en cada mano.",
                "Mantén los codos cerca del torso y realiza un curl, levantando las mancuernas hacia los hombros.",
                "Regresa lentamente a la posición inicial.",
                "Asegúrate de no balancear los brazos para mantener la tensión en los bíceps.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "incline-dumbbell-curl.gif",
            "objetivo": "Aislar los bíceps para un rango de movimiento completo",
        },
        {
            "nombre": "Curl Zottman",
            "musculo": "Bíceps",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Sujeta una mancuerna en cada mano con las palmas hacia arriba.",
                "Realiza un curl llevando las mancuernas hacia los hombros.",
                "Gira las palmas hacia abajo en la parte superior del movimiento.",
                "Baja lentamente las mancuernas con las palmas hacia abajo.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-seated-zottman-curl.gif",
            "objetivo": "Trabajar tanto el bíceps como el braquiorradial",
        },
        {
            "nombre": "Curl con mancuerna inclinado hacia adelante",
            "musculo": "Bíceps",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Inclínate hacia adelante mientras sostienes una mancuerna en cada mano.",
                "Mantén los codos estables y realiza un curl, levantando las mancuernas hacia los hombros.",
                "Haz una pausa en la parte superior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-bent-over-curl.gif",
            "objetivo": "Trabajar el bíceps y aumentar su definición",
        },
        {
            "nombre": "Curl de concentración con mancuerna",
            "musculo": "Bíceps",
            "equipamento": "Mancuerna",
            "instrucciones": [
                "Siéntate en un banco y coloca el codo de tu brazo de trabajo en la parte interna del muslo.",
                "Sujeta una mancuerna con la palma hacia arriba.",
                "Realiza un curl levantando la mancuerna hacia tu hombro.",
                "Haz una pausa en la parte superior y luego regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de brazo."
            ],
            "imagen": "dumbbell-concentration-curl.gif",
            "objetivo": "Aislar el bíceps y mejorar la definición",
        },
        {
            "nombre": "Curl de bíceps en predicador con barra EZ",
            "musculo": "Bíceps",
            "equipamento": "Barra EZ",
            "instrucciones": [
                "Coloca tus brazos en la almohadilla de la máquina de predicador.",
                "Sujeta una barra EZ con un agarre supino.",
                "Realiza un curl llevando la barra hacia los hombros.",
                "Haz una pausa en la parte superior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "ez-bar-preacher-curl.gif",
            "objetivo": "Aislar los bíceps y mejorar su pico",
        },
        {
            "nombre": "Encogimiento de muñeca con mancuerna",
            "musculo": "Bíceps y antebrazo",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Siéntate en un banco con una mancuerna en cada mano.",
                "Deja que las muñecas cuelguen del borde con las palmas hacia arriba.",
                "Flexiona las muñecas hacia arriba lo más alto posible.",
                "Haz una pausa y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-wrist-curl.gif",
            "objetivo": "Fortalecer los antebrazos y los bíceps",
        },
                {
            "nombre": "Curl de bíceps por encima de la cabeza",
            "musculo": "Bíceps",
            "equipamento": "Polea",
            "instrucciones": [
                "Ajusta las poleas a una posición alta y sujeta las manijas con ambas manos.",
                "Párate en el centro con los brazos extendidos hacia los lados.",
                "Realiza un curl llevando las manijas hacia la parte superior de tu cabeza.",
                "Haz una pausa en la parte superior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "overhead-cable-curl.gif",
            "objetivo": "Trabajar la cabeza larga del bíceps para desarrollar tamaño y definición",
        },
            {
            "nombre": "Curl de bíceps lateral",
            "musculo": "Bíceps",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Sujeta una mancuerna en cada mano con las palmas hacia adelante.",
                "Levanta ambas mancuernas hacia los lados en un movimiento de curl.",
                "Mantén los codos cerca del torso mientras subes las pesas.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "lateral-bicep-curls.gif",
            "objetivo": "Fortalecer el bíceps enfocándose en su cabeza larga",
        },
         {
        "nombre": "Curl martillo con mancuerna",
        "musculo": "Bíceps",
        "equipamento": "Mancuernas",
        "instrucciones": [
            "Sujeta una mancuerna en cada mano con un agarre neutro (palmas enfrentadas).",
            "Levanta ambas mancuernas hacia los hombros manteniendo el agarre neutro.",
            "Haz una pausa en la parte superior y baja lentamente las mancuernas.",
            "Repite el número deseado de repeticiones."
        ],
        "imagen": "dumbbell-hammer-curl.gif",
        "objetivo": "Fortalecer el braquiorradial y los bíceps",
    },
    {
        "nombre": "Curl de araña",
        "musculo": "Bíceps",
        "equipamento": "Mancuernas",
        "instrucciones": [
            "Acuéstate boca abajo en un banco inclinado y sujeta una mancuerna en cada mano.",
            "Deja que los brazos cuelguen perpendicularmente al suelo.",
            "Levanta las mancuernas hacia los hombros mientras contraes los bíceps.",
            "Haz una pausa en la parte superior y baja lentamente las mancuernas.",
            "Repite el número deseado de repeticiones."
        ],
        "imagen": "spider-curls.gif",
        "objetivo": "Aislar y fortalecer los bíceps desde un ángulo único",
    },
                # Add other biceps exercises here...
            ]
        },
        {
            "base_url": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Calves/",
            "ejercicios": [
             {
            "nombre": "Elevación de pantorrillas sentado",
            "musculo": "Pantorrillas",
            "equipamento": "Máquina",
            "instrucciones": [
                "Siéntate en la máquina con las puntas de los pies apoyadas en la plataforma.",
                "Ajusta el acolchado sobre tus muslos y libera el seguro de la máquina.",
                "Levanta los talones lo más alto posible mientras mantienes la tensión en las pantorrillas.",
                "Haz una pausa en la parte superior y luego baja lentamente los talones hasta la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "seated-calf-raise.gif",
            "objetivo": "Fortalecer el sóleo y los músculos de las pantorrillas",
        },
        {
            "nombre": "Elevación de pantorrillas a una pierna",
            "musculo": "Pantorrillas",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Colócate de pie en un escalón o plataforma con el talón sobresaliendo.",
                "Apóyate en una superficie estable para equilibrarte.",
                "Levanta una pierna, dejando el peso sobre la otra.",
                "Eleva el talón de la pierna de apoyo lo más alto posible.",
                "Haz una pausa y luego baja lentamente el talón hasta la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "single-leg-calf-raise.gif",
            "objetivo": "Aumentar fuerza y estabilidad en las pantorrillas de manera unilateral",
        },
                # Add other calves exercises here...
            ]
        },
        # Add more muscle groups here...

        {
            "base_url": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Core/",
            "ejercicios" : [
        {
            "nombre": "Abdominales mariposa",
            "musculo": "Core",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Acuéstate en el suelo con las plantas de los pies juntas y las rodillas hacia los lados.",
                "Coloca las manos detrás de la cabeza o en el pecho.",
                "Levanta el torso hacia las piernas contrayendo los abdominales.",
                "Baja lentamente de vuelta a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "butterfly-sit-up.gif",
            "objetivo": "Fortalecer los músculos abdominales",
        },
        {
            "nombre": "Crunch en polea de rodillas",
            "musculo": "Core",
            "equipamento": "Polea",
            "instrucciones": [
                "Ajusta una polea alta con una cuerda y arrodíllate frente a ella.",
                "Sujeta la cuerda con ambas manos a la altura de la cabeza.",
                "Inclina el torso hacia abajo contrayendo los abdominales.",
                "Regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "cable-knee-crunch.gif",
            "objetivo": "Trabajar los músculos abdominales superiores",
        },
        {
            "nombre": "Elevación de piernas en silla romana",
            "musculo": "Core",
            "equipamento": "Silla romana",
            "instrucciones": [
                "Apóyate en la silla romana con los antebrazos y la espalda firmemente contra el respaldo.",
                "Levanta las piernas rectas o ligeramente dobladas hacia el pecho.",
                "Haz una pausa y luego baja lentamente las piernas a la posición inicial.",
                "Evita balancearte y mantén el control durante todo el movimiento.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "captains-chair-leg-raise.gif",
            "objetivo": "Fortalecer los músculos abdominales inferiores",
        },
        {
            "nombre": "Crunch en el suelo",
            "musculo": "Core",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Acuéstate en el suelo con las rodillas dobladas y los pies planos en el suelo.",
                "Coloca las manos detrás de la cabeza o cruzadas sobre el pecho.",
                "Levanta el torso contrayendo los abdominales.",
                "Haz una pausa en la parte superior y luego regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "crunch-floor.gif",
            "objetivo": "Fortalecer los músculos abdominales superiores",
        },
        {
            "nombre": "Abdominales en declive",
            "musculo": "Core",
            "equipamento": "Banco declinado",
            "instrucciones": [
                "Ajusta un banco en declive y siéntate con los pies asegurados.",
                "Cruza las manos sobre el pecho o colócalas detrás de la cabeza.",
                "Levanta el torso contrayendo los abdominales.",
                "Haz una pausa en la parte superior y luego baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "decline-sit-up.gif",
            "objetivo": "Trabajar los abdominales superiores e inferiores",
        },
        {
            "nombre": "Plancha",
            "musculo": "Core",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Colócate en una posición de plancha apoyando los antebrazos y los pies en el suelo.",
                "Mantén el cuerpo en línea recta desde la cabeza hasta los pies.",
                "Aprieta los músculos abdominales y mantén la posición durante el tiempo deseado.",
                "Evita que las caderas caigan o se eleven demasiado."
            ],
            "imagen": "plank.gif",
            "objetivo": "Fortalecer el core y mejorar la estabilidad general",
        },
        {
            "nombre": "Lat Pulldown con agarre ancho",
            "musculo": "Core y dorsales",
            "equipamento": "Máquina de polea",
            "instrucciones": [
                "Siéntate en la máquina con las rodillas aseguradas y sujeta la barra con un agarre ancho.",
                "Jala la barra hacia el pecho manteniendo los codos hacia abajo y apretando los músculos del core.",
                "Haz una pausa y luego regresa lentamente la barra a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "wide-grip-lat-pulldown.gif",
            "objetivo": "Fortalecer el core mientras trabajas los dorsales",
        },

        {
            "base_url": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Forearms/",
            "ejercicios" : [
        {
            "nombre": "Curl de muñeca detrás de la espalda",
            "musculo": "Antebrazos",
            "equipamento": "Barra",
            "instrucciones": [
                "Sujeta una barra con las palmas hacia arriba detrás de tu espalda.",
                "Deja que las muñecas cuelguen por completo.",
                "Levanta la barra flexionando las muñecas lo más alto posible.",
                "Haz una pausa y luego baja lentamente la barra.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "behind-the-back-wrist-curl.gif",
            "objetivo": "Fortalecer los músculos flexores del antebrazo",
        },
        {
            "nombre": "Curl de muñeca con mancuerna",
            "musculo": "Antebrazos",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Siéntate en un banco con una mancuerna en cada mano.",
                "Apoya los antebrazos en los muslos con las muñecas extendiéndose más allá del borde.",
                "Flexiona las muñecas hacia arriba levantando las mancuernas.",
                "Haz una pausa y luego baja lentamente las mancuernas.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-wrist-curl.gif",
            "objetivo": "Fortalecer los flexores del antebrazo",
        },
        {
            "nombre": "Curl inverso con barra EZ",
            "musculo": "Antebrazos",
            "equipamento": "Barra EZ",
            "instrucciones": [
                "Sujeta una barra EZ con un agarre prono (palmas hacia abajo).",
                "Mantén los codos cerca del torso y realiza un curl levantando la barra hacia los hombros.",
                "Haz una pausa en la parte superior y luego baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "ez-bar-reverse-grip-curl.gif",
            "objetivo": "Fortalecer los extensores del antebrazo y el braquiorradial",
        },
    ]
            

        }
    ]
           

        }, {
            "base_url": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Glutes/",
             "ejercicios" : [
        {
            "nombre": "Empuje de cadera en posición B",
            "musculo": "Glúteos",
            "equipamento": "Banco y barra",
            "instrucciones": [
                "Apoya la parte superior de tu espalda en un banco estable.",
                "Coloca los pies en el suelo, separados a la anchura de los hombros, con un pie más adelantado que el otro.",
                "Coloca una barra sobre tus caderas y estabilízala con las manos.",
                "Empuja las caderas hacia arriba contrayendo los glúteos.",
                "Haz una pausa en la parte superior y baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "b-stance-hip-thrust.gif",
            "objetivo": "Fortalecer los glúteos y mejorar la estabilidad unilateral",
        },
        {
            "nombre": "Empuje de cadera con cable",
            "musculo": "Glúteos",
            "equipamento": "Polea",
            "instrucciones": [
                "Coloca una correa de tobillo en la polea baja y sujeta el cable a un tobillo.",
                "Inclínate ligeramente hacia adelante apoyándote en una superficie estable.",
                "Extiende la pierna hacia atrás contrayendo los glúteos.",
                "Haz una pausa en la parte superior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "cable-pull-through.gif",
            "objetivo": "Fortalecer los glúteos con resistencia constante",
        },
        {
            "nombre": "Peso muerto con déficit",
            "musculo": "Glúteos",
            "equipamento": "Barra",
            "instrucciones": [
                "Párate sobre una plataforma para aumentar el rango de movimiento.",
                "Sujeta una barra con un agarre prono, ligeramente más ancho que los hombros.",
                "Inclina las caderas hacia atrás y baja la barra mientras mantienes la espalda recta.",
                "Empuja las caderas hacia adelante para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "deficit-deadlift.gif",
            "objetivo": "Fortalecer los glúteos y los isquiotibiales mientras mejoras el rango de movimiento",
        },
        {
            "nombre": "Empuje de cadera estilo rana",
            "musculo": "Glúteos",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Acuéstate en el suelo con las plantas de los pies juntas y las rodillas hacia los lados.",
                "Empuja las caderas hacia arriba contrayendo los glúteos.",
                "Haz una pausa en la parte superior y luego baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "frog-hip-thrust.gif",
            "objetivo": "Aislar los glúteos en una posición de abducción",
        },
        {
            "nombre": "Empuje de cadera a una pierna",
            "musculo": "Glúteos",
            "equipamento": "Banco",
            "instrucciones": [
                "Apoya la parte superior de tu espalda en un banco estable y levanta una pierna.",
                "Empuja las caderas hacia arriba con la pierna de apoyo contrayendo los glúteos.",
                "Haz una pausa en la parte superior y baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "single-leg-hip-thrust-muscles.gif",
            "objetivo": "Fortalecer los glúteos y mejorar el equilibrio",
        },
        {
            "nombre": "Peso muerto con piernas rectas",
            "musculo": "Glúteos",
            "equipamento": "Barra",
            "instrucciones": [
                "Sujeta una barra con un agarre prono y mantén las piernas rectas pero no bloqueadas.",
                "Inclina las caderas hacia atrás y baja la barra manteniendo la espalda recta.",
                "Empuja las caderas hacia adelante para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "straight-leg-deadlift.gif",
            "objetivo": "Trabajar los glúteos y los isquiotibiales",
        },
    ]

        }, 

        {
            "base_url": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Harmstring/Hamstring/",
             "ejercicios" : [
        {
            "nombre": "Empuje de cadera con cable",
            "musculo": "Isquiotibiales",
            "equipamento": "Polea",
            "instrucciones": [
                "Coloca una correa de tobillo en la polea baja y sujeta el cable a un tobillo.",
                "Inclínate ligeramente hacia adelante apoyándote en una superficie estable.",
                "Extiende la pierna hacia atrás contrayendo los glúteos y los isquiotibiales.",
                "Haz una pausa en la parte superior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "cable-pull-through.gif",
            "objetivo": "Fortalecer los isquiotibiales y glúteos con resistencia constante",
        },
        {
            "nombre": "Peso muerto con déficit",
            "musculo": "Isquiotibiales",
            "equipamento": "Barra",
            "instrucciones": [
                "Párate sobre una plataforma para aumentar el rango de movimiento.",
                "Sujeta una barra con un agarre prono, ligeramente más ancho que los hombros.",
                "Inclina las caderas hacia atrás y baja la barra mientras mantienes la espalda recta.",
                "Empuja las caderas hacia adelante para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "deficit-deadlift.gif",
            "objetivo": "Fortalecer los isquiotibiales y los glúteos mientras mejoras el rango de movimiento",
        },
        {
            "nombre": "Peso muerto con kettlebell",
            "musculo": "Isquiotibiales",
            "equipamento": "Kettlebell",
            "instrucciones": [
                "Párate con los pies separados al ancho de los hombros y una kettlebell en el suelo frente a ti.",
                "Inclina las caderas hacia atrás y baja el torso para sujetar la kettlebell con ambas manos.",
                "Empuja las caderas hacia adelante para levantar la kettlebell manteniendo la espalda recta.",
                "Haz una pausa en la parte superior y baja lentamente la kettlebell a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "how-to-kettlebell-deadlift.gif",
            "objetivo": "Fortalecer los isquiotibiales, glúteos y zona lumbar",
        },
        {
            "nombre": "Curl de pierna acostado",
            "musculo": "Isquiotibiales",
            "equipamento": "Máquina de curl de pierna",
            "instrucciones": [
                "Acuéstate boca abajo en la máquina de curl de pierna y ajusta el rodillo sobre los tobillos.",
                "Flexiona las rodillas para levantar el rodillo hacia los glúteos.",
                "Haz una pausa en la parte superior y baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "lying-leg-curl.gif",
            "objetivo": "Fortalecer los isquiotibiales de forma aislada",
        },
        {
            "nombre": "Curl de pierna sentado",
            "musculo": "Isquiotibiales",
            "equipamento": "Máquina de curl de pierna",
            "instrucciones": [
                "Siéntate en la máquina y ajusta el rodillo sobre los tobillos.",
                "Flexiona las rodillas para mover el rodillo hacia abajo.",
                "Haz una pausa en la parte inferior y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "seated-leg-curl.gif",
            "objetivo": "Fortalecer los isquiotibiales de forma controlada",
        },
        {
            "nombre": "Peso muerto con piernas rectas",
            "musculo": "Isquiotibiales",
            "equipamento": "Barra",
            "instrucciones": [
                "Sujeta una barra con un agarre prono y mantén las piernas rectas pero no bloqueadas.",
                "Inclina las caderas hacia atrás y baja la barra manteniendo la espalda recta.",
                "Empuja las caderas hacia adelante para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "straight-leg-deadlift.gif",
            "objetivo": "Fortalecer los isquiotibiales y glúteos",
        },
    ]


        } , {
            "base_url" : "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Legs/",
              # Exercise data
    "ejercicios" : [
        {
            "nombre": "Sentadilla con peso corporal",
            "musculo": "Piernas",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Párate con los pies separados al ancho de los hombros.",
                "Baja las caderas hacia atrás y hacia abajo hasta que los muslos estén paralelos al suelo.",
                "Mantén el pecho erguido y las rodillas alineadas con los pies.",
                "Empuja a través de los talones para volver a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "bodyweight-squat.gif",
            "objetivo": "Fortalecer cuádriceps, glúteos e isquiotibiales",
        },
        {
            "nombre": "Split squat con mancuerna",
            "musculo": "Piernas",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Sujeta una mancuerna en cada mano y da un paso hacia adelante.",
                "Baja el cuerpo doblando ambas rodillas, manteniendo el torso recto.",
                "Empuja con el pie delantero para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "dumbbell-split-squat.gif",
            "objetivo": "Fortalecer cuádriceps, glúteos e isquiotibiales",
        },
        {
            "nombre": "Sentadilla sumo con mancuerna",
            "musculo": "Piernas",
            "equipamento": "Mancuerna",
            "instrucciones": [
                "Sujeta una mancuerna con ambas manos y coloca los pies más anchos que los hombros.",
                "Baja las caderas hacia abajo mientras mantienes el pecho erguido.",
                "Haz una pausa y empuja hacia arriba a través de los talones.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-sumo-squat.gif",
            "objetivo": "Fortalecer cuádriceps, glúteos y aductores",
        },
        {
            "nombre": "Estiramiento de músculos en posición de arrodillado",
            "musculo": "Piernas",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Arrodíllate en el suelo con una pierna hacia adelante.",
                "Empuja las caderas hacia adelante para estirar el músculo del muslo trasero.",
                "Mantén la posición durante 15-30 segundos y cambia de pierna."
            ],
            "imagen": "kneeling-lunge-stretch-muscles.gif",
            "objetivo": "Mejorar la flexibilidad y la movilidad de los músculos de las piernas",
        },
        {
            "nombre": "Extensión de piernas en máquina",
            "musculo": "Piernas",
            "equipamento": "Máquina de extensión de piernas",
            "instrucciones": [
                "Siéntate en la máquina y ajusta el rodillo para que quede sobre tus tobillos.",
                "Extiende las piernas hacia adelante completamente.",
                "Haz una pausa y baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "leg-extension-machine.gif",
            "objetivo": "Aislar y fortalecer los cuádriceps",
        },
        {
            "nombre": "Prensa de pierna",
            "musculo": "Piernas",
            "equipamento": "Máquina de prensa de pierna",
            "instrucciones": [
                "Siéntate en la máquina de prensa de pierna y coloca los pies en la plataforma.",
                "Empuja la plataforma hacia arriba extendiendo las piernas, sin bloquear las rodillas.",
                "Baja lentamente la plataforma hasta que las rodillas estén en un ángulo de 90 grados.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "leg-press.gif",
            "objetivo": "Fortalecer cuádriceps, glúteos e isquiotibiales",
        },
        {
            "nombre": "Sentadilla pistol",
            "musculo": "Piernas",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Párate sobre una pierna con la otra pierna extendida hacia adelante.",
                "Baja lentamente el cuerpo hacia abajo doblando la pierna de apoyo.",
                "Empuja hacia arriba a través del talón para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "pistol-squat-muscles.gif",
            "objetivo": "Fortalecer piernas y mejorar el equilibrio",
        },
        {
            "nombre": "Lunge con déficit inverso",
            "musculo": "Piernas",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Párate en una plataforma y da un paso hacia atrás con una pierna.",
                "Baja el cuerpo doblando ambas rodillas hasta que la pierna trasera toque el suelo.",
                "Empuja con el pie delantero para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de pierna."
            ],
            "imagen": "reverse-deficit-lunge.gif",
            "objetivo": "Fortalecer cuádriceps, glúteos e isquiotibiales",
        },
        {
            "nombre": "Sentadilla isométrica de 2 segundos",
            "musculo": "Piernas",
            "equipamento": "Peso corporal",
            "instrucciones": [
                "Párate con los pies separados al ancho de los hombros.",
                "Baja las caderas hacia abajo hasta que los muslos estén paralelos al suelo.",
                "Mantén la posición durante 2 segundos antes de regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "squat-hold-2-seconds.gif",
            "objetivo": "Fortalecer cuádriceps y mejorar la resistencia",
        },
        {
            "nombre": "Peso muerto con piernas rectas",
            "musculo": "Piernas",
            "equipamento": "Barra",
            "instrucciones": [
                "Sujeta una barra con un agarre prono y mantén las piernas rectas pero no bloqueadas.",
                "Inclina las caderas hacia atrás y baja la barra manteniendo la espalda recta.",
                "Empuja las caderas hacia adelante para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "straight-leg-deadlift.gif",
            "objetivo": "Fortalecer glúteos e isquiotibiales",
        },
        {
            "nombre": "V Squat",
            "musculo": "Piernas",
            "equipamento": "Máquina",
            "instrucciones": json.dumps([
                "Colócate en la máquina V Squat con los pies en la plataforma.",
                "Ajusta la posición para que los hombros estén asegurados debajo de los acolchados.",
                "Baja el cuerpo doblando las rodillas hasta que los muslos estén paralelos al suelo.",
                "Empuja a través de los talones para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ], ensure_ascii=False),
            "imagen": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Legs/v-squat.gif",
            "objetivo": "Fortalecer los cuádriceps, glúteos y mejorar la estabilidad en las piernas."},
        {
        "nombre": "Dumbbell Squat",
        "musculo": "Piernas",
        "equipamento": "Mancuernas",
        "instrucciones": json.dumps([
            "Toma una mancuerna en cada mano y mantén los brazos extendidos a los lados del cuerpo.",
            "Coloca los pies a la altura de los hombros con las puntas ligeramente hacia afuera.",
            "Dobla las rodillas y baja las caderas hacia abajo y hacia atrás como si estuvieras sentado en una silla.",
            "Mantén el peso en los talones mientras bajas, asegurándote de que las rodillas no sobrepasen los dedos de los pies.",
            "Empuja hacia arriba a través de los talones para regresar a la posición inicial.",
            "Repite el número deseado de repeticiones."
        ], ensure_ascii=False),
        "imagen": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Legs/dumbbell-squat.gif",
        "objetivo": "Fortalecer los cuádriceps, glúteos y estabilizar los músculos de las piernas."
    },

    ]

        } , {
            base_url: "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Shoulders/",
            ejercicios: [
                 {
            "nombre": "Press Arnold",
            "musculo": "Hombros",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Sujeta una mancuerna en cada mano a la altura de los hombros con las palmas mirando hacia ti.",
                "Empuja las mancuernas hacia arriba mientras giras las muñecas, terminando con las palmas mirando hacia afuera.",
                "Baja las mancuernas lentamente a la posición inicial invirtiendo el movimiento.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "arnold-presses.gif",
            "objetivo": "Fortalecer los deltoides y mejorar la movilidad del hombro",
        },
        {
            "nombre": "Jalón de cara con banda",
            "musculo": "Hombros",
            "equipamento": "Banda",
            "instrucciones": [
                "Sujeta una banda a una superficie estable a la altura del pecho.",
                "Agarra los extremos de la banda con ambas manos con las palmas hacia abajo.",
                "Jala la banda hacia tu cara mientras mantienes los codos hacia afuera.",
                "Haz una pausa en la contracción y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "banded-face-pull.gif",
            "objetivo": "Fortalecer la parte trasera del deltoide y mejorar la postura",
        },
        {
            "nombre": "Remo vertical con barra de pie",
            "musculo": "Hombros",
            "equipamento": "Barra",
            "instrucciones": [
                "Sujeta una barra con un agarre prono a la anchura de los hombros.",
                "Levanta la barra hacia la barbilla manteniendo los codos hacia arriba y hacia afuera.",
                "Haz una pausa en la parte superior y baja lentamente la barra.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "barbell-upright-row-standing.gif",
            "objetivo": "Fortalecer los deltoides laterales y el trapecio",
        },
        {
            "nombre": "Elevación lateral con cable a un brazo",
            "musculo": "Hombros",
            "equipamento": "Polea",
            "instrucciones": [
                "Coloca el mango de la polea baja en una mano.",
                "Levanta el brazo hacia un lado hasta que esté paralelo al suelo.",
                "Haz una pausa y baja lentamente el brazo a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de brazo."
            ],
            "imagen": "cable-one-arm-lateral-raise.gif",
            "objetivo": "Fortalecer los deltoides laterales",
        },
        {
            "nombre": "Variaciones de elevación lateral con mancuerna",
            "musculo": "Hombros",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Sujeta una mancuerna en cada mano con los brazos a los costados.",
                "Levanta ambos brazos hacia los lados hasta que estén paralelos al suelo.",
                "Haz una pausa en la parte superior y baja lentamente las mancuernas.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "dumbbell-lateral-raise-variations.gif",
            "objetivo": "Aislar y fortalecer los deltoides laterales",
        },
        {
            "nombre": "Press de hombros en máquina",
            "musculo": "Hombros",
            "equipamento": "Máquina",
            "instrucciones": [
                "Siéntate en la máquina y ajusta la posición de los agarres.",
                "Empuja los agarres hacia arriba hasta que los brazos estén completamente extendidos.",
                "Baja lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "machine-shoulder-press.gif",
            "objetivo": "Fortalecer los deltoides con apoyo",
        },
        {
            "nombre": "Press militar",
            "musculo": "Hombros",
            "equipamento": "Barra",
            "instrucciones": [
                "Sujeta una barra con un agarre prono a la altura de los hombros.",
                "Empuja la barra hacia arriba hasta que los brazos estén completamente extendidos.",
                "Baja la barra lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "military-press.gif",
            "objetivo": "Fortalecer los deltoides y el trapecio superior",
        },
        {
            "nombre": "Elevación trasera sentado con mancuerna",
            "musculo": "Hombros",
            "equipamento": "Mancuernas",
            "instrucciones": [
                "Siéntate en un banco y sujeta una mancuerna en cada mano.",
                "Inclina el torso hacia adelante hasta que quede paralelo al suelo.",
                "Levanta los brazos hacia los lados mientras mantienes un ligero arco en los codos.",
                "Haz una pausa en la parte superior y baja lentamente las mancuernas.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "seated-reverse-fly.gif",
            "objetivo": "Fortalecer la parte trasera del deltoide",
        },
        {
            "nombre": "Press con barra en landmine",
            "musculo": "Hombros",
            "equipamento": "Landmine y barra",
            "instrucciones": [
                "Sujeta el extremo de una barra asegurada en una landmine.",
                "Empuja la barra hacia arriba con un brazo hasta que esté completamente extendido.",
                "Baja lentamente la barra a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de brazo."
            ],
            "imagen": "standing-landmine-press.gif",
            "objetivo": "Fortalecer los deltoides y el core",
        },
        {
            "nombre": "Press de hombros en máquina Smith",
            "musculo": "Hombros",
            "equipamento": "Máquina Smith",
            "instrucciones": [
                "Sujeta la barra de la máquina Smith a la altura de los hombros.",
                "Empuja la barra hacia arriba hasta que los brazos estén completamente extendidos.",
                "Baja lentamente la barra a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "standing-smith-machine-shoulder-press.gif",
            "objetivo": "Fortalecer los deltoides con soporte de la máquina",
        },


            ]


        }, {

           "base_url": "https://storage.googleapis.com/gifs_exercises_regional/Gifs%20exercises/Triceps/" ,
           "ejercicios": [
                {
            "nombre": "Dips en banco",
            "musculo": "Tríceps",
            "equipamento": "Banco",
            "instrucciones": [
                "Siéntate en el borde de un banco con las manos apoyadas a los lados.",
                "Extiende las piernas frente a ti con los talones apoyados en el suelo.",
                "Desciende el cuerpo doblando los codos hasta que los brazos formen un ángulo de 90 grados.",
                "Empuja hacia arriba con los brazos para regresar a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "bench-dip.gif",
            "objetivo": "Fortalecer los tríceps y mejorar la estabilidad del hombro",
        },
        {
            "nombre": "Patada de tríceps con cable",
            "musculo": "Tríceps",
            "equipamento": "Polea",
            "instrucciones": [
                "Coloca un mango en la polea alta y sujétalo con una mano.",
                "Inclínate ligeramente hacia adelante con la espalda recta.",
                "Extiende el brazo hacia atrás mientras contraes el tríceps.",
                "Haz una pausa y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones y cambia de brazo."
            ],
            "imagen": "cable-tricep-kickback.gif",
            "objetivo": "Fortalecer los tríceps con resistencia constante",
        },
        {
            "nombre": "Press de banca con agarre cerrado",
            "musculo": "Tríceps",
            "equipamento": "Barra",
            "instrucciones": [
                "Acuéstate en un banco plano y sujeta una barra con un agarre estrecho.",
                "Baja la barra hacia el pecho manteniendo los codos cerca del cuerpo.",
                "Empuja la barra hacia arriba hasta que los brazos estén completamente extendidos.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "close-grip-bench-press-movement.gif",
            "objetivo": "Fortalecer los tríceps, pectorales y deltoides",
        },
        {
            "nombre": "Skull crusher en banco plano",
            "musculo": "Tríceps",
            "equipamento": "Barra EZ",
            "instrucciones": [
                "Acuéstate en un banco plano sujetando una barra EZ con un agarre prono.",
                "Baja lentamente la barra hacia la frente doblando los codos.",
                "Extiende los brazos hacia arriba regresando a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "flat-bench-skull-crusher.gif",
            "objetivo": "Fortalecer los tríceps de manera aislada",
        },
        {
            "nombre": "Skull crusher inclinado",
            "musculo": "Tríceps",
            "equipamento": "Barra EZ",
            "instrucciones": [
                "Acuéstate en un banco inclinado sujetando una barra EZ con un agarre prono.",
                "Baja lentamente la barra hacia la frente doblando los codos.",
                "Extiende los brazos hacia arriba regresando a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "incline-skullcrusher.gif",
            "objetivo": "Fortalecer los tríceps desde un ángulo diferente",
        },
        {
            "nombre": "Extensión de tríceps con cable por encima de la cabeza",
            "musculo": "Tríceps",
            "equipamento": "Polea",
            "instrucciones": [
                "Sujeta un mango en la polea alta con ambas manos.",
                "Da un paso adelante y extiende los brazos por encima de la cabeza.",
                "Dobla los codos para llevar el mango detrás de la cabeza.",
                "Extiende los brazos nuevamente regresando a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "overhead-cable-tricep-extension.gif",
            "objetivo": "Fortalecer los tríceps con enfoque en la cabeza larga",
        },
        {
            "nombre": "Extensión de tríceps por encima de la cabeza",
            "musculo": "Tríceps",
            "equipamento": "Mancuerna",
            "instrucciones": [
                "Sujeta una mancuerna con ambas manos por detrás de la cabeza.",
                "Extiende los brazos hacia arriba completamente.",
                "Baja lentamente la mancuerna detrás de la cabeza doblando los codos.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "tricep-overhead-extensions.gif",
            "objetivo": "Fortalecer los tríceps con un movimiento completo",
        },
        {
            "nombre": "Pushdown de tríceps con barra en V",
            "musculo": "Tríceps",
            "equipamento": "Polea",
            "instrucciones": [
                "Sujeta una barra en V conectada a la polea alta.",
                "Empuja la barra hacia abajo hasta que los brazos estén completamente extendidos.",
                "Haz una pausa y regresa lentamente a la posición inicial.",
                "Repite el número deseado de repeticiones."
            ],
            "imagen": "v-bar-tricep-pushdown.gif",
            "objetivo": "Fortalecer los tríceps con enfoque en la cabeza lateral",
        },
           ]


        }



    ]

    # Loop through the data and populate exercises
    for group in data:
        base_url = group["base_url"]
        ejercicios = group["ejercicios"]

        for ejercicio_data in ejercicios:
            imagen_url = f"{base_url}{ejercicio_data['imagen']}"
            Ejercicio.objects.update_or_create(
                nombre=ejercicio_data["nombre"],
                defaults={
                    "musculo": ejercicio_data["musculo"],
                    "equipamento": ejercicio_data["equipamento"],
                    "instrucciones": json.dumps(ejercicio_data["instrucciones"], ensure_ascii=False),
                    "imagen": imagen_url,
                    "objetivo": ejercicio_data["objetivo"],
                }
            )


class Migration(migrations.Migration):
    dependencies = [
        ('routine_app', '0001_initial'),  # Adjust to your latest migration
    ]

    operations = [
        migrations.RunPython(populate_ejercicios),
    ]
