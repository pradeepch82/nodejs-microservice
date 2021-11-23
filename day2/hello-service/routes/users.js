var express = require('express');
var router = express.Router();
// Or, if you're not using a transpiler:
const Eureka = require('eureka-js-client').Eureka;
const eurekaHost = (process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE || '127.0.0.1');
const eurekaPort = 8761;
const hostName = (process.env.HOSTNAME || 'localhost')
const ipAddr = '172.0.0.2';

// example configuration
const client = new Eureka({
    instance: {
      app: "hello-service",
      hostName: hostName,
      ipAddr: ipAddr,
      port: {
        '$': 3000,
        '@enabled': 'true',
      },
      vipAddress: "hello-service",
      dataCenterInfo:{
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
    },
  eureka: {
    host: eurekaHost,
    port: eurekaPort,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
});

/* GET users listing. */
router.get('/', function(req, res, next) {

  const instances = client.getInstancesByAppId('HELLO-SERVICE');

console.log("Instances ",instances);

  res.send('respond with a resource');

});

module.exports = router;
