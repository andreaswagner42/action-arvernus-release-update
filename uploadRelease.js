const FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

function uploadRelease(updatePackage, serverUrl, serverSecretKey) {
	const {
		packageFile,
		releaseTitle,
		releaseNotes,
		isPrerelease,
		packageName,
		packageVerson,
		publishedAt
	} = updatePackage;

	return new Promise(async (resolve, reject) => {
		const url = `${serverUrl}/package/${packageName}/${packageVerson}?secret_key=${serverSecretKey}`;

		const file = fs.createReadStream(path.resolve(packageFile));

		const form = new FormData();
		form.append("release_title", releaseTitle);
		form.append("release_notes", releaseNotes);
		form.append("prerelease", String(isPrerelease));
		form.append("published_at", String(publishedAt));
		form.append("file", file);

		const response = await fetch(url, {
			method: "POST",
			body: form
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw response;
				}
			})
			.catch(error => {
				reject(error);
			});

		resolve(response);
	});
}

module.exports = uploadRelease;
