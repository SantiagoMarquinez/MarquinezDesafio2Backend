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


// Ruta para autenticacion con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/products',
    failureRedirect: '/login'
}));

//Ruta logout
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});


module.exports = router;