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
