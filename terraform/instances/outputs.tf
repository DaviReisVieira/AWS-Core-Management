output "ec2_instance" {
  value = aws_instance.ec2_instance
}


output "ec2_public_ip" {
  value = { for instance, ec2 in aws_eip.eip : instance => ec2.public_ip }
}


output "ec2_public_dns" {
  value = { for instance in aws_instance.ec2_instance : instance.id => instance.public_dns }
}