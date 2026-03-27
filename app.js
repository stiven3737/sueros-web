/* --- SCRIPT PARA EL CARRUSEL DE TESTIMONIOS --- */

let testimonioActual = 0;
const testimonios = document.querySelectorAll('.testimonio-card');
const dots = document.querySelectorAll('.dot');
let intervaloSlider;

// Función para mostrar un testimonio específico
function mostrarTestimonio(n) {
    // Maneja el desbordamiento (vuelve al principio o al final)
    if (n >= testimonios.length) { testimonioActual = 0; }
    if (n < 0) { testimonioActual = testimonios.length - 1; }

    // Oculta todos los testimonios y desactiva los puntos
    for (let i = 0; i < testimonios.length; i++) {
        testimonios[i].classList.remove('active');
        dots[i].classList.remove('active');
    }

    // Muestra el testimonio actual y activa su punto
    testimonios[testimonioActual].classList.add('active');
    dots[testimonioActual].classList.add('active');
}

// Función para cambiar el testimonio (siguiente/anterior)
function cambiarTestimonio(n) {
    mostrarTestimonio(testimonioActual += n);
    // Reinicia el temporizador automático al cambiar manualmente
    iniciarSliderAutomatico(); 
}

// Función para ir a un testimonio específico desde los puntos
function irATestimonio(n) {
    mostrarTestimonio(testimonioActual = n);
    iniciarSliderAutomatico();
}

// Función para iniciar el movimiento automático (cada 5 segundos)
function iniciarSliderAutomatico() {
    clearInterval(intervaloSlider); // Limpia cualquier temporizador existente
    intervaloSlider = setInterval(() => {
        cambiarTestimonio(1);
    }, 5000); // 5000 milisegundos = 5 segundos
}

// Inicia el slider automático al cargar la página
iniciarSliderAutomatico();

// Evento para pausar el slider automático al pasar el mouse por encima
const sliderContainer = document.querySelector('.testimonio-slider');
sliderContainer.addEventListener('mouseenter', () => {
    clearInterval(intervaloSlider);
});

// Evento para reanudar el slider automático al quitar el mouse
sliderContainer.addEventListener('mouseleave', iniciarSliderAutomatico);

// Obtener el botón
const btnSubir = document.getElementById("btnVolverArriba");

// Cuando el usuario hace scroll, se ejecuta esta función
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    // Si bajamos más de 300px desde el tope, mostramos el botón
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btnSubir.style.display = "block";
    } else {
        btnSubir.style.display = "none";
    }
}

// Al hacer clic en el botón, sube al inicio del documento
btnSubir.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Desplazamiento suave
    });
});