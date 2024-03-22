const express = require("express");
const app = express();
const PUERTO = 8080;
const productsRouter= require("./routes/products.router");
const cartsRouter= require("./routes/carts.router") ;

//con estas dos lineas el servidor express puede interpretar mensajes de tipo json en formato urlencoded que recibira de postman
app.use(express.json());
app.use(express.urlencoded({ extended: true }));// extended true indica que trabajamos con datos complejos  (no solo strings)

// RUTAS 
app.use("/api", productsRouter);
app.use("/api", cartsRouter); 


app.listen(PUERTO,()=>{
    console.log(`Esta aplicacion funciona en el puerto ${PUERTO}`);
})
