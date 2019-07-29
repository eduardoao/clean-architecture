'use strict';

const Hapi = require('@hapi/hapi');
const Package = require('../../../package');


const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const oauthrouter = require('./oauth/index');
const hellorouter = require('./hello');
const privaterouter = require('./private');
const usersrouter = require('./users');

const createServer = async () => {

  // Create a server with a host and port
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    "routes": {
      "cors": true
    }
  });

  // Register vendors plugins
  await server.register([
    require('blipp'),
    require('@hapi/inert'),
    require('@hapi/vision'),
    {
      plugin: require('hapi-swagger'),
      options: {
        info: {
          title: 'Test API Documentation',
          version: Package.version,
        },
      }
    },
    {
      plugin: require('@hapi/good'),
      options: {
        ops: {
          interval: 1000 * 60
        },
        reporters: {
          myConsoleReporter: [{
              module: '@hapi/good-squeeze',
              name: 'Squeeze',
              args: [{
                ops: '*',
                log: '*',
                error: '*',
                response: '*'
              }]
            },
            {
              module: '@hapi/good-console'
            },
            'stdout'
          ]
        }
      },
    },
  ]);

  // Register custom plugins
  await server.register([
    require('./oauth'),
    require('./hello'),
    require('./private'),
    require('./users'),
  ]);


//Using express for http connection
app.use(bodyParser.json({
  limit: '5mb'
}));

app.use(bodyParser.urlencoded({
  extended:false
}));

// Habilita o CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

 app.use('/oauth', oauthrouter);
 app.use('/hello', hellorouter);
 app.use('/private', privaterouter);
 app.use('/users', usersrouter);

return app;
 // return server;
};

module.exports = createServer;