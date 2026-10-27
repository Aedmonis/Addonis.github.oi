/*
====================================================
 PROYECTO 3 — CAFETERÍA ESCOLAR

 SISTEMA DE PEDIDOS

 Autor:
 Adonis Mauricio Guzmán Henríquez

 INCOA
 1TB Software · Código 13
 Año: 2026

 FUNCIONES:

 ✓ Comidas
 ✓ Bebidas
 ✓ Cálculo de subtotal
 ✓ Descuento del 10%
 ✓ Métodos de pago
 ✓ Guardar pedidos en TXT
 ✓ Consultar TXT
 ✓ Tabla de pedidos
 ✓ Total de ventas
 ✓ Resumen de comidas y bebidas
====================================================
*/


// ==================================================
// 1. CATÁLOGO
// ==================================================

const productos = {

    // COMIDAS

    P001: {
        nombre: "Pupusa",
        precio: 0.75,
        categoria: "Comida"
    },

    P002: {
        nombre: "Hamburguesa",
        precio: 2.50,
        categoria: "Comida"
    },

    P003: {
        nombre: "Pizza",
        precio: 2.00,
        categoria: "Comida"
    },

    P004: {
        nombre: "Taco",
        precio: 1.50,
        categoria: "Comida"
    },


    // BEBIDAS

    B001: {
        nombre: "Jugo",
        precio: 1.00,
        categoria: "Bebida"
    },

    B002: {
        nombre: "Café",
        precio: 1.25,
        categoria: "Bebida"
    },

    B003: {
        nombre: "Soda",
        precio: 1.25,
        categoria: "Bebida"
    },

    B004: {
        nombre: "Agua",
        precio: 0.75,
        categoria: "Bebida"
    },

    B005: {
        nombre: "Té frío",
        precio: 1.00,
        categoria: "Bebida"
    }

};


// ==================================================
// 2. ELEMENTOS HTML
// ==================================================

const formulario =
    document.getElementById("formularioPedido");

const cliente =
    document.getElementById("cliente");

const producto =
    document.getElementById("producto");

const cantidad =
    document.getElementById("cantidad");

const error =
    document.getElementById("error");

const resultado =
    document.getElementById("resultado");

const datosPedido =
    document.getElementById("datosPedido");

const guardar =
    document.getElementById("guardar");

const archivo =
    document.getElementById("archivo");

const cargar =
    document.getElementById("cargar");

const mensajeConsulta =
    document.getElementById("mensajeConsulta");

const tablaContenedor =
    document.getElementById("tablaContenedor");

const resumen =
    document.getElementById("resumen");

const datosResumen =
    document.getElementById("datosResumen");


// ==================================================
// 3. VARIABLES
// ==================================================

let pedidos = [];

let pedidoActual = null;


// ==================================================
// 4. FORMATEAR DINERO
// ==================================================

function dinero(numero) {

    return "$" +
        Number(numero).toFixed(2);
}


// ==================================================
// 5. GENERAR CÓDIGO
// ==================================================

function generarCodigo() {

    return String(
        pedidos.length + 1
    ).padStart(3, "0");
}


// ==================================================
// 6. REGISTRAR PEDIDO
// ==================================================

formulario.addEventListener(
    "submit",
    function(evento) {

        evento.preventDefault();

        error.textContent = "";

        resultado.style.display =
            "none";

        guardar.hidden = true;


        // ------------------------------------------
        // CAPTURAR DATOS
        // ------------------------------------------

        const nombreCliente =
            cliente.value.trim();

        const codigoProducto =
            producto.value;

        const cantidadProducto =
            Number(cantidad.value);


        // ------------------------------------------
        // VALIDAR CLIENTE
        // ------------------------------------------

        if (nombreCliente === "") {

            error.textContent =
                "⚠ Escriba el nombre del cliente.";

            return;
        }


        // ------------------------------------------
        // VALIDAR PRODUCTO
        // ------------------------------------------

        if (codigoProducto === "") {

            error.textContent =
                "⚠ Seleccione un producto o bebida.";

            return;
        }


        // ------------------------------------------
        // VALIDAR CANTIDAD
        // ------------------------------------------

        if (
            !Number.isInteger(
                cantidadProducto
            ) ||
            cantidadProducto <= 0
        ) {

            error.textContent =
                "⚠ La cantidad debe ser mayor que 0.";

            return;
        }


        // ------------------------------------------
        // BUSCAR PRODUCTO
        // ------------------------------------------

        const productoSeleccionado =
            productos[codigoProducto];


        if (!productoSeleccionado) {

            error.textContent =
                "⚠ Producto no encontrado.";

            return;
        }


        // ------------------------------------------
        // MÉTODO DE PAGO
        // ------------------------------------------

        const pagoSeleccionado =
            document.querySelector(
                'input[name="pago"]:checked'
            );


        if (!pagoSeleccionado) {

            error.textContent =
                "⚠ Seleccione un método de pago.";

            return;
        }


        const metodoPago =
            pagoSeleccionado.value;


        // ------------------------------------------
        // SUBTOTAL
        // ------------------------------------------

        const subtotal =
            productoSeleccionado.precio *
            cantidadProducto;


        // ------------------------------------------
        // DESCUENTO
        // ------------------------------------------

        let descuento = 0;


        /*
        PROMOCIÓN:

        5 unidades o más
        = 10% de descuento
        */

        if (cantidadProducto >= 5) {

            descuento =
                subtotal * 0.10;
        }


        // ------------------------------------------
        // TOTAL
        // ------------------------------------------

        const total =
            subtotal - descuento;


        // ------------------------------------------
        // CREAR OBJETO
        // ------------------------------------------

        pedidoActual = {

            codigo:
                generarCodigo(),

            cliente:
                nombreCliente,

            categoria:
                productoSeleccionado.categoria,

            producto:
                productoSeleccionado.nombre,

            cantidad:
                cantidadProducto,

            precio:
                productoSeleccionado.precio,

            subtotal:
                subtotal,

            descuento:
                descuento,

            total:
                total,

            pago:
                metodoPago

        };


        // ------------------------------------------
        // MOSTRAR
        // ------------------------------------------

        mostrarPedido(
            pedidoActual
        );


        guardar.hidden =
            false;

    }
);


