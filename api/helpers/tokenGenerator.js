//This generates a unique token to use wherever we want
exports.generate = () => Math.floor(Math.random() * 90000) + 10000;
