# AWS-Core-Management

AWS Core Management with Terraform

## Format of variables in Terraform JSON

- Security Group

```json
{
  "id": "sg-0a1b2c3d",
  "name": "sg-tcp/udp-22 - davirvs",
  "description": "Security Group for EC2",
  "ingress": [
    {
      "description": "SSH",
      "from_port": 22,
      "to_port": 22,
      "protocol": "tcp",
      "cidr_blocks": ["0.0.0.0/0"]
    }
  ]
}
```

- EC2

```json
{
  "name": "davirvs1_ubuntu2204",
  "ami": "ami-08c40ec9ead489470",
  "instance_type": "t2.micro",
  "security_groups_ids": ["sg-0a1b2c3d"],
  "region": "us-east-1a"
}
```
