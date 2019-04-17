#!/bin/bash

# Note that this does not use pipefail
# because if the grep later doesn't match any deleted files,
# which is likely the majority case,
# it does not exit with a 0, and I only care about the final exit.
set -eo

# Ensure Secret Key is set
if [[ -z "$SECRET_KEY" ]]; then
	echo "Set the SECRET_KEY"
	exit 1
fi

# Get the Repo Name out of the <ORG>/<REPO> string
PACKAGE_NAME="$(cut -d'/' -f2 <<<$GITHUB_REPOSITORY)"

# jq -r . /github/workflow/event.json

# move files to dist folder 
rsync -r \
--exclude "node_modules/" \
--exclude "dist/" \
--exclude ".gitignore" \
--exclude "webpack.config.js" \
--exclude ".prettierrc" \
--exclude "gulp.config.js" \
--exclude "gulpfile.js" \
--exclude "package.json" \
--exclude "package-lock.json" \
--exclude "composer.lock" \
--exclude "wpgulp.config.js" \
--exclude "gulpfile.babel.js" \
--exclude ".eslintrc" \
--exclude ".eslintrc.js" \
--exclude ".scss-lint.yml" \
--exclude ".vscode/" \
--exclude ".git/" \
--exclude ".github/" \
--exclude "blocks/" \
"$GITHUB_WORKSPACE/" \
"$PACKAGE_NAME"/ \
--delete

# Get the version number out of the tag accociated with the Release
VERSION=${GITHUB_REF#refs/tags/}


LATEST_RELEASE_NAME=($(jq '.release.name' . /github/workflow/event.json))
echo "$LATEST_RELEASE_NAME"

LATEST_RELEASE_DESCRIPTION=($(jq '.release.body' . /github/workflow/event.json))
echo "$LATEST_RELEASE_DESCRIPTION"

# change directory into the workspace 
cd "$GITHUB_WORKSPACE"/

# Zip the newly created folder
zip "$PACKAGE_NAME".zip -r "$PACKAGE_NAME"

# POST the File and Parameters to the updates api
if http --form http://updates.arvernus.info/package/"$PACKAGE_NAME"/"$VERSION" file@"$GITHUB_WORKSPACE"/"$PACKAGE_NAME".zip secret_key=="$SECRET_KEY" release_title=="$LATEST_RELEASE_NAME" release_notes=="$LATEST_RELEASE_DESCRIPTION"; then
    echo "✓ Plugin deployed!"
else
    case $? in
        2) echo 'Request timed out!' ;;
        3) echo 'Unexpected HTTP 3xx Redirection!' ;;
        4) echo 'HTTP 4xx Client Error!' ;;
        5) echo 'HTTP 5xx Server Error!' ;;
        6) echo 'Exceeded --max-redirects=<n> redirects!' ;;
        *) echo 'Other Error!' ;;
    esac
fi