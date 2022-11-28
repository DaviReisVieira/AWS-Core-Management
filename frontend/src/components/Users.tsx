interface UsersComponentProps extends UsersProps {
  newRegionInformations: RegionProps;
  setNewRegionInformations: (e: RegionProps) => void;
}

import styles from "../styles/components/Users.module.css";

export default function Users(user: UsersComponentProps) {
  function deleteUserFromUsersGroups(e: any) {
    e.preventDefault();

    const confirmation = confirm(
      "Are you sure you want to delete this user from Users?"
    );
    if (confirmation) {
      const newUsers = user.newRegionInformations.json_config.users.filter(
        (ug) => ug.name !== user.name
      );

      user.setNewRegionInformations({
        ...user.newRegionInformations,
        json_config: {
          ...user.newRegionInformations.json_config,
          users: newUsers,
        },
      });
    } else {
      return;
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <h2>Name: {user.name}</h2>
        <h2>Policy Name: {user.policies.name}</h2>
        {user.user_groups_ids.length ? (
          <h2>
            {"Groups:"} {user.user_groups_ids.toString()}
          </h2>
        ) : (
          <h2>Groups: None</h2>
        )}
      </div>
      <div>
        <h2>Policy Description: {user.policies.description}</h2>
        <h2>
          {"Actions of Policy:"} {user.policies.actions.toString()}
        </h2>
        <h2>
          {"Resources of Policy:"} {user.policies.resources.toString()}
        </h2>
      </div>
      <button onClick={deleteUserFromUsersGroups}>Delete User</button>
    </div>
  );
}
