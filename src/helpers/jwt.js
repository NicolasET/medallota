const jwt = require('jsonwebtoken');

const generarJwt = (uid, nombre, rol) => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid,
            nombre,
            rol
        }

        jwt.sign(payload, process.env.Secret_JWT, { expiresIn: "2h" },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject("No se pudo generar el token")
                }

                resolve(token)
            }
        )
    })
};

module.exports = {
    generarJwt
}