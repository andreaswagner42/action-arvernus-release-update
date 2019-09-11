const core = require("@actions/core");
const github = require("@actions/github");

const action = async () => {
	try {
		const githubToken = core.getInput("github-access-token");
		console.log("githubToken", githubToken);

		// const octokit = new github.GitHub(githubToken);
		console.log(github.context.payload);
		console.log("tagName", github.context.payload.release.tag_name);

		const updateServerUrl = core.getInput("update-server-url");
		console.log("updateServerUrl", updateServerUrl);
		console.log("serverSecretKey", process.env);
		const action = github.context.payload.action;
		console.log("action", action);
		const packageName = github.context.repo.repo;
		console.log("packageName", packageName);

		return;
	} catch (error) {
		core.setFailed(error.message);
	}
};

action();
