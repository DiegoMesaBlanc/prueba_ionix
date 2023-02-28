'use strict'

const responseManagement = require('./../responseManagement')
const jwtFuncs = require('./../jwtFuncs');


exports.authenticated = async (request, response, next) => {
  let token = await request.headers.authorization;

  if (token) {
    token = token.replace('Bearer ', '');
  }

  const decoded = await jwtFuncs.verifyAuth(token);

  if (decoded.status == 1) {
    request.tokenData = await decoded.data;
    next()
  } else {
    return await responseManagement.UNAUTHORIZED(response, "Not authorized. The provided token is not valid.");
  }
};
