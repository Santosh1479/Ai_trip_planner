require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const planRoutes = require('./src/routes/planRoutes')
const cookieParser = require('cookie-parser');
const userRoutes = require('./src/routes/user.routes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, )
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/plan', planRoutes);
app.use('/travel', require('./src/routes/travel.routes'));
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/users', userRoutes);


module.exports = app;