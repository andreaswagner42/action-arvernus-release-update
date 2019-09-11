const action = require("../index.js");
const core = require("@actions/core");
const github = require("@actions/github");
const path = require("path");
jest.mock("node-fetch");
jest.mock("../moveFiles");
jest.mock("../zipFile");
jest.mock("../zipDirectory");
jest.mock("../deleteRelease");
const fetch = require("node-fetch");
const moveFiles = require("../moveFiles");
const zipDirectory = require("../zipDirectory");
const zipFile = require("../zipFile");
const deleteRelease = require("../deleteRelease");

describe("Arvernus Release Package Update", () => {
	process.env.GITHUB_REPOSITORY = "fabiankaegy/test-action";

	// Load up our entry-point file
	require("..");

	beforeEach(() => {
		// Mock methods on it!
		process.env.UPDATE_SERVER_URL = "localhost:3000";
		github.workspace = path.dirname(".");
		core.debug = jest.fn();
		core.setFailed = jest.fn();
		github.context.repo = jest.fn({ owner: "fabiankaegy", repo: "test-repo" });
		github.context.payload = {
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

		zipFile.mockReturnValue(
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
		await action();
		expect(moveFiles).toHaveBeenCalledTimes(1);
		expect(zipDirectory).toHaveBeenCalledTimes(1);
	});

	it("exits successfully if action is published", async () => {
		github.context.payload = {
			...github.context.payload,
			action: "edited"
		};
		await action();

		expect(moveFiles).toHaveBeenCalledTimes(2);
		expect(zipDirectory).toHaveBeenCalledTimes(2);
	});

	it("exits unsuccessfully if action is not published, edited, unpublished or deleted", async () => {
		github.context.payload = {
			...github.context.payload,
			action: "created"
		};
		await action();

		expect(core.setFailed).toHaveBeenCalled();
	});

	it("exits successfully if action is deleted", async () => {
		github.context.payload = {
			...github.context.payload,
			action: "deleted"
		};
		await action();

		expect(deleteRelease).toHaveBeenCalledTimes(1);
	});

	it("exits successfully if action is unpublished", async () => {
		github.context.payload = {
			...github.context.payload,
			action: "unpublished"
		};
		await action();

		expect(deleteRelease).toHaveBeenCalledTimes(2);
	});

	it("to create zip with only one file in it if MU-PLUGIN", async () => {
		process.env.PACKAGE_TYPE = "MU-PLUGIN";
		await action();

		expect(zipFile).toHaveBeenCalledTimes(1);
	});
});
