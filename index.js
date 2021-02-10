const core = require("@actions/core");
const github = require("@actions/github");
const {promisify} = require("util");
const fs = require("fs");
const mv = promisify(fs.rename);
const path = require("path");
const zipFolder = require("./src/zipFolder");

const deleteRelease = require("./src/deleteRelease");
const uploadRelease = require("./src/uploadRelease");
const moveFiles = require("./src/moveFiles");

const action = async () => {
	try {
		const githubToken = core.getInput("github-access-token");
		const serverSecretKey = core.getInput("server-secret-key");
		const updateServerUrl = core.getInput("update-server-url");
		const packageType = core.getInput("package-type");
		const packageFileName = core.getInput("package-file-name");
		const packageExtension = core.getInput("package-file-extension");
		const action = github.context.payload.action;
		const packageName = github.context.repo.repo;
		const { release } = github.context.payload;
		switch (action) {
			case "published":
			case "edited":
				if (packageFileName == "") {
					const releaseFolder = "./release";
					await moveFiles("./", releaseFolder, packageName);
					filesystemobject.MoveFile(source, destination);
					console.info(`File moved to ./${releaseFolder}/${packageName} successfully.`);
					await zipFolder(releaseFolder, './', packageName);
					console.info(`File ziped to ./${packageName}.zip successfully.`);
					const PkgPath = `./${packageName}.zip`;
					release.file = PkgPath;
					release.extension = packageExtension;
				} else {
					const PkgPath = `./${packageName}.${packageExtension}`;
					await mv(packageFileName, PkgPath,);
					console.info(`File renamed to ${PkgPath} successfully.`);
					release.file = PkgPath;
					release.extension = packageExtension;
				}
				const uploadResponse = await uploadRelease(
					packageName,
					release,
					updateServerUrl,
					serverSecretKey
				);
				console.info(`Version ${uploadResponse.version} of ${uploadResponse.name} has been ${action === "published" ? "published" : "updated"}.`);
				const octokit = new github.GitHub(githubToken);
				const PkgFileSize = fs.statSync(release.file).size;
				const githubReleaseResponse = await octokit.repos.getReleaseByTag({
					...github.context.repo,
					tag: release.tag_name
				});
				await octokit.repos.uploadReleaseAsset({
					headers: {
						"content-type": (release.extension === "zip") ? "applicaton/zip" : "application/octet-stream",
						"content-length": PkgFileSize
					},
					url: githubReleaseResponse.data.upload_url,
					name: `${packageName}.${packageExtension}`,
					file: fs.createReadStream(release.file),
					label: `${packageName}.${packageExtension}`
				});
				core.debug(`Added the package "${release.file}" to the release ${release.tag_name} on GitHub.`);
				break;
			case "unpublished":
			case "deleted":
				const deleteResponse = await deleteRelease(
					packageName,
					release.tag_name,
					updateServerUrl,
					serverSecretKey
				);
				console.info(`Version ${deleteResponse.version} of the Package ${deleteResponse.name} has successfully been deleted.`);
				break;
			default:
				core.warning(`This action was triggered using the "${action}" event which is not supported by this Action.`);
		}
		return "Success";
	} catch (error) {
		console.error(error);
		core.setFailed(error.message);
	}
};

action();
