const express = require('express');

const morgan = require('morgan')

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json());
//below help to run html file in browser (images,html etc)
app.use(express.static(`${__dirname}/public`))





// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Helo from the server Side', app: 'Natours' })
// })

// app.post('/', (req, res) => {
//   res.send('you can Post to this')
// })


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;