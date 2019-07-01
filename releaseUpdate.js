const zipDirectory = require("./zipDirectory");
const moveFiles = require("./moveFiles");
const uploadRelease = require("./uploadRelease");
const fs = require("fs");

async function releaseUpdate(tools) {
	try {
		const packageName = tools.context.repo.repo;
		const workspace = tools.workspace;
		const {
			release: { name, body, prerelease, tag_name, published_at }
		} = tools.context.payload;

		const movedFiles = await moveFiles(
			`${workspace}/`,
			`${workspace}/${packageName}/`,
			packageName
		);

		tools.log.success(movedFiles);

		const archive = await zipDirectory(
			`${workspace}/${packageName}`,
			`${workspace}/${packageName}.zip`
		);
		tools.log.success(archive);

		const updatePackage = {
			releaseTitle: name,
			releaseNotes: body,
			isPrerelease: prerelease,
			packageName: packageName,
			packageVerson: tag_name,
			publishedAt: published_at,
			packageFile: `${workspace}/${packageName}.zip`
		};

		const response = await uploadRelease(
			updatePackage,
			process.env.UPDATE_SERVER_URL
		);
		tools.log.success(`${response.name} has been uploaded`);

		// attach zip file to release on GitHub

		const size = fs.statSync(`${workspace}/${packageName}.zip`).size;

		tools.github.repos
			.getReleaseByTag({
				...tools.context.repo,
				tag: tag_name
			})
			.then(result => {
				return tools.github.repos.uploadReleaseAsset({
					url: result.data.upload_url,
					name: packageName,
					contentType: "text/json",
					file: fs.createReadStream(`${workspace}/${packageName}.zip`),
					contentLength: size,
					label: packageName
				});
			});

		return Promise.resolve(response);
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = releaseUpdate;
