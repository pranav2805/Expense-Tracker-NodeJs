const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');

const app = express();
app.use(cors());

User.hasMany(Expense);
Expense.belongsTo(User);

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/user');
const expRoutes = require('./routes/expRoute');

app.use(userRoutes);
app.use(expRoutes);

//app.use(errorController.get404);

sequelize.sync({}).then((result) => {
    app.listen(3000);
}).catch(err => console.log(err))