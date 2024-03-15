const express = require("express");
const app = express();
const PUERTO = 8080;
const productsRouter= require("./routes/products.router")
//const cartsRouter= require("./routes/carts.router") / comento esta linea y la linea 13 hasta que el archivo tenga contenido, para que no arroje error

//con estas dos lineas el servidor express puede interpretar mensajes de tipo json en formato urlencoded que recibira de postman
app.use(express.json())
app.use(express.urlencoded({ extended: true }))// extended true indica que trabajamos con datos complejos  (no solo strings)

// RUTAS / esto tiene que estar en la pre-entrega 1
app.use("/", productsRouter);
//app.use("/api/carts", cartsRouter); linea 13 a la que hago referencia



app.listen(PUERTO,()=>{
    console.log(`Esta aplicacion funciona en el puerto ${PUERTO}`);
})
