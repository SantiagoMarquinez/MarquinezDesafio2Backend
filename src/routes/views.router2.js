const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/products-manager-db.js");
const pm = new ProductManager();
const ProductsModel = require("../models/product.model.js");

router.get("/", async (req, res) => {
    try {
        const productList = await pm.getProduct();
        res.render("home", { products: productList });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/socket", async (req, res) => {
    try {
        res.render("socket");
    } catch (error) {
        console.error("Error al cargar la página de socket:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/realTimeProducts", async (req, res) => {
    try {
        const products = await pm.getProduct();
        res.render("realTimeProducts", { products: products });
    } catch (error) {
        console.error("Error al obtener productos en tiempo real:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/chat", async (req, res) => {
    try {
        res.render("chat");
    } catch (error) {
        console.error("Error al cargar la página de chat:", error);
        res.status(500).send("Error interno del servidor");
    }
});

module.exports = router;
