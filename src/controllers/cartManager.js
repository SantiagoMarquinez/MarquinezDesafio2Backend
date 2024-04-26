const CartModel = require("../models/cart.model.js")
class CartManager {

    async createNewCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Algo fallo. No se pudo crear el carrito", error);
            throw error;
        }
    }



    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const product = cart.products.find(p => p.product.toString() === productId);

            if (product) {
                product.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar el producto", error);
            throw error;
        }
    }


    async getCarts() {
        try {
            const carts = await CartModel.find();
            return carts
        } catch (error) {
            console.error("Error del servidor al obtener los carritos");
            throw error;
        }
    };
    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            console.log("Carrito obtenido de la Base de Datos:", cart);
            if (!cart) {
                console.log(`No se encontró el carrito con id ${cartId}`);
                return null;
            }
            return cart;
        } catch (error) {
            console.error("Error del servidor - no se pudo obtener el carrito especificado");
            throw error;
        }
    }

}

module.exports = CartManager;