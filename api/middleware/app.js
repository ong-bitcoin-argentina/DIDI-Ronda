const helper    = require('../helpers/errorHandler');

const auth = (req,res,next) => {

    // CHECK API KEY
    if( process.env.API_KEY === req.headers.api_key ){
        next();
    } else {
        return helper.unauthorized(res, 'Invalid API KEY');
    }

}

module.exports = { auth };