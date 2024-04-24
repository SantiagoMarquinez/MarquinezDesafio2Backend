const express = require("express");
const router = express.Router();

const ProductManager = require ("../controllers/productManager")
const productManager = new ProductManager ("./src/models/products.json")

router.get("/", async (req, res)=>{
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        //res.render("home", {products});
        if(limit){
            res.json(products.slice(0,limit))
        }else{
            res.json(products)
        }
    } catch (error) {
        console.log("No se pudieron obtener los productos")
        res.status(500).json({error: "Error interno del servidor"});
    }
})

//ruta /realTimeProducts: ruta a realTimeProducts.handlebars
router.get("/realtimeproducts", (req, res)=>{
    res.render("realTimeProducts")
})


module.exports = router;