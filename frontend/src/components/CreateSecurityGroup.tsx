import { useEffect, useState } from "react";

import styles from "../styles/components/CreateSecurityGroup.module.css";

interface CreateSecurityGroupProps {
  newRegionInformations: RegionProps;
  setNewRegionInformations: (e: RegionProps) => void;
}

export default function CreateSecurityGroup({
  newRegionInformations,
  setNewRegionInformations,
}: CreateSecurityGroupProps) {
  const [name, setName] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [policies, setPolicies] = useState<PoliciesProps>({
    name: "",
    description: "",
    actions: [],
    resources: [],
  });

  function handleUserCreate(e: any) {
    e.preventDefault();

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
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Security Group</h2>
      <form>
        <h2>ID</h2>
        <input
          type="text"
          name="ID"
          id="ID"
          value={groupId}
          placeholder="ID of Security Group"
          onChange={(e) => setGroupId(e.target.value)}
        />
        <h2>Name</h2>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          placeholder="Name of Security Group"
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
