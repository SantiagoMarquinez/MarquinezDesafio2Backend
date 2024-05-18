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
        clientID: 'Iv23liBxSEJXDVkLcfMe',
        clientSecret: 'a79b8d979c8eee44f887eb0b7d6f329b17e4d791',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Verificamos si ya existe un usuario con el email de GitHub
            let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
                // Si no existe, creamos un nuevo usuario
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 36,
                    email: profile._json.email,
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
