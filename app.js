const circuitBreaker = require("opossum");
const axios = require("axios");

async function asyncFunctionThatCouldFail(x, y) {
  const apiCall = await axios
    .get("https://jsonplaceholder.typicode.com/posts/1")
    .then(function(response) {
      // handle success
      console.log(response.data);
    })
    .catch(function(error) {
      // handle error
      //console.log(error);
    })
    .then(function() {
      // always executed
    });
}

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};


const breaker = new circuitBreaker(asyncFunctionThatCouldFail, options);
breaker.fallback(() => "Sorry, out of service right now");
breaker.on("fallback", (result) => {
  console.log(result);
});
breaker.on("success", () => console.log("success"));
breaker.on("failure", () => console.log("failed"));
breaker.on("timeout", () => console.log("timed out"));
breaker.on("reject", () => console.log("rejected"));
breaker.on("open", () => console.log("opened"));
breaker.on("halfOpen", () => console.log("halfOpened"));
breaker.on("close", () => console.log("closed"));
breaker
  .fire()
  .then(console.log)
  .catch(console.error);