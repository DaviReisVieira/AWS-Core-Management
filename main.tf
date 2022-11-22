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