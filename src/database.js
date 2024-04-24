//Acá hacemos la conexión con MONGODB: 

//1) Instalamos mongoose: npm i mongoose. 
const mongoose = require("mongoose");

//2) Crear una conexión con la base de datos

mongoose.connect("mongodb+srv://marquinez:coderhouse@cluster0.q7cz2iv.mongodb.net/marquinez?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexion exitosa"))
    .catch((error) => console.log("Error en la conexion :"+error))