'use strict';

const AuthorizationController = require('../../../green_interface_adapters/controllers/AuthorizationController');

module.exports = () => {
  return {
    authenticate: AuthorizationController.verifyAccessToken
  };
};