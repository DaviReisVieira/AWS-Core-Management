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
      </div>
      <div>
        <h2>Description: {instance.description}</h2>
        <h2></h2>
      </div>
      <button onClick={deleteInstanceFromSecurityGroupGroups}>
        Delete Instance
      </button>
    </div>
  );
}
