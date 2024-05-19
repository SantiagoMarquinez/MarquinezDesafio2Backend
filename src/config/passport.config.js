// Importamos los módulos necesarios
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model'); // Ajusta la ruta según tu estructura de carpetas

// Función para hashear la contraseña
const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Función para comparar la contraseña hasheada
const isValidPassword = (password, user) => {
    return bcrypt.compareSync(password, user.password);
};

// Función para inicializar Passport con nuestras estrategias
const initializePassport = () => {
    // Estrategia para registrar un nuevo usuario
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            // Verificamos si ya existe un usuario con ese email
            let user = await userModel.findOne({ email });
            if (user) {
                return done(null, false, { message: 'El correo electrónico ya está registrado' });
            }
            // Creamos un nuevo usuario
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            };
            let resultado = await userModel.create(newUser);
            return done(null, resultado);
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia para autenticar un usuario ya registrado
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            // Verificamos si existe un usuario con ese email
            let user = await userModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            // Verificamos la contraseña
            if (!isValidPassword(password, user)) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia para autenticación con GitHub
    passport.use('github', new GitHubStrategy({
        clientID: 'Ov23liRquhuweu9apS2T',
        clientSecret: 'dc37ca2a2810efe13a71b2c8e083b35e767cb1a2',
        callbackURL: 'http://localhost:8080/api/sessions/github/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Verificamos si ya existe un usuario con el email de GitHub
            const email = profile._json.email || `${profile.username}@github.com`; // usa el nombre de usuario si el correo no está disponible
            let user = await userModel.findOne({ email });
            if (!user) {
                // Si no existe, creamos un nuevo usuario
                let newUser = {
                    first_name: profile._json.name || profile.username,
                    last_name: profile._json.name || profile.username,
                    age: 18,// uso 18 para que sea mayor de edad
                    email: email,
                    password: createHash('github')
                };
                let resultado = await userModel.create(newUser);
                done(null, resultado);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    // Serializar y deserializar el usuario para la sesión
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

module.exports = initializePassport;
