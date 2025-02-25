const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.options('*', cors());


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


const categoryRoute = require('./routes/Categories/categories');
const productRoute = require('./routes/Products/products');
const subCategoryRoute = require('./routes/Subcategory/subcategory');
const productWeightRoute = require('./routes/ProductWeight/productweight');
const productRamsRoute = require('./routes/ProductRAMS/productRAMS');
const productSizeRoute = require('./routes/ProductSize/productSize');
const userRoutes = require('./routes/UserRoutes/userRoutes');
const orderRoutes = require('./routes/OrderRoutes/orderRoutes');


app.use(`/api/category`, categoryRoute)
app.use(`/api/products`, productRoute)
app.use(`/api/subcategory`, subCategoryRoute)
app.use(`/api/productweight`, productWeightRoute)
app.use(`/api/productRAMS`, productRamsRoute)
app.use(`/api/productsize`, productSizeRoute)
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
 app.use("/api/auth", userRoutes);


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