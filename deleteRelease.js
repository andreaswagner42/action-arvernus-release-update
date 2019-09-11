const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");

async function deleteRelease(
	packageName,
	packageVersion,
	serverUrl,
	serverSecretKey
) {
	try {
		const url = `${serverUrl}/package/${packageName}/${packageVersion}/delete?secret_key=${serverSecretKey}`;

		const response = await fetch(url, {
			method: "POST"
		}).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				tools.log.error("error from fetch", response);
				throw response;
			}
		});

		return Promise.resolve(response);
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = deleteRelease;
