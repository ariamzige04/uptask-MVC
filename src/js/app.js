const mobileMenuBtn = document.querySelector('#mobile-menu');
const cerrarMenuBtn = document.querySelector('#cerrar-menu');
const sidebar = document.querySelector('.sidebar');

if(mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.add('mostrar');
    });
}

if(cerrarMenuBtn) {
    cerrarMenuBtn.addEventListener('click', function() {
        sidebar.classList.add('ocultar');
        setTimeout(() => {
            sidebar.classList.remove('mostrar');
            sidebar.classList.remove('ocultar');
        }, 1000);
    })
}

// Elimina la clase de mostrar, en un tamaño de tablet y mayores
const anchoPantalla = document.body.clientWidth;

//resize se llama todas las veces cuando cambia de tamaño la pantalla
window.addEventListener('resize', function() {
    const anchoPantalla = document.body.clientWidth;//checa el ancho de la pantalla
    if(anchoPantalla >= 768) {//aqui lo evalua y si es mayor a 768px remueve la clase
        sidebar.classList.remove('mostrar');
    }
})