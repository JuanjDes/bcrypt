const jwt = require('jsonwebtoken');
const hashedSecret = require('../crypto/config.js');

// funcion para generar el token. Esta función no es un middleware
function generarToken (user) {
    const token = jwt.sign( {user: user.id}, hashedSecret, {expiresIn: '1h'} );
    return token;
};

// Middleware para verificar si el token existe
const verificarToken = (req, res, next) => {
    const token = req.session.token; // traigo el token generado
    
    if(!token) {
        return res.status(401).json({message: 'Token no generado'});
    } else {
        jwt.verify(token, hashedSecret, (err, decoded) => {
            if(err) {
                return res.status(401).json({message: 'Token inválido'});
            }
            req.user = decoded.user;
            next();
        });
    }
};

module.exports = {generarToken, verificarToken};