const Eureka = require('eureka-js-client').Eureka;
const client = new Eureka({
    instance: {
      id: "book-service",    
      instanceId: `book-service:3000`,
      app: "book-service",
      hostName: "localhost",
      ipAddr: "127.0.0.1",
      statusPageUrl: `http://localhost:3000`,
      port: {
        '$': 3000,
        '@enabled': 'true',
      },
      vipAddress: 'book-service:'+port,
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      }
    },
    eureka: {
      host: localhost,
      port: 8761,
      servicePath: '/eureka/apps/'
    }
 });
