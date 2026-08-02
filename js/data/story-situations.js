/**
 * ZoneReact - Data: Situaciones Exclusivas del Modo Historia (10 Niveles Estilo Overcooked)
 * "Salvar a tu mejor amigo (Lucas)"
 */
window.ZR = window.ZR || {};

window.ZR.storySituations = [
  {
    id: 1,
    levelNumber: 1,
    title: '"Aprobar exámenes"',
    tag: 'Nivel 1 · Presión de estudio / Vapeo',
    tagColor: 'red',
    context: 'Lucas está muy estresado por los exámenes finales. Te propone desvelarse en su casa estudiando y te muestra un vape sabor menta diciendo: "Con esto nos mantendremos despiertos toda la noche sin cansarnos".',
    tip: 'El vapeo contiene nicotina y sustancias tóxicas que dañan tu cerebro en desarrollo. El descanso es fundamental para rendir bien.',
    emoji: '🏠',
    mapPosition: { x: 95, y: 430 }, // Casa HOME - inicio izquierda
    options: [
      {
        letter: 'A',
        text: 'Aceptas el vape solo por esta noche para poder estudiar más tiempo',
        score: -10,
        isCorrect: false,
        feedback: 'El vapeo genera adicción rápida y afecta tus pulmones y atención. Usarlo para estudiar es un riesgo grave.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"Ninguna sustancia reemplaza un hábito de estudio y descanso saludable."'
      },
      {
        letter: 'B',
        text: 'Rechazas el vape y estudias solo un momento antes de ir a descansar',
        score: 5,
        isCorrect: true,
        feedback: '¡Bien por rechazar el vape! Evitaste la sustancia y cuidaste tu salud.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Saber decir no a las sustancias protege tu salud y tu futuro."'
      },
      {
        letter: 'C',
        text: 'Propones consumir bebidas energizantes en exceso para no usar el vape',
        score: -5,
        isCorrect: false,
        feedback: 'Las energizantes en exceso provocan taquicardia y ansiedad antes de un examen.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"El exceso de cafeína y taurina altera tu sistema nervioso."'
      },
      {
        letter: 'D',
        text: 'Convences a Lucas de repasar lo importante e irse a dormir antes de medianoche',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente decisión! Dormir 8 horas garantiza un rendimiento óptimo en los exámenes sin recurrir a sustancias.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"El descanso adecuado y la planificación son la verdadera clave del éxito."'
      }
    ]
  },
  {
    id: 2,
    levelNumber: 2,
    title: '"El vape en el parque"',
    tag: 'Nivel 2 · Presión de pares en el parque',
    tagColor: 'yellow',
    context: 'En el parque del barrio, unos chicos mayores se acercan a Lucas y le ofrecen probar un cigarrillo electrónico nuevo. Lucas te mira indeciso buscando tu aprobación.',
    tip: 'La presión social en lugares públicos puede ser fuerte. Tu firmeza ayuda a tus amigos a no ceder.',
    emoji: '🛝',
    mapPosition: { x: 255, y: 240 }, // Parque - curva arriba
    options: [
      {
        letter: 'A',
        text: 'Le dices a Lucas que pruebe un poco para no quedar mal con los mayores',
        score: -10,
        isCorrect: false,
        feedback: 'Ceder a la presión social por encajar expone a Lucas a la adicción a la nicotina.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"Encajar en un grupo negativo jamás vale el costo de tu salud."'
      },
      {
        letter: 'B',
        text: 'Te quedas callado y dejas que Lucas decida por su cuenta',
        score: -5,
        isCorrect: false,
        feedback: 'Como mejor amigo, tu silencio puede interpretarse como aprobación del riesgo.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"El silencio frente a un peligro puede poner en riesgo a tus amigos."'
      },
      {
        letter: 'C',
        text: 'Dices con voz firme "No gracias, no consumimos eso" y propones ir a jugar cancha',
        score: 5,
        isCorrect: true,
        feedback: '¡Bien hecho! Expresar tu negativa con voz clara desvía la presión y protege a Lucas.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"La firmeza desactiva la presión social en un instante."'
      },
      {
        letter: 'D',
        text: 'Tomas del brazo a Lucas, le dices "Tenemos que ir a entrenar ya" y lo alejas del grupo',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente intervención! Sacar a Lucas de la situación de riesgo de inmediato previno cualquier consumo.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"Actuar a tiempo por un amigo es una verdadera muestra de lealtad."'
      }
    ]
  },
  {
    id: 3,
    levelNumber: 3,
    title: '"La invitación al lugar peligroso"',
    tag: 'Nivel 3 · Zonas de riesgo e ilegalidad',
    tagColor: 'blue',
    context: 'Al salir del colegio, unos conocidos invitan a Lucas a una fiesta en un pasaje solitario conocido por la venta ilegal de sustancias. Le aseguran que "no pasa nada si van en grupo".',
    tip: 'Las zonas donde se comercializan sustancias ilícitas conllevan riesgos de violencia, robos y consumo forzado.',
    emoji: '🏫',
    mapPosition: { x: 420, y: 420 }, // Colegio - curva abajo
    options: [
      {
        letter: 'A',
        text: 'Aceptan ir porque van acompañados de varios compañeros',
        score: -10,
        isCorrect: false,
        feedback: 'Ir en grupo no reduce el peligro de zonas con comercio ilegal de drogas.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"El riesgo de una zona peligrosa no disminuye por ir en grupo."'
      },
      {
        letter: 'B',
        text: 'Aceptan ir solo 15 minutos para curiosear y luego salir corriendo',
        score: -5,
        isCorrect: false,
        feedback: 'Estar aunque sea unos minutos en un entorno ilícito te expone a situaciones violentas e imprevistas.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Exponerte poco tiempo al peligro sigue siendo una mala decisión."'
      },
      {
        letter: 'C',
        text: 'Rechazas ir a ese lugar y sugieres ir a la cancha del colegio que es segura',
        score: 5,
        isCorrect: true,
        feedback: '¡Buena iniciativa! Proponer alternativas seguras demuestra liderazgo positivo.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Plantear lugares seguros cuida a todo el grupo."'
      },
      {
        letter: 'D',
        text: 'Adviertes a Lucas del peligro real de esa zona y lo convences de ir directo a casa',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente! Informar sobre los riesgos reales evita que Lucas tome decisiones impulsivas.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"La información clara y la prudencia salvan vidas."'
      }
    ]
  },
  {
    id: 4,
    levelNumber: 4,
    title: '"Presión en el kiosco"',
    tag: 'Nivel 4 · Alcohol y bebidas alteradas',
    tagColor: 'ink',
    context: 'En el kiosco cerca de la avenida, un conocido le insiste a Lucas para que pruebe una lata de bebida alcohólica combinada diciendo "Todos en el barrio ya tomaron esto, no seas infantil".',
    tip: 'El consumo precoz de alcohol afecta gravemente el desarrollo cerebral en la adolescencia y desinhibe conductas de riesgo.',
    emoji: '🏪',
    mapPosition: { x: 590, y: 210 }, // Kiosco - curva arriba
    options: [
      {
        letter: 'A',
        text: 'Dejas que Lucas tome unos sorbos para demostrar que ya es mayor',
        score: -10,
        isCorrect: false,
        feedback: 'El alcohol en adolescentes altera la toma de decisiones y daña el cerebro en crecimiento.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"La madurez se demuestra cuidando tu salud, no consumiendo alcohol."'
      },
      {
        letter: 'B',
        text: 'Le dices que acepte la bebida pero la guarde en su mochila sin tomarla',
        score: -5,
        isCorrect: false,
        feedback: 'Llevar sustancias alcohólicas contigo te mantiene expuesto a ser descubierto o consumirla más tarde.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Guardar una sustancia no te aleja del problema."'
      },
      {
        letter: 'C',
        text: 'Pides dos jugos de fruta en el kiosco y le das uno a Lucas cambiando de tema',
        score: 5,
        isCorrect: true,
        feedback: '¡Bien pensado! Cambiar de opción de forma natural evita el conflicto y mantiene el ambiente sano.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Elegir bebidas saludables es cuidar tu cuerpo con inteligencia."'
      },
      {
        letter: 'D',
        text: 'Le dices firmemente al vendedor que no consumen alcohol y te retiras con Lucas a un lugar seguro',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente determinación! Cortar la insistencia y retirarse de la zona de venta es la postura más segura.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"La determinación ante el consumo previene complicaciones futuras."'
      }
    ]
  },
  {
    id: 5,
    levelNumber: 5,
    title: '"Desconocido en la avenida"',
    tag: 'Nivel 5 · Prevención de robos y captación',
    tagColor: 'red',
    context: 'Caminando por la avenida principal, un sujeto desconocido se acerca a Lucas pidiéndole prestado el celular con la excusa de una emergencia familiar, mientras intenta llevarlo hacia un callejón solitario.',
    tip: 'Los delincuentes suelen usar historias conmovedoras para distraer o conducir a jóvenes hacia zonas desprotegidas.',
    emoji: '🛣️',
    mapPosition: { x: 730, y: 430 }, // Avenida - centro zigzag abajo
    options: [
      {
        letter: 'A',
        text: 'Lucas saca su celular y acompaña al desconocido al callejón para ayudarlo',
        score: -10,
        isCorrect: false,
        feedback: 'Acompañar a un desconocido a una zona oscura es sumamente peligroso y expone a un asalto o secuestro.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"Jamás te desvíes a zonas desiertas con personas desconocidas."'
      },
      {
        letter: 'B',
        text: 'Le prestas tu celular tú mismo en la calle sin moverte',
        score: -5,
        isCorrect: false,
        feedback: 'Exponer pertenencias de valor en la vía pública ante extraños favorece el arrebato rápido.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Protege tus pertenencias en la calle y mantén la distancia."'
      },
      {
        letter: 'C',
        text: 'Le indican al sujeto la ubicación de una caseta policial cercana y siguen caminando a paso firme',
        score: 5,
        isCorrect: true,
        feedback: '¡Bien decidido! Derivar a autoridades oficiales en lugares públicos protege tu integridad.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"La ayuda formal en lugares públicos es la opción segura."'
      },
      {
        letter: 'D',
        text: 'Le dices "No llevo celular" sin detenerte y entran de inmediato a una tienda transcurrida con gente',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente reacción! Mantener la marcha y buscar refugio en un establecimiento con gente anula el riesgo.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"Refugiarte en comercios concurridos es tu mejor escudo en la calle."'
      }
    ]
  },
  {
    id: 6,
    levelNumber: 6,
    title: '"El atajo a oscuras"',
    tag: 'Nivel 6 · Riesgo de ruta nocturna',
    tagColor: 'yellow',
    context: 'Anochece y Lucas sugiere tomar un pasaje sin alumbrado público para ahorrar 15 minutos de caminata hacia su casa.',
    tip: 'Las vías sin luz y poco transitadas son lugares preferidos por delincuentes para cometer ilícitos.',
    emoji: '🌙',
    mapPosition: { x: 870, y: 220 }, // Pasaje nocturno - curva arriba
    options: [
      {
        letter: 'A',
        text: 'Aceptas ir por el atajo oscuro corriendo para terminar rápido',
        score: -10,
        isCorrect: false,
        feedback: 'Correr a oscuras en un pasaje peligroso no impide que sufras una emboscada o accidente.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"La velocidad no reemplaza la falta de iluminación y seguridad."'
      },
      {
        letter: 'B',
        text: 'Dejas que Lucas vaya por el atajo solo mientras tú vas por la avenida',
        score: -5,
        isCorrect: false,
        feedback: 'Dejar que tu amigo camine solo por una zona peligrosa de noche lo vulnera totalmente.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Cuidar a tus amigos significa no dejarlos solos en el peligro."'
      },
      {
        letter: 'C',
        text: 'Convences a Lucas de tomar la avenida iluminada aunque demore unos minutos más',
        score: 5,
        isCorrect: true,
        feedback: '¡Bien! Preferir vías iluminadas reduce radicalmente la posibilidad de ser víctima de delitos.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Llegar seguro a casa vale más que unos minutos ahorrados."'
      },
      {
        letter: 'D',
        text: 'Llaman a un familiar o transporte seguro para que los recoja en la avenida iluminada',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente prevención! Coordinar apoyo familiar o transporte formal es la máxima medida de protección.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"Pedir apoyo a tu familia ante el riesgo es actuar de forma inteligente."'
      }
    ]
  },
  {
    id: 7,
    levelNumber: 7,
    title: '"Solo para probar en la reunión"',
    tag: 'Nivel 7 · Experimentación con drogas',
    tagColor: 'purple',
    context: 'En una reunión en casa de un compañero, un chico mayor saca una envoltura con una sustancia blanca en polvo y le dice a Lucas: "Prueba solo un poco, te dará energía para divertirte toda la noche".',
    tip: 'Las drogas sintéticas y cocaínas destruyen neuronas rápidamente, provocan arritmias fatales y adicción inmediata.',
    emoji: '🏠',
    mapPosition: { x: 1010, y: 430 }, // Casa compañero - curva abajo
    options: [
      {
        letter: 'A',
        text: 'Lucas acepta probar una pizca para no quedar como aburrido frente a los demás',
        score: -10,
        isCorrect: false,
        feedback: 'Probar cualquier droga ilícita por presión de grupo puede ser destructivo desde la primera dosis.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"Una sola prueba de una sustancia desconocida puede marcar de por vida."'
      },
      {
        letter: 'B',
        text: 'Te alejas a otra habitación sin decirle nada a Lucas',
        score: -5,
        isCorrect: false,
        feedback: 'Alejarte sin alertar a tu amigo lo deja expuesto a la manipulación de los consumidores.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Apoya a tu amigo cuando esté a punto de cometer un error grave."'
      },
      {
        letter: 'C',
        text: 'Le dices a Lucas al oído "Esa porquería destruye el cerebro, vámonos ya" y salen de la casa',
        score: 5,
        isCorrect: true,
        feedback: '¡Muy bien! Hacerlo reaccionar a tiempo y abandonar el lugar evita situaciones irreversibles.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Un amigo de verdad te aleja de las sustancias destructivas."'
      },
      {
        letter: 'D',
        text: 'Rechazan enfáticamente, salen de la fiesta y avisan de inmediato a un adulto de confianza',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente valentía! Retirarse de entornos de consumo duro y reportar con adultos evita tragedias mayores.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"La prevención valiente cuida tu vida y la de tus seres queridos."'
      }
    ]
  },
  {
    id: 8,
    levelNumber: 8,
    title: '"Intento de arrebato cerca a locales"',
    tag: 'Nivel 8 · Reacción ante asaltos',
    tagColor: 'red',
    context: 'Cerca a la zona comercial, un sujeto agresivo sorprende a Lucas e intenta quitarle la mochila por la fuerza. A pocos metros hay una farmacia abierta con personal y seguridad.',
    tip: 'Ante un intento de robo, la integridad física es lo más valioso. Nunca se debe forcejear violentamente.',
    emoji: '🏢',
    mapPosition: { x: 1160, y: 220 }, // Edificios - curva arriba
    options: [
      {
        letter: 'A',
        text: 'Lucas forcejea violentamente con el asaltante para defender sus pertenencias',
        score: -10,
        isCorrect: false,
        feedback: 'Forcejear con un delincuente aumenta la probabilidad de agresiones físicas o uso de armas.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"Las cosas materiales se recuperan; tu vida e integridad no."'
      },
      {
        letter: 'B',
        text: 'Sueltan la mochila pero persiguen al asaltante por calles oscuras',
        score: -5,
        isCorrect: false,
        feedback: 'Perseguir a un asaltante por tu cuenta te expone a emboscadas con cómplices.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Nunca persigas a un delincuente por tu propia cuenta."'
      },
      {
        letter: 'C',
        text: 'Sueltan la mochila, piden auxilio a voz en cuello y memorizan los rasgos del asaltante',
        score: 5,
        isCorrect: true,
        feedback: '¡Bien! Priorizar la vida, pedir auxilio y guardar detalles para la policía es lo correcto.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"La calma y el pedido de auxilio adecuado previenen lesiones."'
      },
      {
        letter: 'D',
        text: 'Sueltan el objeto e ingresan de inmediato a la farmacia a ponerse a salvo y pedir ayuda policial',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente decisión! Buscar refugio inmediato en un local con seguridad protege la vida de ambos.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"Buscar refugio inmediato en establecimientos seguros protege tu vida."'
      }
    ]
  },
  {
    id: 9,
    levelNumber: 9,
    title: '"Fiesta y sustancias en Neon Disco"',
    tag: 'Nivel 9 · Microtráfico e inoculación involuntaria',
    tagColor: 'purple',
    context: 'En la zona de entretenimiento Neon Disco, un sujeto le ofrece a Lucas un vaso con una bebida alcohólica ya servida que traía en la mano. Lucas tiene sed y duda en recibirla.',
    tip: 'Nunca consumas bebidas o sustancias servidas por personas desconocidas. Pueden contener drogas de sumisión.',
    emoji: '🪩',
    mapPosition: { x: 1290, y: 420 }, // Neon Disco - curva abajo
    options: [
      {
        letter: 'A',
        text: 'Lucas recibe el vaso abierto y se lo toma de un solo trago',
        score: -10,
        isCorrect: false,
        feedback: 'Consumir bebidas preparadas por desconocidos es la principal causa de intoxicación por drogas de sumisión.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"Jamás recibas vasos servidos o abiertos de extraños."'
      },
      {
        letter: 'B',
        text: 'Acepta el vaso pero solo da un pequeño sorbo para probar el sabor',
        score: -5,
        isCorrect: false,
        feedback: 'Incluso un sorbo de una bebida alterada puede causar mareos, pérdida de conciencia y vulnerabilidad.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Un solo sorbo de sustancia alterada puede anular tu voluntad."'
      },
      {
        letter: 'C',
        text: 'Le quitas el vaso respetuosamente, lo dejas en una mesa y compran una botella de agua sellada',
        score: 5,
        isCorrect: true,
        feedback: '¡Muy bien! Optar solo por envases herméticamente cerrados evita manipulaciones dañinas.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Consumir únicamente bebidas en envases sellados por ti mismo es tu norma de seguridad."'
      },
      {
        letter: 'D',
        text: 'Rechazan de plano la bebida, advierten a los organizadores y deciden retirarse de la discoteca',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente prevención! Identificar el riesgo, reportarlo y abandonar el establecimiento evita situaciones graves.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"Detectar la amenaza y abandonar el lugar es la máxima decisión de autoprotección."'
      }
    ]
  },
  {
    id: 10,
    levelNumber: 10,
    title: '"La decisión final en la Plaza - META"',
    tag: 'Nivel 10 · META FINAL: Liderazgo y compromiso',
    tagColor: 'green',
    context: 'Llegan a la Plaza Principal del distrito. Un grupo de amigos del barrio está reunido deliberando qué hacer durante el fin de semana. Le piden a Lucas y a ti que lideren el grupo y elijan la actividad.',
    tip: 'El verdadero liderazgo juvenil consiste en promover hábitos saludables, cultura y deporte libre de adicciones.',
    emoji: '🏆',
    mapPosition: { x: 1340, y: 220 }, // Plaza META FINAL - derecha
    options: [
      {
        letter: 'A',
        text: 'Proponen conseguir sustancias y alcohol para "celebrar a lo grande" el fin de semana',
        score: -10,
        isCorrect: false,
        feedback: 'Promover el consumo en tu grupo de amigos perpetúa el peligro en el barrio.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"Las adicciones no son celebración; destruyen los proyectos de vida."'
      },
      {
        letter: 'B',
        text: 'Dices que hagan lo que quieran y te desentiendes de las decisiones del grupo',
        score: -5,
        isCorrect: false,
        feedback: 'La indiferencia deja el camino libre para que las malas influencias afecten a tus amigos.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Tu voz y tu liderazgo son necesarios para proteger a tu comunidad."'
      },
      {
        letter: 'C',
        text: 'Propones organizar un torneo deportivo en la losa del barrio con premios para todos',
        score: 5,
        isCorrect: true,
        feedback: '¡Excelente idea! El deporte une a los jóvenes y los mantiene alejados de los vicios.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"El deporte y la sana competencia fortalecen a la juventud."'
      },
      {
        letter: 'D',
        text: 'Organizan un taller de música y arte urbano comunitario para concientizar sobre la prevención',
        score: 10,
        isCorrect: true,
        feedback: '¡FELICITACIONES! Has demostrado un liderazgo transformador. Lucas y tu comunidad están totalmente a salvo gracias a ti.',
        resultWord: '¡VICTORIA!',
        resultType: 'good',
        quote: '"Transformar tu barrio con arte, prevención y unión es tu máximo poder."'
      }
    ]
  }
];
