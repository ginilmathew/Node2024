const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
const app = require('./app');




const DB = process.env.DATABASE
//it will show whichenvirnoment the node app runing
console.log(app.get('env'))

console.log({ DB })

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(con => {
    console.log(con.connections);
    console.log('DB connected Successfully');
  })
  .catch(err => {
    console.error('DB connection error:', err);
  });

//To run Node env in terminal type (NODE_ENV=development nodemon server.js)



// const newTour = new tour({
//   name: 'The new tour parker',
//   rating: 4.5,
//   price: 700
// })

// newTour.save().then(doc => {
//   console.log(doc)
// }).catch(err => {
//   console.log(err)
// })

const port = process.env.PORT || 3000;
console.log({ port })
app.listen(port, () => {
  console.log(`App running on port 3000`);
});
