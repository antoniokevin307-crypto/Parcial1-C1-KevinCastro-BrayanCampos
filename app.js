let carritoActual = [];

// FUNCIONALIDAD DEL CARRITO
function agregarAlCarrito(tipo) {
    const select = document.getElementById(`item-${tipo}`);
    const nombre = select.value;
    const precio = parseFloat(select.options[select.selectedIndex].dataset.p);
    const cant = parseInt(document.getElementById(`cant-${tipo}`).value);
    
    if (cant <= 0) return;

    const existe = carritoActual.find(i => i.nombre === nombre);
    if(existe) {
        existe.cant += cant;
        existe.subtotal = existe.cant * existe.precio;
    } else {
        carritoActual.push({ nombre, precio, cant, subtotal: precio * cant });
    }
    actualizarResumen();
}

function actualizarResumen() {
    const lista = document.getElementById('lista-items');
    lista.innerHTML = '';
    let total = 0;
    carritoActual.forEach((item, index) => {
        total += item.subtotal;
        lista.innerHTML += `<li>
            <span><strong>${item.cant}x</strong> ${item.nombre}</span>
            <span>$${item.subtotal.toFixed(2)} <button onclick="eliminarDelCarrito(${index})">✕</button></span>
        </li>`;
    });
    document.getElementById('total-temporal').innerText = `Total: $${total.toFixed(2)}`;
}

function eliminarDelCarrito(index) {
    carritoActual.splice(index, 1);
    actualizarResumen();
}

// GUARDAR EN LOCALSTORAGE
function finalizarOrden() {
    const cliente = document.getElementById('cliente').value.trim();
    if (!cliente || carritoActual.length === 0) return alert("¡Ey! Poné el nombre y agregá algo al pedido.");

    const nuevaOrden = {
        id: Date.now(),
        cliente: cliente,
        items: [...carritoActual],
        total: carritoActual.reduce((acc, i) => acc + i.subtotal, 0).toFixed(2),
        estado: 'pendiente',
        tiempo: 1800
    };

    let ordenes = JSON.parse(localStorage.getItem('calanza_db')) || [];
    ordenes.push(nuevaOrden);
    localStorage.setItem('calanza_db', JSON.stringify(ordenes));

    carritoActual = [];
    document.getElementById('cliente').value = '';
    actualizarResumen();
    verPantalla('cocina');
}

// TICKET (MODAL GLOBAL)
window.mostrarTicket = function(cliente, itemsJson, total) {
    const items = JSON.parse(decodeURIComponent(itemsJson));
    const modal = document.getElementById('modal-ticket');
    const contenido = document.getElementById('contenido-ticket');
    
    let lineas = items.map(i => `
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <span>${i.cant}x ${i.nombre}</span>
            <span>$${i.subtotal.toFixed(2)}</span>
        </div>
    `).join('');

    contenido.innerHTML = `
        <div class="ticket-header">
            <h3>Calanza el Nahual</h3>
            <p>Cliente: <strong>${cliente}</strong></p>
        </div>
        <div class="ticket-body">
            ${lineas}
            <div style="text-align:right; font-weight:bold; margin-top:15px; border-top:2px solid #000; padding-top:10px; font-size:18px;">
                TOTAL: $${total}
            </div>
        </div>`;
    modal.style.display = 'flex';
}

function cerrarTicket() { document.getElementById('modal-ticket').style.display = 'none'; }

