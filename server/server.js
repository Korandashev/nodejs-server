const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

if (dotenv.error) {
  throw dotenv.error;
}

const { getSecret } = require('./secrets');

const usersRoute = require('./routes/users');
const questionsRoute = require('./routes/questions');

mongoose.Promise = global.Promise;
mongoose.connect(getSecret('dbUri'), { useFindAndModify: false }).then(
  () => {
    console.log('Connected to mongoDB');
  },
  (err) => console.log('Error connecting to mongoDB', err)
);

const app = express();
const port = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users', usersRoute);
app.use('/api/questions', questionsRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app };
