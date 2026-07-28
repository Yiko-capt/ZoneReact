/**
 * ZoneReact - Data: Sustancias y efectos en órganos (Usando recursos de Perry Platypus)
 */
window.ZR = window.ZR || {};

window.ZR.substances = [
  {
    id: 'alcohol',
    name: 'Alcohol',
    icon: '🍶',
    type: 'droga legal',
    typeColor: 'blue',
    description: 'Depresor del sistema nervioso central. En adolescentes el riesgo es mayor ya que el cerebro y el hígado aún están en desarrollo.',
    avatarExpression: 'dizzy',
    avatarTint: 'rgba(212, 140, 50, 0.4)',
    statusEffect: '🥴 MAREO & LENTITUD REFLEJA',
    organs: {
      brain: {
        name: 'Cerebro',
        icon: '🧠',
        imageFile: 'assets/Organos/cerebro.png',
        fallbackFile: 'images/brain_16bit.jpg',
        summary: 'Altera el sistema de recompensa y deteriora funciones cognitivas clave durante el desarrollo adolescente.',
        effects: [
          { zone: 'Sistema dopaminérgico', description: 'Libera dopamina artificialmente, creando dependencia psicológica. El cerebro "aprende" a necesitar alcohol para sentir placer.' },
          { zone: 'Corteza prefrontal', description: 'Reduce la capacidad de tomar decisiones racionales y controlar impulsos. En adolescentes, este efecto es permanente si el consumo es frecuente.' },
          { zone: 'Hipocampo', description: 'Daña la memoria a corto plazo y la capacidad de aprendizaje. Un episodio de intoxicación fuerte puede destruir neuronas de forma irreversible.' }
        ],
        prevention: 'Si necesitas apoyo para lidiar con problemas, habla con un psicólogo escolar o un adulto de confianza antes de recurrir al alcohol.'
      },
      lungs: {
        name: 'Hígado',
        icon: '🫁',
        imageFile: 'assets/Organos/higado.png',
        fallbackFile: 'images/liver_16bit.jpg',
        summary: 'El hígado procesa el alcohol, pero a un costo muy alto que con el tiempo produce cirrosis y falla hepática.',
        effects: [
          { zone: 'Metabolismo', description: 'El hígado prioriza metabolizar el alcohol sobre otras funciones, acumulando grasa hepática (hígado graso).' },
          { zone: 'Enzimas hepáticas', description: 'El consumo repetido eleva las enzimas ALT y AST, señal de daño celular progresivo e inflamación.' },
          { zone: 'Cirrosis', description: 'Con el tiempo, el tejido hepático sano es reemplazado por tejido cicatricial, reduciendo la función hepática permanentemente.' }
        ],
        prevention: 'El hígado de un adolescente es más vulnerable que el de un adulto. El daño puede ser irreversible antes de los 25 años.'
      },
      heart: {
        name: 'Corazón',
        icon: '❤️',
        imageFile: 'assets/Organos/corazon.png',
        fallbackFile: 'images/heart_16bit.jpg',
        summary: 'Aunque el alcohol dilata vasos a corto plazo, el consumo habitual eleva la presión y daña el músculo cardíaco.',
        effects: [
          { zone: 'Presión arterial', description: 'El consumo habitual eleva la presión arterial, aumentando el riesgo de accidentes cerebrovasculares.' },
          { zone: 'Músculo cardíaco', description: 'La miocardiopatía alcohólica debilita el músculo del corazón, reduciendo su capacidad de bombeo.' },
          { zone: 'Ritmo cardíaco', description: 'Puede causar arritmias, incluso en jóvenes sin antecedentes cardíacos, especialmente con consumo episódico intenso.' }
        ],
        prevention: 'El corazón adolescente puede sufrir daños permanentes incluso con consumo episódico intenso. No es un riesgo solo de adultos.'
      }
    }
  },
  {
    id: 'nicotina',
    name: 'Nicotina',
    icon: '🚬',
    type: 'droga legal',
    typeColor: 'blue',
    description: 'Estimulante altamente adictivo presente en cigarrillos y vaporizadores. Genera dependencia física y psicológica rápidamente.',
    avatarExpression: 'tense',
    avatarTint: 'rgba(100, 100, 110, 0.45)',
    statusEffect: '🚬 ANSIEDAD & AUMENTO CARDÍACO',
    organs: {
      brain: {
        name: 'Cerebro',
        icon: '🧠',
        imageFile: 'assets/Organos/cerebro.png',
        fallbackFile: 'images/brain_16bit.jpg',
        summary: 'La nicotina actúa en receptores cerebrales creando dependencia física en días o semanas.',
        effects: [
          { zone: 'Receptores nicotínicos', description: 'La nicotina imita a la acetilcolina y activa masivamente los receptores de dopamina, creando una sensación artificial de alerta y placer.' },
          { zone: 'Dependencia', description: 'En adolescentes, la dependencia a la nicotina se desarrolla 3 veces más rápido que en adultos. El síndrome de abstinencia incluye ansiedad intensa e irritabilidad.' },
          { zone: 'Desarrollo neuronal', description: 'Interfiere con el desarrollo de la corteza prefrontal, afectando la atención, la memoria de trabajo y el control de impulsos de forma permanente.' }
        ],
        prevention: 'Los cigarrillos electrónicos contienen nicotina igual que los tradicionales. No son una alternativa segura para adolescentes.'
      },
      lungs: {
        name: 'Pulmones',
        icon: '🫁',
        imageFile: 'assets/Organos/pulmones_fumador.png',
        fallbackFile: 'images/lungs_16bit.jpg',
        summary: 'El humo y aerosoles destruyen los cilios protectores del sistema respiratorio, causando daños difíciles de revertir.',
        effects: [
          { zone: 'Cilios bronquiales', description: 'El humo paraliza y destruye los cilios que limpian el tracto respiratorio, permitiendo que bacterias y toxinas lleguen más profundo a los pulmones.' },
          { zone: 'Alvéolos', description: 'Los agentes cancerígenos del humo dañan irreversiblemente los alvéolos. La capacidad pulmonar puede reducirse un 30% en fumadores jóvenes.' },
          { zone: 'EPOC', description: 'Los adolescentes que fuman tienen mucho mayor riesgo de desarrollar EPOC (enfermedad pulmonar obstructiva crónica) antes de los 40 años.' }
        ],
        prevention: 'El vapeo también daña los pulmones. Los aerosoles de los vapeadores contienen metales pesados y compuestos químicos tóxicos.'
      },
      heart: {
        name: 'Corazón',
        icon: '❤️',
        imageFile: 'assets/Organos/corazon.png',
        fallbackFile: 'images/heart_16bit.jpg',
        summary: 'La nicotina aumenta la frecuencia cardíaca y la presión arterial, estresando el corazón en cada cigarrillo.',
        effects: [
          { zone: 'Frecuencia cardíaca', description: 'Cada cigarrillo eleva la frecuencia cardíaca 10-20 latidos por minuto, incrementando el desgaste del músculo cardíaco.' },
          { zone: 'Arterias', description: 'El monóxido de carbono del humo reduce el oxígeno en sangre y daña las paredes arteriales, aumentando el riesgo de aterosclerosis.' },
          { zone: 'Coágulos', description: 'La nicotina aumenta la viscosidad de la sangre, elevando el riesgo de trombosis y accidentes cerebrovasculares en jóvenes.' }
        ],
        prevention: 'Fumar un solo cigarrillo ya estresa tu corazón. No existe un "nivel seguro" de consumo de nicotina.'
      }
    }
  },
  {
    id: 'marihuana',
    name: 'Marihuana',
    icon: '🌿',
    type: 'droga ilegal',
    typeColor: 'red',
    description: 'La más consumida entre adolescentes escolares en Perú. El THC afecta gravemente el cerebro en desarrollo.',
    avatarExpression: 'trippy',
    avatarTint: 'rgba(80, 160, 80, 0.45)',
    statusEffect: '🌀 DIFICULTAD COGNITIVA & TAQUICARDIA',
    organs: {
      brain: {
        name: 'Cerebro',
        icon: '🧠',
        imageFile: 'assets/Organos/cerebro.png',
        fallbackFile: 'images/brain_16bit.jpg',
        summary: 'El THC imita al sistema endocannabinoide y altera permanentemente el desarrollo neuronal en adolescentes.',
        effects: [
          { zone: 'Sistema endocannabinoide', description: 'El THC imita a la anandamida natural y satura los receptores CB1, desregulando el sistema de comunicación neuronal y el desarrollo cerebral.' },
          { zone: 'Memoria y aprendizaje', description: 'El consumo frecuente en adolescentes produce pérdida de hasta 8 puntos de CI y déficits significativos de memoria de trabajo y atención sostenida.' },
          { zone: 'Salud mental', description: 'Triplica el riesgo de desarrollar psicosis y esquizofrenia en personas con predisposición genética. Los primeros episodios suelen ocurrir en la adolescencia.' }
        ],
        prevention: 'El cerebro se desarrolla hasta los 25 años. El consumo de marihuana antes de esa edad tiene efectos mucho más graves que en adultos.'
      },
      lungs: {
        name: 'Pulmones',
        icon: '🫁',
        imageFile: 'assets/Organos/pulmones_fumador.png',
        fallbackFile: 'images/lungs_16bit.jpg',
        summary: 'El humo de marihuana contiene más alquitrán que el tabaco y produce irritación bronquial crónica.',
        effects: [
          { zone: 'Bronquios', description: 'El humo contiene más de 400 compuestos químicos tóxicos. Produce irritación, tos crónica y bronquitis en consumidores habituales jóvenes.' },
          { zone: 'Capacidad pulmonar', description: 'Tres cigarrillos de marihuana producen el mismo daño en los alvéolos que un paquete completo de cigarrillos de tabaco.' },
          { zone: 'Infecciones', description: 'Daña el sistema inmune pulmonar, aumentando la frecuencia y gravedad de infecciones respiratorias como neumonía y bronquitis bacteriana.' }
        ],
        prevention: 'Los vaporizadores de marihuana también dañan los pulmones. No existe una forma "segura" de inhalar cannabis.'
      },
      heart: {
        name: 'Corazón',
        icon: '❤️',
        imageFile: 'assets/Organos/corazon.png',
        fallbackFile: 'images/heart_16bit.jpg',
        summary: 'Aumenta drásticamente la frecuencia cardíaca y puede desencadenar arritmias en jóvenes sanos.',
        effects: [
          { zone: 'Taquicardia', description: 'En los primeros 15 minutos tras el consumo, la frecuencia cardíaca puede aumentar de 50 a 100%, llegando hasta 200 latidos por minuto.' },
          { zone: 'Arritmias', description: 'Se han documentado episodios de fibrilación auricular en adolescentes sanos sin antecedentes cardíacos tras el consumo de marihuana.' },
          { zone: 'Flujo sanguíneo', description: 'Altera el flujo sanguíneo cerebral, aumentando el riesgo de accidentes cerebrovasculares incluso en jóvenes de 15-20 años.' }
        ],
        prevention: 'Si sientes palpitaciones, mareos o dolor en el pecho después de consumir cualquier sustancia, busca atención médica inmediata.'
      }
    }
  },
  {
    id: 'cocaina',
    name: 'Cocaína',
    icon: '🔷',
    type: 'droga ilegal',
    typeColor: 'red',
    description: 'Estimulante del SNC de alta adicción. Incluye PBC (pasta básica), crack y clorhidrato. Cada forma tiene efectos devastadores y rápidos.',
    avatarExpression: 'euphoric',
    avatarTint: 'rgba(220, 50, 50, 0.5)',
    statusEffect: '⚡ PARO CARDÍACO & EUFORIA TÓXICA',
    organs: {
      brain: {
        name: 'Cerebro',
        icon: '🧠',
        imageFile: 'assets/Organos/cerebro.png',
        fallbackFile: 'images/brain_16bit.jpg',
        summary: 'Bloquea la recaptación de dopamina produciendo euforia intensa seguida de depresión severa, creando adicción extremadamente rápida.',
        effects: [
          { zone: 'Sistema dopaminérgico', description: 'Bloquea el transportador de dopamina (DAT), acumulando dopamina en las sinapsis. La euforia intensa que produce crea una de las dependencias psicológicas más fuertes conocidas.' },
          { zone: 'Ciclo de abstinencia', description: 'El "bajón" posterior implica depresión severa, ansiedad extrema y disforia. Muchos consumen más cocaína para escapar del bajón, instalando el ciclo adictivo.' },
          { zone: 'Daño estructural', description: 'El consumo crónico destruye materia gris en el córtex prefrontal, reduciendo permanentemente la capacidad de toma de decisiones y control de impulsos.' }
        ],
        prevention: 'La cocaína es una de las sustancias con mayor velocidad de instalación de adicción. Una sola dosis puede marcar el inicio de la dependencia.'
      },
      lungs: {
        name: 'Riñones',
        icon: '🫁',
        imageFile: 'assets/Organos/rinones.png',
        fallbackFile: 'images/lungs_16bit.jpg',
        summary: 'La cocaína y sus adulterantes causan falla renal aguda por rabdomiólisis y vasoconstricción masiva.',
        effects: [
          { zone: 'Filtro Renal', description: 'Destruye los alvéolos renales e interrumpe el flujo de sangre a los riñones.' },
          { zone: 'Rabdomiólisis', description: 'La destrucción del tejido muscular libera mioglobina a la sangre, colapsando los riñones.' }
        ],
        prevention: 'La rabdomiólisis inducida por cocaína puede requerir diálisis de emergencia.'
      },
      heart: {
        name: 'Corazón',
        icon: '❤️',
        imageFile: 'assets/Organos/corazon.png',
        fallbackFile: 'images/heart_16bit.jpg',
        summary: 'Causa infartos y paros cardíacos incluso en jóvenes de 15 años sin antecedentes. Es la principal causa de muerte por droga en adolescentes.',
        effects: [
          { zone: 'Infarto agudo', description: 'La cocaína es la causa más frecuente de infarto en menores de 30 años. Produce vasoespasmo coronario que puede ocurrir incluso en el primer consumo.' },
          { zone: 'Arritmias mortales', description: 'Induce arritmias ventriculares malignas como fibrilación ventricular, que pueden causar muerte súbita en cuestión de minutos.' },
          { zone: 'Cocaetileno', description: 'Al combinar cocaína con alcohol se forma cocaetileno, 5 veces más tóxico para el corazón que la cocaína sola. Esta combinación es común en fiestas.' }
        ],
        prevention: 'El corazón no tiene "práctica previa" con la cocaína. El primer infarto puede ser el último. No existe un consumo seguro.'
      }
    }
  },
  {
    id: 'tusi',
    name: 'Tusi / 2C-B',
    icon: '🟪',
    type: 'droga ilegal',
    typeColor: 'red',
    description: 'Mezcla sintética peligrosa de ketamina, MDMA y estimulantes teñida de rosa. Sus efectos impredecibles dañan múltiples órganos.',
    avatarExpression: 'trippy',
    avatarTint: 'rgba(232, 136, 160, 0.5)',
    statusEffect: '🔮 ALUCINACIÓN & FALLA SINTÉTICA',
    organs: {
      brain: {
        name: 'Cerebro',
        icon: '🧠',
        imageFile: 'assets/Organos/cerebro.png',
        fallbackFile: 'images/brain_16bit.jpg',
        summary: 'Produce disociación psicodélica grave y daño neurotóxico impredecible debido a la mezcla desconocida de sustancias.',
        effects: [
          { zone: 'Receptores Serotoninérgicos', description: 'Altera los niveles de serotonina y dopamina drásticamente, produciendo alucinaciones e hipertermia.' },
          { zone: 'Neurotoxicidad', description: 'La ketamina y MDMA combinadas dañan receptores NMDA y neuronas de la memoria.' }
        ],
        prevention: 'El tusi no es una sustancia pura; es un cóctel químico impredecible con alto riesgo de sobredosis.'
      },
      lungs: {
        name: 'Vejiga y Riñones',
        icon: '🫁',
        imageFile: 'assets/Organos/rinones.png',
        fallbackFile: 'images/lungs_16bit.jpg',
        summary: 'La ketamina presente en el tusi causa cistitis ulcerativa irreversible en consumidores jóvenes.',
        effects: [
          { zone: 'Cistitis por Ketamina', description: 'Destruye las paredes internas de la vejiga produciendo sangrado e incontinencia.' }
        ],
        prevention: 'El daño vesicular por tusi puede requerir cirugía reconstructiva antes de los 20 años.'
      },
      heart: {
        name: 'Corazón',
        icon: '❤️',
        imageFile: 'assets/Organos/corazon.png',
        fallbackFile: 'images/heart_16bit.jpg',
        summary: 'Provoca hipertermia maligna y picos de presión arterial que colapsan el sistema cardiovascular.',
        effects: [
          { zone: 'Hipertermia', description: 'Eleva la temperatura corporal por encima de 40°C causando fallo multiorgánico.' }
        ],
        prevention: 'Mezclar tusi con alcohol u otras sustancias multiplica exponencialmente el riesgo cardíaco.'
      }
    }
  },
  {
    id: 'inhalantes',
    name: 'Inhalantes',
    icon: '🌊',
    type: 'legal / industrial',
    typeColor: 'blue',
    description: 'Vapores químicos tóxicos (pegamentos, aerosoles, solventes) que disuelven la mielina neuronal y causan asfixia súbita.',
    avatarExpression: 'dizzy',
    avatarTint: 'rgba(120, 100, 140, 0.5)',
    statusEffect: '😵 ASFIXIA SÚBITA & ASFIXIA NEURONAL',
    organs: {
      brain: {
        name: 'Cerebro',
        icon: '🧠',
        imageFile: 'assets/Organos/cerebro.png',
        fallbackFile: 'images/brain_16bit.jpg',
        summary: 'Los solventes disuelven la capa de mielina que recubre las neuronas, causando daño cerebral irreversible.',
        effects: [
          { zone: 'Mielina', description: 'Destruye la vaina de mielina, haciendo que las neuronas pierdan la capacidad de transmitir impulsos nerviosos.' },
          { zone: 'Atrofia Cerebral', description: 'Produce contracción de la masa cerebral y pérdida permanente de capacidades intelectuales.' }
        ],
        prevention: 'Inhalar solventes puede causar el "Síndrome de Muerte Súbita por Inhalación" en el primer intento.'
      },
      lungs: {
        name: 'Pulmones',
        icon: '🫁',
        imageFile: 'assets/Organos/pulmones_fumador.png',
        fallbackFile: 'images/lungs_16bit.jpg',
        summary: 'Reemplazan el oxígeno en los alvéolos, produciendo asfixia celular inmediata.',
        effects: [
          { zone: 'Hipoxia Aguda', description: 'Privan al cerebro y pulmones de oxígeno, causando paros respiratorios en minutos.' }
        ],
        prevention: 'Nunca utilices solventes industriales en espacios cerrados ni inhales sus vapores.'
      },
      heart: {
        name: 'Corazón',
        icon: '❤️',
        imageFile: 'assets/Organos/corazon.png',
        fallbackFile: 'images/heart_16bit.jpg',
        summary: 'Sensibilizan el corazón a la adrenalina, provocando paros cardíacos repentinos ante cualquier susto.',
        effects: [
          { zone: 'Fibrilación Ventricular', description: 'Un susto o esfuerzo físico tras inhalar puede congelar o detener el corazón instantáneamente.' }
        ],
        prevention: 'El consumo de inhalantes es altamente peligroso desde la primera inhalación.'
      }
    }
  }
];
