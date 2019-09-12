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

	core.warning("Current directory: " + process.cwd());
	core.warning("Source Folder: " + source);
	core.warning("Destination Folder: " + destination);
	fs.readdir(source, (err, files) => {
		core.startGroup("Files in Source");
		core.warning("Files in Source:");
		if (err) {
			throw new Error("Unable to scan directory: " + err);
		}
		files.forEach(file => {
			// Do whatever you want to do with the file
			console.log(file);
		});
		core.endGroup();
	});
	fs.readdir(process.cwd(), (err, files) => {
		core.startGroup("Files in process.cwd()");
		core.warning("Files in process.cwd():");
		if (err) {
			throw new Error("Unable to scan directory: " + err);
		}
		files.forEach(file => {
			// Do whatever you want to do with the file
			console.log(file);
		});
		core.endGroup();
	});

	return new Promise((resolve, reject) => {
		archive
			.directory(path.resolve(source), false)
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
