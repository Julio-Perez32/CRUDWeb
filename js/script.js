//Direccion del Endpoint generado en Retool
const API_URL = "https://retoolapi.dev/3Gw4Yz/Integrantes";


//funcion que llama a la API u realiza una solicitud GET. Obtiene un JSON
async function ObtenerRegistros(){
    //hacemos GET a la API y obtenemos su respuesta (response)
    const respuesta = await fetch(API_URL);

    //Obtenemos los datos en formato JSON a partir de la respuesta
    const data = await respuesta.json(); //esto ya es un JSON

    //Llamamos a "MostrarRegistros()" y le enviamos el JSON
    MostrarRegistros(data);
}

//funcion para generar las filas de la tabla
//Datos representa al JSON
function MostrarRegistros(datos){
    //se llama al elemento tbody dentro de la tabla con id "tabla"
    const tabla = document.querySelector("#tabla tbody");

    //Para inyectar codigo HTML usamos innerHTML
    tabla.innerHTML = ""; //esto significa que vaciamos el contenido de la tabla

    datos.forEach(persona => {
        tabla.innerHTML += `
            <tr>
                <td>${persona.id}</td>
                <td>${persona.Nombre}</td>
                <td>${persona.Apellido}</td>
                <td>${persona.Correo}</td>
                <td>
                    <button>Editar</button>
                    <button onclick="EliminarPersonas(${persona.id})">Eliminar</button>
                </td>
            </tr>
        `;
    }); //por cada persona en el JSON (datos)
}

ObtenerRegistros();

//Proceso para agregar registros
const modal = document.getElementById("mdAgregar"); //cuadro de dialogo
const btnAgregar = document.getElementById("btnAgregar"); //boton para abrir
const btnCerrar = document.getElementById("btnCerrarModal"); //boton para cerrar


btnAgregar.addEventListener("click", ()=>{
    modal.showModal(); //Abre el modal cuando a btnAgregar se le hace click
});

btnCerrar.addEventListener("click", ()=>{
    modal.close(); //Cierra el modal cuando se le hace click al btnCerrar
});

//Agregar un nuevo integrante desde el formulario
document.getElementById("frmAgregar").addEventListener("submit", async e => {
    e.preventDefault(); //evita que los datos se envien por defecto

    //capturar los valores del formulario
    const Nombre = document.getElementById("txtNombre").value.trim();
    const Apellido = document.getElementById("txtApellido").value.trim();
    const Correo = document.getElementById("txtEmail").value.trim();

    //validacion basica
    if(!Nombre || !Apellido || !Correo){
        alert("Complete todos los campos");
        return; //evita que el codigo se siga ejecutando
    }


    //llamar a la API para mandar los datos
    const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({Nombre, Apellido, Correo})
    });

    if(respuesta.ok){
        //Mensaje de confirmacion
        alert("El regsitro fue agregado correctamente"); 

        //Limpiar el formulario
        document.getElementById("frmAgregar").reset();

        //cerrar el modal (dialog)
        modal.close();

        //recargar la tabla
        ObtenerRegistros();
    }
    else{
        alert("Hubo un error jeje");
    }
});

//Funcion para borrar registros
async function EliminarPersonas(id){
    const confirmacion = confirm("¿Estas seguro de eliminar el registro?");

    //validamos si el usuario eligio "Aceptar"
    if(confirmacion){
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        }); //Llamada al endPoint

        //recargar la tabla para actualizar la lista
        ObtenerRegistros();
    }
}
