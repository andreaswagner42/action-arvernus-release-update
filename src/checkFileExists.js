const fs = require("fs");

const checkFileExists = file => {
	try {
		fs.statSync(file);
		return true;
	} catch (error) {
		throw error;
	}
};

module.exports = checkFileExists;
