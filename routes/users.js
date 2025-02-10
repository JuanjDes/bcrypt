// Rutas para usuarios. Por eso el archivo se llama users.js

const express = require('express');
const router = express.Router();

const users = require('../data/users.js');
const {generarToken, verificarToken} = require('../middlewares/authMiddleware.js');

const jwt = require('jsonwebtoken');

// Formulario de inicio de sesion
router.get('/', (req, res) => {
    if (req.session.token) {
        const formLogout = `
            <center>
                <h1> Hola ${req.session.username}!</h1>
                <a href = "/dashboard">Dashboard</a>
                <a href = "/logout">Logout</a>
            </center>
        `;
        res.send(formLogout);
    } else {
        const formulario = `
            <center>
                <h1> AUTENTICACION DE USUARIOS </h1>
                <hr style = "width: 50%">
                <br><br><br><br>
                <form action = "/login" method = "POST">
                    <label for = "username"> Usuario ... : </label>
                    <input type = "text" id = "username" name = "username" required><br><br>
                    <label for = "password"> Contraseña: </label>
                    <input type = "password" id = "password" name = "password" required><br><br><br>
                    <input type = "submit" value = "Iniciar sesión">
                </form>
            </center>
        `;
        
        res.send(formulario);
        }
});

// Validar usuario y contraseña y generar un toker
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        res.status(401).send('Usuario o contraseña incorrectos');
        return;
    } else {
        const token = generarToken(user); // genero un token
        req.session.token = token; // guardo token en session.token
        req.session.username = user.username;
        res.redirect('/dashboard');
    }

});

// Panel de control, accesible con token válido
router.get('/dashboard', verificarToken, (req, res) => {
    const userId = req.user;
    const user = users.find(u => u.id === userId)

    console.log('userID: ' + userId);
    console.log('user: ' + user);

    if (user) {
        const template = `
            <center>
                <h1> Bienvenido ${req.session.username} </h1>
                <hr style = "width: 50%">
                <br><br><br><br>
                <p>ID: <strong>${user.id}</strong></p>
                <p>Username: <strong>${user.username}</strong></p>
                <br><br>
                <a href="/">Home</a>
                <form action = "/logout" method = "POST">
                    <button type = "submit">Cerrar sesión</button>
                </form>
            </center>
        `;
        
        res.send(template);
    } else {
        res.status(401).json({ message: 'Token no válido (users.js)' });
    };

});

// Cerrar y destruir la sesion
router.post('/logout', (req, res) => {
    req.session.destroy();  // destuimos el token
    res.redirect('/');
})

module.exports = router;