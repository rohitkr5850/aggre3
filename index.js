const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Import routes
const loanRoutes = require('./routes/loan.routes');
const analyticsRoutes = require('./routes/analytics.routes');

app.use('/loans', loanRoutes);
app.use('/analytics', analyticsRoutes);

// DB + Server
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
