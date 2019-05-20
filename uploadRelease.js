const FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

function uploadRelease(updatePackage) {
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
		const file = fs.createReadStream(path.resolve(packageFile));

		const form = new FormData();
		form.append("release_title", releaseTitle);
		form.append("release_notes", releaseNotes);
		form.append("prerelease", String(isPrerelease));
		form.append("published_at", publishedAt);
		form.append("file", file);

		const url = `http://updates.arvernus.info/package/${packageName}/${packageVerson}?secret_key=${
			process.env.ARVERNUS_SECRET_KEY
		}`;

		response = await fetch(url, {
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
