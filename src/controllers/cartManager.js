const fs = require("fs").promises;
class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.cId = 0;//id del ultimo carrito

        this.cargarCarritos();
    }
}