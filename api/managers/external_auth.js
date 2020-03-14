const JWT = require('../helpers/jwt');

exports.login = async (username, userPassword, password) => {

    const token = JWT.sign( {username: username} );
    const response = await new Promise(
        (resolve, reject) => {
            return setTimeout(() => {
                return userPassword === password ?
                    resolve({username:username, token: token, login: true}) : 
                    resolve({error: 'wrong user or password'})
            }, 500);
        }
    )

    return response;
    
};
