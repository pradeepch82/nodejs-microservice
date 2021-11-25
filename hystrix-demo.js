  const CircuitBreaker = require('opossum');
  const HystrixStats = require('opossum-hystrix');
  const express = require('express');
  const axios=require("axios");

  const app = express();
  app.use('/hystrix.stream', hystrixStream);

const dashboard = require('hystrix-dashboard');
 
app.use(dashboard({
    idleTimeout: 4000,  // will emit "ping if no data comes within 4 seconds,
    interval: 2000,      // interval to collect metrics
    proxy: true         // enable proxy for stream
}));


async function getPost(x,y) {
      
    const apiCall = await axios
      .get("https://jsonplaceholder.typicode.com/posts/1")
      .then(function(result) {
        // handle success
        console.log("==========Successs "+result+"==============");
        console.log(result.data);
        y.send(response);
        
         })
      .catch(function(error) {
        // handle error
        console.log("===========Error "+error+"==============");
          })
      .then(function() {
        // always executed
      console.log("============Completed============");
      });

  
  }

//==========


async function getUser(x,y) {
      
    const apiCall = await axios
      .get("https://jsonplaceholder.typicode.com/users/1")
      .then(function(result) {
        // handle success
        console.log("==========Successs "+result+"==============");
        console.log(result.data);
        y.send(response);

         })
      .catch(function(error) {
        // handle error
        console.log("===========Error "+error+"==============");
          })
      .then(function() {
        // always executed
      console.log("============Completed============");
      });

  
  }
  

const options = {
  timeout: 1000, // If our function takes longer than 1 millisecond, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

  
  
  
  
  // create a couple of circuit breakers
  const c1 = new CircuitBreaker(getUser);
  const c2 = new CircuitBreaker(getPost);


app.get("/user",(request,response)=>{
  //getUser(request,response);
  c1.fire()
  .then(result=>response.send(result))
  .catch(error=>response.send(error))
    


});

app.get("/post",(request,response)=>{
 // getUser(request,response);
  c2.fire()
    .then(result=>response.send(result))
    .catch(error=>response.send(error))
    

});


  // Provide them to the constructor
  const hystrixMetrics = new HystrixStats([c1, c2]);

  // Provide a Server Side Event stream of metrics data
  function hystrixStream (request, response) {
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
        });
      response.write('retry: 10000\n');
      response.write('event: connecttime\n');

      hystrixMetrics.getHystrixStream().pipe(response);
    };
  
    app.listen(8080,function(){
        console.log("Server started  on port 8080");
    })