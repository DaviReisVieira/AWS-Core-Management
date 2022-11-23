output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "availability_zones" {
  value = data.aws_availability_zones.available.names
}

output "public_subnet" {
  value = aws_subnet.public_subnet.id
}

output "gateway_id" {
  value = aws_internet_gateway.ig.id
}

output "security_groups" {
  value = [for security_group in aws_security_group.sg : security_group]
}
