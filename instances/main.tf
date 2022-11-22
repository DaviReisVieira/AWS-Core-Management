resource "tls_private_key" "pk_generate" {
  algorithm = "RSA"
  rsa_bits  = 4096
}


resource "aws_key_pair" "kp" {
  for_each = { for instance in var.instances : instance.name => instance }
  
  key_name   = each.value.name
  public_key = tls_private_key.pk_generate.public_key_openssh
  
  provisioner "local-exec" {
    command = "echo '${tls_private_key.pk_generate.private_key_pem}' > '${each.value.name}.pem'"
  }
}


resource "aws_instance" "ec2_instance" {
  for_each = { for instance in var.instances : instance.name => instance }
  
  ami                    = each.value.ami
  instance_type          = each.value.instance_type

  subnet_id              = var.public_subnet

  key_name               = each.value.name

  vpc_security_group_ids = [for security_group in var.security_groups : security_group.id if contains(each.value.security_groups_ids, security_group.tags.id)]

  tags = {
    Name = each.value.name
  }
}


resource "aws_eip" "eip" {
  for_each = { for instance in var.instances : instance.name => instance }
  
  instance = aws_instance.ec2_instance[each.value.name].id
  vpc      = true
}


