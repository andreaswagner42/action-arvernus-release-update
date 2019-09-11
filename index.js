const core = require("@actions/core");
const github = require("@actions/github");

const action = async () => {
	try {
		const githubToken = core.getInput("github-access-token");
		const updateServerUrl = core.getInput("update-server-url");
		const action = github.context.payload.action;
		const packageName = github.context.repo.repo;
		const { release } = github.context.payload;

		const octokit = new github.GitHub(githubToken);

		console.log("Version Number", release.tag_name);
		console.log("Action Triigger", action);
		console.log("Package Name", packageName);

		return;
	} catch (error) {
		core.setFailed(error.message);
	}
};

action();
