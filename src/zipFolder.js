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
	const zipPath = `${destination}/${name}.zip`;
	const stream = fs.createWriteStream(zipPath);

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
			const file = path.existsSync(zipPath);
			if (!file) {
				reject(new Error(`The File ${zipPath} does not exixt.`));
			}
			console.log(`${zipPath} was successfully created`);
			resolve(zipPath);
		});
		archive.finalize();
	});
}

module.exports = zipFolder;
