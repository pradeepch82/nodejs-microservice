const express = require('express');
const mongoose = require("mongoose");
const Order = require('./Order');
const Eureka = require('eureka-js-client').Eureka;

const axios = require('axios');
const mongoURI="mongodb://localhost:27017/test";
const booksURL="http://localhost:3000/books";
const customersURL="http://localhost:3001/customers";
const port = 3002;
const appName="order-service";
const eurekaHost = '127.0.0.1';
const eurekaPort = 8761;
const hostName = (process.env.HOSTNAME || 'localhost')
const ipAddr = '127.0.0.1';


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
   res.send("Welcome To Order Service");
})


app.post('/orders', (req, res) => {
   const newOrder = new Order({
   customerId: mongoose.Types.ObjectId(req.body.customerId),
   bookId: mongoose.Types.ObjectId(req.body.bookId),
   initialDate: req.body.initialDate,
   deliveryDate: req.body.deliveryDate
});
newOrder.save().then(() => {
   res.send('New order added successfully!')
  }).catch((err) => {
   res.status(500).send('Internal Server Error!');
  })
})


app.get('/orders', (req, res) => {
   Order.find().then((orders) => {
      if (orders) {
          res.json(orders)
       } else {
          res.status(404).send('Orders not found');
       }
   }).catch((err) => {
          res.status(500).send('Internal Server Error!');
   });
})

app.get('/orders/:id', (req, res) => {

    Order.findById(req.params.id).then((order) => {
         if (order) {
   
            console.log("OrderId  :"+order);
   
         axios.get(`${customersURL}/${order.customerId}`).then((response) => {

            console.log("CustomerId  :"+order.customerId);
   

         let orderObject = { 
           CustomerName: response.data.name, 
           BookTitle: '' 
          };

        axios.get(`${booksURL}/${order.bookId}`).then((response) => {
   
         console.log("BookId  :"+order.bookId);
   
         orderObject.BookTitle = response.data.title 
         res.json(orderObject);
        }).catch(err=>console.log("Book service problem ",err))
  }).catch(err=>console.log("Customer service problem ",err))	
     } else {
        res.status(404).send('Orders not found');
     }
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
   });
}) 

app.listen(port, () => {
     console.log(`Up and Running on port ${port} - This is Order service`);
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
     vipAddress: 'appName:'+port,
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
