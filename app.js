// Call in installed dependencies
const express = require('express');
// set up express app
const app = express();
// set up port number
const port = 4000;
// set up home route

const testjson = {
  "name": "John Doe",
  "age": 30,
  "city": "New York"
};

app.get('/', (request, respond) => {
  respond.status(200).json({
    message: 'Welcome to Project Support',
    data: testjson
  });
  console.log("Request duoc goi", request.url);
});
app.listen(port, (request, respond) => {
  console.log(`Our server is live on ${port}. Yay!`);
}); 
