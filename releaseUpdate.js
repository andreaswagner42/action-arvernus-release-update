const core = require("@actions/core");
const github = require("@actions/github");
const zipFile = require("./zipFile");
const zipDirectory = require("./zipDirectory");
const moveFiles = require("./moveFiles");
const uploadRelease = require("./uploadRelease");
const fs = require("fs");

async function releaseUpdate(updateServerUrl, serverSecretKey) {
	try {
		const githubToken = core.getInput("github-access-token");
		const octokit = new github.GitHub(githubToken);
		const packageName = github.context.repo.repo;
		const workspace = github.workspace;
		const {
			release: { name, body, prerelease, tag_name, published_at }
		} = github.context.payload;

		const movedFiles = await moveFiles(
			`${workspace}/`,
			`${workspace}/${packageName}/`,
			packageName
		);

		core.debug(movedFiles);

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
		core.debug(archive);

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
			updateServerUrl,
			serverSecretKey
		);
		core.debug(`${response.name} has been uploaded`);

		// attach zip file to release on GitHub

		const size = fs.statSync(`${workspace}/${packageName}.zip`).size;

		const result = await octokit.repos
			.getReleaseByTag({
				...github.context.repo,
				tag: tag_name
			})
			.then(result => {
				return octokit.repos.uploadReleaseAsset({
					headers: {
						"content-type": "text/plain",
						"content-length": size
					},
					url: result.data.upload_url,
					name: `${packageName}.zip`,
					file: fs.createReadStream(`${workspace}/${packageName}.zip`),
					label: packageName
				});
			});

		core.debug("Add to release result:", result);

		return Promise.resolve(response);
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = releaseUpdate;
