const { Toolkit } = require("actions-toolkit");
const path = require("path");
jest.mock("node-fetch");
jest.mock("../moveFiles");
jest.mock("../zipDirectory");
jest.mock("../deleteRelease");
const fetch = require("node-fetch");
const moveFiles = require("../moveFiles");
const zipDirectory = require("../zipDirectory");
const deleteRelease = require("../deleteRelease");

describe("Arvernus Release Package Update", () => {
	let action, tools;

	// Mock Toolkit.run to define `action` so we can call it
	Toolkit.run = jest.fn(actionFn => {
		action = actionFn;
	});
	process.env.GITHUB_REPOSITORY = "fabiankaegy/test-action";

	// Load up our entry-point file
	require("..");

	beforeEach(() => {
		// Create a new Toolkit instance
		tools = new Toolkit();
		// Mock methods on it!
		process.env.UPDATE_SERVER_URL = "localhost:3000";
		tools.workspace = path.dirname(".");
		tools.exit.success = jest.fn();
		tools.exit.failure = jest.fn();
		tools.context.repo = jest.fn({ owner: "fabiankaegy", repo: "test-repo" });
		tools.context.payload = {
			action: "published",
			release: {
				tag_name: "0.0.3-beta.1",
				name: "Example Release ",
				prerelease: true,
				body: "Testing"
			}
		};

		fetch.mockReturnValue(
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve({
						tested: "",
						downloadUrl:
							"https://updates.arvernus.info/package/test-action/0.0.3.beta.1/download",
						requires: "",
						releaseNotesHtml: "",
						releaseNotes: "",
						releaseTitle: "0.0.3-beta.1",
						version: "0.0.3-beta.1",
						name: "test-action"
					})
			})
		);

		moveFiles.mockReturnValue(
			Promise.resolve(`Files moved to: ./test-action/`)
		);

		zipDirectory.mockReturnValue(
			Promise.resolve(`./test-action/test-action.zip was successfully created`)
		);

		deleteRelease.mockReturnValue(
			Promise.resolve({
				message:
					"Version 0.0.3-beta.3 of test-action has successfully been deleted.",
				name: "test-action",
				version: "0.0.3-beta.3"
			})
		);
	});

	it("exits successfully if action is published", async () => {
		await action(tools);

		expect(moveFiles).toHaveBeenCalledTimes(1);
		expect(zipDirectory).toHaveBeenCalledTimes(1);
		expect(tools.exit.success).toHaveBeenCalled();
	});

	it("exits successfully if action is published", async () => {
		tools.context.payload = {
			...tools.context.payload,
			action: "edited"
		};
		await action(tools);

		expect(moveFiles).toHaveBeenCalledTimes(2);
		expect(zipDirectory).toHaveBeenCalledTimes(2);
		expect(tools.exit.success).toHaveBeenCalled();
	});

	it("exits unsuccessfully if action is not published, edited, unpublished or deleted", async () => {
		tools.context.payload = {
			...tools.context.payload,
			action: "created"
		};
		await action(tools);

		expect(tools.exit.failure).toHaveBeenCalled();
	});

	it("exits successfully if action is deleted", async () => {
		tools.context.payload = {
			...tools.context.payload,
			action: "deleted"
		};
		await action(tools);

		expect(deleteRelease).toHaveBeenCalledTimes(1);
		expect(tools.exit.success).toHaveBeenCalled();
	});

	it("exits successfully if action is unpublished", async () => {
		tools.context.payload = {
			...tools.context.payload,
			action: "unpublished"
		};
		await action(tools);

		expect(deleteRelease).toHaveBeenCalledTimes(2);
		expect(tools.exit.success).toHaveBeenCalled();
	});
});
