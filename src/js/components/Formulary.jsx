import React from "react";
import {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import '../../styles/Formulary.css';

/**Tendria que volver a hacer las funciones asincronas de la forma que estan explicadas en la web para ver otra variante
 * La forma empleada fue el metodo visto en la clase
 */

export const Formulary = () =>{

    useEffect(() =>{
        getUser();
    },[])

    const [inputField, setInputField] = useState("");
    const [task, setTask] = useState([]);

    /*Para cargar el usuario de la API con todas las tareas que tiene */
    const getUser = async () =>{
        const result = await fetch("https://playground.4geeks.com/todo/users/marlonpons");
        const data = await result.json();
        console.log(data);//para ver en consola todos los campos del objeto devuelto
        if(Array.isArray(data.todos)){//verifica que todos es un array de objetos OJO, faltaria poner manejo de errores ppara el caso que no lo sea 
            setTask(data.todos); // pone en el array task todos los objetos de 'todos' que hay en el servidor del usuario al cargarlo
        }
    }

/*pasarle a la API el valor del input */
    const postToDo = async (input) =>{
        let newToDo={
            label: `${input}`,
            is_done: false
        }

        await fetch("https://playground.4geeks.com/todo/todos/marlonpons",{
            method: "POST",
            body: JSON.stringify(newToDo),
            headers: {"Content-type": "application/json"}
        })
    }


    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(inputField.trim() !== ""){
            //setTask([...task,inputField]); esta funcion se usaba para la todo local, se quita porque se esta haciendo a traves de la API
            await postToDo(inputField); //llamo a la funcion asincronica con el valor del input 
            setInputField("");
            await getUser(); //se vuelve a cargar el usuario con todas las tareas
            /*De be haber otra manera, porque al usar getUser cada vez que se ingresa un campo manual se carga 
            todos los datos del usuario una y otra vez, no solamente la tarea agregada
            Cuando sea algo con mucha informacion seria lento, pesado y poco optimizado */
        }
    }


    const deleteTask = async (id) =>{
        await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "DELETE",
        });
        await getUser(); // Recargar tareas después de eliminar. Igual que el de handleSubmit
        /*const newTask = task.filter((_,i) => i !==index);
        setTask(newTask);*/
    }


    return (
        <div className="container">
            <h2>todo</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="form-label" htmlFor="field">Ingrese tarea</label>
                    <input
                    type="text"
                    className="form-control"
                    id="input-Field"
                    value={inputField}
                    onChange={(e) => setInputField(e.target.value)}
                    ></input>
                </div>

                <button className="btn btn-primary" type="submit">Agregar</button>
            </form>

            <ul className="list-group">
                {task.length === 0 ? 
                (
                    <li className="list-group-item text-muted">Without tasks</li>
                ) : (
                    task.map((tarea) =>
                    <li
                        key={tarea.id} //El navegador me ponia un mensaje de error que cada <li> debe tener una key
                        className="list-group-item"
                    >
                        {tarea.label}
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteTask(tarea.id)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </li>
                    )
                )
                }
            </ul>
            <p className="text-muted mt-2">{task.length} tareas pendientes</p>
        </div>
    )
}