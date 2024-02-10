// Código JavaScript para la lógica del juego de Bingo

const bingoForm = document.getElementById('bingo-form');
const bingoBoardDiv = document.getElementById('bingo-board');

// Función para crear un cartón de bingo con el tamaño especificado por el usuario
function crearCarton(filas, columnas) {
    let carton = [];

    // Llenar el cartón con números aleatorios
    for (let i = 0; i < filas; i++) {
        let fila = [];
        for (let j = 0; j < columnas; j++) {
            // Generar un número aleatorio entre 1 y 50
            let numero = Math.floor(Math.random() * 50) + 1;
            fila.push(numero);
        }
        carton.push(fila);
    }

    return carton;
}

// Función para imprimir un cartón de bingo en el HTML
function imprimirCarton(carton) {
    // Limpiar el contenido anterior del div
    bingoBoardDiv.innerHTML = '';

    // Crear tabla para mostrar el cartón
    const tabla = document.createElement('table');

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

    // Agregar la tabla al div
    bingoBoardDiv.appendChild(tabla);
}

// Manejar el evento de envío del formulario
bingoForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe

    // Obtener los valores de filas y columnas ingresados por el usuario
    const filas = parseInt(document.getElementById('filas').value);
    const columnas = parseInt(document.getElementById('columnas').value);

    // Crear el cartón de bingo
    const carton = crearCarton(filas, columnas);

    // Mostrar el cartón generado en el HTML
    imprimirCarton(carton);
});