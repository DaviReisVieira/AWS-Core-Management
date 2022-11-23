import Head from "next/head";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import Instances from "../../components/Instances";
import MenuBox from "../../components/MenuBox";
import SecurityGroup from "../../components/SecurityGroup";
import Users from "../../components/Users";
import UsersGroups from "../../components/UsersGroups";
import { api } from "../../services/api";

interface RegionPageProps {
  regionName: string;
}

export default function Region({ regionName }: RegionPageProps) {
  const [regionInformations, setRegionInformations] =
    useState<RegionProps | null>(null);

  useEffect(() => {
    async function getRegion() {
      try {
        const response = await api.get(`get-terraform-config/${regionName}`);

        const data = response.data;

        setRegionInformations(data);
      } catch (err) {
        console.log(err);
      }
    }

    getRegion();
  }, [regionName]);

  return (
    <div>
      <Head>
        <title>Region - AWS Core Management</title>
      </Head>
      <MenuBox currentPage={"region"} />
      <h1>Region: {regionInformations?.region}</h1>

      <div>
        <h2>IAM Users</h2>
        {regionInformations?.json_config.users.map((user) => (
          <Users key={user.name} {...user} />
        ))}
      </div>
      <div>
        <h2>IAM Users Groups</h2>
        {regionInformations?.json_config.users_groups.map((ug) => (
          <UsersGroups key={ug.id} {...ug} />
        ))}
      </div>
      <div>
        <h2>Security Groups</h2>
        {regionInformations?.json_config.security_groups.map((sg) => (
          <SecurityGroup key={sg.id} {...sg} />
        ))}
      </div>
      <div>
        <h2>Instances</h2>
        {regionInformations?.json_config.instances.map((instance) => (
          <Instances key={instance.name} {...instance} />
        ))}
      </div>
    </div>
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
