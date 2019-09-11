const core = require("@actions/core");
const github = require("@actions/github");

try {
	const githubToken = core.getInput("github-access-token");
	console.log("githubToken", githubToken);

	const octokit = new github.GitHub(githubToken);
	console.log("octokit", octokit);
	console.log("context", github.context);

	const ref = octokit.git.getRef({
		...github.context.repo,
		...github.context
	});

	console.log("ref", ref);

	const updateServerUrl = core.getInput("update-server-url");
	console.log("updateServerUrl", updateServerUrl);
	const serverSecretKey = core.getInput("server-secret-key");
	console.log("serverSecretKey", serverSecretKey);

	const action = github.context.eventName;
	console.log("action", action);
	const packageName = github.context.repo.repo;
	console.log("packageName", packageName);

	return;
} catch (error) {
	core.setFailed(error.message);
	return;
}
