const Eureka = require('eureka-js-client').Eureka;

const eurekaHost = (process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE || '127.0.0.1');
const eurekaPort = 8761;
const hostName = (process.env.HOSTNAME || 'localhost')
const ipAddr = '127.0.0.1';


exports.registerWithEureka = function(appName, PORT) {
  const client = new Eureka({
    instance: {
      id: appName,    
      instanceId: `${appName}:${PORT}`,
      app: appName,
      hostName: hostName,
      ipAddr: '127.0.0.1',
      statusPageUrl: `http://localhost:${PORT}`,
      port: {
        '$': PORT,
        '@enabled': 'true',
      },
      vipAddress: 'appName:'+PORT,
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      }
    },
    eureka: {
      host: hostName,
      port: eurekaPort,
      servicePath: '/eureka/apps/'
    }
  });


client.logger.level('debug')

client.start( error => {
    console.log(error || "hello service registered")
});



function exitHandler(options, exitCode) {
    if (options.cleanup) {
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) {
        client.stop();
    }
}

client.on('deregistered', () => {
    process.exit();
    console.log('after deregistered');
})

client.on('started', () => {
  console.log("eureka host  " + eurekaHost);
})

process.on('SIGINT', exitHandler.bind(null, {exit:true}));
};



