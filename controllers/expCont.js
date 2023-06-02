const Expense = require('../models/expense');

exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.postExpense = async (req, res, next) => {
    try {
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const expense = await Expense.create({amount: amount, description: description, category: category});
        res.status(201).json(expense);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.destroy({where: {id: req.params.id}});
        res.status(200).json(expense);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

exports.editExpense = async (req, res, next) => {
    try {
        const expense = await Expense.update(req.body, {where: {id: req.params.id}});
        console.log(expense);
        res.status(200).json(expense);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}