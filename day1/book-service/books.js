const express = require('express');
const mongoose = require('mongoose');
const Book = require('./Book');
const mongoURI="mongodb://localhost:27017/test";
const port = 3000;



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