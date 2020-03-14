// SERVICES
const guest_services = require('../services/guest');

const {generic}     = require('../helpers/errorHandler');

/*
    /login
*/
exports.login = async (req, res) => {

    const { username, password } = req.body;

    try {
        const auth = await guest_services.login(username, password);
        return auth && auth.error ?
            res.status(200).jsonp( {'error': auth.error} ) :
            res.status(200).jsonp( auth );
    } catch( err ) {
        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }

};

/*
    /register
*/
exports.register = async (req, res) => {

    const { username, password, name, token } = req.body
    
    try {
        const user = await guest_services.register(username, password, name, token)

        return user && user.error ?
            res.status(200).jsonp( {'error': user.error} ) :
            res.status(200).jsonp( user );
            
    } catch( err ) {
        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }
};


exports.verifyAccount = async ( req, res ) => {
    try {

        const { username, token } = req.body
        const user = await guest_services.verify(username, token)

        res.status(200).jsonp( user );

    } catch( err ) {

        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }    

}

/*
    /forgot
*/
exports.forgot = async (req, res) => {
    const { username } = req.body;
    try {

        const response = await guest_services.forgot(username)
        
        res.status(200).jsonp( response );

    } catch( err ) {

        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }   
};

exports.forgotCode = async (req, res) => {
    const { username, token } = req.body;
    try {

        const response = await guest_services.forgotCode(username, token)

        res.status(200).jsonp( response );

    } catch( err ) {

        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }   
};

exports.forgotNewPassword = async (req, res) => {
    const { username, password, token } = req.body;
     try {

        const response = await guest_services.forgotNewPassword(username, password, token)

        res.status(200).jsonp( response );

    } catch( err ) {

        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }   
};

/*
    /phone
*/
exports.phone = async (req, res) => {
    const { username, phone, country } = req.body;

    try {

        const response = await guest_services.phone(username, phone, country)
        
        res.status(200).jsonp( response );

    } catch( err ) {

        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }   
};

exports.phoneCode = async (req, res) => {
    
    const { username, phone, country, token } = req.body;

    try {

        const response = await guest_services.phoneCode(username, phone, country, token)

        res.status(200).jsonp( response );

    } catch( err ) {

        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );

    }   
};

