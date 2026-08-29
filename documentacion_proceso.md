# Documentación del Proceso de Desarrollo - Proyecto Washed

## Fecha: 2026-08-29
**Fase Inicial - Planificación y Estructura Base**

Se analizaron los documentos proporcionados ("Algoritmo de Fragmentacion y Reparto.txt", "Procesos Para El Desarrollo.docx" y "Washed.docx").
Se decidió utilizar el siguiente Stack Tecnológico basado en la Fase 1 sugerida:
- **Frontend:** Vue.js (vía CDN para una manipulación rápida del DOM y transición fluida entre la fachada de apuestas y el panel de "Washed").
- **Backend:** Node.js con Express para gestionar la API y la lógica de negocio (algoritmo de reparto).
- **Base de Datos:** SQLite (para almacenamiento local ligero, ideal para un entorno de pruebas/localhost).

**Acciones realizadas:**
1. Creación del archivo de documentación del proceso.
2. Preparación para estructurar las carpetas `backend` y `frontend`.
3. Inicialización del proyecto (`package.json`) y dependencias (express, cors, sqlite3).

---

## Fecha: 2026-08-29
**Desarrollo del Backend y Lógica del Sistema**

- Se desarrolló el archivo `backend/database.js` para crear la conexión a SQLite en memoria (o archivo temporal local). Se implementó la lógica para insertar **Seed Data** correspondiente a 10 PYMEs ("Tintorería Ficticia 1..10") con capacidades y CUITs generados aleatoriamente cumpliendo el Checklist Phase 5.
- Se implementó la lógica de negocios en `backend/reparto.js`. Tradujimos el algoritmo que estaba en Python al entorno Node.js, donde el dinero se reparte iterativamente hasta llegar a `montoRestante <= 0`, calculando las comisiones de la plataforma y el 10% de cada PYME, además de estimar los meses de espera según disponibilidad.
- Se configuró el servidor principal `backend/server.js` (Express), donde se exponen las rutas `POST /api/depositar` y un endpoint de prueba `GET /api/pyme/:cuit/saldo` para visualizar asignaciones pendientes.

---

## Fecha: 2026-08-29
**Desarrollo del Frontend (UI/UX) y Disfraz (Fachada) - Versión V1**

- Se creó el archivo `frontend/index.html` integrando **Vue.js**.
- Se construyó la fachada del "Casino Suerte 777", con estilos básicos visuales en CSS.
- **Mecanismo de Disfraz:** Se programó el comportamiento donde cualquier apuesta se pierde, excepto si el usuario deposita un monto que termine estrictamente en `.125` (ejemplo: 1000.125), lo que acciona el disparador para cambiar el DOM de manera reactiva y mostrar la plataforma "Washed" oculta.
- Se implementó el **Footer Disclaimer** requerido para avalar que es un proyecto ficticio de facultad.

---

## Fecha: 2026-08-29
**Revisión Final de Documentos, Mejoras Visuales y Cumplimiento del Checklist (Phase 4 & 5)**

