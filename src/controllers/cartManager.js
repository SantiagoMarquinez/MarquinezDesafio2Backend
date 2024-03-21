const fs = require("fs").promises;
class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.cId = 0;//id del ultimo carrito

        this.cargarCarritos();
    }

    async cargarCarritos(){
        try {
            const cartsInJson = JSON.parse(await fs.readFile(this.path, "utf-8"));
            this.carts = cartsInJson;
            if(this.carts.length>0){
                this.cId = Math.max(...this.carts.map(cart=>cart.id));//encuentra el id mas alto entre todos los carritos que hay almacenados, para que cuando cargue un nuevo carrito ya este almacenado en this.cId, el id del ultimo carrito
                }
        } catch (error) {
            console.error("Error - no se cargaron los carritos", error);
            await this.saveCarts(); // si no existe el  archivo lo creo
        }
    }
    async saveCarts(){
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));

        } catch (error) {
            console.error("Error - no se guardaron los carritos", error);
        }
    }

    async createNewCart(){
        try {
            const newCart = {
                id: this.cId++,
                products: []
            }
            this.carts.push(newCart);
            await this.saveCarts();
            return newCart
        } catch (error) {
            console.error("Error - no se pudo crear el carrito", error);
            
        }
    }

    async getCartById (cartId){
        try {
            const cart = this.carts.find(ca=> ca.id === cartId);
            if (!cart){
                console.log(`No existe un carrito con id ${cartId}`)
                return;
            }
            return cart;
        } catch (error) {
            console.log("Error en el proceso de obtención del carrito", error);
            
        }
    }

    async addProductToCart (cartId, productId, quantity = 1){ //quantity = 1 hace que si no recibimos una cantidad la misma sea 1 por defecto (si no nos pasan cantidad solo se agrega uno)
        try {
            const cart = await this.getCartById(cartId);
            const product = cart.products.find( p=> p.product === productId);
            if(product){
                product.quantity += quantity
            } else{
                cart.products.push ({product: productId, quantity})
            }
            await this.saveCarts();
            return cart;
        } catch (error) {
            console.error("Error al agregar el producto", error);
        }
    }
}

module.exports = CartManager;