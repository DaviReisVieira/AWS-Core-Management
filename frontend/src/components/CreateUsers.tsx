import { useEffect, useState } from "react";

import styles from "../styles/components/CreateUser.module.css";

interface CreateUsersProps {
  newRegionInformations: RegionProps;
  setNewRegionInformations: (e: RegionProps) => void;
}

export default function CreateUsers({
  newRegionInformations,
  setNewRegionInformations,
}: CreateUsersProps) {
  const [name, setName] = useState<string>("");
  const [policies, setPolicies] = useState<PoliciesProps>({
    name: "",
    description: "",
    actions: [],
    resources: [],
  });
  const [groups, setGroups] = useState<Array<any>>([]);
  const [initialGroups, setInitialGroups] = useState<string>("");
  const [initialActions, setInitialActions] = useState<string>("");
  const [initialResources, setInitialResources] = useState<string>("");

  function handleUserCreate(e: any) {
    e.preventDefault();
    // check if actions and resources are not empty
    if (policies.actions.length === 0 && policies.resources.length === 0) {
      alert("Actions and Resources cannot be empty");
      return;
    }

    const json_data = {
      name,
      policies,
      user_groups_ids: groups,
    };

    console.log(json_data);

    const newUsers = [...newRegionInformations.json_config.users, json_data];

    setNewRegionInformations({
      ...newRegionInformations,
      json_config: {
        ...newRegionInformations.json_config,
        users: newUsers,
      },
    });

    setName("");
    setPolicies({
      name: "",
      description: "",
      actions: [],
      resources: [],
    });
    setGroups([]);
    setInitialGroups("");
    setInitialActions("");
    setInitialResources("");
  }

  let changePoliciesActionsHandler = (e: any) => {
    e.preventDefault();
    setInitialActions(e.target.value);
  };

  let addAction = (event: any) => {
    event.preventDefault();

    if (initialActions !== "") {
      let newItem = initialActions;
      setPolicies({
        ...policies,
        actions: [...policies.actions, newItem],
      });
      setInitialActions("");
    }
  };

  let removeAction = (par: number) => {
    let newActions = policies.actions.filter((action, index) => index !== par);
    setPolicies({
      ...policies,
      actions: newActions,
    });
  };

  let changePoliciesResourcesHandler = (e: any) => {
    e.preventDefault();
    setInitialResources(e.target.value);
  };

  let addResource = (event: any) => {
    event.preventDefault();

    if (initialResources !== "") {
      let newItem = initialResources;
      setPolicies({
        ...policies,
        resources: [...policies.resources, newItem],
      });
      setInitialResources("");
    }
  };

  let removeResource = (par: number) => {
    let newResources = policies.resources.filter(
      (resource, index) => index !== par
    );
    setPolicies({
      ...policies,
      resources: newResources,
    });
  };

  let changePoliciesGroupsHandler = (e: any) => {
    e.preventDefault();
    setInitialGroups(e.target.value);
  };

  let addGroup = (event: any) => {
    event.preventDefault();
    if (initialGroups !== "") {
      let newItem = initialGroups;
      setGroups([...groups, newItem]);
      setInitialGroups("");
    }
  };

  let removeGroup = (par: number) => {
    let newGroups = groups.filter((group, index) => index !== par);
    setGroups(newGroups);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create User</h2>
      <form>
        <h2>Name</h2>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
        <h2>Policies</h2>
        <input
          type="text"
          name="policy"
          id="policy"
          placeholder="Policy Name"
          value={policies.name}
          onChange={(e) =>
            setPolicies({
              ...policies,
              name: e.target.value.replace(/[^a-zA-Z0-9]/g, ""),
            })
          }
        />
        <input
          type="text"
          name="description"
          id="description"
          placeholder="Description"
          value={policies.description}
          onChange={(e) =>
            setPolicies({ ...policies, description: e.target.value })
          }
        />
        <h3>Actions</h3>
        <div id="parent_action">
          <div id="container_action">
            <div id="sub1_action">
              <input
                type="text"
                value={initialActions}
                onChange={changePoliciesActionsHandler}
                placeholder="Add a item"
                autoFocus
              />
              <button
                className={styles.alternativeButton}
                id="add_action"
                onClick={addAction}
              >
                +
              </button>
            </div>

            <div id="sub2_action">
              {policies.actions.map((name, index) => {
                return (
                  <div id="cross_action" key={index}>
                    {name} {"  "}
                    <button
                      className={styles.alternativeButton}
                      id={`${index}`}
                      onClick={(e) => {
                        e.preventDefault();
                        removeAction(index);
                      }}
                    >
                      &#10060;
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <h3>Resources</h3>
        <div id="parent_resource">
          <div id="container_resource">
            <div id="sub1_resource">
              <input
                type="text"
                value={initialResources}
                onChange={changePoliciesResourcesHandler}
                placeholder="Add a item"
                autoFocus
              />
              <button
                className={styles.alternativeButton}
                id="add_resource"
                onClick={addResource}
              >
                +
              </button>
            </div>

            <div id="sub2_resource">
              {policies.resources.map((name, index) => {
                return (
                  <div id="cross_resource" key={index}>
                    <button
                      className={styles.alternativeButton}
                      id={`${index}`}
                      onClick={(e) => {
                        e.preventDefault();
                        removeResource(index);
                      }}
                    >
                      &#10060;
                    </button>
                    {name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <h2>Groups</h2>
        <div id="parent_group">
          <div id="container_group">
            <div id="sub1_group">
              <select
                name="add_group"
                id="add_group"
                value={initialGroups}
                onChange={changePoliciesGroupsHandler}
              >
                <option value="">Select a Group</option>
                {newRegionInformations.json_config.users_groups.map((sg) => (
                  <option key={`us_s_${sg.id}`} value={sg.id}>
                    {sg.name}
                  </option>
                ))}
              </select>
              <button
                className={styles.alternativeButton}
                id="add_group"
                onClick={addGroup}
              >
                +
              </button>
            </div>

            <div id="sub2_group">
              {groups.map((name, index) => {
                return (
                  <div id="cross_group" key={index}>
                    <button
                      className={styles.alternativeButton}
                      id={`${index}`}
                      onClick={(e) => {
                        e.preventDefault();
                        removeGroup(index);
                      }}
                    >
                      &#10060;
                    </button>
                    {name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <button
          className={styles.buttonSubmit}
          type="submit"
          onClick={(e) => {
            handleUserCreate(e);
          }}
        >
          Create
        </button>
      </form>
    </div>
  );
}
