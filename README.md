# :package: Github Action to Deploy Releases to the Arvernus Update Server

This Action is build to be trigered upon new releases. Once a new Release is created, the Action will take the master branch at the state of the last tagged release, takes all the code needed for production and moves into a new folder. This folder then gets compressed into a zip archive. Upon completion the zip file and some metadata like the version number will be send to the arvernus update server via a POST request.

## :sparkles: Reccomended setup

It's reccomended to run NPM scripts before it, in order to build and test the application before it gets shipped.

## :closed_lock_with_key: Secrets

- `SECRET_KEY`: Secret you need in otder for the arvernus update server to accept your POST request.
- `GITHUB_TOKEN`: Github Auth token in order to get the release name and description.
