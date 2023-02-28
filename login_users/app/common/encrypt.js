const bcrypt = require('bcrypt');
const saltRounds = 10;

let encryptFuncs = {}


/**
 * Función que encripta la contraseña que queremos
 * @param {*} password Contraseña a encriptar
 * @returns Contraseña encriptada
 */
encryptFuncs.generateHashPassword = async (password) => {
    const hash = await bcrypt.hashSync(password, saltRounds);
    return await hash;
}


/**
 * Valida la autenticidad de dos contraseñas
 * @param {*} password Contraseña sin encriptar
 * @param {*} hash Contraseña encriptada
 * @returns Bolleano de validación entre las dos contraseñas
 */
encryptFuncs.comparePasswordHash = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
}

module.exports = encryptFuncs;
