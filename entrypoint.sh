#!/bin/bash

# Note that this does not use pipefail
# because if the grep later doesn't match any deleted files,
# which is likely the majority case,
# it does not exit with a 0, and I only care about the final exit.
set -eo

# Ensure SVN username and password are set
# IMPORTANT: secrets are accessible by anyone with write access to the repository!
if [[ -z "$SECRET_KEY" ]]; then
	echo "Set the SECRET_KEY"
	exit 1
fi

# SLUG=${GITHUB_REPOSITORY#*/}
# echo "ℹ︎ SLUG is $SLUG"

echo GITHUB_WORKSPACE

# echo "✓ Plugin deployed!"