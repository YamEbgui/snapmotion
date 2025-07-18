module "s3" {
  source      = "./modules/s3"
  bucket_name = "snapmotion-app-bucket-${local.env}"
  tags = local.common_tags
}

module "iam_user" {
  source     = "./modules/iam_user"
  user_name  = "snapmotion-app-user-${local.env}"
  bucket_arn = module.s3.bucket_arn
  tags = local.common_tags
}