// ==================================================
// 7. MOSTRAR PEDIDO
// ==================================================

function mostrarPedido(pedido) {

    datosPedido.replaceChildren();


    const informacion = [

        ["Cliente", pedido.cliente],

        ["Categoría", pedido.categoria],

        ["Producto", pedido.producto],

        ["Cantidad", pedido.cantidad],

        ["Precio", dinero(pedido.precio)],

        ["Subtotal", dinero(pedido.subtotal)],

        ["Descuento", dinero(pedido.descuento)],

        ["Pago", pedido.pago]

    ];


    informacion.forEach(
        function(item) {

            const fila =
                document.createElement("div");

            fila.className =
                "dato";


            const etiqueta =
                document.createElement("strong");

            etiqueta.textContent =
                item[0];


            const valor =
                document.createElement("span");

            valor.textContent =
                item[1];


            fila.append(
                etiqueta,
                valor
            );


            datosPedido.appendChild(
                fila
            );

        }
    );


    const total =
        document.createElement("div");

    total.className =
        "total";

    total.textContent =
        "TOTAL: " +
        dinero(pedido.total);


    datosPedido.appendChild(
        total
    );


    resultado.style.display =
        "block";
}


// ==================================================
// 8. CONVERTIR PEDIDOS A TXT
// ==================================================

function convertirATxt(lista) {

    return lista.map(
        function(pedido) {

            return [

                pedido.codigo,

                pedido.cliente,

                pedido.categoria,

                pedido.producto,

                pedido.cantidad,

                Number(
                    pedido.precio
                ).toFixed(2),

                Number(
                    pedido.subtotal
                ).toFixed(2),

                Number(
                    pedido.descuento
                ).toFixed(2),

                Number(
                    pedido.total
                ).toFixed(2),

                pedido.pago

            ].join("|");

        }
    ).join("\n");
}


// ==================================================
// 9. GUARDAR PEDIDO
// ==================================================

guardar.addEventListener(
    "click",
    function() {

        if (!pedidoActual) {

            return;
        }


        // Agregar a la lista
        pedidos.push(
            pedidoActual
        );


        // Crear contenido
        const contenido =
            convertirATxt(
                pedidos
            );


        // Crear archivo
        const blob =
            new Blob(
                [
                    contenido + "\n"
                ],
                {
                    type:
                        "text/plain;charset=utf-8"
                }
            );


        // Descargar
        const url =
            URL.createObjectURL(
                blob
            );


        const enlace =
            document.createElement("a");


        enlace.href = url;

        enlace.download =
            "pedidos.txt";


        document.body.appendChild(
            enlace
        );


        enlace.click();

        enlace.remove();


        URL.revokeObjectURL(
            url
        );


        error.style.color =
            "#73e0a3";

        error.textContent =
            "✓ Pedido guardado correctamente.";


        // Actualizar resumen
        mostrarResumen(
            pedidos
        );

    }
);


// ==================================================
// 10. CARGAR PEDIDOS.TXT
// ==================================================

