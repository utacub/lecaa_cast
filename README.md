# LECAA CAST

Lectura y escritura en castellano para alumnos que utilizan comunicación aumentativa y alternativa (CAA).

Versión **0.6.9**: publicación web y PWA a partir del HTML autónomo aprobado 0.6.3. Se conservan las actividades, las mecánicas, las ilustraciones, los vídeos, las fuentes y todos los audios incorporados. Voz femenina sintética generada con ElevenLabs.

## Uso e instalación

Abre https://utacub.github.io/lecaa_cast/ en un navegador actualizado. En la pantalla de inicio, el botón «Instalar» (junto a «Qué es LECAA CAST», «Guía y marco teórico» y «Créditos») abre la instalación en Chrome y Edge. En iPhone o iPad, el mismo botón explica los pasos en Safari: Compartir → Añadir a pantalla de inicio. El botón no aparece cuando LECAA CAST ya se ha abierto como aplicación instalada.

La primera descarga incluye el programa completo, unos 97 MB. Espera al mensaje **«Lista para usar sin conexión: imágenes y audios incluidos»** antes de desconectarte. Las siguientes aperturas pueden funcionar sin conexión. Los navegadores pueden eliminar los datos locales si se borra su almacenamiento o falta espacio; conserva copias de seguridad de los perfiles.

Los perfiles, configuraciones y sesiones se guardan en este navegador y dispositivo. Una instalación desde otro navegador no los transfiere automáticamente. No se envían los datos de los alumnos al repositorio ni a un servidor.

## Publicación y mantenimiento

GitHub Pages publica la rama `main`, carpeta raíz `/`. No requiere compilación ni servicios externos. `index.html` es autónomo; `manifest.webmanifest`, `sw.js` e `icons/` añaden la instalación PWA.

- Identidad, inicio y ámbito: `/lecaa_cast/`.
- Cachés exclusivos con prefijo `lecaa-cast-`.
- Datos de perfiles: `lecaa.cast.v1`; multimedia local: IndexedDB `lecaa-cast-media`.
- Al cambiar recursos, cambia la versión de la caché de `sw.js`. Las actualizaciones esperan a que se cierren todas las ventanas de LECAA CAST; no interrumpen sesiones.
- Al modificar un script incrustado, recalcula su hash SHA-256 en la política CSP de `index.html`.
- Conserva los créditos y avisos de terceros incluidos en el programa.

### Reconstrucción del HTML a partir de fragmentos

`index.html` pesa unos 97 MB, por encima de lo que admiten algunas vías de subida. Para publicarlo por partes:

1. Divide el HTML en fragmentos y súbelos a una carpeta `bootstrap/` junto con `bootstrap/parts.json`, de la forma `{"parts": ["part-01", "part-02", …], "bytes": <tamaño total>, "sha256": "<hash del HTML completo>"}`.
2. Al hacer push a `main` con cambios en `bootstrap/**`, o al lanzarlo a mano desde Actions, el flujo `.github/workflows/assemble.yml` une los fragmentos en orden, comprueba el tamaño y el SHA-256, escribe `index.html`, borra `bootstrap/` y hace commit en `main`.
3. Si el tamaño o el hash no coinciden, el flujo falla y no cambia nada.

Por eso `bootstrap/` no aparece en el repositorio: el propio flujo la elimina tras la reconstrucción.

## Validación de esta publicación

Comprobados en Chromium: arranque online, manifiesto e iconos válidos, ausencia de errores de instalabilidad, registro y control del service worker, precarga íntegra, recarga offline, reproducción real offline de la locución «Muy bien, no riman.», conservación de datos y de una caché de otra aplicación, y créditos aprobados. Sin errores de consola ni de JavaScript. Los 2.972 recursos incrustados (2.968 únicos) mantienen exactamente sus datos originales; la lógica de ejercicios de 0.6.3 no se ha modificado.

Estas pruebas de publicación no sustituyen la valoración con dispositivos físicos de acceso ni implican que se haya vuelto a auditar cada actividad o escuchado cada audio. La instalación en iOS debe comprobarse en un dispositivo físico.

## Revisión de ordenadores y tabletas 0.6.5

