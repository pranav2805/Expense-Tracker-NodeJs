const Expense = require('../models/expense');

exports.getExpenses = async (req, res, next) => {
    try {
        //const expenses = await req.user.getExpenses();
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
        //const expense = await Expense.create({amount: amount, description: description, category: category});
        const expense = await req.user.createExpense({amount, description, category});
        res.status(201).json(expense);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.destroy({where: {id: req.params.id, userId: req.user.id}});
        if(expense === 0){
            return res.status(404).json({error: 'Expense does not belong to the user!'});
        }
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