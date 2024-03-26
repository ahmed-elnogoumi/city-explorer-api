'use strict'

const express = require('express');
const app = express();
const port = 3000;
const weatherData = require('./data/weather.json');

app.get('/', (req, res) => {
  res.send('Hello from Express.js!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});