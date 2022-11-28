import { useEffect, useState } from "react";

import styles from "../styles/components/CreateInstance.module.css";

interface CreateInstanceProps {
  newRegionInformations: RegionProps;
  setNewRegionInformations: (e: RegionProps) => void;
}

const instanceTypeList = ["t2.micro", "t2.small", "t2.medium"];

const amiList: any = {
  "us-east-1": "ami-00a0e0b890ae17d65",
  "us-east-2": "ami-0b4577d77dac11b84",
  "us-west-1": "ami-07ca31583160e0a93",
  "us-west-2": "ami-0cc5d32378afd3b57",
  "sa-east-1": "ami-084fadaa5d7882916",
  "eu-west-1": "ami-082bec92abb02aba4",
  "eu-west-2": "ami-0f0741503c767a317",
  "eu-west-3": "ami-03a5d4b9a3dba6ebe",
  "eu-central-1": "ami-0a474432ef48429a7",
  "ap-southeast-1": "ami-0ec559e18e8ed6466",
  "ap-southeast-2": "ami-0bb85ffded6e32670",
  "ap-northeast-1": "ami-04705b95f49850f5e",
  "ap-northeast-2": "ami-0cf362b88b0395b94",
  "ap-northeast-3": "ami-0cf362b88b0395b94",
  "ca-central-1": "ami-0191b23c592e9a01b",
  "cn-north-1": "ami-0764541358866f84e",
  "cn-northwest-1": "ami-02441dea73a15a612",
  "us-gov-west-1": "ami-02642d561d662175f",
  "us-gov-east-1": "ami-01c308292da9fe7f5",
};

export default function CreateInstance({
  newRegionInformations,
  setNewRegionInformations,
}: CreateInstanceProps) {
  const [name, setName] = useState<string>("");
  const [instanceType, setInstanceType] = useState<string>("");
  const [initialsecurityGroupsIds, setInitialsecurityGroupsIds] =
    useState<string>("");

  const [securityGroupsIds, setSecurityGroupsIds] = useState<Array<string>>([]);

  function handleUserCreate(e: any) {
    e.preventDefault();

    const json_data = {
      name,
      ami: amiList[newRegionInformations.region],
      instance_type: instanceType,
      security_groups_ids: securityGroupsIds,
    };

    const newUsersGroups = [
      ...newRegionInformations.json_config.instances,
      json_data,
    ];

    setNewRegionInformations({
      ...newRegionInformations,
      json_config: {
        ...newRegionInformations.json_config,
        instances: newUsersGroups,
      },
    });

    setName("");
    setInstanceType("");
    setSecurityGroupsIds([]);
  }

  let changePoliciesActionsHandler = (e: any) => {
    e.preventDefault();
    setInitialsecurityGroupsIds(e.target.value);
  };

  let addSecurityGroupsIds = (event: any) => {
    event.preventDefault();

    if (initialsecurityGroupsIds !== "") {
      let newItem = initialsecurityGroupsIds;
      setSecurityGroupsIds([...securityGroupsIds, newItem]);
      setInitialsecurityGroupsIds("");
    }
  };

  let removeSecurityGroupsIds = (par: number) => {
    let newSecurityGroupsIds = securityGroupsIds.filter(
      (item, index) => index !== par
    );
    setSecurityGroupsIds(newSecurityGroupsIds);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Instance</h2>
      <form>
        <h2>Name</h2>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          placeholder="Name of the instance"
          onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
        />
        <h2>Instance Type</h2>
        <select
          name="instance_type"
          id="instance_type"
          value={instanceType}
          onChange={(e) => setInstanceType(e.target.value)}
        >
          <option value="">Select an instance type</option>
          {instanceTypeList.map((instanceType) => (
            <option key={instanceType} value={instanceType}>
              {instanceType}
            </option>
          ))}
        </select>

        <div>
          <h2>Security Groups</h2>
          <div id="parent_action">
            <div id="container_action">
              <div id="sub1_action">
                <input
                  type="text"
                  value={initialsecurityGroupsIds}
                  onChange={changePoliciesActionsHandler}
                  placeholder="Add a item"
                  autoFocus
                />
                <button
                  className={styles.alternativeButton}
                  id="add_action"
                  onClick={addSecurityGroupsIds}
                >
                  +
                </button>
              </div>

              <div id="sub2_action" className={styles.listOfGroups}>
                {securityGroupsIds.map((name, index) => {
                  return (
                    <div id="cross_action" key={index}>
                      {name} | Remover{" "}
                      <button
                        id={`${index}`}
                        onClick={(e) => {
                          e.preventDefault();
                          removeSecurityGroupsIds(index);
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
