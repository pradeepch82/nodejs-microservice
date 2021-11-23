var express = require('express');
var router = express.Router();


var app=express();

let instance=process.env.NODE_APP_INSTANCE || '0';



/* GET home page. */
app.get('/', function(req, res, next) {
  res.send("Instances running "+instance);
});


app.listen(8080,function(){
    console.log("Server running on port 8080");
});
