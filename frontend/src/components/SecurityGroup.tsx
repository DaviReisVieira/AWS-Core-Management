interface SecurityGroupComponentProps extends SecurityGroupProps {
  newRegionInformations: RegionProps;
  setNewRegionInformations: (e: RegionProps) => void;
}

import styles from "../styles/components/SecurityGroups.module.css";

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
      <div className={styles.informations}>
        <div>
          <h2>Name</h2>
          <h2>{instance.name}</h2>
        </div>
        <div>
          <h2>Description</h2>
          <h2>{instance.description}</h2>
        </div>
        <div>
          <h2>Security Group ID</h2>
          <h2>{instance.id}</h2>
        </div>
      </div>
      <div className={styles.securityContainer}>
        <div className={styles.ingressEgress}>
          <h2>Ingress</h2>
          {instance.ingress.map((ingress, index) => (
            <div
              key={`ingress_${index}`}
              className={styles.ingressEgressContainer}
            >
              <div>
                <h2>Description</h2>
                <h2>{ingress.description}</h2>
              </div>
              <div>
                <h2>Protocol</h2>
                <h2>{ingress.protocol}</h2>
              </div>
              <div>
                <h2>From Port</h2>
                <h2>{ingress.from_port}</h2>
              </div>
              <div>
                <h2>To Port</h2>
                <h2>{ingress.to_port}</h2>
              </div>
              <div>
                <h2>Cidr Blocks</h2>
                <h2>{ingress.cidr_blocks.toString()}</h2>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className={styles.ingressEgress}>
            <h2>Egress</h2>
            {instance.egress.map((egress, index) => (
              <div
                key={`ingress_${index}`}
                className={styles.ingressEgressContainer}
              >
                <div>
                  <h2>Description</h2>
                  <h2>{egress.description}</h2>
                </div>
                <div>
                  <h2>Protocol</h2>
                  <h2>{egress.protocol}</h2>
                </div>
                <div>
                  <h2>From Port</h2>
                  <h2>{egress.from_port}</h2>
                </div>
                <div>
                  <h2>To Port</h2>
                  <h2>{egress.to_port}</h2>
                </div>
                <div>
                  <h2>Cidr Blocks</h2>
                  <h2>{egress.cidr_blocks.toString()}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={deleteInstanceFromSecurityGroupGroups}>Delete SG</button>
    </div>
  );
}
