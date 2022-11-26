import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import CreateUsers from "../../components/CreateUsers";
import Instances from "../../components/Instances";
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
    useState<RegionProps | null>(null);

  const router = useRouter();

  useEffect(() => {
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

    getRegion();
  }, [regionName]);

  // check if newRegionInformations json_config is different from regionInformations json_config
  // check if RegionConfigProps with keys in list
  // if it is, return true
  // if it isn't, return false

  async function deleteRegion(e: any) {
    e.preventDefault();

    const confirmation = confirm(
      "Are you sure you want to delete this region?"
    );
    if (confirmation) {
      try {
        await api.delete(`delete-terraform-config/${regionInformations?.id}`);

        router.push("/dashboard");
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  }

  return (
    <>
      <Head>
        <title>Region - AWS Core Management</title>
      </Head>
      <MenuBox currentPage={"region"} />
      <div className={styles.container}>
        <h1 className={styles.title}>{regionInformations?.region}</h1>
        <div className={styles.components}>
          <div className={styles.componentContainer}>
            <h1>IAM Users</h1>
            {regionInformations?.json_config.users.map((user) => (
              <Users key={user.name} {...user} />
            ))}
            <CreateUsers />
          </div>
          <div className={styles.componentContainer}>
            <h1>IAM Users Groups</h1>
            {regionInformations?.json_config.users_groups.map((ug) => (
              <UsersGroups key={ug.id} {...ug} />
            ))}
          </div>
          <div className={styles.componentContainer}>
            <h1>Security Groups</h1>
            {regionInformations?.json_config.security_groups.map((sg) => (
              <SecurityGroup key={sg.id} {...sg} />
            ))}
          </div>
          <div className={styles.componentContainer}>
            <h1>Instances</h1>
            {regionInformations?.json_config.instances.map((instance) => (
              <Instances key={instance.name} {...instance} />
            ))}
          </div>
        </div>
        <button
          className={styles.deleteButton}
          onClick={(e) => {
            deleteRegion(e);
          }}
        >
          Delete Region
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { "awsCoreManagement.accessToken": accessToken } = await parseCookies(
    context
  );

  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { region } = context.query;

  return {
    props: {
      regionName: region,
    },
  };
}
