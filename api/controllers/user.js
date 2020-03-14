// SERVICES
const user_services = require('../services/user');

const {generic}     = require('../helpers/errorHandler');


// RETURN TEST (async)
exports.test = async (req, res) => {
    
    const response = await new Promise(
        (resolve, reject) => setTimeout( () => resolve( {req: req} ), 500 )
    )

    res.status(200).jsonp( response );
    
};

// Get user by username
exports.byUsername = async (req, res) => {
    const user = await user_services.byUsername( req, res );
    res.status(200).jsonp( user );
};

// Get user rounds
exports.roundsOfUser = async (req, res) => {

    const rounds = await user_services.roundsOfUser( req, res );
    res.status(200).jsonp( rounds );
};

// Get user data
exports.userData = async (req, res) => {
    
    try {
        const userData = await user_services.userData( req, res );
        return userData && userData.error ?
            res.status(200).jsonp( {'error': userData.error} ) :
            res.status(200).jsonp( userData );
    } catch( err ) {
        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }

}

// Update user token
exports.updateToken = async (req, res) => {
    
    try {
        const updateToken = await user_services.updateToken( req, res );
        return updateToken && updateToken.error ?
            res.status(200).jsonp( {'error': updateToken.error} ) :
            res.status(200).jsonp( updateToken );
    } catch( err ) {
        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }

}