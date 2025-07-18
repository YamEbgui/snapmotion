locals {
  env = "local"
  common_tags = {
    Environment = local.env
    Project     = "snapmotion"
  }
}