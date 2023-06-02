const User = require('../models/user');

function isStringInvalid(string) {
    if(string == undefined || string.length === 0)
        return true;
    else
        return false;
}

exports.postUser = async (req, res, next) => {
    try{
        const{username, email, password} = req.body;
        if(isStringInvalid(username) || isStringInvalid(email) || isStringInvalid(password)){
            return res.status(400).json({err: 'Bad parameter. Something is missing!'});
        }

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

exports.login = async (req, res, next) => {
    try{
        const{email, password} = req.body;
        if(isStringInvalid(email) || isStringInvalid(password)){
            return res.status(400).json({err: 'Bad parameter. Something is missing!'});
        }

        const users = await User.findAll({where: {email: email}});
        const user = users[0];
        //console.log(user);
        if(user){
            if(user.password === password)
                res.status(200).json('User logged in successfully!');
            else
                res.status(401).json({error: 'User not authorized!'});
        } else{
            res.status(404).json({error: 'User not found!'});
        }
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}