document.addEventListener('DOMContentLoaded', function() {
    const bingoForm = document.getElementById('bingo-form');
    const inputNombre = document.getElementById('nombre-jugador');
    const btnAgregar = document.getElementById('agregar-jugador');
    const btnEliminar = document.getElementById('eliminar-jugador');
    const listaJugadores = document.getElementById('jugadores');
    const puntajesJugadores = document.getElementById('puntajes-jugadores');
    const botonGenerar = document.getElementById("generar");
    const divNumeroGenerado = document.getElementById("numero-generado");
    
    let jugadores = []; // Array para almacenar los nombres de los jugadores
    let cartones = {}; // Objeto para almacenar los cartones de cada jugador
    let contador = 0;
    let numerosGenerados = new Set();

    // Función para actualizar visualmente el cartón del jugador
    function actualizarCartonVisual(carton, jugador) {
        const divJugador = document.getElementById(jugador);
        const tabla = divJugador.querySelector('table');
        const celdas = tabla.querySelectorAll('td');
    
        // Iterar sobre todas las celdas del cartón
        for (let i = 0; i < carton.length; i++) {
            for (let j = 0; j < carton[i].length; j++) {
                const numeroCarton = carton[i][j];
                // Verificar si el número ya ha sido marcado
                if (numeroCarton === numero) {
                    // Buscar la celda correspondiente en la tabla y marcarla con 'X'
                    const indiceCelda = i * carton.length + j;
                    celdas[indiceCelda].textContent = 'X';
                    celdas[indiceCelda].classList.add('marcado');
                }
            }
        }
    }    

    // Función para marcar un número en un cartón de bingo y actualizar localStorage
    function marcarNumeroEnCarton(numero, jugador) {
        // Obtener el cartón del jugador desde localStorage
        let carton = JSON.parse(localStorage.getItem(jugador));

        // Marcar el número en el cartón con una 'X'
        for (let i = 0; i < carton.length; i++) {
            for (let j = 0; j < carton[i].length; j++) {
                if (carton[i][j] === numero) {
                    carton[i][j] = 'X';
                }
            }
        }

        // Actualizar el cartón en localStorage
        localStorage.setItem(jugador, JSON.stringify(carton));

        // Calcular puntaje y actualizar
        calcularPuntaje(carton, jugador);
    }

    // Función para generar un número aleatorio y mostrarlo en pantalla
    function generarNumero() {
        if (contador >= 25) {
            alert("Ya se han generado 25 números.");
            return;
        }

        // Generar un número aleatorio del 1 al 50 sin repetir
        let numero;
        do {
            numero = Math.floor(Math.random() * 50) + 1;
        } while (numerosGenerados.has(numero));

        // Agregar el número generado al conjunto de números generados
        numerosGenerados.add(numero);

        // Marcar el número en los cartones de bingo de los jugadores y actualizar visualmente
        for (const jugador in cartones) {
            marcarNumeroEnCarton(numero, jugador);
            actualizarCartonVisual(cartones[jugador], jugador, numero); // Actualizar visualmente el cartón del jugador
        }

        // Mostrar el número generado en el div
        const nuevoNumero = document.createElement("p");
        nuevoNumero.textContent = ` ${numero},`;
        divNumeroGenerado.appendChild(nuevoNumero);

        // Incrementar el contador de clics
        contador++;
    }
    
    // Función para calcular el puntaje según las reglas
    function calcularPuntaje(carton, jugador) {
        let puntaje = 0;

        // Verificar si el cartón está lleno
        let lleno = true;
        for (let i = 0; i < carton.length; i++) {
            for (let j = 0; j < carton[i].length; j++) {
                if (carton[i][j] !== 'X') {
                    lleno = false;
                    break;
                }
            }
            if (!lleno) break;
        }
        if (lleno) {
            puntaje += 5;
        }

        // Verificar líneas horizontales
        for (let i = 0; i < carton.length; i++) {
            let lineaHorizontal = true;
            for (let j = 0; j < carton[i].length; j++) {
                if (carton[i][j] !== 'X') {
                    lineaHorizontal = false;
                    break;
                }
            }
            if (lineaHorizontal) {
                puntaje += 1;
                break;
            }
        }

        // Verificar líneas verticales
        for (let j = 0; j < carton[0].length; j++) {
            let lineaVertical = true;
            for (let i = 0; i < carton.length; i++) {
                if (carton[i][j] !== 'X') {
                    lineaVertical = false;
                    break;
                }
            }
            if (lineaVertical) {
                puntaje += 1;
                break;
            }
        }

        // Verificar líneas diagonales
        let diagonal1 = true;
        let diagonal2 = true;
        for (let i = 0; i < carton.length; i++) {
            if (carton[i][i] !== 'X') {
                diagonal1 = false;
            }
            if (carton[i][carton.length - 1 - i] !== 'X') {
                diagonal2 = false;
            }
        }
        if (diagonal1 || diagonal2) {
            puntaje += 3;
        }

        // Actualizar el puntaje en localStorage
        localStorage.setItem(jugador + "_puntaje", puntaje);

        // Mostrar el puntaje en pantalla
        mostrarPuntajeEnPantalla(jugador, puntaje);
    }

    // Función para mostrar el puntaje de un jugador en pantalla
    function mostrarPuntajeEnPantalla(jugador, puntaje) {
        const divPuntajeJugador = document.getElementById(jugador + "-puntaje");
        divPuntajeJugador.textContent = `${jugador}: ${puntaje} puntos`;
    }

    // Función para crear un cartón de bingo con el tamaño especificado por el usuario
    function crearCarton(filasxcolumnas) {
        let carton = [];

        // Llenar el cartón con números aleatorios
        for (let i = 0; i < filasxcolumnas; i++) {
            let fila = [];
            for (let j = 0; j < filasxcolumnas; j++) {
                // Generar un número aleatorio entre 1 y 50
                let numero = Math.floor(Math.random() * 50) + 1;
                fila.push(numero);
            }
            carton.push(fila);
        }

        return carton;
    }

    // Función para imprimir un cartón de bingo en el HTML
    function imprimirCarton(carton, jugador) {
        // Crear tabla para mostrar el cartón
        const tabla = document.createElement('table');
        tabla.classList.add('bingo-table'); // Agrega una clase para dar estilo si es necesario

        // Iterar sobre el cartón para crear filas y columnas
        carton.forEach(fila => {
            const filaElemento = document.createElement('tr');
            fila.forEach(numero => {
                const celda = document.createElement('td');
                celda.textContent = numero;
                filaElemento.appendChild(celda);
            });
            tabla.appendChild(filaElemento);
        });

        // Agregar la tabla al div correspondiente al jugador
        const divJugador = document.getElementById(jugador);
        divJugador.appendChild(tabla);
    }

    // Manejar el evento de envío del formulario
    bingoForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe

        // Obtener los valores de filas y columnas ingresados por el usuario
        const filasxcolumnas = parseInt(document.getElementById('filasxcolumnas').value);

        if (![3, 4, 5].includes(filasxcolumnas)) {
            alert('Por favor, ingrese un número válido (3, 4 o 5).');
            return;
        }

        // Crear el cartón de bingo para cada jugador
        jugadores.forEach(function(jugador) {
            cartones[jugador] = crearCarton(filasxcolumnas);
            localStorage.setItem(jugador, JSON.stringify(cartones[jugador]));
            localStorage.setItem(jugador + "_puntaje", 0); // Inicializar puntaje en 0
            mostrarPuntajeEnPantalla(jugador, 0); // Mostrar puntaje inicial en pantalla
        });

        // Mostrar los cartones de bingo generados
        for (const jugador in cartones) {
            console.log(`Cartón de ${jugador}:`, cartones[jugador]);
            imprimirCarton(cartones[jugador], jugador); // Llama a la función imprimirCarton con el cartón y el nombre del jugador
        }
    });

    // Función para agregar un jugador
    function agregarJugador() {
        const nombre = inputNombre.value.trim(); // Eliminar espacios en blanco al inicio y al final
        // Validar que el nombre solo sean letras
        if (nombre.match(/^[a-zA-Z\s]+$/) && nombre !== '' && jugadores.length < 4 && !jugadores.includes(nombre)) {
            jugadores.push(nombre); // Agregar el nombre del jugador al array
            inputNombre.value = ''; // Limpiar el input después de agregar el jugador
            mostrarJugadores(); // Mostrar la lista de jugadores actualizada
        } else {
            alert('Ingrese un nombre válido o ya ha ingresado 4 jugadores.');
        }
    }

    // Función para mostrar la lista de jugadores
    function mostrarJugadores() {
        listaJugadores.innerHTML = ''; // Limpiar la lista antes de volver a mostrar

        jugadores.forEach(function(nombre, index) {
            const jugadorItem = document.createElement('div');
            jugadorItem.textContent = `${index + 1}. ${nombre}`;
            jugadorItem.id = nombre; // Asignar el ID del jugador al div
            listaJugadores.appendChild(jugadorItem);

            // Agregar elemento para mostrar puntaje
            const puntajeJugador = document.createElement('div');
            puntajeJugador.id = nombre + "-puntaje";
            puntajesJugadores.appendChild(puntajeJugador);
        });
    }

    // Evento clic para agregar un jugador
    btnAgregar.addEventListener('click', function() {
        agregarJugador();
    });

    // Evento tecla Enter para agregar un jugador
    inputNombre.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evitar que se enví
            agregarJugador();   
        }
    });

    // Evento clic para eliminar un jugador
    btnEliminar.addEventListener('click', function() {
        jugadores.pop(); // Eliminar el último jugador ingresado
        mostrarJugadores(); // Mostrar la lista de jugadores actualizada
    });

    
    // Función para generar un número aleatorio y mostrarlo en pantalla
    function generarNumero() {
        if (contador >= 25) {
            alert("Ya se han generado 25 números.");
            return;
        }

        // Generar un número aleatorio del 1 al 50 sin repetir
        let numero;
        do {
            numero = Math.floor(Math.random() * 50) + 1;
        } while (numerosGenerados.has(numero));

        // Agregar el número generado al conjunto de números generados
        numerosGenerados.add(numero);

        // Marcar el número en los cartones de bingo de los jugadores
        for (const jugador in cartones) {
            marcarNumeroEnCarton(numero, jugador);
        }

        // Mostrar el número generado en el div
        const nuevoNumero = document.createElement("p");
        nuevoNumero.textContent = ` ${numero},`;
        divNumeroGenerado.appendChild(nuevoNumero);

        // Incrementar el contador de clics
        contador++;
    }

    // Agregar un event listener al botón para llamar a la función generarNumero cuando se haga clic
    botonGenerar.addEventListener("click", generarNumero);

    
});
