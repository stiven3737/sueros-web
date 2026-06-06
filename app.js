/* ==========================================================
   1. SCRIPT PARA EL CARRUSEL DE TESTIMONIOS
   ========================================================== */
let testimonioActual = 0;
const testimonios = document.querySelectorAll('.testimonio-card');
const dots = document.querySelectorAll('.dot');
let intervaloSlider;

function mostrarTestimonio(n) {
    if (n >= testimonios.length) { testimonioActual = 0; }
    if (n < 0) { testimonioActual = testimonios.length - 1; }

    for (let i = 0; i < testimonios.length; i++) {
        testimonios[i].classList.remove('active');
        dots[i].classList.remove('active');
    }

    if(testimonios[testimonioActual]) testimonios[testimonioActual].classList.add('active');
    if(dots[testimonioActual]) dots[testimonioActual].classList.add('active');
}

function cambiarTestimonio(n) {
    mostrarTestimonio(testimonioActual += n);
    iniciarSliderAutomatico(); 
}

function irATestimonio(n) {
    mostrarTestimonio(testimonioActual = n);
    iniciarSliderAutomatico();
}

function iniciarSliderAutomatico() {
    clearInterval(intervaloSlider);
    intervaloSlider = setInterval(() => {
        cambiarTestimonio(1);
    }, 5000);
}

iniciarSliderAutomatico();

const sliderContainer = document.querySelector('.testimonio-slider');
if(sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(intervaloSlider));
    sliderContainer.addEventListener('mouseleave', iniciarSliderAutomatico);
}

// Botón volver arriba
const btnSubir = document.getElementById("btnVolverArriba");
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        if(btnSubir) btnSubir.style.display = "block";
    } else {
        if(btnSubir) btnSubir.style.display = "none";
    }
};

if(btnSubir) {
    btnSubir.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* ==========================================================
   2. LÓGICA DEL CRUD EN VIVO (LOCAL STORAGE)
   ========================================================== */

// Estado para saber si estamos editando un paciente
let editandoId = null;

// Capturar elementos del DOM
const formulario = document.getElementById('formularioContacto');
const cuerpoTabla = document.getElementById('cuerpoTabla');

// Cargar pacientes desde LocalStorage o empezar vacío
let listaPacientes = JSON.parse(localStorage.getItem('pacientesDatos')) || [];

// Función para renderizar la tabla
function renderizarTabla() {
    if (!cuerpoTabla) return;
    cuerpoTabla.innerHTML = '';

    if (listaPacientes.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="4" class="text-center">No hay pacientes registrados aún.</td></tr>`;
        return;
    }

    listaPacientes.forEach(paciente => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${paciente.nombre}</td>
            <td>${paciente.whatsapp}</td>
            <td>${paciente.mensaje || 'Sin mensaje'}</td>
            <td class="text-center">
                <button class="btn-action edit" onclick="prepararEdicion('${paciente.id}')">Editar</button>
                <button class="btn-action delete" onclick="eliminarPaciente('${paciente.id}')">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

// Función para guardar / actualizar un paciente (Formulario)
if (formulario) {
    formulario.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita que la página se recargue o se vaya a Formspree

        const nombreInput = document.getElementById('nombre').value;
        const whatsappInput = document.getElementById('whatsapp').value;
        const mensajeInput = document.getElementById('mensaje').value;

        if (editandoId) {
            // MODO EDICIÓN: Actualizar el paciente existente
            listaPacientes = listaPacientes.map(paciente => {
                if (paciente.id === editandoId) {
                    return { ...paciente, nombre: nombreInput, whatsapp: whatsappInput, mensaje: mensajeInput };
                }
                return paciente;
            });
            editandoId = null;
            document.querySelector('.btn-enviar').innerText = "Enviar Información";
        } else {
            // MODO CREACIÓN: Agregar nuevo paciente
            const nuevoPaciente = {
                id: Date.now().toString(), // ID único basado en tiempo
                nombre: nombreInput,
                whatsapp: whatsappInput,
                mensaje: mensajeInput
            };
            listaPacientes.push(nuevoPaciente);
        }

        // Guardar en LocalStorage y volver a dibujar la tabla
        localStorage.setItem('pacientesDatos', JSON.stringify(listaPacientes));
        renderizarTabla();
        formulario.reset(); // Limpia los inputs del formulario
    });
}

// Función para cargar los datos en el formulario y editarlos
window.prepararEdicion = function(id) {
    const paciente = listaPacientes.find(p => p.id === id);
    if (!paciente) return;

    document.getElementById('nombre').value = paciente.nombre;
    document.getElementById('whatsapp').value = paciente.whatsapp;
    document.getElementById('mensaje').value = paciente.mensaje;

    editandoId = id;
    document.querySelector('.btn-enviar').innerText = "Actualizar Datos";
    
    // Hace un scroll suave hacia el formulario para editar con comodidad
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
};

// Función para eliminar un paciente de la tabla
window.eliminarPaciente = function(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este registro clínico?')) {
        listaPacientes = listaPacientes.filter(p => p.id !== id);
        localStorage.setItem('pacientesDatos', JSON.stringify(listaPacientes));
        renderizarTabla();
    }
};

/* ==========================================================
   3. VERIFICACIÓN DE RUTA PRIVADA (?admin=true)
   ========================================================== */
function inicializarAplicacion() {
    const parametrosURL = new URLSearchParams(window.location.search);
    const esAdmin = parametrosURL.get('admin');
    const panel = document.getElementById('panelAdministrador');

    if (panel) {
        if (esAdmin === 'true') {
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    }
    // Renderiza los datos iniciales que estén guardados
    renderizarTabla();
}

document.addEventListener('DOMContentLoaded', inicializarAplicacion);
