workflow "Testing" {
  on = "push"
  resolves = ["WordPress Plugin Deploy"]
}

action "WordPress Plugin Deploy" {
  uses = "./"
  secrets = ["SECRET_KEY"]
}
