const bcrypt = require('bcrypt');
const saltRounds = 10;

let encryptFuncs = {}

encryptFuncs.generateHashPassword = async (password) => {
    const hash = await bcrypt.hashSync(password, saltRounds);
    return await hash;
}

encryptFuncs.comparePasswordHash = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
}

module.exports = encryptFuncs;
