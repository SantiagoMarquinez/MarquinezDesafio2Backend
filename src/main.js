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

    //METODOS
    async addProduct(title, description, price, thumbnail, code, stock) {
        //aca veo si tengo algo en el Json y si hay algo se almacena en verProductsJson
        const verProductsJson = await fs.promises.readFile(this.path, "utf-8");
        if (verProductsJson) {
            this.products = JSON.parse(verProductsJson)
        } //si el Json tenia algo lo parseo y lo almaceno en this.products. Aca no uso else porque si no hay nada en el Json, this.products seguira siendo array vacio porque asi lo inicializo en el constructor
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("El producto no puede tener campos vacios");
            return;
        } else {
            const producExist = this.products.find(product => product.code === code);// uso find porque al encontrar el primer producto con un codigo igual corta. Al ser pocos productos puede ser mas conveniente el some, pero lo hago pensando en que si agrego muchos productos, some puede encontrarlo en la primera posicion e igual seguiria hasta la ultima 
            if (producExist) {
                console.log("Este producto ya fue cargado con anterioridad");
                return;
            } else {
                ProductManager.id++;
                const newProduct = new Product(title, description, price, thumbnail, code, stock, ProductManager.id);//esta linea y la siguiente van aca porque si las pongo al principio, cuando hay un producto con algun campo vacio se incrementa el id sin que se cree efectivamente el producto, en cambio si llego aca es porque ya paso los filtros.
                this.products.push(newProduct); //pusheo el array con el producto agregado
                console.log(this.products);
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))//reescribo el JSON con todos los productos actualizados
                console.log(this.products);
                console.log("¡Producto agregado con exito!");
            };
        };
    };

    async getProducts() {
        try {
            // Verifico si el archivo existe
            const stats = await fs.promises.stat(this.path);
            if (stats.isFile()) { //isFile devuelve true si el archivo existe y false en caso contrario
                // Si el archivo existe, lo leo y guardo los productos
                const verProductsJson = await fs.promises.readFile(this.path, "utf-8");
                this.products = JSON.parse(verProductsJson);
                //Imprimo todos los productos
                for (let i = 0; i < this.products.length; i++) {
                    console.log(this.products[i]);
                }
            } else {
                console.log("No hay productos almacenados");
            }
        } catch (error) {
            console.error("Error al intentar obtener productos:", error);
        }
    }

    async getProductById(id) {
        try {
            const verProductsJson = await fs.readFile(this.path, "utf-8");
            if(verProductsJson){
                this.products= JSON.parse(verProductsJson)
                const productFound = this.products.find(producto => producto.id === id);
                if (!productFound) {
                    console.error(`El producto con el id ${id} no fue encontrado (Error 404 - Not Found)`)
                } else console.log(productFound);
            }
        }
        catch{
            console.error("Error inesperado");

        }
    }

};


const fs = require("fs");
const path = "./products.json"
const content = "[]";
fs.writeFile(path, content, (error) => {
    if (error) {
        console.error("No se pudo crear el archivo")
    } else {
        console.log("Archivo creado con exito")
    }
})

let manager = new ProductManager();
manager.getProducts();
manager.addProduct(`Mate`, `Yerba`, 3000, `thumbnail`, `03`, 10);
manager.addProduct(`Cafe`, `Cafecitooo`, 5000, `thumbnail2`, `034`, 10);
//manager.addProduct(`palmitos`, undefined, 2000, `thumbnail3`, `56`, 10);
//manager.addProduct(`Harina`, `harina 000`, 2000, `thumbnail3`, `000`, 10);
manager.getProducts();
//manager.getProductById(`03`);
//manager.getProductById(1);
