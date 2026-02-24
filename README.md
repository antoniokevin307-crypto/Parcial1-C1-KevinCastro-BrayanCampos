# Parcial Primer Cómputo - Programación Computacional IV

## 1. Situación Problemática
**Enunciado:** En las pupuserías locales de San Miguel, el proceso de toma de pedidos suele ser desordenado durante las horas pico. Los clientes tienen que esperar mucho tiempo para ser atendidos y los encargados a menudo cometen errores al calcular el total de la cuenta manualmente o al anotar los sabores solicitados. [cite_start]Esto genera una mala experiencia para el cliente y pérdidas de tiempo para el negocio. [cite: 7, 8]

[cite_start]**Sectores enfocados:** Esta solución va dirigida al sector gastronómico, específicamente a pequeñas y medianas pupuserías o emprendimientos de comida típica que buscan digitalizar su atención al cliente de forma sencilla y rápida. [cite: 9]

---

## 2. Respuestas a Preguntas de Evaluación

### ¿Qué valor agregado tiene el uso de webcomponents a su proyecto?
El uso de **WebComponents** nos permite crear etiquetas personalizadas (como nuestro `<ticket-salida>`) que encapsulan su propio diseño y lógica. [cite_start]Esto significa que el código es más limpio, modular y fácil de mantener, ya que el "ticket" funciona de forma independiente al resto de la página. [cite: 11, 15]

### ¿De qué forma manipularon los datos sin recargar la página?
Para evitar que la página se refresque, utilizamos el evento `submit` del formulario y aplicamos el método `event.preventDefault()`. [cite_start]Luego, mediante JavaScript, capturamos los valores de los inputs y actualizamos el contenido del WebComponent directamente en el DOM en tiempo real. [cite: 12, 16]

### ¿De qué forma validaron las entradas de datos?
Se aplicó una validación del lado del cliente mediante condicionales `if` en JavaScript. [cite_start]El programa verifica que el campo de nombre no esté vacío (usando `.trim()` para quitar espacios), que se haya seleccionado un sabor del menú y que la cantidad sea un número mayor a cero antes de procesar el pedido. [cite: 13, 17]

### ¿Cómo manejaría la escalabilidad futura en su página?
[cite_start]Gracias a la arquitectura basada en componentes, para escalar el sistema podríamos crear nuevos WebComponents para gestionar inventarios, agregar un carrito de compras con más productos o conectar la lógica a una API externa para guardar los pedidos en una base de datos sin necesidad de reescribir todo el código existente. [cite: 18]