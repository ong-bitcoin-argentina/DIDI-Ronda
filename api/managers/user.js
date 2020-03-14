const 	mongoose 	= require('mongoose'),
		User	    = require('../models/user'),
		ObjectId	= mongoose.Types.ObjectId;

exports.byUsername = async username => {

    return await User.findOne({
        username: username
    })
    .then( user => user )
    .catch( err => ({ error: `${username}: ${err}` }) )
}

exports.byPhone = async phone => {

    return await User.findOne({
        phone: phone
    })
    .then( user => user )
    .catch( err => ({ error: `${username}: ${err}` }) )
}


exports.saveUnverified = async ( phone, name ) => {

    return new User ({
        phone: phone,
        name: name,
        verified: false
    })
    .save()
    .then( newUser => newUser )
    .catch( err => ({ error: err }) )

}

exports.saveUser = async ( username, password, name, token, verifyToken ) => {

    return await new User ({
        username,
        password,
        name,
        token,
        verifyToken
    })
    .save()
    .then( newUser => newUser )
    .catch( err => ({ error: err }) )

}

exports.save = async user => {

    return await user
    .save()
    .then( newUser => newUser )
    .catch( err => ({ error: err }) )

}

exports.remove = async user => {

    return await user
    .remove()
    .then( user => user )
    .catch( err => ({ error: err }) )

}