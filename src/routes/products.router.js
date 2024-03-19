const express = require("express");
const router = express.Router();
const path = require("path");

const ProductManager = require("../controllers/main");// aca estoy "importando"  main.js
const products = new ProductManager();


router.get("/products", async (req, res) => {
    try {
        await products.init();
        let prodList = await products.getProducts();
        console.log(prodList);
        const { limit } = req.query;
        if (!limit) {
            res.send(prodList);
        } else if (Number.isInteger(Number(limit)) && Number(limit) > 0 && Number(limit) < prodList.length) {
            res.send(prodList.slice(0, limit));
        } else {
            res.send(`El limite (${limit}) no es valido`);
        }
    }
    catch (error) {
        console.error("error del servidor", error);
        res.status(500).send("Error del servidor");
    }
});

router.get("/products/:id", async (req, res) => {// los ":" antes del id indican que es dinamico. se recibe en los params del req que hace el cliente"
    try {
        let id = parseInt(req.params.id); // uso parseInt porque todos los datos que sacamos de los params son strings
        let prodList = await products.getProductById(id);
        res.send(prodList);
    }
    catch (error) {
        console.error("error del servidor", error);
        res.status(404).send("Producto no encontrado");
    }
});

router.post("/products", async (req, res) => {
    try { 
        let productsToAdd = req.body;
        for (const product of productsToAdd) {
            await products.addProduct(product);
        }
        res.status(201).send("Producto agregado correctamente");
    }
    catch(error) { 
        console.error("Error al agregar el producto:", error); 
        res.status(500).send("Error del servidor");
    }
});

module.exports = router;