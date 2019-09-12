// jest.mock("fs");
// jest.mock("rsyncwrapper");
// const rsync = require("rsyncwrapper");

const moveFiles = require("../moveFiles");
const zipFolder = require("../zipFolder");
describe("moveFiles", () => {
	beforeEach(async () => {});

	test("works", async () => {
		// rsync.mockReturnValue(true);

		const folderPath = await moveFiles(
			".",
			"release",
			"action-arvernus-release-update"
		);

		const zipPath = await zipFolder(
			folderPath,
			"release",
			"action-arvernus-release-update"
		);

		// expect(rsync).toHaveBeenCalledTimes(1);

		expect(folderPath).toBe("release/action-arvernus-release-update");
		expect(zipPath).toBe("release/action-arvernus-release-update.zip");
	});
});
