const fs = require("fs");
const rsync = require("rsyncwrapper");

const listFilesIn = require("./listFilesIn");

async function moveFiles(source, destination, name) {
	const destinationPath = `${destination}/${name}`;
	if (!fs.existsSync(destination)) {
		fs.mkdirSync(destination);
	}

	if (!fs.existsSync(destinationPath)) {
		fs.mkdirSync(destinationPath);
	}

	listFilesIn(source);
	listFilesIn(destination);
	listFilesIn(destinationPath);

	return new Promise((resolve, reject) => {
		rsync(
			{
				src: source,
				dest: destinationPath,
				recursive: true,
				deleteAll: true,
				exclude: [
					"package.json",
					"package-lock.json",
					"node_modules",
					"Dockerfile",
					".gitignore",
					".github",
					"test/",
					"src/",
					"*.zip",
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
					`${name}`,
					"phpcs.xml.dist",
					".eslintignore",
					".editorconfig",
					"release"
				]
			},
			function(error) {
				if (error) {
					reject(error);
				}
				listFilesIn(source);
				listFilesIn(destination);
				listFilesIn(destinationPath);
				resolve(destinationPath);
			}
		);
	});
}

module.exports = moveFiles;
