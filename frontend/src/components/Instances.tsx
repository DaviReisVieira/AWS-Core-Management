interface InstancesComponentProps extends InstancesProps {
  newRegionInformations: RegionProps;
  setNewRegionInformations: (e: RegionProps) => void;
}

import styles from "../styles/components/Users.module.css";

export default function Instances(instance: InstancesComponentProps) {
  function deleteInstanceFromInstancesGroups(e: any) {
    e.preventDefault();

    const confirmation = confirm(
      "Are you sure you want to delete this Instance from Instances?"
    );
    if (confirmation) {
      const newInstances =
        instance.newRegionInformations.json_config.instances.filter(
          (ug) => ug.name !== instance.name
        );

      instance.setNewRegionInformations({
        ...instance.newRegionInformations,
        json_config: {
          ...instance.newRegionInformations.json_config,
          instances: newInstances,
        },
      });
    } else {
      return;
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <h2>Name: {instance.name}</h2>
        <h2>AMI: {instance.ami}</h2>
      </div>
      <div>
        <h2>Instance Type: {instance.instance_type}</h2>
        <h2>
          {"Security Groups:"} {instance.security_groups_ids.toString()}
        </h2>
      </div>
      <button onClick={deleteInstanceFromInstancesGroups}>
        Delete Instance
      </button>
    </div>
  );
}
