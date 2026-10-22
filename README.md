# LECAA CAST

Lectura y escritura en castellano para alumnos que utilizan comunicación aumentativa y alternativa (CAA).

Versión **0.6.4**: publicación web y PWA a partir del HTML autónomo aprobado 0.6.3. Se conservan las actividades, las mecánicas, las ilustraciones, los vídeos, las fuentes y todos los audios incorporados. Voz femenina sintética generada con ElevenLabs.

## Uso e instalación

Abre https://utacub.github.io/lecaa_cast/ en un navegador actualizado. En Chrome o Edge, utiliza la opción de instalación del navegador o «Instalar LECAA CAST» cuando aparezca. En iPhone o iPad, abre la página en Safari y elige Compartir → Añadir a la pantalla de inicio.

La primera descarga incluye el programa completo, unos 97 MB. Espera al mensaje **«Lista para usar sin conexión: imágenes y audios incluidos»** antes de desconectarte. Las siguientes aperturas pueden funcionar sin conexión. Los navegadores pueden eliminar los datos locales si se borra su almacenamiento o falta espacio; conserva copias de seguridad de los perfiles.

Los perfiles, configuraciones y sesiones se guardan en este navegador y dispositivo. Una instalación desde otro navegador no los transfiere automáticamente. No se envían los datos de los alumnos al repositorio ni a un servidor.

## Publicación y mantenimiento

Publica la rama `main`, carpeta raíz `/`, en GitHub Pages. No requiere compilación ni servicios externos. `index.html` es autónomo; `manifest.webmanifest`, `sw.js` e `icons/` añaden la instalación PWA.

- Identidad, inicio y ámbito: `/lecaa_cast/`.
- Cachés exclusivos con prefijo `lecaa-cast-`.
- Datos de perfiles: `lecaa.cast.v1`; multimedia local: IndexedDB `lecaa-cast-media`.
- Al cambiar recursos, cambia la versión de la caché de `sw.js`. Las actualizaciones esperan a que se cierren todas las ventanas de LECAA CAST; no interrumpen sesiones.
- Al modificar un script incrustado, recalcula su hash SHA-256 en la política CSP de `index.html`.
- Conserva los créditos y avisos de terceros incluidos en el programa.

## Validación de esta publicación

Comprobados en Chromium: arranque online, manifiesto e iconos válidos, ausencia de errores de instalabilidad, registro y control del service worker, precarga íntegra, recarga offline, reproducción real offline de la locución «Muy bien, no riman.», conservación de datos y de una caché de otra aplicación, y créditos aprobados. Sin errores de consola ni de JavaScript. Los 2.972 recursos incrustados (2.968 únicos) mantienen exactamente sus datos originales; la lógica de ejercicios de 0.6.3 no se ha modificado.

Estas pruebas de publicación no sustituyen la valoración con dispositivos físicos de acceso ni implican que se haya vuelto a auditar cada actividad o escuchado cada audio. La instalación en iOS debe comprobarse en un dispositivo físico.
