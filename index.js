const core = require("@actions/core");
const github = require("@actions/github");
const releaseUpdate = require("./releaseUpdate");
const deleteRelease = require("./deleteRelease");

const action = async () => {
	try {
		const githubToken = core.getInput("github-access-token");
		const octokit = new github.GitHub(githubToken);
		core.debug("context: " + github.context.ref);

		const ref = octokit.git.getRef({
			...github.context
		});

		core.debug("ref: " + ref);

		const updateServerUrl = core.getInput("update-server-url");
		const serverSecretKey = core.getInput("server-secret-key");

		if (!serverSecretKey) {
			throw new Error("The server-secret-key must be set.");
		}

		const action = github.context.eventName;
		const packageName = github.context.repo.repo;

		switch (action) {
			case "published":
			case "edited":
				const uploadResponse = await releaseUpdate(
					updateServerUrl,
					serverSecretKey
				);
				core.debug(
					`Version ${uploadResponse.version} of the Package ${uploadResponse.name} has successfully been released.`
				);
				break;
			case "unpublished":
			case "deleted":
				const deleteResponse = await deleteRelease(
					packageName,
					tag_name,
					updateServerUrl,
					serverSecretKey
				);

				core.debug(
					`Version ${deleteResponse.version} of the Package ${deleteResponse.name} has successfully been deleted.`
				);
				break;
			default:
				throw `This Action was triggered using the ${action} event. In order to work correcty it needs to run on "published", "edited", "unpublished" or "deleted"`;
		}
	} catch (error) {
		core.setFailed(error.message);
	}
};

action();

module.exports = action;
