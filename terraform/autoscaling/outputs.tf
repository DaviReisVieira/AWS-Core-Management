output "elb-dns" {
  value = aws_elb.elb1.dns_name
}

output "availability_zones" {
  value = data.aws_availability_zones.available.names
}