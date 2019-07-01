const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

/**
 * @param {String} sourceFile
 * @param {String} destination
 * @returns {Promise}
 */
function zipFile(sourceFoler, destination, packageName) {
	const archive = archiver("zip", { zlib: { level: 9 } });
	const stream = fs.createWriteStream(path.resolve(destination));

	const sourceFile = path.resolve(`${sourceFoler}/${packageName}.php`);

	console.log(sourceFile);

	return new Promise((resolve, reject) => {
		archive
			.file(sourceFile, { name: `${packageName}.php` })
			.on("error", error => reject(error))
			.pipe(stream);

		stream.on("close", () =>
			resolve(`${destination} was successfully created`)
		);
		archive.finalize();
	});
}

module.exports = zipFile;
