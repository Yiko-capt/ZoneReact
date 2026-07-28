/**
 * ZoneReact - Data: Situaciones del Modo Historia
 * "Salvar a tu mejor amigo (Leo)"
 */
window.ZR = window.ZR || {};

window.ZR.situations = [
  {
    id: 1,
    title: '"La Esquina del Colegio"',
    tag: 'Presión de vapeo',
    tagColor: 'red',
    context: 'A la salida del colegio, un grupo de chicos mayores aborda a Leo y le ofrecen un vapeador desconocido, diciéndole que "no hace daño". Leo duda y te mira buscando tu apoyo.',
    tip: 'La presión de grupo es la principal puerta de entrada al consumo en adolescentes.',
    emoji: '🚭',
    mapPosition: { x: 992, y: 64 }, // Pin 1 on Flower block
    options: [
      {
        letter: 'A',
        text: 'Distracción estratégica: intervines diciendo que un profesor busca a Leo con urgencia y lo sacas del lugar sin pelear.',
        score: 20,
        isCorrect: true,
        feedback: '¡Excelente! Retirarte sin confrontar es la decisión más inteligente. Leo está a salvo y no generaste más conflicto.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Proteger a un amigo no siempre es confrontar. A veces es desviar."'
      },
      {
        letter: 'B',
        text: 'Enfrentas violentamente a los sujetos mayores para defender a Leo.',
        score: 0,
        isCorrect: false,
        feedback: 'La confrontación física frente a personas mayores pone a ambos en riesgo. Buscar apoyo adulto era la mejor opción.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Equivocarte aquí sirve para decidir mejor allá afuera."'
      },
      {
        letter: 'C',
        text: 'Te vas solo y le mandas un WhatsApp a Leo diciéndole que se vaya.',
        score: 0,
        isCorrect: false,
        feedback: 'Alejarte sin apoyar a Leo lo deja solo ante la presión. Un amigo de verdad actúa, no solo observa desde lejos.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Un mensaje no reemplaza tu presencia cuando alguien te necesita."'
      },
      {
        letter: 'D',
        text: 'Te quedas callado mirando al costado, esperando que Leo decida solo.',
        score: 0,
        isCorrect: false,
        feedback: 'La pasividad también es una decisión. Leo necesitaba tu apoyo activo en ese momento.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Callarse cuando alguien necesita ayuda también tiene consecuencias."'
      }
    ]
  },
  {
    id: 2,
    title: '"El Parque Nocturno"',
    tag: 'Estrés y vías de escape',
    tagColor: 'blue',
    context: 'Leo tiene problemas familiares serios y quiere irse de noche a un parque peligroso del barrio "para despejar la mente". Te dice que no le importa lo que le pase.',
    tip: 'Los problemas familiares son el principal factor de riesgo para conductas peligrosas en adolescentes.',
    emoji: '🌙',
    sceneEmojis: ['🌃', '😔', '⚡'],
    mapPosition: { x: 544, y: 384 }, // Pin 2 in Park near Lake
    options: [
      {
        letter: 'A',
        text: 'Validas sus sentimientos y lo invitas a jugar fútbol o comer algo en un lugar iluminado y seguro.',
        score: 20,
        isCorrect: true,
        feedback: '¡Perfecto! Reconocer su dolor y ofrecer una alternativa segura es la respuesta más empática y efectiva.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Cuidarte también es una forma de cuidar a tu comunidad."'
      },
      {
        letter: 'B',
        text: 'Aceptas ir "solo media hora" porque no quieres que Leo vaya solo.',
        score: 0,
        isCorrect: false,
        feedback: 'Ir juntos a un lugar peligroso no reduce el riesgo, lo duplica. La intención es buena, pero la decisión pone a ambos en peligro.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Acompañar no siempre significa seguir al mismo lugar."'
      },
      {
        letter: 'C',
        text: 'Lo juzgas y le dices que es un tonto por querer ir a un lugar así.',
        score: 0,
        isCorrect: false,
        feedback: 'Juzgar a alguien que sufre lo aleja más. Leo necesitaba comprensión, no crítica.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Escuchar antes de juzgar puede salvar más que cualquier consejo."'
      },
      {
        letter: 'D',
        text: 'Le acusas directamente a su mamá sin hablar primero con él.',
        score: 0,
        isCorrect: false,
        feedback: 'Delatar sin hablar primero puede romper la confianza de Leo. La comunicación directa siempre va primero.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"La confianza entre amigos es la base del apoyo real."'
      }
    ]
  },
  {
    id: 3,
    title: '"La Fiesta del Barrio"',
    tag: 'Sustancias en pastilla',
    tagColor: 'purple',
    context: 'En una fiesta del barrio, alguien le ofrece a Leo una pastilla de colores diciéndole que "quita la timidez". Leo parece tentado. Hay mucho ruido y personas alrededor.',
    tip: 'Los adolescentes son más vulnerables al consumo cuando están en entornos sociales de alta presión.',
    emoji: '💊',
    sceneEmojis: ['🎉', '💊', '🚨'],
    mapPosition: { x: 160, y: 768 },
    options: [
      {
        letter: 'A',
        text: 'Le pasas agua, dices en voz alta "nosotros no tomamos eso" y juntos buscan al organizador de la fiesta.',
        score: 20,
        isCorrect: true,
        feedback: '¡Excelente! Actuar con asertividad y buscar apoyo adulto es la respuesta más completa. Leo está protegido.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Tu voz puede marcar la diferencia cuando alguien duda."'
      },
      {
        letter: 'B',
        text: 'Te quedas mirando a ver si Leo dice que no por su cuenta.',
        score: 0,
        isCorrect: false,
        feedback: 'La pasividad en momentos críticos puede costarle caro a Leo. Tu intervención activa era necesaria.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Esperar no es una estrategia cuando alguien corre riesgo."'
      },
      {
        letter: 'C',
        text: 'Sugieres que si quiere relajarse mejor tome "solo un trago de alcohol".',
        score: 0,
        isCorrect: false,
        feedback: 'Cambiar una sustancia dañina por otra no protege a Leo. Todas las alternativas que implican consumo son incorrectas.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Proteger a un amigo es buscar alternativas libres de riesgo."'
      },
      {
        letter: 'D',
        text: 'Te vas a tu casa y lo dejas solo en la fiesta.',
        score: 0,
        isCorrect: false,
        feedback: 'Abandonar a un amigo en una situación de riesgo es lo más peligroso que puedes hacer. Leo te necesitaba ahí.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Un amigo de verdad no desaparece cuando más se le necesita."'
      }
    ]
  },
  {
    id: 4,
    title: '"El Encargo Sospechoso"',
    tag: 'Microtráfico escolar',
    tagColor: 'ink',
    context: 'Un sujeto desconocido le ofrece a Leo S/ 100 a cambio de llevar un paquete sellado en su mochila hasta otra dirección. Leo dice que necesita el dinero para su familia.',
    tip: 'El microtráfico escolar aprovecha las necesidades económicas de los jóvenes. La ley es severa incluso con menores.',
    emoji: '📦',
    sceneEmojis: ['📦', '💰', '🚔'],
    mapPosition: { x: 448, y: 960 }, // Pin 4 on Tan Building block
    options: [
      {
        letter: 'A',
        text: 'Le muestras a Leo el riesgo legal y lo acompañas al tutor escolar para buscar orientación de manera anónima.',
        score: 20,
        isCorrect: true,
        feedback: '¡Correcto! Buscar apoyo adulto de confianza de forma anónima protege a Leo sin exponerlo a represalias.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Pedir ayuda a tiempo es el acto más valiente."'
      },
      {
        letter: 'B',
        text: 'Le dices a Leo que lo haga "solo una vez" porque realmente necesita el dinero.',
        score: 0,
        isCorrect: false,
        feedback: '"Solo una vez" es la mentira más peligrosa del microtráfico. Una vez puede significar antecedentes penales y peligro real.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Una sola vez puede cambiar una vida para siempre."'
      },
      {
        letter: 'C',
        text: 'Guardas tú el paquete en tu mochila para "proteger" a Leo.',
        score: 0,
        isCorrect: false,
        feedback: 'Asumir el riesgo tú mismo no protege a Leo, te pone a ti en serio peligro legal. Ambos necesitaban salir de esa situación.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Proteger a alguien no significa asumir su riesgo."'
      },
      {
        letter: 'D',
        text: 'Lo delatas gritando frente a todo el patio escolar.',
        score: 0,
        isCorrect: false,
        feedback: 'Exponer a Leo públicamente puede poner en riesgo su seguridad ante el sujeto que lo contactó. La discreción era clave.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Ayudar en privado puede ser más poderoso que exponer en público."'
      }
    ]
  },
  {
    id: 5,
    title: '"La Ruta de Regreso"',
    tag: 'Riesgo nocturno',
    tagColor: 'green',
    context: 'Es de noche y Leo quiere cruzar un callejón oscuro y solitario para ahorrar 5 minutos en el camino a casa. Ya han reportado robos en esa zona esta semana.',
    tip: 'Los callejones sin iluminación y con poca gente son los espacios de mayor riesgo para adolescentes.',
    emoji: '🌑',
    sceneEmojis: ['🌑', '🛣️', '⚠️'],
    mapPosition: { x: 1120, y: 832 },
    options: [
      {
        letter: 'A',
        text: 'Le muestras en el mapa los reportes de riesgo del callejón y van juntos por la avenida principal aunque tarde más.',
        score: 20,
        isCorrect: true,
        feedback: '¡Excelente! Usar la información disponible y elegir la ruta segura juntos es la decisión más inteligente.',
        resultWord: '¡BIEN!',
        resultType: 'good',
        quote: '"Cinco minutos más pueden ser la diferencia entre llegar o no llegar."'
      },
      {
        letter: 'B',
        text: 'Aceptas cruzar agarrando piedras en la mano "por si acaso".',
        score: 0,
        isCorrect: false,
        feedback: 'Las piedras no son protección real. Entrar a un lugar de riesgo con esa "precaución" sigue siendo una mala decisión.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Evitar el riesgo es siempre mejor que enfrentarlo."'
      },
      {
        letter: 'C',
        text: 'Te vas solo por tu lado seguro y dejas que Leo decida cruzar el callejón.',
        score: 0,
        isCorrect: false,
        feedback: 'Dejar a Leo solo frente a un riesgo real no es respetar su autonomía, es abandonarlo cuando más te necesita.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"Un amigo no te abandona en la puerta del peligro."'
      },
      {
        letter: 'D',
        text: 'Se quedan sentados esperando en la esquina oscura hasta que alguien pase.',
        score: 0,
        isCorrect: false,
        feedback: 'Quedarse en una zona oscura y peligrosa no es una solución. Moverse hacia un lugar iluminado y concurrido era la prioridad.',
        resultWord: 'PIENSA',
        resultType: 'bad',
        quote: '"La espera en el lugar equivocado puede ser tan peligrosa como actuar mal."'
      }
    ]
  }
];
