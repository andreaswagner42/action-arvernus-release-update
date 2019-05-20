const { Toolkit } = require("actions-toolkit");
const releaseUpdate = require("./releaseUpdate");
const deleteRelease = require("./deleteRelease");

Toolkit.run(
	async tools => {
		const packageName = tools.context.repo.repo;
		const workspace = tools.workspace;
		const {
			release: { name, body, prerelease, tag_name, published_at }
		} = tools.context.payload;
		if (!process.env.UPDATE_SERVER_URL) {
			process.env.UPDATE_SERVER_URL = "http://updates.arvernus.info";
		}
		try {
			const { action } = tools.context.payload;

			switch (action) {
				case "published":
				case "edited":
					const uploadResponse = await releaseUpdate(tools);
					tools.exit.success(
						`Version ${uploadResponse.version} of the Package ${
							uploadResponse.name
						} has successfully been released.`
					);
					break;
				case "unpublished":
				case "deleted":
					const deleteResponse = await deleteRelease(
						packageName,
						tag_name,
						process.env.UPDATE_SERVER_URL,
						tools
					);

					tools.exit.success(
						`Version ${deleteResponse.version} of the Package ${
							deleteResponse.name
						} has successfully been deleted.`
					);
					break;
				default:
					throw `This Action was triggered using the ${action} event. In order to work correcty it needs to run on "published", "edited", "unpublished" or "deleted"`;
			}
		} catch (error) {
			tools.log.error(error);
			tools.exit.failure(error);
		}
	},
	{
		secrets: ["ARVERNUS_SECRET_KEY"],
		event: "release"
	}
);
