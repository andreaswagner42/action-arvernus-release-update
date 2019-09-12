const core = require("@actions/core");
const fs = require("fs");

const listFilesIn = source => {
	fs.readdir(source, (error, files) => {
		core.startGroup(`Files in ${source}`);
		if (error) {
			throw new Error("Unable to scan directory: " + error);
		}
		files.forEach(file => {
			console.log(file);
		});
		core.endGroup();
	});
};

module.exports = listFilesIn;
