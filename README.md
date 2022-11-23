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

- User

```json
{
  "name": "davirvsTeste1",
  "policies": {
    "name": "davirvsTeste1Restrictions",
    "description": "Estas são as restrições do usuário davirvsTeste1",
    "actions": ["ec2:DescribeInstances", "ec2:DescribeSecurityGroups"],
    "resources": ["*"]
  }
}
```

- Group

```json
{
  "id": "ug-0a1b2c3d",
  "name": "davirvsGroups1",
  "description": "davirvsGroups1 description",
  "policies": {
    "name": "davirvsGroups1Restrictions",
    "description": "Estas são as restrições do grupo de usuários davirvsGroups1",
    "actions": ["ec2:DescribeInstances", "ec2:DescribeSecurityGroups"],
    "resources": ["*"]
  }
}
```

## Format os JSON variable file

```json
{
  "aws-region": "us-east-2",
  "security_groups": [],
  "instances": [],
  "users": [],
  "users_groups": []
}
```
