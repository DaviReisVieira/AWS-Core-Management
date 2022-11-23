export default function SecurityGroup(sg: SecurityGroupProps) {
  return (
    <div>
      <h1>Security Group</h1>
      <h2>Name: {sg.name}</h2>
      <h2>Description: {sg.description}</h2>
      <h2>Id: {sg.id}</h2>
    </div>
  );
}
