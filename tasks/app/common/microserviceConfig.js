'use strict'
let parameters = {}

parameters.configInitial = async () => {
    global.configMicroservices = {
        password: {
            expiration: '0',
            regex: '0'
        },
        token: {
            activateAccountExpiresIn: '24h',
            authenticationExpiresIn: '5m'
        }
    }
}


module.exports = parameters;