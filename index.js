const express = require('express')
const custRouter = require('./routes/customer')
const userRouter = require('./routes/user')
const bodyParser = require('body-parser')
const path = require('path')
const hbs = require('hbs')
const mongoose = require('mongoose')
const error = require('./middleware/error')

const app = express();
const port = process.env.PORT

//settings for handle bars for dynamic templates
app.set('view engine', 'hbs') //default engine extension to use when nothing is specified
app.set('views', path.join(__dirname + '/views' ))
hbs.registerPartials(path.join(__dirname + '/views/partials' ))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

//settings for router and parsing to json
app.use(express.json()) //BUILT-IN middleware
app.use('/api/customer', custRouter);
app.use('/api/user', userRouter);
//error middleware
app.use(error);


mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connection to DB sucessful!");
  })
  .catch(() => {
    console.log("Connection to DB failed!");
});

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

process.on('unhandledRejection', function (err) {
  console.error((new Date).toUTCString() + ' unhandledRejection:', err.message)
  console.error(err.stack)
  process.exit(1)
})


app.listen(port, () => {
    console.log('Server is running on ' + port)
})


