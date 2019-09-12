const fetch = require("node-fetch");

async function deleteRelease(name, version, hostname, secret) {
	try {
		const postReleaseDeleteUrl = `${hostname}/package/${name}/${version}/delete?secret_key=${secret}`;

		const response = await fetch(postReleaseDeleteUrl, {
			method: "POST"
		});

		if (!response.ok) {
			console.error("error from fetch", response);
			throw response;
		}

		const responseJson = await response.json();

		return Promise.resolve(responseJson);
	} catch (error) {
		return Promise.reject(error);
	}
}

module.exports = deleteRelease;
