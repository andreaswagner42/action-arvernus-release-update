const fs = require("fs");
const rsync = require("rsyncwrapper");
const path = require("path");

async function moveFiles(source, destination, name) {
	try {
		if (!fs.existsSync(destination)) {
			fs.mkdirSync(destination);
		}

		if (!fs.existsSync(`${destination}/${name}/`)) {
			fs.mkdirSync(`${destination}/${name}/`);
		}

		rsync(
			{
				src: source,
				dest: `${destination}/${name}/`,
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
					".editorconfig"
				]
			},
			function(error) {
				if (error) {
					throw `Moving the files resoved in an Error: ${error}`;
				}
				return;
			}
		);

		return Promise.resolve(path.resolve(destination, name));
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = moveFiles;
