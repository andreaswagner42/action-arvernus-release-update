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

	const sourceFile = path.resolve(source);

	console.log(sourceFile);

	return new Promise((resolve, reject) => {
		archive
			.directory(sourceFile, false)
			.on("error", error => reject(error))
			.pipe(stream);

		stream.on("close", () =>
			resolve(`${destination} was successfully created`)
		);
		archive.finalize();
	});
}

module.exports = zipDirectory;
