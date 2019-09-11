const FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

async function uploadRelease(name, release, hostname, secret) {
	try {
		const url = `${hostname}/package/${name}/${release.tag_name}?secret_key=${secret}`;

		const form = new FormData();
		form.append("release_title", release.name);
		form.append("release_notes", release.body);
		form.append("prerelease", String(release.prerelease));
		form.append("published_at", String(release.published_at));
		form.append("file", release.file);

		const response = await fetch(url, { method: "POST", body: form });

		if (!response.ok) {
			throw response;
		}

		const responseJson = await response.json();

		return Promise.resolve(responseJson);
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = uploadRelease;
