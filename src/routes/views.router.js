const express = require("express");
const router = express.Router();

const ProductManager = require ("../controllers/productManager")
const productManager = new ProductManager ("./src/models/products.json")

//ruta /realTimeProducts: ruta a realTimeProducts.handlebars
router.get("/", async (req, res)=>{
try {
    const products = await productManager.getProducts();
    res.render("home", {products})
} catch (error) {
    res.status(500).json({error: "Error interno del servidor"})
}
})

router.get("/realtimeproducts", (req, res)=>{
    res.render("realTimeProducts")
})


module.exports = router;