Se corrigen dos desbordamientos en tabletas: cuatro respuestas con imágenes grandes a 1024 × 768 y el teclado de escritura con palabras largas. El ajuste CSS se limita a anchuras de 701 a 1100 píxeles y alturas de hasta 1100 píxeles. Las hojas de estilo originales, la lógica de los ejercicios y los recursos incorporados se conservan.

Comprobados 495 escenarios de disposición en Chromium 153, Firefox 153 y WebKit 26.5 sobre Linux (11 tamaños × 3 tamaños de imagen × 5 actividades por motor), con palabras largas en escritura y lectura. Las 900 imágenes se descodifican en los tres motores. Se comprueban también los seis accesos con eventos de ratón y teclado en Chromium y Firefox, y las siete vistas de configuración en escritorio y tableta. La PWA actualiza desde 0.6.4 tras cerrar las ventanas, conserva los datos y la caché de otras aplicaciones y vuelve a abrir offline.

Estos resultados no certifican todos los equipos Windows, ChromeOS, macOS, iPadOS, Android y Linux. La emulación no equivale a un dispositivo real. La salida de audio, la instalación y los dispositivos de acceso físicos requieren comprobación en cada plataforma, especialmente Safari en iPadOS y macOS. No se declara validada una plataforma por cambiar el tamaño de ventana o el agente de usuario.

## Cambio 0.6.9

- Nuevo botón «Activar teclado completo» en «Letra y sonido» (T8) y «Construye la palabra» (T11), en la columna de botones de la derecha. Al pulsarlo desaparecen las opciones o el teclado reducido y el alumno escribe la respuesta con un teclado completo. El botón queda pulsado, con un interruptor encendido, y pasa a decir «Desactivar teclado completo».
- La opción se guarda en el perfil de cada alumno y por separado para cada actividad (`pres.fullKeyboard.T8` y `pres.fullKeyboard.T11`). Cada cambio queda en el historial de cambios del perfil.
- Con selección directa se escribe con el teclado físico o con el teclado en pantalla del dispositivo: al activar la opción, o al tocar la casilla de respuesta, se abre el teclado del sistema. «Hecho» o la tecla Intro envían la respuesta.
- Con barrido (automático, paso a paso, uno o dos pulsadores) y con lector ocular aparece un teclado QWERTY propio de la aplicación, dividido en dos bloques: izquierdo (q w e r t · a s d f g · z x c v b) y derecho (y u i o p · h j k l ñ · n m). Primero se elige el bloque, después la fila y después la tecla. El barrido admite ahora grupos anidados mediante rutas en `data-group` («fk0/r1»).
- En «Letra y sonido» con teclado completo, una letra con el mismo sonido también cuenta como acierto (por ejemplo, b cuando se busca v); el registro lo marca con `homophone: true`. Cada registro de T8 y T11 indica la forma de respuesta en `input` (`opciones`, `teclado-reducido`, `teclado-completo-dispositivo`, `teclado-completo-app` o `…-por-ayuda`).
- Las ayudas 3 y 4 vuelven a mostrar las opciones o el teclado reducido, como sin teclado completo. «Lo que he escrito» lee las letras que no forman parte del programa sin locución (h, q, w) o con su sonido habitual (k, x), de modo que no invalida la actividad.
- La ayuda 2 de escritura, que resalta la primera letra, ahora se ve: la clase `hint` de las teclas no tenía estilo.
- El botón no tiene locución para el barrido con señal auditiva, porque no hay grabación de «Activar teclado completo».

Comprobado solo en Chromium (escritorio, iPad, iPhone y Pixel emulados), con selección directa, composición de un teclado en pantalla, barrido automático y de dos pulsadores, y lector ocular. Las demás actividades no cambian. En «Letra y sonido» las opciones dejan sitio a la nueva columna de botones; por debajo de 700 px de ancho el botón pasa debajo de las opciones. Falta comprobarlo en dispositivos reales, especialmente Safari en iPad (apertura del teclado del sistema) y con pulsadores físicos. Safari solo abre el teclado del sistema tras un toque, así que previsiblemente se cerrará entre actividades y habrá que volver a tocar la casilla; no se ha podido comprobar.

## Cambio 0.6.8

