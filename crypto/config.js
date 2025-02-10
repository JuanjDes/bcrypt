const crypto = require('crypto'); // Genera clave aleatoria
const bcrypt = require('bcrypt'); // Hashea (encripta la clave aleatoria)

// constante secret será una palabra aleatoria de 64bytes en hexadecimal
const secret = crypto.randomBytes(64).toString('hex');
// encripta secret con 10 saltos o 10 veces y nos devuelve la última
const hashedSecret = bcrypt.hashSync(secret, 10);

/* Exportamos la variable hashedSecret, que es la clave final encriptada,
     para usarla en otros archivos */
module.exports = hashedSecret;