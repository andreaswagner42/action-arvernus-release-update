const core = require("@actions/core");
const github = require("@actions/github");

const action = async () => {
	try {
		const githubToken = core.getInput("github-access-token");
		const updateServerUrl = core.getInput("update-server-url");
		const action = github.context.payload.action;
		const packageName = github.context.repo.repo;
		const { release } = github.context.payload;

		switch (action) {
			case "published":
			case "edited":
				console.log(`Upload Release ${release.tag_name} of ${packageName}`);
				break;
			case "unpublished":
			case "deleted":
				console.log(`Delete Release ${release.tag_name} of ${packageName}`);
				break;
			default:
				throw new Error(
					`This action was triggered using the ${action} event which is not supported by this Action.`
				);
		}

		return;
	} catch (error) {
		core.setFailed(error.message);
	}
};

action();
