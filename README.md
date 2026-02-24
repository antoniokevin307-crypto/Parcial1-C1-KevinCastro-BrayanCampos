# Sistema POS "Calanza el Nahual" - Parcial I

## 1. Situación Problemática
**Enunciado:** La Pupusería Calanza el Nahual en San Miguel necesitaba modernizar su toma de pedidos. El sistema anterior era manual y no permitía gestionar órdenes complejas con múltiples sabores y bebidas. Además, si se entregaba un pedido por error, no había forma de recuperarlo. Se diseñó esta solución para automatizar el cálculo de totales, gestionar tiempos de entrega y mantener la persistencia de datos.

**Sectores enfocados:** Sector gastronómico y pequeños negocios de comida típica.

---

## 2. Respuestas a la Evaluación

### ¿Qué valor agregado tiene el uso de webcomponents a su proyecto?
Permite encapsular cada orden en un componente autónomo (`<orden-nahual>`). Esto facilita que cada pedido maneje su propio cronómetro, estados visuales y desglose de productos de forma independiente, haciendo el código modular y fácil de escalar.

### ¿De qué forma manipularon los datos sin recargar la página?
Se utilizó el evento `submit` con `preventDefault()` y se guardó la información en un arreglo de objetos. Los datos se persisten en el `localStorage` del navegador y la interfaz se actualiza dinámicamente inyectando los WebComponents en el DOM.

### ¿De qué forma validaron las entradas de datos?
Se aplicaron validaciones en JavaScript para asegurar que el nombre del cliente no esté vacío, que se seleccione al menos un producto y que las cantidades sean números enteros positivos antes de procesar la orden.

### ¿Cómo manejaría la escalabilidad futura en su página?
Se podría integrar una base de datos en tiempo real (como Firebase) para sincronizar pedidos entre la caja y la cocina, y añadir un módulo de facturación electrónica conforme a las leyes vigentes.