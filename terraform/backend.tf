terraform {
  backend "s3" {
    bucket         = "snapmotion-tf-state-infra"
    key            = "state/terraform.tfstate"
    region         = "us-east-1"
    use_lockfile   = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = local.common_tags
  }
}