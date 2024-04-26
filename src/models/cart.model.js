const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId, //guardamos solo el id del producto, porque asi lo decia la consigna desde la primera pre-entrega / en esta linea estamos extrayendo el id de otra colección 
                ref: "Product",
                required: true
            },
            quantity: {
                type:Number, 
                required: true
            }
        }
    ]
})

const CartModel = mongoose.model("carts", cartSchema);

module.exports = CartModel;