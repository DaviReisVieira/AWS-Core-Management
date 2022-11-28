import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import MenuBox from "../components/MenuBox";
import { api } from "../services/api";

import React from "react";

import styles from "../styles/pages/Dashboard.module.css";
import MapChart from "../components/MapChart";
import { LoadingBox } from "../components/LoadingBox";

const allRegions = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ap-east-1",
  "ap-south-1",
  "ap-northeast-3",
  "ap-northeast-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ca-central-1",
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-north-1",
  "sa-east-1",
];

export default function Dashboard() {
  const [regions, setRegions] = useState<RegionProps[]>([]);
  const [regionsNameAlreadyExists, setRegionsNameAlreadyExists] = useState<
    string[]
  >([]);
  const [newRegionName, setNewRegionName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function getAllRegions() {
      const response = await api.get("get-terraform-configs");
      setRegions(response.data.terraform_configs || []);

      const regionsNameAlreadyExists = regions.map((region) => region.region);
      setRegionsNameAlreadyExists(regionsNameAlreadyExists);
    }

    getAllRegions();
  }, [loading]);

  useEffect(() => {
    const regionsNameAlreadyExists = regions.map((region) => region.region);
    setRegionsNameAlreadyExists(regionsNameAlreadyExists);
  }, [regions]);

  async function addNewRegion(e: any) {
    e.preventDefault();

    const json_data = {
      region: newRegionName,
      json_config: {
        aws_region: newRegionName,
        security_groups: [],
        instances: [],
        users: [],
        users_groups: [],
      },
    };

    try {
      if (newRegionName == "") {
        alert("Please, enter a region name");
        return;
      }

      setLoading(true);
      const response = await api.post("create-terraform-config", json_data);

      setRegionsNameAlreadyExists([...regionsNameAlreadyExists, newRegionName]);
      setNewRegionName("");
      setLoading(false);
      // router.push(`/region/${newRegionName}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {loading && <LoadingBox text="Creating Region..." />}

      <MenuBox currentPage={"dashboard"} />
      <div className={styles.container}>
        <Head>
          <title>Dashboard - AWS Core Management</title>
        </Head>
        <div>
          <div className={styles.mapContainer}>
            <MapChart regions={regions} />
          </div>
          <form
            onSubmit={(e) => {
              addNewRegion(e);
            }}
          >
            <select
              name="region"
              id="region"
              onChange={(e) => setNewRegionName(e.target.value)}
            >
              <option value="">Create a New Region</option>
              {allRegions.map((region, index) => {
                if (!regionsNameAlreadyExists.includes(region)) {
                  return (
                    <option key={`region_${index}_${region}`} value={region}>
                      {region}
                    </option>
                  );
                }
              })}
            </select>
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["awsCoreManagement.accessToken"]: accessToken } = parseCookies(ctx);

  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
