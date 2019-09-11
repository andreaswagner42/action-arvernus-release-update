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
	try {
		archive
			.directory(source, false)
			.on("error", error => {
				throw new Error(error);
			})
			.pipe(stream);

		stream.on("close", () => {
			console.log(`${destination} was successfully created`);
			return Promise.resolve(path.resolve(`${destination}/${name}.zip`));
		});
		archive.finalize();
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = zipFolder;
