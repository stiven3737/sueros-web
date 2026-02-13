function enviarAWhatsApp(usuario) {
    const miTelefono = "573001234567"; // 👈 Tu número con código de país (sin el +)
    const mensaje = `Hola, un nuevo usuario se ha registrado:%0A*Nombre:* ${usuario.nombre}%0A*Teléfono:* ${usuario.telefono}`;
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(`https://wa.me/${57302123031}?text=${mensaje}`, '_blank');
}