console.log("esta funcionando main.js");
const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
})

// funcion para renderizar el listado de productos

const renderProducts = (products) => {
    const productsContainer = document.getElementById("productsContainer")
    productsContainer.innerHTML = "";

    products.forEach(element => {
        const card = document.createElement("div");
        card.innerHTML = `
                    <div class="card">
                        <p>ID:${element.id} </p>
                        <p>Titulo: ${element.title}</p>
                        <p>Precio: ${element.price}</p>
                        <button>Eliminar</button>
                    </div>
                        `
        productsContainer.appendChild(card);

        //agrego el evento al boton eliminar
        card.querySelector("button").addEventListener("click", () => {
            removeProduct(element.id);
        });
    });
}

//funcion eliminar producto
const removeProduct = (id)=>{
    socket.emit("removeProduct", id);
}


//Agregar producto:
//1) configuro el boton
document.getElementById("btnEnviar").addEventListener("click",()=>{
    addProduct();
})
//2)creo la funcion para agregar producto
const addProduct = ()=>{
    const product= {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock:document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    };
    socket.emit("addProduct", product);
}