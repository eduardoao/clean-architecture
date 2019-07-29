'use strict';

const Boom = require('@hapi/boom');
const UserSerializer = require('../serializers/UserSerializer');
const ListUsers = require('../../red_application_business_rules/use_cases/users/ListUsers');
const CreateUser = require('../../red_application_business_rules/use_cases/users/CreateUser');
const GetUser = require('../../red_application_business_rules/use_cases/users/GetUser');
const DeleteUser = require('../../red_application_business_rules/use_cases/users/DeleteUser');
const UserRepository = require('../../red_application_business_rules/repositories/UserRepository');

const UserRepositoryInMemory = require('../storage/UserRepositoryInMemory');
const userRepository = new UserRepository(new UserRepositoryInMemory());

/*
const UserRepositorySQLite = require('../storage/UserRepositorySQLite');
const userRepository = new UserRepository(new UserRepositorySQLite());
*/

module.exports = {

  async createUser(request) {

    // Input
    const {
      firstName,
      lastName,
      email,
      password
    } = request.payload;

    // Treatment
    const user = await CreateUser(firstName, lastName, email, password, {
      userRepository
    });

    // Output
    const userSerializer = new UserSerializer();
    return userSerializer.serialize(user);
  },

  async findUsers() {

    // Treatment
    const users = await ListUsers({
      userRepository
    });

    // Output
    const userSerializer = new UserSerializer();
    return users.map(userSerializer.serialize)
  },

  async getUser(request) {

    // Input
    const userId = request.params.id;

    // Treatment
    const user = await GetUser(userId, {
      userRepository
    });

    // Output
    if (!user) {
      return Boom.notFound();
    }
    const userSerializer = new UserSerializer();
    return userSerializer.serialize(user);
  },

  async deleteUser(request, h) {

    // Input
    const userId = request.params.id;

    // Treatment
    await DeleteUser(userId, {
      userRepository
    });

    // Output
    return h.response().code(204);
  },

};