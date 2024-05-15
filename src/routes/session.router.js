const express = require("express");
const router = express.Router();
// const UserModel = require("../models/user.model.js");
// const { isValidPassword } = require("../utils/hashbcryp.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { authorization, passportCall } = require("../utils/util.js");

//Login: 
router.post("/login", (req, res) => {
    let { usuario, pass } = req.body;

    if (usuario === "tinki" && pass === "winki") {
        // Crear el token
        let token = jwt.sign({ usuario, pass, role: "user" }, "coderhouse", { expiresIn: "24h" });
        res.cookie("coderCookieToken", token, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ message: "Usuario logueado con exito" });
    } else {
        res.send({ message: "No se pudo completar el login" });
    }
});
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const usuario = await UserModel.findOne({ email: email });
//         if (usuario) {
//             //uso isValidPassword para verificar el pass: 
//             //if (usuario.password === password) {
//             if (isValidPassword(password, usuario)) {
//                 req.session.login = true;
//                 req.session.user = {
//                     email: usuario.email,
//                     age: usuario.age,
//                     first_name: usuario.first_name,
//                     last_name: usuario.last_name,
//                     role: usuario.role
//                 };

//                 res.redirect("/products");
//             } else {
//                 res.status(401).send({ error: "Contraseña no valida" });
//             }
//         } else {
//             res.status(404).send({ error: "Usuario no encontrado" });
//         }

//     } catch (error) {
//         res.status(400).send({ error: "Error en el login" });
//     }
// })


//Logout: 

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
});

module.exports = router; 