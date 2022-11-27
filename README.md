# AWS Core Management

![index](public/foto1.png)

## Description

This project is a simple example of how to use Terraform to manage AWS resources.

## Technologies

[![Terraform](https://img.shields.io/badge/Terraform-623CE4?style=for-the-badge&logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/en/2.0.x/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

## Requirements

- [Terraform](https://www.terraform.io/downloads.html)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [Python](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/en/download/)
<!-- - [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) -->
- [AWS Account](https://aws.amazon.com/)
- [AWS IAM User](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)

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

## Format of JSON variable file

```json
{
  "aws-region": "us-east-2",
  "security_groups": [],
  "instances": [],
  "users": [],
  "users_groups": []
}
```
