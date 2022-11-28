module "network" {
  source          = "./networks"
  vpc_cidr        = "10.0.0.0/16"
  security_groups = var.security_groups
}

output "network" {
  value = module.network
}

module "instances" {
  source        = "./instances"
  public_subnet = module.network.public_subnet
  security_groups = module.network.security_groups
  instances = var.instances
}

output "instances" {
  value = module.instances
}


module "users" {
  source    = "./users"
  users = var.users
}

output "users" {
  value = module.users
}


module "groups" {
  source    = "./groups"
  users = var.users
  users_groups = var.users_groups
}

output "groups" {
  value = module.groups
}

module "autoscaling" {
  source = "./autoscaling"
}

output "autoscaling" {
  value = module.autoscaling
}