const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./customer');
const Eureka = require('eureka-js-client').Eureka;
const mongoURI="mongodb://localhost:27017/test";
const port = 4101;
const appName="customer-service";
const eurekaHost = '127.0.0.1';
const eurekaPort = 8761;
const hostName = (process.env.HOSTNAME || 'localhost')
const ipAddr = '0.0.0.0';

// Connect
mongoose.connect(mongoURI, { 
     useNewUrlParser: true,
     useUnifiedTopology: true,
}).then(() => {
     console.log('Connection successful!');
}).catch((e) => {
     console.log(e);
     console.log('Connection failed!');
})


const app = express();
app.use(express.json())


app.get('/', (req, res) => {
   res.send("Welcome To Customer Service running @ Port :"+port);
})

app.get('/welcome', (req, res) => {

   const instances = client.getInstancesByAppId(appName);
   console.log(instances);

   res.send("Welcome "+instances);

})



app.post('/customers', (req, res) => {
    console.log("In postCustomer");
    const newCustomer = new Customer({...req.body});
    newCustomer.save().then(() => {
       res.send('New Customer created successfully!');
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    })
})
app.get('/customers', (req, res) => {
console.log("In getCustomer");


    Customer.find().then((customers) => {
       if (customers) {
          res.json(customers)
       } else {
          res.status(404).send('customers not found');
       }
    }).catch((err) => {
         res.status(500).send('Internal Server Error!');
   });
})

app.get('/customers/:id', (req, res) => {
    Customer.findById(req.params.id).then((customer) => 	{
     if (customer) {
          res.json(customer)
      } else {
          res.status(404).send('customer not found');
      }
    }).catch((err) => {
          res.status(500).send('Internal Server Error!');
   });
})

app.delete('/customers/:id', (req, res) => {
Customer.findByIdAndRemove(req.params.id).then((customer) => {
    if (customer) {
         res.json('customer deleted Successfully!')
      } else {
         res.status(404).send('Customer Not Found!');
      }
    }).catch((err) => {
       res.status(500).send('Internal Server Error!');
  });
});


app.put('/customers/:id', (req, res) => {
   Customer.findByIdAndUpdate(req.params.id,req.body).then((customer) => {
       if (customer) {
            res.json('customer updated Successfully!')
                
         } else {
            res.status(404).send('Customer Not Found!');
         }
       }).catch((err) => {
          res.status(500).send('Internal Server Error!');
     });
   });
   
   


app.listen(port, () => {
    console.log(`Up and Running on port ${port}- This is Customer service`);
});




const client = new Eureka({
   instance: {
     id: appName,    
     instanceId: `${appName}:${port}`,
     app: appName,
     hostName: hostName,
     ipAddr: ipAddr,
     statusPageUrl: `http://localhost:${port}`,
     port: {
       '$': port,
       '@enabled': 'true',
     },
     vipAddress: appName,
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


