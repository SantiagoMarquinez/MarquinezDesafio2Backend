const express = require("express");
const router = express.Router();

// const ProductManager = require("../controllers/productManager.js");
// const productManager = new ProductManager();
const MessageManager = require("../controllers/messageManager.js");
const messageManager = new MessageManager();

router.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        //res.render("home", {products});
        if (limit) {
            res.render("home", { products: products.slice(0, limit) })
        } else {
            res.render("home", { products: products })
        }
    } catch (error) {
        console.log("No se pudieron obtener los productos")
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

//ruta /realTimeProducts: ruta a realTimeProducts.handlebars
router.get("/realTimeProducts", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("realTimeProducts", { products: products });
    } catch (error) {
        console.error("Error al obtener productos en tiempo real:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para cargar la página de chat
router.get("/chat", async (req, res) => {
    try {
        // Obtener todos los mensajes de la base de datos
        const messages = await messageManager.getAllMessages();
        // Renderizar la vista de chat y pasar los mensajes a la plantilla
        res.render("chat", { messages });
    } catch (error) {
        console.error("Error al cargar la página de chat:", error);
        res.status(500).send("Error interno del servidor");
    }
});

module.exports = router;