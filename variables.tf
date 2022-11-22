variable "aws_access_key" {
  type = string
}

variable "aws_secret_key" {
  type = string
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

# Network
variable "security_groups" {
  type = list(object({
    id          = string
    name        = string
    description = string
    ingress = list(object({
      description = string
      from_port   = number
      to_port     = number
      protocol    = string
      cidr_blocks = list(string)
    }))
  }))
}

# Instances
variable "instances" {
  type = list(object({
    name                = string
    ami                 = string
    instance_type       = string
    security_groups_ids = list(string)
    region              = string
  }))
}