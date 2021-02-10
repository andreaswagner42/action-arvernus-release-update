const FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");
const core = require("@actions/core");

async function uploadRelease(name, release, hostname, secret) {
	try {
		const postReleaseUrl = `${hostname}/package/${name}/${release.tag_name}?secret_key=${secret}`;

		const file = fs.createReadStream(release.file);

		if (!file) {
			throw new Error(`There is no file located at ${release.file}.`);
		}

		const form = new FormData();
		form.append("release_title", release.name);
		form.append("release_notes", release.body);
		form.append("prerelease", String(release.prerelease));
		form.append("published_at", String(release.published_at));
		form.append("file", file);
		form.append("extension", release.extension);

		const response = await fetch(postReleaseUrl, {
			method: "POST",
			body: form
		});

		if (!response.ok) {
			throw await response.json();
		}

		const responseJson = await response.json();

		core.debug(responseJson);

		return Promise.resolve(responseJson);
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = uploadRelease;
