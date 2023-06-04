const User = require('../models/user');
const Expense = require('../models/expense');

exports.getLeaderboard = async (req, res) => {
    try{
        const expenses = await Expense.findAll();
        const users = await User.findAll();
        
        const userAggregatedExpense = {};
        expenses.forEach(expense => {
            if(userAggregatedExpense[expense.userId]){
                userAggregatedExpense[expense.userId] += expense.amount;
            } else{
                userAggregatedExpense[expense.userId] = expense.amount;
            }
        })
        //console.log(userAggregatedExpense);
        const userLeaderboard = [];
        users.forEach(user => {
            userLeaderboard.push({name: user.username, totalExpenses: userAggregatedExpense[user.id] || 0})
        })

        userLeaderboard.sort((a, b) => b.totalExpenses - a.totalExpenses);
        res.status(200).json(userLeaderboard);
    } catch(err) {
        console.log(err);
        res.status(403).json({message: 'Something went wrong!!'})
    }
}