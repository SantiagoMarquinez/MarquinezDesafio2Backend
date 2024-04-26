const express = require("express");
const router = express.Router();

const ProductManager = require ("../controllers/productManager.js");
const productManager = new ProductManager ();

router.get("/products", async (req, res)=>{
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        //res.render("home", {products});
        if(limit){
            res.render("home",{ products: products.slice(0, limit) })
        }else{
            res.render("home", { products: products })
        }
    } catch (error) {
        console.log("No se pudieron obtener los productos")
        res.status(500).json({error: "Error interno del servidor"});
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

module.exports = router;