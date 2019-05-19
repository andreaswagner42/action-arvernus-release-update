const { Toolkit } = require("actions-toolkit");
const zipDirectory = require("./zipDirectory");
const moveFiles = require("./moveFiles");
const uploadRelease = require("./uploadRelease");

Toolkit.run(
	async tools => {
		try {
			const packageName = tools.context.repo.repo;
			const workspace = tools.workspace;

			tools.log.info(packageName);
			tools.log.info(workspace);

			const movedFiles = await moveFiles(
				`${workspace}/`,
				`${workspace}/${packageName}/`,
				packageName
			);

			tools.log.success(movedFiles);

			const archive = await zipDirectory(
				`${workspace}/${packageName}`,
				`${workspace}/${packageName}.zip`
			);
			tools.log.success(archive);

			const {
				release: { name, body, prerelease, tag_name }
			} = tools.context.payload;

			const updatePackage = {
				releaseTitle: name,
				releaseNotes: body,
				isPrerelease: prerelease,
				packageName: packageName,
				packageVerson: tag_name,
				packageFile: `${workspace}/${packageName}.zip`
			};

			const response = await uploadRelease(updatePackage);
			tools.log.success(`${response.name} has been uploaded`);

			tools.exit.success(
				`Version ${response.version} of the Package ${
					response.name
				} has successfully been released.`
			);
		} catch (error) {
			tools.log.error(
				"This is coming from the catch statement in the main programm",
				error
			);
			tools.exit.failure(error);
		}
	},
	{
		secrets: ["ARVERNUS_SECRET_KEY"],
		event: "release"
	}
);
