const User = require('../models/user');

exports.postUser = async (req, res, next) => {
    try{
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.create({username: username, email: email, password: password});
        res.status(200).json(user);
    } catch(err) {
        if(err.message === 'Validation error')
            res.status(500).json({error: 'Email id already exists!'});
        else
            res.status(500).json({error: err.message});
        // return res.status(500).json().then(body => {
        //     throw new Error(body.error)
        // })
    }
}