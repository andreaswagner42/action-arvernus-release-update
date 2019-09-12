const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

const listFilesIn = require("./listFilesIn");

/**
 * @param {String} source
 * @param {String} destination
 * @returns {Promise}
 */
function zipFolder(source, destination, name) {
	const archive = archiver("zip");
	const zipPath = `${destination}/${name}.zip`;
	const stream = fs.createWriteStream(zipPath);
	const movedFolder = `${source}/${name}`;

	listFilesIn(source);
	listFilesIn(movedFolder);

	return new Promise((resolve, reject) => {
		archive
			.directory(movedFolder, false)
			.on("error", error => reject(error))
			.pipe(stream);

		stream.on("close", () => {
			try {
				// test wether zip exists
				fs.statSync(zipPath);
				console.log(`${zipPath} was successfully created`);
				resolve(zipPath);
			} catch (error) {
				reject(error);
			}
		});
		archive.finalize();
	});
}

module.exports = zipFolder;
