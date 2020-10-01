const logError = (content) => {
	console.log("\x1b[31m", content);
};

const getDidAddress = (did) => {
	const cleanDid = did.split(":");
	return cleanDid[cleanDid.length - 1];
};

module.exports = {
	logError,
	getDidAddress,
};
