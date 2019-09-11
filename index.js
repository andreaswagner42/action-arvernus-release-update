const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
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
		const action = github.context.payload.action;
		const packageName = github.context.repo.repo;
		const { release } = github.context.payload;

		switch (action) {
			case "published":
			case "edited":
				const folderPath = await moveFiles(
					path.resolve("."),
					"dist",
					packageName
				);
				console.log("Folder Path:", folderPath);

				const zipPath = await zipFolder(folderPath, `dist`, packageName);
				console.log("Zip Path", zipPath);

				release.file = zipPath;

				const uploadResponse = await uploadRelease(
					packageName,
					release,
					updateServerUrl,
					serverSecretKey
				);

				console.log(
					`Version ${uploadResponse.version} of ${
						uploadResponse.name
					} has been ${action === "published" ? "published" : "updated"}.`
				);
				break;
			case "unpublished":
			case "deleted":
				const deleteResponse = await deleteRelease(
					packageName,
					release.tag_name,
					updateServerUrl,
					serverSecretKey
				);

				console.info(
					`Version ${deleteResponse.version} of the Package ${deleteResponse.name} has successfully been deleted.`
				);

				break;
			default:
				throw new Error(
					`This action was triggered using the "${action}" event which is not supported by this Action.`
				);
		}
		return "Success";
	} catch (error) {
		console.error(error);
		core.setFailed(error.message);
	}
};

action();
