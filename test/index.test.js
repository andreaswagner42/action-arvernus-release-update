const { Toolkit } = require("actions-toolkit");
const path = require("path");
jest.mock("node-fetch");
const fetch = require("node-fetch");

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
		tools.workspace = path.dirname(".");
		tools.exit.success = jest.fn();
		tools.exit.failure = jest.fn();
		tools.context.repo = jest.fn({ owner: "fabiankaegy", repo: "test-repo" });
		tools.context.payload = {
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
	});

	it("exits successfully", async () => {
		await action(tools);

		expect(tools.exit.success).toHaveBeenCalled();
	});
});
