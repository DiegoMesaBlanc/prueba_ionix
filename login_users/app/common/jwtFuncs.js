const jwt = require('jsonwebtoken');

const algorithm = "HS256";

let jwtFuncs = {}

//Firmar token de autenfificacion
jwtFuncs.signAuth = async (payload) => {
    // SIGNING OPTIONS
    const signOptions = {
        expiresIn: global.configMicroservices.token.authenticationExpiresIn,
        algorithm: algorithm
    };

    const tokenJwt = await jwt.sign(payload, 'D13G0_Pru3B4_10n1X', signOptions);

    return await tokenJwt;
}


//verificar token de autenfificacion
jwtFuncs.verifyAuth = async (token) => {
    const verifyOptions = {
        expiresIn: global.configMicroservices.token.authenticationExpiresIn,
        algorithm: algorithm
    };

    return await jwt.verify(token, 'D13G0_Pru3B4_10n1X', verifyOptions, (err, decoded) => {
        if (err) {
            return { status: 0, error: err }
        } else {
            return { status: 1, data: decoded }
        }
    });
}


module.exports = jwtFuncs;