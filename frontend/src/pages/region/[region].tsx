import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import CreateGroups from "../../components/CreateGroups";
import CreateInstance from "../../components/CreateInstance";
import CreateSecurityGroup from "../../components/CreateSecurityGroup";
import CreateUsers from "../../components/CreateUsers";
import Instances from "../../components/Instances";
import { LoadingBox } from "../../components/LoadingBox";
import MenuBox from "../../components/MenuBox";
import SecurityGroup from "../../components/SecurityGroup";
import Users from "../../components/Users";
import UsersGroups from "../../components/UsersGroups";
import { api } from "../../services/api";

import styles from "../../styles/pages/region/Region.module.css";
interface RegionPageProps {
  regionName: string;
}

export default function Region({ regionName }: RegionPageProps) {
  const [regionInformations, setRegionInformations] =
    useState<RegionProps | null>(null);
  const [newRegionInformations, setNewRegionInformations] =
    useState<RegionProps>({} as RegionProps);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  async function getRegion() {
    try {
      const response = await api.get(`get-terraform-config/${regionName}`);

      const data = response.data;

      setRegionInformations(data);
      setNewRegionInformations(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getRegion();
  }, [regionName]);

  function checkIfDifferent() {
    if (
      JSON.stringify(newRegionInformations) ===
      JSON.stringify(regionInformations)
    ) {
      return false;
    } else {
      return true;
    }
  }

  async function saveButton(e: any) {
    e.preventDefault();

    const confirmation = confirm(
      "Are you sure you want to save this region updates?"
    );
    if (confirmation) {
      setLoading(true);
      try {
        await api.post(`update-terraform-config`, newRegionInformations);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);

      getRegion();
    }
  }

  async function deleteRegion(e: any) {
    e.preventDefault();

    const confirmation = confirm(
      "Are you sure you want to delete this region?"
    );
    if (confirmation) {
      setLoading(true);

      try {
        await api.delete(`delete-terraform-config/${regionInformations?.id}`);

        router.push("/dashboard");
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    } else {
      return;
    }
  }

  if (!regionInformations) {
    return <LoadingBox text={"Loading Region..."} />;
  }

  return (
    <>
      {loading && <LoadingBox text="Updating Region..." />}

      <Head>
        <title>Region - AWS Core Management</title>
      </Head>
      <MenuBox currentPage={"region"} />
      <div className={styles.container}>
        <h1 className={styles.title}>{regionInformations?.region}</h1>
        <div className={styles.components}>
          <h1>IAM Users</h1>
          <div className={styles.componentContainer}>
            <div className={styles.componentContainerList}>
              {newRegionInformations.json_config.users.map((user) => (
                <Users
                  key={user.name}
                  {...user}
                  newRegionInformations={newRegionInformations}
                  setNewRegionInformations={setNewRegionInformations}
                />
              ))}
            </div>
            <CreateUsers
              newRegionInformations={newRegionInformations}
              setNewRegionInformations={setNewRegionInformations}
            />
          </div>
          <h1>IAM User Groups</h1>
          <div className={styles.componentContainer}>
            <div className={styles.componentContainerList}>
              {newRegionInformations?.json_config.users_groups.map((ug) => (
                <UsersGroups
                  key={ug.id}
                  {...ug}
                  newRegionInformations={newRegionInformations}
                  setNewRegionInformations={setNewRegionInformations}
                />
              ))}
            </div>
            <CreateGroups
              newRegionInformations={newRegionInformations}
              setNewRegionInformations={setNewRegionInformations}
            />
          </div>
          <h1>Security Groups</h1>
          <div className={styles.componentContainer}>
            <div className={styles.componentContainerList}>
              {newRegionInformations.json_config.security_groups.map(
                (security_group) => (
                  <SecurityGroup
                    key={security_group.name}
                    {...security_group}
                    newRegionInformations={newRegionInformations}
                    setNewRegionInformations={setNewRegionInformations}
                  />
                )
              )}
            </div>
            <CreateSecurityGroup
              newRegionInformations={newRegionInformations}
              setNewRegionInformations={setNewRegionInformations}
            />
          </div>
          <h1>Instances</h1>
          <div className={styles.componentContainer}>
            <div className={styles.componentContainerList}>
              {newRegionInformations.json_config.instances.map((instance) => (
                <Instances
                  key={instance.name}
                  {...instance}
                  newRegionInformations={newRegionInformations}
                  setNewRegionInformations={setNewRegionInformations}
                />
              ))}
            </div>
            <CreateInstance
              newRegionInformations={newRegionInformations}
              setNewRegionInformations={setNewRegionInformations}
            />
          </div>
        </div>
        <div>
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              deleteRegion(e);
            }}
          >
            Delete Region
          </button>
          {checkIfDifferent() && (
            <button
              className={styles.saveButton}
              onClick={(e) => {
                saveButton(e);
              }}
            >
              Update Region
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { "awsCoreManagement.accessToken": accessToken } =
    parseCookies(context);

  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { region } = context.query;

  if (!region) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      regionName: region,
    },
  };
}