// WEBCOMPONENT DE LA ORDEN
class OrdenNahual extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }

    connectedCallback() { this.render(); this.iniciarReloj(); }

    iniciarReloj() {
        this.timer = setInterval(() => {
            let t = parseInt(this.getAttribute('tiempo'));
            if (t > 0 && this.getAttribute('estado') === 'pendiente') {
                this.setAttribute('tiempo', t - 1);
                this.render();
            }
        }, 1000);
    }

    cambiarEstado(est) {
        const id = this.getAttribute('id-p');
        let ordenes = JSON.parse(localStorage.getItem('calanza_db'));
        ordenes.find(o => o.id == id).estado = est;
        localStorage.setItem('calanza_db', JSON.stringify(ordenes));
        renderizarCocina();
    }

    render() {
        const est = this.getAttribute('estado');
        const t = parseInt(this.getAttribute('tiempo'));
        const m = Math.floor(t / 60);
        const s = t % 60;
        const items = this.getAttribute('items');
        const cliente = this.getAttribute('cliente');
        const total = this.getAttribute('total');

        this.shadowRoot.innerHTML = `
        <style>
            .card { background: white; border-radius: 12px; padding: 20px; border: 1px solid #ddd; position: relative; font-family: sans-serif; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .blur-area { transition: 0.3s; ${est !== 'pendiente' ? 'filter: blur(3px) grayscale(1); pointer-events: none;' : ''} }
            .overlay-text { position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; font-size: 1.8rem; z-index: 10; color: #333; text-transform: uppercase; display: ${est !== 'pendiente' ? 'block' : 'none'}; }
            
            h3 { margin: 0 0 10px 0; color: #0c1b98; }
            .timer { font-size: 1.4rem; font-weight: bold; margin: 10px 0; color: ${t < 300 ? '#dc3545' : '#0c1b98'}; }
            
            .btn { padding: 12px; border: none; border-radius: 8px; cursor: pointer; color: white; font-weight: bold; width: 100%; margin-top: 10px; font-size: 14px; transition: 0.2s; }
            .btn:active { transform: scale(0.98); }
            .btn-ticket { background: #6f42c1; }
            .btn-entregar { background: #28a745; width: 48%; }
            .btn-cancelar { background: #dc3545; width: 48%; }
            .btn-reintegrar { background: #333; margin-top: 15px; border: 2px solid #000; }
            
            .flex { display: flex; justify-content: space-between; }
        </style>
        
        <div class="card">
            <div class="overlay-text">${est}</div>
            
            <div class="blur-area">
                <h3>${cliente}</h3>
                <p>Monto: <strong>$${total}</strong></p>
                <p class="timer">⏳ ${m}:${s < 10 ? '0' : ''}${s}</p>
                
                <button class="btn btn-ticket" onclick="window.mostrarTicket('${cliente}', '${encodeURIComponent(items)}', '${total}')">📄 VER TICKET DETALLADO</button>
                
                <div class="flex">
                    <button class="btn btn-entregar" onclick="this.getRootNode().host.cambiarEstado('entregado')">ENTREGAR</button>
                    <button class="btn btn-cancelar" onclick="this.getRootNode().host.cambiarEstado('cancelado')">CANCELAR</button>
                </div>
            </div>

            ${est !== 'pendiente' ? `
                <button class="btn btn-reintegrar" onclick="this.getRootNode().host.cambiarEstado('pendiente')">
                    ↩ REINTEGRAR PEDIDO A COCINA
                </button>
            ` : ''}
        </div>`;
    }
}
customElements.define('orden-nahual', OrdenNahual);

function verPantalla(id) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if(id === 'cocina') renderizarCocina();
}

function renderizarCocina() {
    const cont = document.getElementById('contenedor-pedidos');
    cont.innerHTML = '';
    const ordenes = JSON.parse(localStorage.getItem('calanza_db')) || [];
    ordenes.forEach(o => {
        const el = document.createElement('orden-nahual');
        el.setAttribute('id-p', o.id);
        el.setAttribute('cliente', o.cliente);
        el.setAttribute('total', o.total);
        el.setAttribute('items', JSON.stringify(o.items));
        el.setAttribute('estado', o.estado);
        el.setAttribute('tiempo', o.tiempo);
        cont.appendChild(el);
    });
}
document.addEventListener('DOMContentLoaded', renderizarCocina);