const express = require("express");
const router = express.Router(); 
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager("./src/models/carts.json");


router.post ("carts", async (req, res)=>{
    try {
        const newCart = await cartManager.createNewCart();
        res.json(newCart)
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})



module.exports = router; 