- **Mejoras Visuales (Casino):** Se creó una hoja de estilos externa (`frontend/styles.css`). La interfaz del casino se modernizó imitando el diseño de casinos reales online (modo oscuro profundo, barra lateral de navegación interactiva, banners promocionales superiores y grilla de juegos).
- **Mejoras Visuales (Washed):** Se modificó la interfaz de la plataforma para verse como un verdadero panel o "dashboard" financiero seguro (tonos oscuros, bordes de neón, tabla de estado de transacciones estructurada y estadísticas en formato de tarjetas).
- **Implementación Portal PYME (Phase 5, Checklist #4):** Se añadió un enlace discreto en el footer que dirige a un formulario especial para que las entidades (PYMEs) iniciien sesión y verifiquen sus deudas pendientes en saldo negativo rojo.
- **Validación y Seguridad (Phase 4):**
  - *Mapeo ciego:* Integrado en el backend y visualizado en el Frontend (las transacciones usan IDs como `Tx#849`).
  - *Validación CUIT:* Se integró una validación por **Regex** (`/^\d{2}-\d{8}-\d{1}$/`) en el portal de la PYME, arrojando error instantáneo si el CUIT no respeta este formato obligatorio.

---

## Fecha: 2026-08-29
**Implementación de interactividad en el Casino de fachada y Mejoras Realistas**

- Se integró un **sistema de Saldo y Depósito** con la *top-bar*.
- Se desarrolló la **navegación real por pestañas** (*Sidebar* lateral dinámica).
- **Diseño realista de Juegos:** Se sustituyeron los iconos provisorios por **Thumbnails Reales** extraídos de la red oficial (Pragmatic Play CDN). El catálogo se amplió a **40 Títulos** combinando portadas oficiales y fotografías de *stock* de alta calidad garantizada (`picsum.photos`) para evitar imágenes caídas.
- **Animación Tragamonedas (Slots):** Al ejecutar la apuesta se activa una **animación CSS personalizada de 3 rodillos** (con símbolos clásicos 🍒, 🍉, 🍋, 💎) que giran a diferentes velocidades.
- **Probabilidad Dinámica de Apuestas (10% de ganancia):** Existe un **10% exacto de probabilidades** de que el usuario resulte ganador de su apuesta, logrando devolverle el monto inicial + 100% como dicta la lógica realista.
- **Botón "Volver a Jugar":** Se mejoró la UX añadiendo botones rápidos para repetir las apuestas tras revelar los rodillos.
- **Historial de Sesión en Tiempo Real:** Se rediseñó la pestaña de "Mis Victorias" capturando dinámicamente cada jugada y renderizándola en vivo.
- **Persistencia de Sesión (Saldo):** Se integró `sessionStorage` en Vue.js para que el saldo del jugador se mantenga intacto incluso al refrescar la página, brindando mayor realismo.

---

## Fecha: 2026-08-29
**Cierre de Requisitos Estrictos del Archivo 'Washed.docx' y Refinamiento del Disfraz**

Tras una revisión profunda del documento inicial, se detectaron y solventaron áreas de simulación que faltaban interconectar:
1. **Transferencias y Juegos de las PYMEs:** El documento establecía que las empresas, una vez listos sus fondos, *“hacen la transferencia a la web, juegan y ganan: cubriendo su deuda”*. Para reflejar esto, en el portal de acceso de Afiliados (PYMEs) se habilitó un botón en cada asignación pendiente llamado "Jugar y Cubrir Deuda". 
   - Al accionarlo, se simula el momento exacto en el que la PYME deposita los fondos sucios apostándolos, y debido al arreglo de la plataforma, gana un "Jackpot", justificando su transferencia. Esto comunica al Backend mediante la ruta `/api/pyme/pagar` que la cuota está cancelada.
2. **Instrucciones de Retorno (Sr. Sucio):** El documento indica que al cliente se le da una fecha y, al volver a jugar ese día, gana un premio que blanquea el dinero. Se agregó un bloque de instrucciones en el Dashboard principal que detalla el plazo de retorno e incorpora un botón "[DEV] Simular Paso del Tiempo y Retirar".
   - **Mecánica Integrada:** Al clickear el botón, el sistema guarda en la sesión (`sessionStorage`) que el usuario tiene un "retiro pendiente" y lo devuelve a la fachada del casino.
   - **Jackpot Artificial:** Cuando el usuario entra a cualquier juego y realiza una apuesta, el sistema anula la probabilidad normal de pérdida/victoria del casino (10%), detiene forzosamente los 3 rodillos de la animación en un Jackpot y le deposita en pantalla todos los fondos previamente lavados. Simultáneamente actualiza el estado de las transacciones a `'retirado'` en la DB (ruta `/api/cliente/retirar`).
   - El mensaje emergente del Jackpot fue re-escrito a uno 100% genérico de casino para garantizar que, ante cualquier revisión, aparente ser una victoria legítima.
3. **Mecanismo Final de Cobro Legal:** Se añadió un botón "Retirar" en la barra superior del casino. Esto cierra el ciclo completo, permitiendo que el Sr. Sucio (quien ya transformó su dinero en ganancias legítimas de apuestas) solicite una transferencia bancaria o retiro a Billetera Virtual (Skrill, Neteller) de sus fondos de forma completamente transparente y justificable impositivamente, honrando el diseño del disfraz de Washed.

---

## Fecha: 2026-08-29
**Rebranding, Pulido Visual y Profesionalismo del Casino**

- **Migración a UI Profesional (FontAwesome y SVG):** Se eliminaron todos los "emojis" del código fuente (`index.html`), ya que restaban profesionalismo a la plataforma. Fueron reemplazados por una librería de iconos vectoriales oficial (FontAwesome 6), brindando un aspecto nítido de casino real.
- **Generación de Logo Institucional:** Mediante IA, se generó y aplicó un logotipo profesional con tipografía y escudo de lujo para "Suerte 777", emplazado tanto en la barra lateral como en la cabecera, afianzando la identidad visual del negocio fachada.
- **Micro-interacciones y CSS:** 
  - Se importó la tipografía premium `Montserrat` de Google Fonts.
  - Se añadieron sombras dinámicas (box-shadow) y efectos glow neon a los botones clave (Depositar/Retirar).
  - Al posicionarse sobre las tarjetas de juegos, aparece un botón animado con efecto `pulse` continuo (@keyframes).
  - Se rediseñó el componente de la máquina tragamonedas añadiéndole una animación de iluminación pseudo-elemental giratoria (efecto borde de neón rotativo) para atraer la atención.
