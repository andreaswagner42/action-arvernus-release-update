const zipFile = require("./zipFile");
const zipDirectory = require("./zipDirectory");
const moveFiles = require("./moveFiles");
const uploadRelease = require("./uploadRelease");

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

		let archive;
		if (process.env.PACKAGE_TYPE === "MU-PLUGIN") {
			archive = await zipFile(
				`${workspace}`,
				`${workspace}/${packageName}.zip`,
				packageName
			);
		} else {
			archive = await zipDirectory(
				`${workspace}/${packageName}`,
				`${workspace}/${packageName}.zip`
			);
		}
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

		return Promise.resolve(response);
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = releaseUpdate;
