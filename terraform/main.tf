terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

locals {
  common_tags = {
    Environment = "local"
    Project     = "snapmotion"
  }
}

provider "aws" {
  region = "us-east-1"
}

module "s3" {
  source      = "./modules/s3"
  bucket_name = "snapmotion-app-bucket-${var.env}"
  tags = local.common_tags
}

module "iam_user" {
  source     = "./modules/iam_user"
  user_name  = "snapmotion-app-user-${var.env}"
  bucket_arn = module.s3.bucket_arn
  tags = local.common_tags
}
