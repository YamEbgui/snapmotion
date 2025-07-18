#################################################
# S3
#################################################
module "s3" {
  source      = "./modules/s3"
  bucket_name = "snapmotion-app-bucket-${local.env}"
}

#################################################
# IAM User
#################################################
module "iam_user" {
  source     = "./modules/iam_user"
  user_name  = "snapmotion-app-user-${local.env}"
  bucket_arn = module.s3.bucket_arn
}

#################################################
# ECR
#################################################
module "ecr" {
  source = "./modules/ecr"
  repository_name = "snapmotion-app-ecr-${local.env}"
}

#################################################
# ROLE FOR APP RUNNER
#################################################
resource "aws_iam_role" "app_runner_role" {
  name = "snapmotion-app-runner-role-${local.env}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = [
          "build.apprunner.amazonaws.com",
          "tasks.apprunner.amazonaws.com"
        ]
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "app_runner_role_policy_attachment" {
  role       = aws_iam_role.app_runner_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
  
}

resource "aws_iam_role_policy_attachment" "app_runner_role_policy_attachment_2" {
  role       = aws_iam_role.app_runner_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSAppRunnerFullAccess"
}

#################################################
# App Runner
#################################################
module "app_runner" {
  source = "./modules/app_runner"
  service_name = "snapmotion-app-runner-${local.env}"
  image_identifier = "${module.ecr.repository_url}:${var.image_tag}"
  image_repository_type = "ECR"
  container_port = "4000"
  auto_deployments_enabled = true
  cpu = "1 vCPU"
  memory = "2 GB"
  instance_role_arn = aws_iam_role.app_runner_role.arn
}
