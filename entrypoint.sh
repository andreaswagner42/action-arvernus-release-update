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

$PACKAGE_NAME "$(cut -d'/' -f2 <<<$GITHUB_REPOSITORY)"
echo $PACKAGE_NAME

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
--exclude ".vscode/" \
--exclude ".git/" \
--exclude ".github/" \
"$GITHUB_WORKSPACE/" \
arvernus-slider-build/ \
--delete

for entry in "$GITHUB_WORKSPACE"/arvernus-slider-build/*
do
  echo "$entry"
done


# echo "✓ Plugin deployed!"