variable "service_name" {
  description = "Name of the App Runner service"
  type        = string
}

variable "image_identifier" {
  description = "Container image identifier (e.g., Docker image URI)"
  type        = string
}

variable "image_repository_type" {
  description = "Type of image repository (ECR or ECR_PUBLIC)"
  type        = string
  default     = "ECR_PUBLIC"
  
  validation {
    condition     = contains(["ECR", "ECR_PUBLIC"], var.image_repository_type)
    error_message = "Image repository type must be either 'ECR' or 'ECR_PUBLIC'."
  }
}

variable "container_port" {
  description = "Port that the container listens on"
  type        = string
  default     = "4000"
}


variable "auto_deployments_enabled" {
  description = "Whether automatic deployments are enabled"
  type        = bool
  default     = true
}

variable "cpu" {
  description = "Number of CPU units reserved for each instance of your App Runner service"
  type        = string
  default     = "0.25 vCPU"
  
  validation {
    condition = contains([
      "0.25 vCPU",
      "0.5 vCPU", 
      "1 vCPU",
      "2 vCPU",
      "4 vCPU"
    ], var.cpu)
    error_message = "CPU must be one of: 0.25 vCPU, 0.5 vCPU, 1 vCPU, 2 vCPU, 4 vCPU."
  }
}

variable "memory" {
  description = "Amount of memory reserved for each instance of your App Runner service"
  type        = string
  default     = "0.5 GB"
  
  validation {
    condition = contains([
      "0.5 GB",
      "1 GB",
      "2 GB",
      "3 GB",
      "4 GB",
      "6 GB",
      "8 GB",
      "10 GB",
      "12 GB"
    ], var.memory)
    error_message = "Memory must be one of: 0.5 GB, 1 GB, 2 GB, 3 GB, 4 GB, 6 GB, 8 GB, 10 GB, 12 GB."
  }
}

variable "instance_role_arn" {
  description = "ARN of the IAM role that provides permissions to your App Runner service"
  type        = string
}
