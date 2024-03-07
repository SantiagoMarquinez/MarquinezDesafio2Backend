class Product {
    constructor(title, description, price, thumbnail, code, stock, id) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = id;
    }
}
class ProductManager {
    static id = 0;
    constructor() {
        this.products = [];
        this.path = path;
    }

    async init() {
        try {
            // Verificar si el archivo JSON existe
            if (fs.existsSync(this.path)) {
                // Leer productos del archivo JSON si existe
                const verProductsJson = await fs.promises.readFile(this.path, "utf-8");
                this.products = JSON.parse(verProductsJson);
            } else {
                // Si el archivo no existe, crearlo con un array vacío
                await fs.promises.writeFile(this.path, JSON.stringify(this.products), "utf-8");
            }
        } catch (error) {
            console.error("Error al inicializar ProductManager:", error);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            // Validar que no haya campos vacíos
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("El producto no puede tener campos vacíos");
                return;
            }

            // Verificar si el producto ya existe por código
            if (this.products.some(product => product.code === code)) {
                console.log("Este producto ya fue cargado con anterioridad");
                return;
            }

            // Crear un nuevo producto
            ProductManager.id++;
            const newProduct = new Product(title, description, price, thumbnail, code, stock, ProductManager.id);
            
            // Agregar el nuevo producto a la lista de productos
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
            console.log(this.products);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        }
    }

    async getProductById(id) {
        try {
            const productFound = this.products.find(product => product.id === id);
            if (!productFound) {
                console.error(`El producto con el id ${id} no fue encontrado`);
            } else {
                console.log(productFound);
            }
        } catch (error) {
            console.error(`Error inesperado al obtener el producto con id ${id}`, error);
        }
    }
}

const fs = require("fs");
const path = "./products.json";

async function main() {
    let manager = new ProductManager();
    await manager.init();
    await manager.getProducts();
    await manager.addProduct(`Mate`, `Yerba`, 3000, `thumbnail`, `03`, 10);
    await manager.addProduct(`Cafe`, `Cafecitooo`, 5000, `thumbnail2`, `034`, 10);
    await manager.addProduct(`palmitos`, undefined, 2000, `thumbnail3`, `56`, 10);
    await manager.addProduct(`Harina`, `harina 000`, 2000, `thumbnail3`, `000`, 10);
    await manager.getProducts();
    await manager.getProductById(`03`);
    await manager.getProductById(1);
};

main(); 
