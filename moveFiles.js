const rsync = require("rsyncwrapper");

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function moveFiles(source, out) {
	return new Promise((resolve, reject) => {
		rsync(
			{
				src: source,
				dest: out,
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
					"dist/",
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
					".vscode/",
					".git/",
					"blocks/",
					".DS_Store"
				]
			},
			function(error) {
				if (error) {
					reject("Zip Failed");
				}
				resolve(`Files moved to: ${out}`);
			}
		);
	});
}

module.exports = moveFiles;
