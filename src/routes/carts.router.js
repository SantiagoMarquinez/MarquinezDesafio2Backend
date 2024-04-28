const express = require("express");
const router = express.Router(); 
const CartManager = require("../controllers/cartManager");
const cartManager = new CartManager(); //"./src/models/carts.json"

router.post ("/", async (req, res)=>{//crea un carrito
    try {
        const newCart = await cartManager.createNewCart();
        res.json(newCart)
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
        console.error("Error al crear el carrito");
    }
});


//muestro todos los carritos
router.get("/", async (req,res)=>{
    try{
        const carts = await cartManager.getCarts();
        res.status(200).send(carts);
    }catch(error){
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

//muestra los productos de un carrito determinado por id
router.get ("/:cid", async(req, res)=>{
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById (cartId);
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
        console.error(`Error - No se pudo obtener el carrito con id ${cartId}`);
    }
})


//agrego un producto a un carrito con un id determinado
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 

    try {
        const updateCart = await cartManager.addProductToCart (cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
        console.error("Error - El producto no fue agregado al carrito", error);
    }
});


router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const result = await cartManager.deleteCartById(cartId);
        
        if (result.success) {
            res.status(200).send("Carrito eliminado correctamente");
        } else {
            res.status(404).send("No se encontró el carrito");
        }
    } catch (error) {
        console.error("Error al eliminar el carrito:", error);
        res.status(500).send("Error interno del servidor");
    }
});



module.exports = router; 