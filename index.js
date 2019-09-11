const core = require("@actions/core");
const github = require("@actions/github");

const action = async () => {
	try {
		const githubToken = core.getInput("github-access-token");
		const octokit = new github.GitHub(githubToken);
		core.debug("context: " + github.context.ref);

		const ref = octokit.git.getRef({
			...github.context.repo,
			...github.context
		});

		core.debug("ref: " + ref);

		const updateServerUrl = core.getInput("update-server-url");
		core.debug("updateServerUrl: " + updateServerUrl);
		const serverSecretKey = core.getInput("server-secret-key");
		core.debug("serverSecretKey: " + serverSecretKey);

		const action = github.context.eventName;
		const packageName = github.context.repo.repo;
	} catch (error) {
		core.warning(error);
		core.setFailed(error.message);
	}
};

action();

module.exports = action;
