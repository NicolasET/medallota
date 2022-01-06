const jwt = require('jsonwebtoken');

const validarJwt = (req, res, next) => {
    let token = "";

    // EN POSTMAN: Authorization: Type => Bearer Token (Se coloca el token generado para el usuario logeado)
    //             Body: GraphQL => QUERY:
    // {
    //     cursos {
    //         id,
    //         nombre
    //     }
    // }

    token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) {
        req.user = { auth: false }
        return next();
    }

    if (token.startsWith("Bearer ")) {
        // El slice es para quitar del token la palabra "Bearer ", y se reasigna al mismo token
        token = token.slice(7, token.length);
        console.log(token);
    }
    try {
        const { uid, nombre, rol } = jwt.verify(token, process.env.Secret_JWT);
        console.log(uid, nombre, rol);
        req.user = { auth: true, rol: rol, id: uid, nombre: nombre };
        return next();

    } catch (error) {
        req.user = { auth: false }
        return next();
    }
};

module.exports = {
    validarJwt
}