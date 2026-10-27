# LECAA CAST

Lectura y escritura en castellano para alumnos que utilizan comunicación aumentativa y alternativa (CAA).

Versión **0.6.7**: publicación web y PWA a partir del HTML autónomo aprobado 0.6.3. Se conservan las actividades, las mecánicas, las ilustraciones, los vídeos, las fuentes y todos los audios incorporados. Voz femenina sintética generada con ElevenLabs.

## Uso e instalación

Abre https://utacub.github.io/lecaa_cast/ en un navegador actualizado. En Chrome o Edge, utiliza la opción de instalación del navegador o «Instalar LECAA CAST» cuando aparezca. En iPhone o iPad, abre la página en Safari y elige Compartir → Añadir a la pantalla de inicio.

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

## Cambio 0.6.7

- Ya no aparece en pantalla el aviso «Vista de revisión · locuciones pendientes. Esta actividad no genera resultados de aprendizaje válidos.». Antes salía cuando una locución no se podía reproducir y no desaparecía hasta volver al inicio, de modo que seguía visible en las actividades siguientes.
- El registro no cambia: la actividad en la que falla una locución sigue guardándose en el perfil como no válida (`audio_pending`), con la locución afectada en sus eventos `audio_clip`.

Comprobado en Chromium con locuciones desaprobadas a propósito en un perfil: no aparece ningún aviso, las actividades afectadas quedan registradas como `audio_pending` y las demás como válidas. Sin errores de JavaScript.

## Correcciones 0.6.6

- La lista de correspondencias del Plan mostraba «gu davant e i» (catalán); ahora dice «gu ante e i».
- En los gráficos de progreso, cada punto mostraba «LECAA CAST · 0.6.5» al pasar el puntero; ahora muestra la sesión y el porcentaje (por ejemplo, «S3: 75%»). El título accesible del gráfico es «Aciertos independientes con la correspondencia nueva, por sesión».

- Se retira código heredado de LECAA en catalán que LECAA CAST nunca ejecutaba: las versiones catalanas de las actividades, de la vista de sonidos y del perfil de ejemplo, las palabras clave y rimas catalanas y el acceso «cast:tap-context». Los nombres de los niveles del corpus pasan al castellano.
- Se actualiza el metadato `lecaa-revision`. El flujo `assemble.yml` se conserva; su mensaje de commit ya no lleva un número de versión fijo.

La lógica de los ejercicios, los audios y las imágenes no cambian. Comprobado en Chromium sin errores de JavaScript.
