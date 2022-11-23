import Head from "next/head";
import MenuBox from "../components/MenuBox";

export default function Dashboard() {
  return (
    <div>
      <Head>
        <title>Dashboard - AWS Core Management</title>
      </Head>
      <MenuBox currentPage={"dashboard"} />
      <h1>Dashboard</h1>
    </div>
  );
}
