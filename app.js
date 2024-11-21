const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.options('*', cors());


app.use(bodyParser.json());


const categoryRoute = require('./routes/categories');
const productRoute = require('./routes/products');


app.use(`/api/category`, categoryRoute)
app.use(`/api/products`, productRoute)


mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
