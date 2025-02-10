const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

const router = require('./routes/users.js');
const hashedSecret = require('./crypto/config.js');

// Parseamos datos que envia el cliente
app.use(express.json());
// Parseamos datos de formularios
app.use(express.urlencoded( { extended: true } ));

app.use(
    session({
        secret: hashedSecret,
        resave: false, // no volver a generar token cuando recargue pagina
        saveUninitialized: true, // al inicio guarda sesion del session
        cookie: { secure: false},
        /* cookie: guarda información de la sesión. Si las cookies no cambian,
            no nos pide aceptarlas otra vez */
    })
);

app.use('/', router);

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
});