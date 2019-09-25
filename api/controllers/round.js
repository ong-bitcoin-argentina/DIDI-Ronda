// RETURN TEST (async)
exports.test = async (req, res) => {
    
    const response = await new Promise(
        (resolve, reject) => setTimeout( ()=> resolve({hello: 'world'}), 500 )
    )

    res.status(200).jsonp( response );
    
};