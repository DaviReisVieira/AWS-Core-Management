interface SecurityGroupComponentProps extends SecurityGroupProps {
  newRegionInformations: RegionProps;
  setNewRegionInformations: (e: RegionProps) => void;
}

import styles from "../styles/components/Users.module.css";

export default function SecurityGroup(instance: SecurityGroupComponentProps) {
  function deleteInstanceFromSecurityGroupGroups(e: any) {
    e.preventDefault();

    const confirmation = confirm(
      "Are you sure you want to delete this Instance from SecurityGroup?"
    );
    if (confirmation) {
      const newSecurityGroup =
        instance.newRegionInformations.json_config.security_groups.filter(
          (sg) => sg.name !== instance.name
        );

      instance.setNewRegionInformations({
        ...instance.newRegionInformations,
        json_config: {
          ...instance.newRegionInformations.json_config,
          security_groups: newSecurityGroup,
        },
      });
    } else {
      return;
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <h2>ID: {instance.id}</h2>
        <h2>Name: {instance.name}</h2>
        <h2>Description: {instance.description}</h2>
      </div>
      <div>
        <h2>Ingress</h2>
        {instance.ingress.map((ingress, index) => (
          <div key={`ingress_${index}`}>
            <h2>Description: {ingress.description}</h2>
            <h2>Protocol: {ingress.protocol}</h2>
            <h2>
              Port: {ingress.from_port}-{ingress.to_port}
            </h2>
            <h2>Cidr Blocks: {ingress.cidr_blocks.toString()}</h2>
          </div>
        ))}
      </div>
      <div>
        <h2>Egress</h2>
        {instance.egress.map((egress, index) => (
          <div key={`ingress_${index}`}>
            <h2>Description: {egress.description}</h2>
            <h2>Protocol: {egress.protocol}</h2>
            <h2>
              Port: {egress.from_port}-{egress.to_port}
            </h2>
            <h2>Cidr Blocks: {egress.cidr_blocks.toString()}</h2>
          </div>
        ))}
      </div>
      <button onClick={deleteInstanceFromSecurityGroupGroups}>Delete SG</button>
    </div>
  );
}
