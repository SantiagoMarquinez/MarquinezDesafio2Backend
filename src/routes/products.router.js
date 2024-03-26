const express = require("express");
const router = express.Router();
const path = require("path");

const ProductManager = require("../controllers/productManager");// aca estoy "importando"  producManager.js
const products = new ProductManager();


router.get("/products", async (req, res) => {
    try {

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

router.put("/products", async (req, res) => {
    try { 
        let toUpdateFields = req.body[0];
        console.log(toUpdateFields)
        if (!toUpdateFields || !toUpdateFields.id) {
            throw new Error("El producto no tiene un campo 'id' válido");
        }
        
        let id = toUpdateFields.id;
        console.log(`este es el id que viene de postman ${id}`)
        delete toUpdateFields.id;
        
        await products.updateProduct(id, toUpdateFields);
        
        res.status(200).send("Producto actualizado correctamente");
    }
    catch(error) { 
        console.error("Error al actualizar el producto:", error); 
        res.status(500).send("Error del servidor - el producto no fue actualizado");
    }
});

router.delete ("/products/:pid", async (req, res)=>{
    try {
        let id = parseInt(req.params.pid);
        await products.deleteProduct(id);
    }
    catch {
        console.error(`No fue posible eliminar el producto`,error)
        res.status(500).send("Error del servidor - el producto no fue eliminado");
    }
})


module.exports = router;