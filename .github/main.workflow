workflow "Testing" {
  resolves = ["WordPress Plugin Deploy"]
  on = "release"
}

action "WordPress Plugin Deploy" {
  uses = "./"
  secrets = [
    "SECRET_KEY",
    "GITHUB_TOKEN",
    "ARVERNUS_SECRET_KEY",
  ]
}
