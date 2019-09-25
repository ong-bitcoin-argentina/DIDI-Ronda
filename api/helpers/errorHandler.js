exports.unauthorized = (res, msg) => {
    return res.status(401).json({
      message: 'Authorization failed.',
      error: msg
    });
}