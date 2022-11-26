import Link from "next/link";

interface RegionSummaryProps {
  region: RegionProps;
}

export default function RegionSummary({ region }: RegionSummaryProps) {
  return (
    <Link href={`region/${region.region}`}>
      <div>
        <h2>Name: {region.region}</h2>
        <h3>Users Groups: {region.json_config.users_groups.length}</h3>
        <h3>Users: {region.json_config.users.length}</h3>
        <h3>Security Groups: {region.json_config.security_groups.length}</h3>
        <h3>Instances: {region.json_config.instances.length}</h3>
      </div>
    </Link>
  );
}
