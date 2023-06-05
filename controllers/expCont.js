const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await req.user.getExpenses();
        //const expenses = await Expense.findAll();
        res.status(200).json({expenses: expenses, user: req.user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.postExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        //const expense = await Expense.create({amount: amount, description: description, category: category});
        const expense = await req.user.createExpense({amount, description, category}, {transaction: t});

        const newTotalExpense = Number(req.user.totalExpenses) + Number(amount);
        
        await User.update(
            {totalExpenses: newTotalExpense},
            {
                where: {id: req.user.id},
                transaction: t
            }
        )

        await t.commit();
        res.status(201).json(expense);

    } catch(err) {
        await t.rollback();
        res.status(500).json({error: err.message});
    }
}

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const expenseAmount = await Expense.findOne(
            {
                attributes: ['amount'],
                where: {id: req.params.id, userId: req.user.id}, 
                transaction: t
            },
        )
        console.log('Deleted amount:' ,expenseAmount.amount);

        const expense = await Expense.destroy({where: {id: req.params.id, userId: req.user.id}, transaction: t});
        if(expense === 0){
            return res.status(404).json({error: 'Expense does not belong to the user!'});
        }

        const newTotalExpense = Number(req.user.totalExpenses) - Number(expenseAmount.amount);

        await User.update(
            {totalExpenses: newTotalExpense},
            {
                where: {id: req.user.id},
                transaction: t
            }
        )

        await t.commit();
        res.status(200).json(expense);
    } catch(err) {
        await t.rollback();
        res.status(500).json({error: err.message});
    }
}

exports.editExpense = async (req, res, next) => {
    try {
        const expense = await Expense.update(req.body, {where: {id: req.params.id, userId: req.user.id}});
        console.log(expense);
        if(expense === 0){
            return res.status(404).json({error: 'Expense does not belong to the user!'});
        }
        res.status(200).json(expense);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}