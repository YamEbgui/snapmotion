
output "s3_bucket_id" {
  value = module.s3.bucket_id
}

output "s3_bucket_arn" {
  value = module.s3.bucket_arn
}

output "iam_user_name" {
  value = module.iam_user.user_name
}

output "iam_user_access_key_id" {
  value = module.iam_user.access_key_id
}

output "iam_user_secret_access_key" {
  value = module.iam_user.secret_access_key
  sensitive = true
}
