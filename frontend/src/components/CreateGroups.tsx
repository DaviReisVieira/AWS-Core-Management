import { useEffect, useState } from "react";

import styles from "../styles/components/CreateUser.module.css";

interface CreateGroupsProps {
  newRegionInformations: RegionProps;
  setNewRegionInformations: (e: RegionProps) => void;
}

export default function CreateGroups({
  newRegionInformations,
  setNewRegionInformations,
}: CreateGroupsProps) {
  const [name, setName] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [policies, setPolicies] = useState<PoliciesProps>({
    name: "",
    description: "",
    actions: [],
    resources: [],
  });
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
      id: groupId,
      name,
      description,
      policies,
    };

    console.log(json_data);

    const newUsersGroups = [
      ...newRegionInformations.json_config.users_groups,
      json_data,
    ];

    setNewRegionInformations({
      ...newRegionInformations,
      json_config: {
        ...newRegionInformations.json_config,
        users_groups: newUsersGroups,
      },
    });

    setName("");
    setGroupId("");
    setDescription("");
    setPolicies({
      name: "",
      description: "",
      actions: [],
      resources: [],
    });

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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create User Group</h2>
      <form>
        <h2>ID</h2>
        <input
          type="text"
          name="ID"
          id="ID"
          value={groupId}
          placeholder="ID of Group"
          onChange={(e) => setGroupId(e.target.value)}
        />
        <h2>Name</h2>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          placeholder="Username"
          onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
        />
        <h2>Description</h2>
        <input
          type="text"
          name="description"
          id="description"
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
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
