const express = require("express");
const app = express();
const PUERTO = 8080;
const expresshandlebars = require("express-handlebars");
const socket = require("socket.io");
require("./database.js"); // esto hace la conexión con database.js y data base.js hace la conexión con mongodb

const productsRouter= require("./routes/products.router");
const cartsRouter= require("./routes/carts.router") ;
const viewsRouter = require("./routes/views.router.js");


//Middleware
app.use(express.static("./src/public"));
//con estas dos lineas el servidor express puede interpretar mensajes de tipo json en formato urlencoded que recibira de postman
app.use(express.json());
app.use(express.urlencoded({ extended: true }));// extended true indica que trabajamos con datos complejos  (no solo strings)

//configuro handlebars
app.engine("handlebars", expresshandlebars.engine());
app.set("view engine", "handlebars");
app.set ("views", "./src/views"); // revisar que este bien la ruta!!!

// RUTAS 
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter); 


const httpserver = app.listen(PUERTO,()=>{
    console.log(`Esta aplicacion funciona en el puerto ${PUERTO}`);
})

const io = socket(httpserver);

const ProductManager = require("./controllers/productManager.js");
const productManager = new ProductManager("./src/models/productos.json");

io.on("connection", async (socket) => {
    console.log("Un cliente conectado");

    //Enviamos el array de productos al cliente: 
    socket.emit("products", await productManager.getProducts());

    //Recibimos el evento "eliminarProducto" desde el cliente: 
    socket.on("removeProduct", async (id) => {
        await productManager.deleteProduct(id);
        //Enviamos el array de productos actualizados: 
        socket.emit("products", await productManager.getProducts());
    })

    //recibo el evento addProduct desde el cliente:
    socket.on("addProduct", async (product)=>{
        await productManager.addProduct(product)
        //Enviamos el array de productos actualizados: 
        socket.emit("products", await productManager.getProducts());
    })

})