- Nuevo botón «Instalar» en la pantalla de inicio, después de «Qué es LECAA CAST», «Guía y marco teórico» y «Créditos», con el mismo estilo. Donde el navegador ofrece la instalación directa (Chrome, Edge, Android), abre su diálogo. En iPad, iPhone y otros navegadores sin esa opción abre una ventana con los pasos manuales. Se oculta si LECAA CAST ya funciona como aplicación instalada o al terminar la instalación.
- Se retira el botón «Instalar LECAA CAST» del panel inferior de uso sin conexión, que solo aparecía en Chrome y Edge; el panel conserva el estado de descarga y la ayuda.
- Solo cambia el script PWA y su CSS; se recalculan los hashes CSP y la versión de caché de `sw.js`.

Comprobado en Chromium (escritorio, Pixel 7 e iPad emulado, también con el agente de usuario de Mac que usa iPadOS): botón visible y con el mismo estilo, diálogo de instalación simulado, ventana de pasos en iPad y en navegadores sin instalación directa, botón oculto en modo aplicación de iOS y tras instalar. Sin errores de JavaScript ni de CSP. Falta comprobarlo en un iPad real con Safari.

## Cambio 0.6.7

- Ya no aparece en pantalla el aviso «Vista de revisión · locuciones pendientes. Esta actividad no genera resultados de aprendizaje válidos.». Antes salía cuando una locución no se podía reproducir y no desaparecía hasta volver al inicio, de modo que seguía visible en las actividades siguientes.
- El registro no cambia: la actividad en la que falla una locución sigue guardándose en el perfil como no válida (`audio_pending`), con la locución afectada en sus eventos `audio_clip`.

Comprobado en Chromium con locuciones desaprobadas a propósito en un perfil: no aparece ningún aviso, las actividades afectadas quedan registradas como `audio_pending` y las demás como válidas. Sin errores de JavaScript.
- iPad y iPhone: las locuciones se reproducen con un único elemento de audio reutilizado, que se desbloquea con el primer toque mediante un silencio breve. Antes se creaba un elemento nuevo para cada locución; con la política de iOS, que solo permite reproducir sonido a partir de un toque, las consignas que suenan solas (la presentación de cada actividad, la retroacción, las ayudas automáticas) podían quedar mudas y la actividad se registraba como `audio_pending`.

Pruebas en tabletas emuladas con Chromium (sin dispositivos físicos; WebKit no estaba disponible en el entorno de pruebas): Galaxy Tab S4 con la política de reproducción de Android, sin fallos. iPad (7.ª generación) e iPad Pro 11 con una emulación de la restricción de iOS: antes del cambio, 13 de 14 actividades sin audio; después, 0 de 32. El saludo inicial, que suena antes de cualquier toque, sigue sin poder sonar en iOS. Hay que confirmarlo en un iPad real con Safari.
- Velocidad de las locuciones: la velocidad nunca se aplicaba, porque `load()` devolvía el audio a 1× antes de sonar. Ahora se aplica tras cargar el audio, de modo que «Velocidad de la voz» y las ayudas lentas (70 % en «Escúchala», 60 % en el nivel 2 de escritura, 55 % en el modelo de lectura) suenan como estaban diseñadas. Se limita a entre 0,5× y 4×, el intervalo que admiten los navegadores sin silenciar el audio.

## Correcciones 0.6.6

- La lista de correspondencias del Plan mostraba «gu davant e i» (catalán); ahora dice «gu ante e i».
- En los gráficos de progreso, cada punto mostraba «LECAA CAST · 0.6.5» al pasar el puntero; ahora muestra la sesión y el porcentaje (por ejemplo, «S3: 75%»). El título accesible del gráfico es «Aciertos independientes con la correspondencia nueva, por sesión».

- Se retira código heredado de LECAA en catalán que LECAA CAST nunca ejecutaba: las versiones catalanas de las actividades, de la vista de sonidos y del perfil de ejemplo, las palabras clave y rimas catalanas y el acceso «cast:tap-context». Los nombres de los niveles del corpus pasan al castellano.
- Se actualiza el metadato `lecaa-revision`. El flujo `assemble.yml` se conserva; su mensaje de commit ya no lleva un número de versión fijo.

La lógica de los ejercicios, los audios y las imágenes no cambian. Comprobado en Chromium sin errores de JavaScript.
