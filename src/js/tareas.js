(function() {

    obtenerTareas();
    let tareas = [];
    let filtradas = [];

    // Botón para mostrar el Modal de Agregar tarea
    const nuevaTareaBtn = document.querySelector('#agregar-tarea');
    nuevaTareaBtn.addEventListener('click', function() {
        mostrarFormulario();
    });

    // Filtros de búsqueda
    const filtros = document.querySelectorAll('#filtros input[type="radio');
    filtros.forEach( radio => {
        radio.addEventListener('input', filtrarTareas);//como son 3 input se itera con un foreach y llama la funcion filtrarTareas
    } )

    //aqui se pasa el evento del input radio
    function filtrarTareas(e) {
        const filtro = e.target.value;//es para obtener el value de los inputs (estan en html ej, "" "0" "1")
//!0 = pendiente
//!1 = completa
//!  = todas
        //si es diferente, o sea si tiene un string vacio es que estas filtrando ej, "" "0" "1"
        if(filtro !== '') {
            filtradas = tareas.filter(tarea => tarea.estado === filtro);//filtra todos los estados de las tareas y si es igual a la que estas filtrando (EJ. selecciona completadas "1" trae todas las tareas que tengan el estado 1)o viceversa

        } else {
            filtradas = [];//muestra todas
        }

        mostrarTareas();//aqui lo muestra
    }

    async function obtenerTareas() {
        try {
            const id = obtenerProyecto();//saca el id del proyecto en que estamos dinamicamente
            const url = `/api/tareas?id=${id}`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();

            tareas = resultado.tareas;//esta es la variable global (es un objeto)
            mostrarTareas();
        
        } catch (error) {
            console.log(error);
        }
    }

    function mostrarTareas() {
        limpiarTareas();//esto es para que no se vayan duplicando tareas cada vez que agregas una
        totalPendientes();
        totalCompletas();

        const arrayTareas = filtradas.length ? filtradas : tareas;//si filtradas tiene algo, el arrayTareas va a hacer igual al arreglo de filtradas, y si no tiene nada va a hacer igual al de tareas

        if(arrayTareas.length === 0) {  
            const contenedorTareas = document.querySelector('#listado-tareas');

            const textoNoTareas = document.createElement('LI');
            textoNoTareas.textContent = 'No Hay Tareas';
            textoNoTareas.classList.add('no-tareas');

            contenedorTareas.appendChild(textoNoTareas);
            return;
        }

        //es un objeto de tareas
        const estados = {
            0: 'Pendiente',
            1: 'Completa'
        }

        arrayTareas.forEach(tarea => {
            const contenedorTarea = document.createElement('LI');
            contenedorTarea.dataset.tareaId = tarea.id;//dataset.tareaId (aqui quedaria asi data-tarea-id="1") se pone el guion automaticamente -
            contenedorTarea.classList.add('tarea');

            const nombreTarea = document.createElement('P');
            nombreTarea.textContent = tarea.nombre;
            //ondblclick (DOBLE CLICK)
            nombreTarea.ondblclick = function() {
                mostrarFormulario(editar = true, {...tarea});
            }

            const opcionesDiv = document.createElement('DIV');
            opcionesDiv.classList.add('opciones');

            // Botones
            const btnEstadoTarea = document.createElement('BUTTON');
            btnEstadoTarea.classList.add('estado-tarea');
            btnEstadoTarea.classList.add(`${estados[tarea.estado].toLowerCase()}`)//agrega la clase pendiente o completa y el tolowercase lo convierte en minusculas porque es una clase
            btnEstadoTarea.textContent = estados[tarea.estado];//se va al objeto de estados y si detecta que es un 0 es pendiente, si es 1 es completa
            btnEstadoTarea.dataset.estadoTarea = tarea.estado;//dataset.estadoTarea (aqui quedaria asi data-estado-tarea="1") se pone el guion automaticamente -

            //ondblclick (DOBLE CLICK)
            btnEstadoTarea.ondblclick = function() {
                cambiarEstadoTarea({...tarea});//lo va a pasar como objeto y como copia (video 650)
                //para que no se modifique el arreglo original, ya que todo este bien se incorpora al arreglo original
            }

            const btnEliminarTarea = document.createElement('BUTTON');
            btnEliminarTarea.classList.add('eliminar-tarea');
            btnEliminarTarea.dataset.idTarea = tarea.id;//dataset.idTarea (aqui quedaria asi data-id-tarea="1") se pone el guion automaticamente -
            btnEliminarTarea.textContent = 'Eliminar';
            //ondblclick (DOBLE CLICK)
            btnEliminarTarea.ondblclick = function() {
                confirmarEliminarTarea({...tarea});
            }

            opcionesDiv.appendChild(btnEstadoTarea);
            opcionesDiv.appendChild(btnEliminarTarea);

            contenedorTarea.appendChild(nombreTarea);
            contenedorTarea.appendChild(opcionesDiv);

            const listadoTareas = document.querySelector('#listado-tareas');
            listadoTareas.appendChild(contenedorTarea);
        });
    }

    function totalPendientes() {
        const totalPendientes = tareas.filter(tarea => tarea.estado === "0");//esto nos trae cuantas tareas estan pendientes 
        const pendientesRadio = document.querySelector('#pendientes');

        if(totalPendientes.length === 0) {
            pendientesRadio.disabled = true;//se desabilita el input radio de pendientes
        } else {
            pendientesRadio.disabled = false;//se habilita el input radio de pendientes
        }   
    }
    function totalCompletas() {
        const totalCompletas = tareas.filter(tarea => tarea.estado === "1");
        const completasRadio = document.querySelector('#completadas');

        if(totalCompletas.length === 0) {
            completasRadio.disabled = true;//se desabilita el input radio de completas
        } else {
            completasRadio.disabled = false;//se habilita el input radio de completas
        }   
    }

    function mostrarFormulario( editar = false, tarea = {} ) {//por default no estas editando la tarea, pero si esta en true, si lo estas editando
        console.log(tarea);
        const modal = document.createElement('DIV');
        modal.classList.add('modal');
        modal.innerHTML = `
            <form class="formulario nueva-tarea">
                <legend>${editar ? 'Editar Tarea' : 'Añade una nueva tarea'}</legend>
                <div class="campo">
                    <label>Tarea</label>
                    <input 
                        type="text"
                        name="tarea"
                        placeholder="${tarea.nombre ? 'Edita la Tarea' : 'Añadir Tarea al Proyecto Actual'}"
                        id="tarea"
                        value="${tarea.nombre ? tarea.nombre : ''}"
                    />
                </div>
                <div class="opciones">
                    <input 
                        type="submit" 
                        class="submit-nueva-tarea" 
                        value="${tarea.nombre ? 'Guardar Cambios' : 'Añadir Tarea'} " 
                    />
                    <button type="button" class="cerrar-modal">Cancelar</button>
                </div>
            </form>
        `;//en value le estas pasando el nombre de la tarea, para que no la vuelva a escribir el usuario cuando quiera actualizarlo

        setTimeout(() => {
            const formulario = document.querySelector('.formulario');
            formulario.classList.add('animar');
        }, 0);//se ejecuta la animacion para animar el formulario, se ejecuta en cero segundos

        modal.addEventListener('click', function(e) {
            e.preventDefault();
            //si en el modal le das click a algo, y contiene la clase (cerrar modal) (LO DETECTA DESPUES QUE JAVASCRIPT GENERO EL HTML)
            if(e.target.classList.contains('cerrar-modal')) {
                const formulario = document.querySelector('.formulario');
                formulario.classList.add('cerrar');//esto hace animacion de cerrar modal

                setTimeout(() => {
                    modal.remove();//remueve ese inerthtml despues de .5 segundos
                }, 500);//se ejecuta la animacion para animar el formulario, se ejecuta en .5 segundo
            } 

            //si en el modal le das click a algo, y contiene la clase (submit-nueva-tarea) (LO DETECTA DESPUES QUE JAVASCRIPT GENERO EL HTML)
            if(e.target.classList.contains('submit-nueva-tarea')) {
                const nombreTarea = document.querySelector('#tarea').value.trim();//es el input donde pones tu tarea....(VALUE lee el valor lo que se escribe en el input y TRIM quita los espacios al principio y al final)

                if(nombreTarea === '') {
                    // Mostrar una alerta de error
                    mostrarAlerta('El Nombre de la tarea es Obligatorio', 'error', document.querySelector('.formulario legend'));
                    return;//no se ejecuta las siguientes lineas de codigo
                } 

                if(editar) {
                    tarea.nombre = nombreTarea;//aqui se actualiza el nombre de la tarea (reescribe esa parte del objeto, que es la copia)
                    actualizarTarea(tarea);
                } else {
                    agregarTarea(nombreTarea);//aqui solo se pasa el nobre de la tarea (solo lo necesario)
                }
                
            }
        })

        document.querySelector('.dashboard').appendChild(modal);
    }

    // Muestra un mensaje en la interfaz
    function mostrarAlerta(mensaje, tipo, referencia) {
        // Previene la creación de multiples alertas
        const alertaPrevia = document.querySelector('.alerta');//selecciona la alerta
        if(alertaPrevia) {//si existe la alerta previa la elimina(solo se pone una alerta)
            alertaPrevia.remove();
        }


        const alerta = document.createElement('DIV');
        alerta.classList.add('alerta', tipo);//se agrega la clase css alerta y otro que es el tipo (error o exito)
        alerta.textContent = mensaje;

        // Inserta la alerta antes del legend
        //(la referenecia es el .formulario legend)
        referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling);
        //referencia.nextElementSibling (busca el elemento padre, lo pone despues del legend pero antes del siguiente hermano)
        // Eliminar la alerta después de 5 segundos
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }

    // Consultar el Servidor para añadir una nueva tarea al proyecto actual
    async function agregarTarea(tarea) {
        // Construir la petición
        const datos = new FormData();//asi se envia datos
        datos.append('nombre', tarea);//saca el nombre de la tarea, con la variable (tarea)
        datos.append('proyectoId', obtenerProyecto());//aqui saca el id del proyecto con una funcion 
        //este es lo que lee php--  --aca viene los datos la info
        try {
            const url = 'http://uptask.rf.gd/api/tarea';
            //este await detiene el siguiente await, solamente hasta que halla finalizado
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos//aqui se envian los datos
            });
            //!importante obtiene un resultado y si encontro el id del proyecto, muestra una alerta de exito o error
            const resultado = await respuesta.json();//te da un resultado del servidor php 
            // console.log(resultado);//te da un resultado del servidor y lo imprime en la consola
            mostrarAlerta(
                resultado.mensaje, //esto lo lee por medio de json que lo envio el servidor
                resultado.tipo, //esto lo lee por medio de json que lo envio el servidor
                document.querySelector('.formulario legend')
            );

            if(resultado.tipo === 'exito') {
                const modal = document.querySelector('.modal');
                setTimeout(() => {
                    modal.remove();
                }, 3000);

                // Agregar el objeto de tarea al global de tareas
                //hay que replicar la misma estructura que tengas en la API
                const tareaObj = {
                    id: String(resultado.id),//este id se saca del resultado del json
                    nombre: tarea,//aca esta la variable tarea (CONTIENE EL NOMBRE DE LA TAREA) que se saco atras
                    estado: "0",//este va a hacer 0 porque es una tarea nueva
                    proyectoId: resultado.proyectoId
                }
                //es un arreglo de tareas (es la global)
                tareas = [...tareas, tareaObj];//toma una copia de las mismas tareas, y le pasa el nuevo objeto que tiene que agregar al arreglo global (tareas)
                mostrarTareas();//lo llama otra vez 

            }
        } catch (error) {
            console.log(error);
        }
    }

    function cambiarEstadoTarea(tarea) {
        const nuevoEstado = tarea.estado === "1" ? "0" : "1";//si en el btn (le das doble click) si es 1 se pasa a 0, en caso contrario, si es 0 lo pasa a 1 
        tarea.estado = nuevoEstado;//se asocia esta nueva tarea (o sea este nuevo valor)(se actualiza el numero)
        actualizarTarea(tarea);
    }

    async function actualizarTarea(tarea) {

        const {estado, id, nombre, proyectoId} = tarea;//estraemos los valores y se crean las variables (destructuring)
        
        const datos = new FormData();
        //primero es el identificador en el backend y la otra es la variable que contiene el valor (datos)
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto());//saca el id del proyecto

        // for (let valor of datos.values()) {
            // console.log(valor);//esto es para ver los datos del FormData
        // }

        try {
            const url = 'http://uptask.rf.gd/api/tarea/actualizar';

            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
            const resultado = await respuesta.json();

            // console.log(resultado);

            if(resultado.respuesta.tipo === 'exito') {
                Swal.fire(
                    resultado.respuesta.mensaje,//son las alertas
                    resultado.respuesta.mensaje,
                    'success'
                );

                const modal = document.querySelector('.modal');
                if(modal) {//en caso de que exista el modal se elimina (es para que no marque un error 657)
                    modal.remove();//se quita el modal del formulario
                }
               
                
                //itera en el arreglo de tareas, pero te crea un nuevo arreglo (map)
                tareas = tareas.map(tareaMemoria => {
                    if(tareaMemoria.id === id) {//compara entre TODAS las tareas que estan en memoria con el id (a la que le doy click actualiza la tarea)(identida y verifica que tarea estamos cambiando)
                        tareaMemoria.estado = estado;
                        tareaMemoria.nombre = nombre;
                    } 

                    return tareaMemoria;
                });

                mostrarTareas();//lo llame otra vez para que regenere el html
            }
        } catch (error) {
            console.log(error);
        }
    }

    function confirmarEliminarTarea(tarea) {
        Swal.fire({
            title: '¿Eliminar Tarea?',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTarea(tarea);
            } 
        })
    }

    async function eliminarTarea(tarea) {

        const {estado, id, nombre} = tarea;//extraemos los valores y se crean las variables (destructuring)
        
        const datos = new FormData();
        //primero es el identificador en el backend y la otra es la variable que contiene el valor (datos)
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto());//saca el id del proyecto (la URL)

        // for (let valor of datos.values()) {
            // console.log(valor);//esto es para ver los datos del FormData
        // }

        try {
            const url = 'http://uptask.rf.gd/api/tarea/eliminar';
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });

            const resultado = await respuesta.json();
            if(resultado.resultado) {//este es el resultado que te envio el backend cuando eliminaste la tarea

                // mostrarAlerta(
                //     resultado.mensaje, 
                //     resultado.tipo, 
                //     document.querySelector('.contenedor-nueva-tarea')
                // );

                Swal.fire('Eliminado!', resultado.mensaje, 'success');

                //(filter) crea un arreglo nuevo, saca todo excepto uno, o uno que cumpla cierta condicion 
                tareas = tareas.filter( tareaMemoria => tareaMemoria.id !== tarea.id);//trae todas las que son diferentes a la que estas deseando eliminar (o sea saca a la que estas dando click eliminar, y muestra todas las demas tareas que no eliminastes)
                mostrarTareas();
            }
            
        } catch (error) {
            
        }
    }

    function obtenerProyecto() {
        const proyectoParams = new URLSearchParams(window.location.search);//esto asi solo no hace nada
        const proyecto = Object.fromEntries(proyectoParams.entries());//aqui saca el id del proyecto
        return proyecto.id;//proyecto?id=fba187d24a84efec14735c2d1c88d30b
    }//solo esto fba187d24a84efec14735c2d1c88d30b

    function limpiarTareas() {
        const listadoTareas = document.querySelector('#listado-tareas');
        //mientras haya tareas o sea elementos HTML, elimina el primero
        while(listadoTareas.firstChild) {
            listadoTareas.removeChild(listadoTareas.firstChild);
        }
    }

})();
