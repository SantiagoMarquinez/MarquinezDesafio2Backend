const CartModel = require("../models/cart.model.js")
class CartManager {

    async createNewCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
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

    async deleteCartById(cartId) {
        try {
            const cart = await CartModel.findByIdAndDelete(cartId);
            if (!cart) {
                console.log(`Carrito ${cartId} inexistente. Verifique el ID`);
                return { success: false, message: `Carrito ${cartId} inexistente. Verifique el ID` };
            } else {
                console.log(`El carrito ${cartId} fue eliminado con éxito`);
                return { success: true, message: `El carrito ${cartId} fue eliminado con éxito` };
            }
        } catch (error) {
            console.error("Error del servidor", error);
            throw error;
        }
    }
    
}

module.exports = CartManager;