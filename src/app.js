const PUERTO = 8080;
const ProductManager = require("./main.js");// aca estoy "importando"  main.js
const express = require("express");
const path = require("path");
const app = express();

const fs = require("fs");
console.log(`existe el archivo? ${fs.existsSync(path.join(__dirname, "src/products.json"))}`);


const products= new ProductManager(path.join(__dirname,"src/products.json"));
console.log(`HOLA ${path.join(__dirname,"src/products.json")}`)

app.get("/products", async(req,res)=>{
    try{
        await products.init();
        let prodList= await products.getProducts();
        console.log(prodList);
        const {limit}= req.query;
        console.log(`este es el limite ${limit}`);
        if(!limit){
            res.send(prodList);
        } else if (Number.isInteger(Number(limit)) && Number(limit) > 0 && Number(limit)<prodList.length){
            console.log(`CANTIDAD DE PRODUCTOS ${prodList.length}`)
            res.send(prodList.slice(0, limit));
        }else{
            res.send(`El limite (${limit}) no es valido`);
        }
    }
    catch(error){
        console.error("error del servidor", error);
        res.status(500).send("Error del servidor");
    }
});

app.get("/products/:id", async(req,res)=>{// los ":" antes del id indican que es dinamico. se recibe en los params del req que hace el cliente"
    try{
        let id= parseInt(req.params.id); // uso parseInt porque todos los datos que sacamos de los params son strings
        console.log(`producto con id ${id}`)
        let prodList= await products.getProductById(id);
        console.log(`Este es el producto solicitado ${prodList}`)
        res.send(prodList);
    }
    catch(error){
        console.error("error del servidor", error);
        res.status(404).send("Producto no encontrado");
    }
})


app.listen(PUERTO,()=>{
    console.log(`Esta aplicacion funciona en el puerto ${PUERTO}`)
})