const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expCont');

router.get('/expenses', expenseController.getExpenses);

router.post('/expenses', expenseController.postExpense);

router.delete('/expenses/:id', expenseController.deleteExpense);

router.put('/expenses/edit-expense/:id', expenseController.editExpense);

module.exports = router;