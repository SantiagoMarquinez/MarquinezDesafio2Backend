const mongoose = require("mongoose");

// Definimos el esquema: "schema".
const usuariosSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    edad: Number
});

// Definir el modelo:
const UsuariosModel = mongoose.model("usuarios", usuariosSchema);

module.exports = UsuariosModel;
