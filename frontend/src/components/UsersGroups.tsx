interface UsersGroupsPropsComponent extends UsersGroupsProps {
  newRegionInformations: RegionProps;
  setNewRegionInformations: (e: RegionProps) => void;
}

import styles from "../styles/components/UsersGroups.module.css";

export default function UsersGroups(usersGroups: UsersGroupsPropsComponent) {
  function deleteUserGroupFromUsersGroups(e: any) {
    e.preventDefault();

    const confirmation = confirm(
      "Are you sure you want to delete this user group from Users Groups?"
    );

    if (confirmation) {
      const newUsersGroups =
        usersGroups.newRegionInformations.json_config.users_groups.filter(
          (ug) => ug.id !== usersGroups.id
        );

      usersGroups.setNewRegionInformations({
        ...usersGroups.newRegionInformations,
        json_config: {
          ...usersGroups.newRegionInformations.json_config,
          users_groups: newUsersGroups,
        },
      });
    } else {
      return;
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <h2>ID: {usersGroups.id}</h2>
        <h2>Name: {usersGroups.name}</h2>
        <h2>Description: {usersGroups.description}</h2>
        <h2>Policy Name: {usersGroups.policies.name}</h2>
      </div>
      <div>
        <h2>Policy Description: {usersGroups.policies.description}</h2>
        <h2>
          {"Actions of Policy:"} {usersGroups.policies.actions.toString()}
        </h2>
        <h2>
          {"Resources of Policy:"} {usersGroups.policies.resources.toString()}
        </h2>
      </div>
      <button onClick={deleteUserGroupFromUsersGroups}>Delete Group</button>
    </div>
  );
}
