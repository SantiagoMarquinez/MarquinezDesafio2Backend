
const express = require("express");
const app = express();
const session = require("express-session");
const expresshandlebars = require("express-handlebars");
const socket = require("socket.io");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const MessageModel = require("./models/message.model.js");
require("./database.js"); // Conexión con la base de datos: esto hace la conexión con database.js y data base.js hace la conexión con mongodb


const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/session.router.js"); // Asegúrate de tener este archivo o ajusta la ruta

const initializePassport = require("./config/passport.config.js");

// Constante de puerto
const PUERTO = 8080;

// Middleware
app.use(express.static("./src/public"));
//con estas dos lineas el servidor express puede interpretar mensajes de tipo json en formato urlencoded que recibira de postman
app.use(express.json());
app.use(express.urlencoded({ extended: true }));// extended true indica que trabajamos con datos complejos  (no solo strings)

// Configuración de sesiones
app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
}));

// Configuración de cookies
app.use(cookieParser());

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

initializePassport();

// Configuración de handlebars
app.engine("handlebars", expresshandlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

const httpserver = app.listen(PUERTO, () => {
    console.log(`Esta aplicación funciona en el puerto ${PUERTO}`);
});

const io = socket(httpserver);

// Manejo de eventos de chat
io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async (data) => {
        // Guarda el mensaje en MongoDB
        await MessageModel.create(data);

        // Obtiene los mensajes de MongoDB y se los pasa al cliente
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
    });
});

// Manejo de eventos de productos
const ProductManager = require("./controllers/productManager.js");
const productManager = new ProductManager("./src/models/productos.json");

io.on("connection", async (socket) => {
    console.log("Un cliente conectado");

    // Envía array de productos al cliente
    socket.emit("products", await productManager.getProducts());

    // Recibe el evento deleteProduct desde el cliente
    socket.on("removeProduct", async (id) => {
        await productManager.deleteProduct(id);
        // Envía el array de productos actualizados
        socket.emit("products", await productManager.getProducts());
    });

    // Recibe el evento addProduct desde el cliente
    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        // Envía el array de productos actualizados
        socket.emit("products", await productManager.getProducts());
    });
});

// Manejo de eventos de carrito
const CartManager = require("./controllers/cartManager.js");
const cartManager = new CartManager();

io.on("connection", async (socket) => {
    console.log("Un cliente conectado");

    // Envía los datos del carrito al cliente cuando se conecta
    socket.emit("cart", await cartManager.getProductsFromCart());
});
