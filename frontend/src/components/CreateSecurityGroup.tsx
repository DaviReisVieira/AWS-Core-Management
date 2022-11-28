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
  const [securityGroupId, setSecurityGroupId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ingress, setIngress] = useState<IngressProps[]>([]);
  const [egress, setEgress] = useState<EgressProps[]>([]);

  function handleUserCreate(e: any) {
    e.preventDefault();

    const json_data = {
      id: securityGroupId,
      name,
      description,
      ingress,
      egress,
    };

    const newSecurityGroups = [
      ...newRegionInformations.json_config.security_groups,
      json_data,
    ];

    setNewRegionInformations({
      ...newRegionInformations,
      json_config: {
        ...newRegionInformations.json_config,
        security_groups: newSecurityGroups,
      },
    });

    setSecurityGroupId("");
    setName("");
    setDescription("");
    setIngress([]);
    setEgress([]);
  }

  function handleIngressCreate(e: any) {
    e.preventDefault();

    const newIngress = [
      ...ingress,
      {
        description: "",
        from_port: 0,
        to_port: 0,
        protocol: "",
        cidr_blocks: [],
      },
    ];

    setIngress(newIngress);
  }

  function handleEgressCreate(e: any) {
    e.preventDefault();

    const newEgress = [
      ...egress,
      {
        description: "",
        from_port: 0,
        to_port: 0,
        protocol: "",
        cidr_blocks: [],
      },
    ];

    setEgress(newEgress);
  }

  function handleIngressDelete(e: any) {
    e.preventDefault();

    const newIngress = ingress.filter((ingressValue, index) => {
      return index !== Number(e.target.value);
    });

    setIngress(newIngress);
  }

  function handleEgressDelete(e: any) {
    e.preventDefault();

    const newEgress = egress.filter((egressValue, index) => {
      return index !== Number(e.target.value);
    });

    setEgress(newEgress);
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
          value={securityGroupId}
          placeholder="ID of Security Group"
          onChange={(e) => setSecurityGroupId(e.target.value)}
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
        <h2>Ingress</h2>
        <div className={styles.ingressContainer}>
          {ingress.map((ingressNew, indexOfIngress) => {
            return (
              <div key={`ingress_${indexOfIngress}`} className={styles.ingress}>
                <div>
                  <div>
                    <h3>Protocol</h3>
                    <input
                      type="text"
                      name="protocol"
                      id="protocol"
                      value={ingressNew.protocol}
                      placeholder="Protocol"
                      onChange={(e) => {
                        const newIngress = ingressNew;
                        newIngress.protocol = e.target.value;
                        ingress[indexOfIngress] = newIngress;
                        setIngress([...ingress]);
                      }}
                    />
                  </div>
                  <div>
                    <h3>Description</h3>
                    <input
                      key={`ingress_${indexOfIngress}_description`}
                      type="text"
                      name="description"
                      id="description"
                      value={ingressNew.description}
                      placeholder="Description"
                      onChange={(e) => {
                        const newIngress = ingressNew;
                        newIngress.description = e.target.value;
                        ingress[indexOfIngress] = newIngress;
                        setIngress([...ingress]);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <h3>From Port</h3>
                    <input
                      type="number"
                      name="from_port"
                      id="from_port"
                      value={ingressNew.from_port}
                      placeholder="From Port"
                      onChange={(e) => {
                        const newIngress = ingressNew;
                        newIngress.from_port = Number(e.target.value);
                        ingress[indexOfIngress] = newIngress;
                        setIngress([...ingress]);
                      }}
                    />
                  </div>
                  <div>
                    <h3>To Port</h3>
                    <input
                      type="number"
                      name="to_port"
                      id="to_port"
                      value={ingressNew.to_port}
                      placeholder="To Port"
                      onChange={(e) => {
                        const newIngress = ingressNew;
                        newIngress.to_port = Number(e.target.value);
                        ingress[indexOfIngress] = newIngress;
                        setIngress([...ingress]);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3>CIDR Blocks</h3>
                  <div>
                    <div className={styles.cidrContainer}>
                      {ingressNew.cidr_blocks.map((cidr_block, indexOfCidr) => {
                        return (
                          <div key={indexOfCidr} className={styles.cidr}>
                            <input
                              key={`ingress_${indexOfIngress}_cidr_${indexOfCidr}`}
                              type="text"
                              name="cidr_block"
                              id="cidr_block"
                              value={cidr_block}
                              placeholder="CIDR Block"
                              onChange={(e) => {
                                const newIngress = ingressNew;
                                newIngress.cidr_blocks[indexOfCidr] =
                                  e.target.value;
                                ingress[indexOfIngress] = newIngress;
                                setIngress([...ingress]);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const newIngress = ingressNew;
                        newIngress.cidr_blocks.push("");
                        ingress[indexOfIngress] = newIngress;
                        setIngress([...ingress]);
                      }}
                    >
                      Add CIDR Block
                    </button>
                  </div>
                </div>

                <button
                  className={styles.deleteButton}
                  value={indexOfIngress}
                  onClick={handleIngressDelete}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
        <div>
          <h2>Egress</h2>
          <div className={styles.ingressContainer}>
            {egress.map((egressNew, indexOfEgress) => {
              return (
                <div key={`egress_${indexOfEgress}`} className={styles.ingress}>
                  <div>
                    <div>
                      <h3>Protocol</h3>
                      <input
                        type="text"
                        name="protocol"
                        id="protocol"
                        value={egressNew.protocol}
                        placeholder="Protocol"
                        onChange={(e) => {
                          const newEgress = egressNew;
                          newEgress.protocol = e.target.value;
                          egress[indexOfEgress] = newEgress;
                          setEgress([...egress]);
                        }}
                      />
                    </div>
                    <div>
                      <h3>Description</h3>
                      <input
                        key={`egress_${indexOfEgress}_description`}
                        type="text"
                        name="description"
                        id="description"
                        value={egressNew.description}
                        placeholder="Description"
                        onChange={(e) => {
                          const newEgress = egressNew;
                          newEgress.description = e.target.value;
                          egress[indexOfEgress] = newEgress;
                          setEgress([...egress]);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div>
                      <h3>From Port</h3>
                      <input
                        type="number"
                        name="from_port"
                        id="from_port"
                        value={egressNew.from_port}
                        placeholder="From Port"
                        onChange={(e) => {
                          const newEgress = egressNew;
                          newEgress.from_port = Number(e.target.value);
                          egress[indexOfEgress] = newEgress;
                          setEgress([...egress]);
                        }}
                      />
                    </div>
                    <div>
                      <h3>To Port</h3>
                      <input
                        type="number"
                        name="to_port"
                        id="to_port"
                        value={egressNew.to_port}
                        placeholder="To Port"
                        onChange={(e) => {
                          const newEgress = egressNew;
                          newEgress.to_port = Number(e.target.value);
                          egress[indexOfEgress] = newEgress;
                          setEgress([...egress]);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h3>CIDR Blocks</h3>
                    <div>
                      <div className={styles.cidrContainer}>
                        {egressNew.cidr_blocks.map(
                          (cidr_block, indexOfCidr) => {
                            return (
                              <div key={indexOfCidr} className={styles.cidr}>
                                <input
                                  key={`egress_${indexOfEgress}_cidr_${indexOfCidr}`}
                                  type="text"
                                  name="cidr_block"
                                  id="cidr_block"
                                  value={cidr_block}
                                  placeholder="CIDR Block"
                                  onChange={(e) => {
                                    const newEgress = egressNew;
                                    newEgress.cidr_blocks[indexOfCidr] =
                                      e.target.value;
                                    egress[indexOfEgress] = newEgress;
                                    setEgress([...egress]);
                                  }}
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const newEgress = egressNew;
                          newEgress.cidr_blocks.push("");
                          egress[indexOfEgress] = newEgress;
                          setEgress([...egress]);
                        }}
                      >
                        Add CIDR Block
                      </button>
                    </div>
                  </div>

                  <button
                    className={styles.deleteButton}
                    value={indexOfEgress}
                    onClick={handleEgressDelete}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <button
            className={styles.createIngressButton}
            onClick={handleIngressCreate}
          >
            Create Ingress
          </button>
          <button
            className={styles.createIngressButton}
            onClick={handleEgressCreate}
          >
            Create Egress
          </button>
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
