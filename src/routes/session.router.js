const express = require("express");
const router = express.Router();
const passport = require("passport");

//Login: 
router.post("/login", passport.authenticate("local", {
    successRedirect: "/products",
    failureRedirect: "/login",
}));

//Logout: 
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

module.exports = router;
