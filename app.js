const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');

const app = express();
app.use(cors());

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

// Routes
const userRoutes = require('./routes/user');
const expRoutes = require('./routes/expRoute');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');

app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use(userRoutes);
app.use(expRoutes);

//app.use(errorController.get404);

sequelize.sync().then((result) => {
    app.listen(process.env.PORT_NUMBER);
}).catch(err => console.log(err))