cargar.addEventListener(
    "click",
    function() {

        const archivoSeleccionado =
            archivo.files[0];


        if (!archivoSeleccionado) {

            mensajeConsulta.textContent =
                "⚠ Seleccione pedidos.txt.";

            return;
        }


        const lector =
            new FileReader();


        lector.onload =
            function() {

                const contenido =
                    lector.result;


                const lineas =
                    contenido
                    .split(/\r?\n/)
                    .filter(
                        linea =>
                            linea.trim() !== ""
                    );


                const nuevosPedidos = [];


                lineas.forEach(
                    function(linea) {

                        const pedido =
                            convertirLinea(
                                linea
                            );


                        if (pedido) {

                            nuevosPedidos.push(
                                pedido
                            );
                        }

                    }
                );


                pedidos =
                    nuevosPedidos;


                mensajeConsulta.textContent =
                    "✓ " +
                    pedidos.length +
                    " pedidos cargados correctamente.";


                mostrarTabla(
                    pedidos
                );


                mostrarResumen(
                    pedidos
                );

            };


        lector.onerror =
            function() {

                mensajeConsulta.textContent =
                    "⚠ Error al leer el archivo.";

            };


        lector.readAsText(
            archivoSeleccionado
        );

    }
);


// ==================================================
// 11. CONVERTIR TXT A OBJETO
// ==================================================

function convertirLinea(linea) {

    const partes =
        linea.split("|");


    if (partes.length !== 10) {

        return null;
    }


    return {

        codigo:
            partes[0],

        cliente:
            partes[1],

        categoria:
            partes[2],

        producto:
            partes[3],

        cantidad:
            Number(partes[4]),

        precio:
            Number(partes[5]),

        subtotal:
            Number(partes[6]),

        descuento:
            Number(partes[7]),

        total:
            Number(partes[8]),

        pago:
            partes[9]

    };
}


// ==================================================
// 12. MOSTRAR TABLA
// ==================================================

function mostrarTabla(lista) {

    tablaContenedor.replaceChildren();


    if (lista.length === 0) {

        mensajeConsulta.textContent =
            "No hay pedidos registrados.";

        return;
    }


    const tabla =
        document.createElement("table");


    const thead =
        document.createElement("thead");


    const filaTitulos =
        document.createElement("tr");


    const titulos = [

        "Código",
        "Cliente",
        "Categoría",
        "Producto",
        "Cantidad",
        "Total"

    ];


    titulos.forEach(
        function(titulo) {

            const th =
                document.createElement("th");

            th.textContent =
                titulo;

            filaTitulos.appendChild(
                th
            );

        }
    );


    thead.appendChild(
        filaTitulos
    );


    const tbody =
        document.createElement("tbody");


    lista.forEach(
        function(pedido) {

            const fila =
                document.createElement("tr");


            const datos = [

                pedido.codigo,

                pedido.cliente,

                pedido.categoria,

                pedido.producto,

                pedido.cantidad,

                dinero(pedido.total)

            ];


            datos.forEach(
                function(valor) {

                    const td =
                        document.createElement("td");

                    td.textContent =
                        valor;

                    fila.appendChild(
                        td
                    );

                }
            );


            tbody.appendChild(
                fila
            );

        }
    );


    tabla.append(
        thead,
        tbody
    );


    tablaContenedor.appendChild(
        tabla
    );
}


// ==================================================
// 13. RESUMEN DE VENTAS
// ==================================================

function mostrarResumen(lista) {

    datosResumen.replaceChildren();


    if (lista.length === 0) {

        resumen.hidden = true;

        return;
    }


    // ----------------------------------------------
    // TOTAL DE VENTAS
    // ----------------------------------------------

    const ventas =
        lista.reduce(
            function(total, pedido) {

                return total +
                    Number(pedido.total);

            },
            0
        );


    // ----------------------------------------------
    // COMIDAS
    // ----------------------------------------------

    const comidas =
        lista.filter(
            pedido =>
                pedido.categoria === "Comida"
        );


    // ----------------------------------------------
    // BEBIDAS
    // ----------------------------------------------

    const bebidas =
        lista.filter(
            pedido =>
                pedido.categoria === "Bebida"
        );


    // ----------------------------------------------
    // PEDIDOS
    // ----------------------------------------------

    const pedidosTexto =
        document.createElement("p");

    pedidosTexto.textContent =
        "🛒 Pedidos registrados: " +
        lista.length;


    // ----------------------------------------------
    // COMIDAS
    // ----------------------------------------------

    const comidasTexto =
        document.createElement("p");

    comidasTexto.textContent =
        "🍔 Pedidos de comida: " +
        comidas.length;


    // ----------------------------------------------
    // BEBIDAS
    // ----------------------------------------------

    const bebidasTexto =
        document.createElement("p");

    bebidasTexto.textContent =
        "🥤 Pedidos de bebida: " +
        bebidas.length;


    // ----------------------------------------------
    // TOTAL
    // ----------------------------------------------

    const ventasTexto =
        document.createElement("p");

    ventasTexto.textContent =
        "💰 TOTAL DE VENTAS";


    const total =
        document.createElement("span");

    total.className =
        "ventas";

    total.textContent =
        dinero(ventas);


    datosResumen.append(

        pedidosTexto,

        comidasTexto,

        bebidasTexto,

        ventasTexto,

        total

    );


    resumen.hidden =
        false;
}