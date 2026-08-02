/**
 * ZoneReact - Data: Situaciones del Modo Historia / Multijugador
 * 6 Situaciones actualizadas con imágenes generadas y ubicaciones del mapa
 */
window.ZR = window.ZR || {};

window.ZR.situations = [
  {
    id: 1,
    title: '"Aprobar exámenes"',
    tag: 'PRESIÓN DE ESTUDIO / VAPEO',
    tagColor: 'red',
    image: 'assets/Situaciones/situacion_2.png',
    context: 'Tu amigo te propone que se desvelen estudiando, por lo que te ofrece un vape sabor menta para combatir el sueño. Te dice "Este vape es menos dañino que los otros, lo compré en una tienda buena. Si lo usamos, estaremos despiertos hasta la madrugada"',
    tip: 'La presión de estudio no debe llevarte a consumir sustancias nocivas. El descanso adecuado antes de un examen es fundamental.',
    emoji: '🏠',
    mapPosition: { x: 2420, y: 920 }, // CASA en mapa.png
    options: [
      {
        letter: 'A',
        text: 'Acepto el vape, solo por esta noche, para aprovechar el tiempo de estudio',
        score: -10,
        isCorrect: false,
        feedback: 'El vapeo contiene nicotina y sustancias tóxicas que generan adicción rápidamente. Usarlo para estudiar es un riesgo innecesario.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"Ninguna sustancia reemplaza un hábito de estudio y descanso saludable."'
      },
      {
        letter: 'B',
        text: 'Rechazo el vape y termino de estudiar solo, dejando a mi amigo con su plan de desvelarse',
        score: 5,
        isCorrect: true,
        feedback: '¡Bien por rechazar el vape! Evitaste la sustancia, aunque desvelarte no sea la mejor opción para rendir en el examen.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Saber decir que no a las sustancias es cuidar tu salud y tu futuro."'
      },
      {
        letter: 'C',
        text: 'Nos desvelamos, pero sin usar nicotina, le digo que mejor tomemos Monster, que es menos dañino',
        score: -5,
        isCorrect: false,
        feedback: 'Las bebidas energizantes en exceso causan taquicardia y alteran tu organismo antes de un examen.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Las bebidas energizantes en exceso también ponen en riesgo tu salud."'
      },
      {
        letter: 'D',
        text: 'Le digo que mejor acortemos el repaso para dormir antes de medianoche',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente decisión! Dormir bien y descansar lo suficiente te permite rendir al máximo en los exámenes sin sustancias.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"El descanso y la preparación previa son la verdadera clave del éxito."'
      }
    ]
  },
  {
    id: 2,
    title: '"La invitación"',
    tag: 'PRESIÓN SOCIAL',
    tagColor: 'blue',
    image: 'assets/Situaciones/situacion_3.png',
    context: 'Después de los exámenes, estás muy cansado y tus amigos te ofrecen ir a una discoteca por un cumpleaños para relajarse. Sabes que está ubicada en una calle conocida por la venta de drogas y comercio ilegal. Te dicen "siempre hemos pasado por ahí y les hemos comprado, por lo que son de confianza. No nos van a hacer nada"',
    tip: 'Las zonas de venta de drogas y comercio ilegal representan un alto riesgo para ti y tus amigos, sin importar la hora o con quién vayas.',
    emoji: '🏫',
    mapPosition: { x: 1220, y: 940 }, // COLEGIO en mapa.png
    options: [
      {
        letter: 'A',
        text: 'Acepto porque iremos en grupo y eso hace que sea menos peligroso.',
        score: -10,
        isCorrect: false,
        feedback: 'Ir en grupo no disminuye la peligrosidad de un lugar vinculado al comercio ilegal de sustancias.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"El peligro de una zona ilícita no desaparece por ir en grupo."'
      },
      {
        letter: 'B',
        text: 'Rechazo con firmeza y me voy a descansar, puedo reunirme con mis amigos en otro momento y en un lugar más seguro',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente decisión! Decir "no" con firmeza y priorizar tu seguridad frente a la presión social demuestra gran madurez.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"Tu seguridad y bienestar siempre deben estar en primer lugar."'
      },
      {
        letter: 'C',
        text: 'Acepto, pero solo me quedaré un momento y evitaré acercarme a personas que no conozca.',
        score: -5,
        isCorrect: false,
        feedback: 'Permanecer aunque sea un momento en un lugar peligroso sigue exponiéndote a situaciones ilícitas o violentas.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Estar poco tiempo en un entorno peligroso sigue siendo un riesgo alto."'
      },
      {
        letter: 'D',
        text: 'Les digo que iré solo si cambiamos el lugar por uno más seguro.',
        score: 5,
        isCorrect: true,
        feedback: '¡Buena iniciativa! Proponer alternativas seguras demuestra liderazgo y ayuda a cuidar a tus amigos.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Proponer lugares seguros es proteger a todo el grupo."'
      }
    ]
  },
  {
    id: 3,
    title: '"Solo para probar"',
    tag: 'SUSTANCIAS ILÍCITAS',
    tagColor: 'purple',
    image: 'assets/Situaciones/situacion_1.jpg',
    context: 'Estás en el cumpleaños de un amigo. Un chico mayor del grupo te ofrece un tipo de droga que no conoces "algo para pasarla mejor". Varios ya aceptaron y sientes que si dices que no, vas a quedar afuera del grupo.',
    tip: 'Nunca aceptes sustancias desconocidas. Consumir drogas por presión social a por encajar puede tener consecuencias fatales.',
    emoji: '🪩',
    mapPosition: { x: 2100, y: 520 }, // DISCO en mapa.png
    options: [
      {
        letter: 'A',
        text: 'Le digo que no me provoca ahorita y continúo en el grupo',
        score: 5,
        isCorrect: true,
        feedback: '¡Bien por rechazar la sustancia! Sin embargo, quedarte en el mismo entorno de consumo puede mantener la presión sobre ti.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Firmeza al rechazar, pero atento al entorno que te rodea."'
      },
      {
        letter: 'B',
        text: 'Acepto un poco, para no quedar como el aguafiestas del grupo',
        score: -10,
        isCorrect: false,
        feedback: 'Probar una droga desconocida por encajar con los demás pone en grave peligro tu salud y tu vida.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"No vale la pena arriesgar tu vida para complacer a los demás."'
      },
      {
        letter: 'C',
        text: 'Me alejo del grupo gran parte de la fiesta para evitar que me vuelvan a insistir',
        score: -5,
        isCorrect: false,
        feedback: 'Alejarte solo dentro de la fiesta sin buscar un adulto o salir del lugar puede dejarte desprotegido en la reunión.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"En lugar de aislarte en un lugar de riesgo, busca salir de allí."'
      },
      {
        letter: 'D',
        text: 'Finjo salir a tomar aire y escribo a un familiar para que me llame con una excusa a recogerme',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente estrategia! Salir de la situación de riesgo sin entrar en conflicto y pedir ayuda a tu familia es la opción más segura.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"Recurrir a tu familia o adultos de confianza es la mejor estrategia de protección."'
      }
    ]
  },
  {
    id: 4,
    title: '"El camino oscuro"',
    tag: 'RUTA NOCTURNA',
    tagColor: 'yellow',
    image: 'assets/Situaciones/situacion_4.png',
    context: 'Sales tarde de estudiar en casa de un amigo. Para llegar a tu casa hay dos rutas: un atajo por una calle sola y mal iluminada (10 min), o la calle principal, más iluminada pero más larga (25 min). Tu amigo vive en dirección contraria a la tuya.',
    tip: 'Las calles mal iluminadas y solitarias son puntos frecuentes de asaltos. Elige siempre caminos iluminados y transitados.',
    emoji: '🌙',
    mapPosition: { x: 1450, y: 480 },
    options: [
      {
        letter: 'A',
        text: 'Voy con mi amigo por el atajo, porque así no voy solo',
        score: -5,
        isCorrect: false,
        feedback: 'Caminar con tu amigo por un atajo que no te lleva a tu casa te desviará y al final quedarás caminando solo por un tramo oscuro.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Acompañar a un amigo no debe desviarte hacia zonas oscuras solo."'
      },
      {
        letter: 'B',
        text: 'Tomo la calle más iluminada, me separo de mi amigo y me demoro más en llegar a mi casa',
        score: 5,
        isCorrect: true,
        feedback: '¡Buena decisión! Priorizar la calle principal bien iluminada reduce drásticamente el riesgo de ser víctima de un delito.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Llegar unos minutos más tarde por un camino seguro vale la pena."'
      },
      {
        letter: 'C',
        text: 'Cruzo solo por el atajo, porque ya conozco esa ruta de cuando la caminé de día',
        score: -10,
        isCorrect: false,
        feedback: 'Conocer un atajo de día no lo hace seguro de noche. Las calles oscuras esconden riesgos de robos y agresiones.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"De noche, la falta de iluminación cambia por completo la seguridad de una calle."'
      },
      {
        letter: 'D',
        text: 'Le pido a mi amigo que se desvíe conmigo por la calle iluminada, aunque a él le tome más tiempo llegar a su casa',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente! Coordinar con tu amigo para recorrer la vía iluminada garantiza la protección de ambos en el camino.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"Acompañarse mutuamente por rutas seguras es verdadero trabajo en equipo."'
      }
    ]
  },
  {
    id: 5,
    title: '"Desconocido en la calle"',
    tag: 'DESCONOCIDO EN LA CALLE',
    tagColor: 'ink',
    image: 'assets/Situaciones/situacion_5.png',
    context: 'Vas caminando a casa después del colegio, con el celular guardado. Una persona que no conoces se te acerca y te pregunta la hora, insistiendo después en que la ayudes con el mapa de tu celular. Estás en una zona peligrosa con alto índice de un aumento del robo callejero de celulares por distracción.',
    tip: 'Las preguntas frecuentes sobre la hora o direcciones suelen ser tácticas de distracción para arrebatar objetos de valor.',
    emoji: '🏪',
    mapPosition: { x: 380, y: 980 }, // KIOSCO en mapa.png
    options: [
      {
        letter: 'A',
        text: 'Sacas el celular rápido para indicarle la hora o la dirección que pide y sigues caminando sin detenerme',
        score: -10,
        isCorrect: false,
        feedback: 'Sacar el celular ante una pregunta de un desconocido en una zona peligrosa es la distracción perfecta para un arrebato rápido.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"No expongas tus pertenencias de valor ante desconocidos en la vía pública."'
      },
      {
        letter: 'B',
        text: 'Le dices que no sabes y sigues caminando a tu ritmo normal, por la misma ruta',
        score: -5,
        isCorrect: false,
        feedback: 'Responder pero mantener la misma ruta poco transitada mantiene la proximidad del posible sospechoso.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Mantente alerta y busca avenidas más concurridas."'
      },
      {
        letter: 'C',
        text: 'Ignoras a la persona y te metes por una calle más corta que conoces, para llegar antes a tu casa',
        score: 5,
        isCorrect: true,
        feedback: '¡Bien! Evitas la distracción y buscas llegar pronto a tu destino seguro.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Evitar la interacción con desconocidos sospechosos previene el robo."'
      },
      {
        letter: 'D',
        text: 'Le respondes que no llevas celular ni reloj, sin detenerte, y sigues por tu ruta habitual hacia una avenida con más gente',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente! Responder sin detener la marcha y dirigirte a avenidas transitadas neutraliza el intento de robo.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"La firmeza, la prudencia y dirigirse a zonas transitadas son tu mejor escudo."'
      }
    ]
  },
  {
    id: 6,
    title: '"¡Suelta mi celular!"',
    tag: 'INTENTO DE ARREBATO',
    tagColor: 'red',
    image: 'assets/Situaciones/situacion_6.png',
    context: 'Caminabas cerca de una avenida peligrosa cuando un desconocido intentó quitarte el celular de la mano. Aunque hay gente cerca, el arrebato fue rápido. Tienes suerte de que varios negocios abiertos están a pocos metros.',
    tip: 'Ante un intento de robo, nunca opongas resistencia ni persigas al delincuente. Tu vida e integridad valen más que cualquier objeto.',
    emoji: '🏢',
    mapPosition: { x: 650, y: 440 }, // EDIFICIOS en mapa.png
    options: [
      {
        letter: 'A',
        text: 'Forcejeas un momento para no soltar el celular, antes de dejarlo ir',
        score: -10,
        isCorrect: false,
        feedback: 'Forcejear con un asaltante aumenta drásticamente la posibilidad de sufrir violencia física o agresiones graves.',
        resultWord: 'PELIGRO',
        resultType: 'bad',
        quote: '"Un objeto material se recupera, tu salud e integridad física no."'
      },
      {
        letter: 'B',
        text: 'Sueltas el celular de inmediato y corres detrás del ladrón a corta distancia para intentar ver hacia dónde va',
        score: -5,
        isCorrect: false,
        feedback: 'Perseguir a un delincuente te expone a ser agredido o a caer en una emboscada de posibles cómplices.',
        resultWord: 'CUIDADO',
        resultType: 'bad',
        quote: '"Nunca persigas a un delincuente por tu propia cuenta."'
      },
      {
        letter: 'C',
        text: 'Sueltas el celular de inmediato, gritas pidiendo ayuda a gente cercana y tratas de memorizar cómo era el ladrón',
        score: 5,
        isCorrect: true,
        feedback: '¡Bien! Entregaste el objeto sin arriesgar tu vida, pediste auxilio y observaste detalles para hacer la denuncia.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Pedir ayuda y conservar la calma es fundamental."'
      },
      {
        letter: 'D',
        text: 'Sueltas el celular y entras a un negocio a pedir ayuda',
        score: 10,
        isCorrect: true,
        feedback: '¡Excelente decisión! Refugiarte de inmediato en un establecimiento comercial seguro con más personas es la reacción más prudente.',
        resultWord: '¡EXCELENTE!',
        resultType: 'good',
        quote: '"Buscar refugio inmediato en un local comercial protege tu vida e integridad."'
      }
    ]
  }
];
