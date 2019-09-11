const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

/**
 * @param {String} source
 * @param {String} destination
 * @returns {Promise}
 */
function zipFolder(source, destination, name) {
	const archive = archiver("zip", { zlib: { level: 9 } });
	const stream = fs.createWriteStream(
		`${path.resolve(destination)}/${name}.zip`
	);

	return new Promise((resolve, reject) => {
		archive
			.directory(source, false)
			.on("error", error => reject(error))
			.pipe(stream);

		stream.on("close", () => {
			archive.finalize();
			console.log(`${destination} was successfully created`);
			resolve(path.resolve(`destination}/${name}.zip`));
		});
	});
}

module.exports = zipFolder;
