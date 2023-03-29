<?php

namespace Controllers;

use Model\Proyecto;
use Model\Tarea;

class TareaController {
    //api/tareas/
    public static function index() {

        // funcion de javascript obtenerTareas()
        $proyectoId = $_GET['id'];//saca el id del proyecto
        //ej. /proyecto?id=fba187d24a84efec14735c2d1c88d30b

        if(!$proyectoId) header('Location: /dashboard');//si no hay lo redirecciona

        $proyecto = Proyecto::where('url', $proyectoId);//busca en la BD la tabla Proyecto, en la columna Url

        session_start();

        //si no existe el proyecto; 
        // o si el propietario el que creo el proyecto, su id es diferente a la SESSION del id
        // o sea si la persona que inicio sesion(SESSION ID) es diferente al propietario del proyecto
        if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) header('Location: /404');//se redirecciona

        $tareas = Tarea::belongsTo('proyectoId', $proyecto->id);//en tareas esta asociado a un mayor o sea a un proyecto 
        //o sea en Tabla Tareas, en columna proyectoId obtiene todos los resultados en Tabla Proyectos en la columna Id

        echo json_encode(['tareas' => $tareas]);
    }

    //api/tarea/
    public static function crear() {
        // funcion de javascript agregarTarea(tarea)
        if($_SERVER['REQUEST_METHOD'] === 'POST') {

            session_start();

            $proyectoId = $_POST['proyectoId'];//esto son los datos que se enviaron en POST por medio de JS en json

            $proyecto = Proyecto::where('url', $proyectoId);//aqui se obiene un proyecto

            //si no existe el proyecto; 
            // o si el propietario el que creo el proyecto, su id es diferente a la SESSION del id
            // o sea si la persona que inicio sesion(SESSION ID) es diferente al propietario del proyecto 
            if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un Error al agregar la tarea'
                ];
                echo json_encode($respuesta);//aqui le da una respuesta por medio de json a JS
                return;//hace que no se ejecute las siguientes lineas 
            } 
            
            // Todo bien, instanciar y crear la tarea
            $tarea = new Tarea($_POST);
            $tarea->proyectoId = $proyecto->id;
            $resultado = $tarea->guardar();
            $respuesta = [
                'tipo' => 'exito',
                'id' => $resultado['id'],
                'mensaje' => 'Tarea Creada Correctamente',
                'proyectoId' => $proyecto->id
            ];
            echo json_encode($respuesta);
        }
    }

    //api/tarea/actualizar
    public static function actualizar() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Validar que el proyecto exista
            $proyecto = Proyecto::where('url', $_POST['proyectoId']);

            session_start();

            //si la proyecto no existe o si la persona que lo creo es diferente 
            if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un Error al actualizar la tarea'
                ];
                echo json_encode($respuesta);
                return;
            } 

            $tarea = new Tarea($_POST);
            $tarea->proyectoId = $proyecto->id;

            $resultado = $tarea->guardar();
            if($resultado) {
                $respuesta = [
                    'tipo' => 'exito',
                    'id' => $tarea->id,
                    'proyectoId' => $proyecto->id,
                    'mensaje' => 'Actualizado correctamente'
                ];
                echo json_encode(['respuesta' => $respuesta]);
            }

        }
    }

    //api/tarea/eliminar
    public static function eliminar() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {

            // Validar que el proyecto exista
            $proyecto = Proyecto::where('url', $_POST['proyectoId']);

            session_start();

            if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un Error al actualizar la tarea'
                ];
                echo json_encode($respuesta);
                return;
            } 

            $tarea = new Tarea($_POST);
            $resultado = $tarea->eliminar();


            $resultado = [
                'resultado' => $resultado,
                'mensaje' => 'Eliminado Correctamente',
                'tipo' => 'exito'
            ];
            
            echo json_encode($resultado);
        }
    }
}