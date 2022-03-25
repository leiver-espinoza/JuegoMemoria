// Esta es la variable que controla cuántos elementos se consideran en el tablero en cada eje (XY)
var nivel = 4;

// Esta variable es una bandera que indica si se ejecutan las acciones al hacer click en una ficha
var procesando = false;

// En esta variable se almacena el número calculado de la cantidad de fichas que se desean utilizar
// con base al nivel especificado
var cantidad_fichas;

// Objeto para guardar el tablero del memoria 
var tablero_memoria;

// Estas dos variables almacenan los valores de las dos fichas del tablero seleccionadas
var ficha1 = ""
var ficha2 = "";
var v1 = "";
var v2 = "";

// Pantalla de inicio, apenas se abre la sesión del juego
//var seccion_de_inicio = document.getElementById('nivel_completado');
seccion_de_inicio = $('#seccion_de_inicio');

// Objeto que se llama cuando el tablero es resuelto
var nivel_completado = $('#nivel_completado');

// Esta rutina inicia el juego, definiendo la cantidad de fichas
// tanto en el eje X como Y para crear el tablero.
function IniciarJuego() {

    //Se calculan la cantidad de fichas en el arreglo. El "-1" es el espacio en blanco en el tablero
    cantidad_fichas = Math.pow(nivel, 2);

    //Se oculan la pantalla principal y el mensaje de resultad completado en caso de estar visibles.
    seccion_de_inicio.hide();
    nivel_completado.hide();

    //Se llama el método para dibujar el tablero, dando inicio al juego, una vez configurados los parámetros
    dibujar();
}

// Esta rutina crea dinámicamente los elementos del tablero y los eventos asociados a ellos.
// Dicha funcionalidad se puede ver en este URL https://www.w3schools.com/jsref/met_document_createelement.asp
// pero se cambió para que se ejecutara con jQuery
// Esto es prácticamente crear instancias de objetos y métodos.
function dibujar() {
    // Se crea el div que contiene todos los elementos dentro
    tablero_memoria =  $('<div></div>').appendTo('body');

    // Le asigna la clase al elemento
    tablero_memoria.addClass('tablero_memoria')

    // El ancho y la altura se configuran con base a la cantidad de fichas con las que cuenta el tablero,
    // usando como referencia que cada ficha mide 15 vh/vw
    tablero_memoria.width('80vw').height('80vh');

    var valoresBase = [];
    for (i = cantidad_fichas/2; i >= 1; i--) {
        valoresBase.push(i);
    }
    var valoresAdicionales = [];
    for (i = cantidad_fichas/2; i >= 1; i--) {
        valoresAdicionales.push(i);
    }
    
    $.merge(valoresBase,valoresAdicionales);
    revolver(valoresBase);

    for(nFicha = 0; nFicha < cantidad_fichas; nFicha++) {
        // Este método agrega un una nueva ficha dentro del DIV
        crear_ficha(tablero_memoria, nFicha, valoresBase[nFicha]);
    }

    // Se crea el div para llevar el control de las fichas pendientes
    conteo_fichas =  $('<div id="contador_fichas"></div>').appendTo('body');
    conteo_fichas.addClass('contador_fichas');
    validarJuegoTerminado();

    conteo_fichas =  $('<div id="mensaje_resultado"></div>').appendTo('body');
    conteo_fichas.addClass('mensaje_resultado');
}

// Método para agregar el código HTML de una nueva ficha
function crear_ficha(parent, id, valor) {
    // Cada ficha se crea como un "DIV" dentro de un objeto
    var ficha = $('<div id="ficha' + id + '"></div>');
    
    // Se le asigna el número a la ficha
    ficha.textContent = i;

    // Se le agrega la clase
    ficha.addClass('ficha');
    ficha.width(((80/nivel)-1) + 'vw').height(((80/nivel)-1) + 'vh');
    ficha.addClass('n' + valor);
    
    // Se agrega el objeto al código HTML
    ficha.appendTo(parent);
    ficha.click(function() {mostrar(this)});

    // Se le asigna el evento
}

// Este es el método que se agrega a cada una de las fichas de forma dinámica
function mostrar(ficha) {
    // Se busca la segunda clase en el objeto ficha, el cual corresponde al número asignado a la ficha
    if (!procesando) {
        // Se dividen las clases utilizando el espacio y se toma el elemento en la posición 1, que corresponde al número
        // de la ficha
        var valorFicha = $('#' + ficha.id).attr('class').split(' ')[1].substring(1);

        if (ficha1 == "") {
            ficha1 = ficha;
            $('#' + ficha1.id).text(valorFicha);
            v1 = $('#' + ficha1.id).attr('class').split(' ')[1].substring(1);
        } else {
            ficha2 = ficha;
            if (ficha1 != ficha2) {
                $('#' + ficha2.id).text(valorFicha);
                v2 = $('#' + ficha2.id).attr('class').split(' ')[1].substring(1);
                
                if ((v1 == v2) && (ficha1 != ficha2)) {
                    aplicarSeleccion("Es un match!",ficha1, ficha2);
                } else {
                    aplicarSeleccion("Oooops!",ficha1, ficha2);
                }
                ficha1 = "";
                ficha2 = "";
            }
        }
    }
};

// Este método revolverá las fichas del tablero
function revolver(valores) {
    var posicionActual = valores.length;
    while (posicionActual != 0) {
        // Selecciona una ficha de forma aleatoria
        posicionAleatoria = Math.floor(Math.random() * posicionActual);
        posicionActual--;
        // Realiza el cambio de posicion de las fichas
        [valores[posicionActual], valores[posicionAleatoria]] = [valores[posicionAleatoria], valores[posicionActual]];
    }
    return valores;
}

function validarJuegoTerminado() {
    var fichasPendientes = $('.ficha').length;
    $('#contador_fichas').text("Pendientes: " + fichasPendientes);
    if (fichasPendientes == 0) {
        $('#nivel_completado').show();
        tablero_memoria.remove();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function aplicarSeleccion(texto, ficha1, ficha2) {
    procesando = true;
    sleep(0).then(() => {
        $('#mensaje_resultado').show();
        $('#mensaje_resultado').text(texto);
    }).then(() =>
        sleep(1000)).then(() => {
            $('#mensaje_resultado').hide();
            $('#mensaje_resultado').text("");
            sleep(500).then(() => {
                if ((v1 == v2) && (ficha1 != ficha2)) {
                    $('#' + ficha1.id).text("");
                    $('#' + ficha2.id).text("");
                    $('#' + ficha1.id).removeClass();
                    $('#' + ficha2.id).removeClass();
                    $('#' + ficha1.id).addClass('ficha_inactiva');
                    $('#' + ficha2.id).addClass('ficha_inactiva');
                    $('#' + ficha1.id).off("click");
                    $('#' + ficha2.id).off("click");
                    validarJuegoTerminado()
                } else {
                    $('#' + ficha1.id).text("");
                    $('#' + ficha2.id).text("");
                }
            procesando = false;
            })
        })
}