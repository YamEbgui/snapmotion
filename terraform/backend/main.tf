provider "aws" {
  region = "us-east-1" # Set your AWS region
}

# Get current AWS account ID
data "aws_caller_identity" "current" {}

# S3 bucket for Terraform state
resource "aws_s3_bucket" "tf_backend" {
  bucket = "snapmotion-tf-state-infra" # Your bucket name
}

# Enable versioning for the bucket
resource "aws_s3_bucket_versioning" "tf_backend_versioning" {
  bucket = aws_s3_bucket.tf_backend.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption for the bucket
resource "aws_s3_bucket_server_side_encryption_configuration" "tf_backend_sse" {
  bucket = aws_s3_bucket.tf_backend.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Create bucket policy document for the Terraform state bucket
data "aws_iam_policy_document" "bucket_policy" {
  statement {
    principals {
      type        = "AWS"
      identifiers = [
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/personal_work"
      ]
    }
    actions = [
      "s3:ListBucket"
    ]
    resources = [
      aws_s3_bucket.tf_backend.arn
    ]
  }

  statement {
    principals {
      type        = "AWS"
      identifiers = [
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/personal_work"
      ]
    }
    actions = [
      "s3:GetObject",
      "s3:PutObject"
    ]
    resources = [
      "${aws_s3_bucket.tf_backend.arn}/state/terraform.tfstate"
    ]
  }

  statement {
    principals {
      type        = "AWS"
      identifiers = [
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/personal_work"
      ]
    }
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject"
    ]
    resources = [
      "${aws_s3_bucket.tf_backend.arn}/state/terraform.tfstate.tflock"
    ]
  }
}

# Attach the policy to the bucket
resource "aws_s3_bucket_policy" "terraform_state_bucket_policy" {
  bucket = aws_s3_bucket.tf_backend.id
  policy = data.aws_iam_policy_document.bucket_policy.json
}

# Output the bucket name for reference
output "terraform_state_bucket" {
  value       = aws_s3_bucket.tf_backend.bucket
  description = "The S3 bucket for storing Terraform state"
}

/*
IMPORTANT: After creating the bucket with the above resources, you can use it as a backend.
To do this, uncomment the terraform block below and run 'terraform init' again.

terraform {
  backend "s3" {
    bucket       = "snapmotion-tf-state-infra"
    key          = "state/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
  }
}
*/
