const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./customer');
const mongoURI="mongodb://localhost:27017/test";
const port = 3001;

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


