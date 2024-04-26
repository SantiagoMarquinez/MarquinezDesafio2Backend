//Creamos una instacia de socket.io desde el lado del cliente

const socket = io();

//Creamos una variable para guardar el usuario.
let user;

const chatBox = document.getElementById("chatBox");

//Utilizamos Sweet alert para el mensaje de bienvenida

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre para continuar";
    },
    allowOutsideClick: false,
}).then( result => {
    user = result.value;
})

//Envio de mensajes 

chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            //Trim nos permite sacar los espacios en blanco del principio y del final de un string. 
            //Si el mensaje tiene más de 0 caracteres, lo enviamos al servidor. 
            socket.emit("message", {user: user, message: chatBox.value});
            chatBox.value = "";
        }
    }
})


//listerner de mensajes

socket.on("messagesLogs", data => {
    const log = document.getElementById("messagesLogs");
    let messages = "";

    data.forEach( (message) => {
        messages = messages + `${message.user}: ${message.message} <br>`
    })
        log.innerHTML = messages;
})