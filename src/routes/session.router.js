const express = require('express');
const passport = require('passport');
const router = express.Router();

// Ruta para autenticacion con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de GitHub despues de la autenticacion
router.get('/github/callback', passport.authenticate('github', {
    successRedirect: '/products',
    failureRedirect: '/login'
}));

module.exports = router;