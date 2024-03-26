const fs = require("fs");
const path = require("path");

class Product {
    constructor(title, description, price, thumbnail, code, stock, id, category) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail || [];
        this.code = code;
        this.stock = stock;
        this.id = id;
        this.category = category;
        this.status = true;
    }
}
class ProductManager {
    constructor() {
        this.products = [];
        this.path = "./src/models/products.json";
        this.id = 0;
    }

    async readProducts() {
        try {
            const verProductsJson = await fs.promises.readFile(this.path, "utf-8");
            this.products = JSON.parse(verProductsJson);
        } catch (error) {
            console.error("Error al leer los productos desde el archivo JSON:", error);
            throw error;
        }
    }
    
    async addProduct(product) {
        try {
            await this.readProducts();
            const { title, description, price, thumbnail, code, stock, category, status } = product;

            // Valido que no haya campos vacios
            if (!title || !description || !price || !thumbnail || !code || !stock || !category || status === undefined) {
                console.log("El producto no puede tener campos vacíos");
                return;
            }
            // Verifico si el producto ya existe
            if (this.products.some(product => product.code === code)) {
                console.log("Este producto ya fue cargado con anterioridad");
                return;
            }
            // Creo un nuevo producto y lo agrego
            this.id++;
            const newProduct = new Product(title, description, price, thumbnail, code, stock, this.id, category, status);
            this.products.push(newProduct);

            // Escribir la lista actualizada de productos en el archivo JSON
            await fs.promises.writeFile(this.path, JSON.stringify(this.products), "utf-8");

            console.log("¡Producto agregado con éxito!");
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    }

    async getProducts() {
        try {
            await this.readProducts();
            return this.products;
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        }
    }

    async getProductById(id) {
        try {
            await this.readProducts();
            const productFound = this.products.find(product => product.id === id);
            if (!productFound) {
                throw new Error(`El producto con el ID ${id} no fue encontrado`);
            } else {
                await console.log(`Aca deberia estar el producto que buscas ${productFound}`)
                return productFound;
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            await this.readProducts();
            //busco el producto que coincida con el id y devuelvo el indice de ese producto, que es el que remuevo
            console.log(`ID RECIBIDO DESDE ROUTERS: ${id}`)
            console.log(this.path)
            console.log(this.products)
            const indexRemove = this.products.findIndex(product => product.id === id);
            console.log(`indice a remover: ${indexRemove}`)
            if (indexRemove > -1) {
                //lo remuevo de products
                this.products.splice(indexRemove, 1);
                //reescribo el JSON con products actualizado
                await fs.promises.writeFile(this.path, JSON.stringify(this.products), "utf-8");
                console.log("Elemento eliminado")
            } else {
                console.log(`No hay productos con el id ${id}`);
            }
        } catch (error) {
            console.error(`Error inesperado al eliminar el producto con id ${id}`, error);
        }
    }

    async updateProduct(id, toUpdateFields) {
        try {
            await this.readProducts();

            const indexUD = this.products.findIndex(product => product.id === id);
            if (indexUD === -1) {
                throw new Error(`El producto con id ${id} no existe`);
            }
            // Verifico si toUpdateFields no esta vacio y si el campo 'id' no esta incluido
            if (Object.keys(toUpdateFields).length > 0 && !('id' in toUpdateFields)) {
                // Verifico que toUpdateFields no contenga el campo id y si lo tiene lo elimino
                const updatedFields = { ...toUpdateFields };
                if ('id' in updatedFields) {
                    delete updatedFields.id;
                    console.error("No está permitido modificar el ID del producto");
                }
                // Actualizo los campos del producto
                this.products[indexUD] = { ...this.products[indexUD], ...updatedFields };
                // Actualizo la lista de productos en el archivo JSON
                await fs.promises.writeFile(this.path, JSON.stringify(this.products), "utf-8");
                console.log("Producto actualizado correctamente");
            } else if ('id' in toUpdateFields) {
                // Si el campo 'id' está incluido, tiro el error
                throw new Error("No está permitido modificar el ID del producto");
            } else {
                // Si toUpdateFields esta vacio, tiro el error
                throw new Error("No se especificaron campos para actualizar");
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }

}


module.exports = ProductManager;
