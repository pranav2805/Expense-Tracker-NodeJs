const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expCont');
const userAuthentication = require('../middleware/auth');

router.get('/expenses', userAuthentication.authenticate, expenseController.getExpenses);

router.post('/expenses', userAuthentication.authenticate, expenseController.postExpense);

router.delete('/expenses/:id', userAuthentication.authenticate, expenseController.deleteExpense);

router.put('/expenses/edit-expense/:id', expenseController.editExpense);

module.exports = router;