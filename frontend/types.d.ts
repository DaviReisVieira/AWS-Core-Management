interface SecurityGroupProps {
  id: string;
  name: string;
  description: string;
  ingress: {
    description: string;
    from_port: number;
    to_port: number;
    protocol: string;
    cidr_blocks: string[];
  };
}

interface InstancesProps {
  name: string;
  ami: string;
  instance_type: string;
  security_groups_ids: string[];
  region: string;
}

interface UsersProps {
  name: string;
  policies: {
    name: string;
    description: string;
    actions: string[];
    resources: string[];
  };
  user_groups_ids: string[];
}

interface UsersGroupsProps {
  id: string;
  name: string;
  description: string;
  policies: {
    name: string;
    description: string;
    actions: string[];
    resources: string[];
  };
}

interface RegionConfigProps {
  aws_region: string;
  users: UsersProps[];
  users_groups: UsersGroupsProps[];
  security_groups: SecurityGroupProps[];
  instances: InstancesProps[];
}

interface RegionProps {
  region: string;
  id: number;
  user_id: number;
  json_config: RegionConfigProps;
}
