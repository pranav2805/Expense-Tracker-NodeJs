const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const app = express();
app.use(cors());

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/user');
const expRoutes = require('./routes/expRoute');

app.use(userRoutes);
app.use(expRoutes);

sequelize.sync().then((result) => {
    app.listen(3000);
}).catch(err => console.log(err))