const express = require('express');
const mongoose = require('mongoose');
const Book = require('./Book');
const Eureka = require('eureka-js-client').Eureka;

const mongoURI="mongodb://localhost:27017/test";
const port = 3000;
const appName="book-service";
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
    res.send("Welcome To Book Service");
})

app.post('/books', (req, res) => {
    const newBook = new Book({...req.body});
    newBook.save().then(() => {
          res.send('New Book added successfully!')
    }).catch((err) => {
         res.status(500).send('Internal Server Error!');
    })
})

app.get('/books', (req, res) => {
   Book.find().then((books) => {
        if (books.length !== 0) {
              res.json(books)
        } else {
            res.status(404).send('Books not found');
       }
    }).catch((err) => {
         res.status(500).send('Internal Server Error!');
    });
})
app.get('/books/:id', (req, res) => {
    Book.findById(req.params.id).then((book) => {
        if (book) {
           res.json(book)
        } else {
            res.status(404).send('Books not found');
        }
     }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    });
})



app.put('/books/:id', (req, res) => {
     Book.findOneAndUpdate(req.params.id,req.body).then((book) 	=> {
         if (book) {
            res.json('Book updated Successfully!')
                   
          } else {
             res.status(404).send('Book Not found!'); 
         }
     }).catch((err) => {
          res.status(500).send('Internal Server Error!');
     });
 });


app.delete('/books/:id', (req, res) => {
    Book.findOneAndRemove(req.params.id).then((book) 	=> {
        if (book) {
      
          res.json('Book deleted Successfully!')


        } else {
            res.status(404).send('Book Not found!'); 
        }
    }).catch((err) => {
         res.status(500).send('Internal Server Error!');
    });
});
app.listen(port, () => {
     console.log(`Up and Running on port ${port} - This is Book service`);
})




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


















