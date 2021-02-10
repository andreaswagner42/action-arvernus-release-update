# 📦 Github Action to Deploy Releases to the Arvernus Update Server

This Action is build to be trigered upon new releases. Once a new Release is created, the Action will take the master branch at the state of the last tagged release, takes all the code needed for production and moves into a new folder. This folder then gets compressed into a zip archive. Upon completion the zip file and some metadata like the version number will be send to the arvernus update server via a POST request. If package-file-name is given this file will be used as package and uploaded to the arvernus update server.

## ✨ Reccomended setup

It's reccomended to run NPM scripts before it, in order to build and test the application before it gets shipped.

### Example of how to use this action:
```yml
on:
  release:
    types:
      [published, edited, unpublished, deleted]
name: Publish Release
jobs:
  wordPressPackageDeploy:
    name: WordPress Package Deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: WordPress Plugin Deploy
        uses: Arvernus/action-arvernus-release-update@master
        with:
          update-server-url: "https://custom-server.com"
          package-type: "Plugin"
          server-secret-key: ${{ secrets.SERVER_SECRET_KEY }}
          github-access-token: ${{ secrets.GITHUB_ACCESS_TOKEN }}
```

## 📎 Inputs

### `github-access-token`
Github Auth token in order to get the release name and description.
> **`required`**

### `update-server-url`
URL of the Server the release will be uploaded to.
> **`optional`**
> 
> **Default:** `https://updates.arvernus.info`


### `server-secret-key`
Secret you need in otder for the update server to accept your POST request.
> **`required`**

### `package-type`
Pass in wether it is a WordPress Theme, Plugin or MU-Plugin
> **`optional`**
> 
> **Default:** `Theme`

### `package-file-name`
The file-name of the release package (if not given use the built-in packaging)
> **`optional`**

### `package-file-extension`
The file extension of the release package file (only used if package-file-name is specified)
> **`optional`**
>
> **Default:** `zip`
