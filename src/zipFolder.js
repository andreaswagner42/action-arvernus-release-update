const core = require("@actions/core");

const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

/**
 * @param {String} source
 * @param {String} destination
 * @returns {Promise}
 */
function zipFolder(source, destination, name) {
	const archive = archiver("zip");
	const stream = fs.createWriteStream(`${destination}/${name}.zip`);

	fs.readdir(source, (error, files) => {
		core.startGroup("Files in process.cwd()");
		if (error) {
			throw new Error("Unable to scan directory: " + error);
		}
		files.forEach(file => {
			// Do whatever you want to do with the file
			console.log(file);
		});
		core.endGroup();
	});

	return new Promise((resolve, reject) => {
		archive
			.directory(path.join(source, name), false)
			.on("error", error => reject(error))
			.pipe(stream);

		stream.on("close", () => {
			console.log(`${destination} was successfully created`);
			resolve(`${destination}/${name}.zip`);
		});
		archive.finalize();
	});
}

module.exports = zipFolder;
