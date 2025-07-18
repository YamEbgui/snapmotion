resource "aws_apprunner_service" "this" {
  service_name = var.service_name

  source_configuration {
    authentication_configuration {
      access_role_arn = var.instance_role_arn
    }
    image_repository {
      image_identifier      = var.image_identifier
      image_repository_type = var.image_repository_type
      image_configuration {
        port = var.container_port
      }
    }
    auto_deployments_enabled = var.auto_deployments_enabled
  }

  instance_configuration {
    cpu    = var.cpu
    memory = var.memory
    instance_role_arn = var.instance_role_arn
  }

  # Ignore changes to environment variables(push environment variables secrets to app runner manually)
  lifecycle {
    ignore_changes = [
      source_configuration[0].image_repository[0].image_configuration[0].runtime_environment_variables
    ]
  }
}