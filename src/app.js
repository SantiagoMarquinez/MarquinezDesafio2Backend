const PUERTO = 8080;
const ProductManager = require("./main.js");// aca estoy "importando"  main.js
const express = require("express");
const path = require("path");
const app = express();

const products= new ProductManager(path.join(__dirname,"/products.json"));
console.log(`HOLA ${path.join(__dirname,"/products.json")}`)

app.get("/products", async(req,res)=>{
    try{
        await products.init();
        let prodList= await products.getProducts();
        console.log(prodList);
        res.send(prodList);
    }
    catch(error){
        console.error("error del servidor", error);
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