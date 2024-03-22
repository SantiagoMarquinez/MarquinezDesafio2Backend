const express = require("express");
const router = express.Router(); 
const CartManager = require("../controllers/cartManager.js");
const cartManager = new CartManager("./src/models/carts.json");

router.post ("/carts", async (req, res)=>{//crea un carrito
    try {
        const newCart = await cartManager.createNewCart();
        res.json(newCart)
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

//muestra los productos de un carrito determinado por id
router.get ("/carts/:cid", async(req, res)=>{
    const cartId = parseInt(req.params.cid);
    try {
        const cart = await cartManager.getCartById (cartId);
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

router.post("/carts/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    console.log(cartId)
    const productId = req.params.pid;
    console.log(productId) // No es necesario convertir a número
    const quantity = req.body.quantity || 1; 

    try {
        const updateCart = await cartManager.addProductToCart (cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});





module.exports = router; 