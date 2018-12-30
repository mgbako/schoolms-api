require('dotenv').config();

const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/schoolms')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...'));

const feedRoutes = require('./routes/feed');
const courseRoutes = require('./routes/course');
const userRoutes = require('./routes/user')

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

if(process.env.Environment === 'development'){
  app.use(morgan('combined'));
  console.log('Morgan enabled...');
}

app.use('/api/feed/', feedRoutes);
app.use('/api/course/', courseRoutes);
app.use('/api/user/', userRoutes);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));