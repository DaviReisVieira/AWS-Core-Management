module "network" {
  source          = "./networks"
  vpc_cidr        = "10.0.0.0/16"
  security_groups = var.security_groups
}

output "network" {
  value = module.network
}