const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

/**
 * @param {String} source
 * @param {String} destination
 * @returns {Promise}
 */
function zipDirectory(source, destination) {
	const archive = archiver("zip", { zlib: { level: 9 } });
	const stream = fs.createWriteStream(path.resolve(destination));

	const sourceFolder = path.resolve(source);

	return new Promise((resolve, reject) => {
		archive
			.directory(sourceFolder, false)
			.on("error", error => reject(error))
			.pipe(stream);

		stream.on("close", () => {
			archive.finalize();
			console.log(`${destination} was successfully created`);
			resolve(sdestination);
		});
	});
}

module.exports = zipDirectory;
