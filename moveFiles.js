const rsync = require("rsyncwrapper");
const fs = require("fs");

/**
 * @param {String} source
 * @param {String} destination
 * @returns {Promise}
 */
function moveFiles(source, destination, packageName) {
	fs.writeFile(`${destination}/test.txt`);
	fs.readdir(`${destination}/`, (error, files) => {
		files.forEach(file => {
			console.log(file);
		});
	});

	return new Promise((resolve, reject) => {
		rsync(
			{
				src: source,
				dest: destination,
				recursive: true,
				deleteAll: true,
				exclude: [
					"package.json",
					"package-lock.json",
					"node_modules",
					"Dockerfile",
					".gitignore",
					".github",
					"test",
					"src",
					"*.zip",
					"dist",
					"webpack.config.js",
					".prettierrc",
					"gulp.config.js",
					"gulpfile.js",
					"composer.lock",
					"wpgulp.config.js",
					"gulpfile.babel.js",
					".eslintrc",
					".eslintrc.js",
					".scss-lint.yml",
					".vscode",
					".git",
					"blocks",
					".DS_Store",
					`${packageName}`
				]
			},
			function(error) {
				if (error) {
					reject(`Moving the files resoved in an Error: ${error}`);
				}
				resolve(`Files moved to: ${destination}`);
			}
		);
	});
}

module.exports = moveFiles;
