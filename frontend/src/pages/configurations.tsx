import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useState } from "react";
import MenuBox from "../components/MenuBox";
import { api } from "../services/api";

import styles from "../styles/pages/Register.module.css";

export default function Configurations() {
  const [message, setMessage] = useState("");
  const [aws_access_key_id, setAws_access_key_id] = useState("");
  const [aws_secret_access_key, setAws_secret_access_key] = useState("");

  async function updateAWSCredentials(e: any) {
    e.preventDefault();

    try {
      const response = await api.post("update-aws-credentials", {
        aws_access_key_id: aws_access_key_id,
        aws_secret_key: aws_secret_access_key,
      });

      setMessage(response.data.message);

      setAws_access_key_id("");
      setAws_secret_access_key("");
    } catch (error) {
      console.log(error);
    }
  }

  function eye(): { x: number; y: number } {
    let length = aws_access_key_id.length;
    let x = 20;
    let y = 0;

    if (aws_secret_access_key.length > 0) {
      return { x: 200, y: 200 };
    }

    if (length > 0 && length < 33) {
      x = length;
    } else if (length >= 33) {
      x = 33;
    }

    if (length > 0 && length < 18) {
      y = x * 0.2;
    } else if (length >= 18) {
      y = (36 - x) * 0.2;
    }
    return { x: -26 + x * 0.3, y: y };
  }

  function facial(): { x: number; y: number } {
    let length = aws_access_key_id.length;
    let x = 20;
    let y = -6;

    if (length > 0 && length < 33) {
      x = length;
    } else if (length >= 33) {
      x = 33;
    }

    if (length > 0 && length < 18) {
      y = -6 + x * 0.2;
    } else if (length >= 18) {
      y = -6 + (36 - x) * 0.2;
    }
    return { x: -12 + x * 0.3, y: y };
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Configurations - AWS Core Management</title>
      </Head>
      <MenuBox currentPage={"Configurations"} />
      <main className={styles.main}>
        <h1 className={styles.title}>Update Credentials</h1>
        <div className={styles.bear}>
          <div className={styles.head}>
            <div
              className={styles.eyes}
              style={{
                transform: "translate(" + eye().x + "px," + eye().y + "px)",
              }}
            >
              <div id="eye" className={styles.eye}></div>
              <div id="eye" className={styles.eye}></div>
            </div>
            <div
              className={styles.facial}
              id="facial"
              style={{
                transform:
                  "translate(" + facial().x + "px," + facial().y + "px)",
              }}
            >
              <div className={styles.nose}></div>
              <div className={styles.mouth}></div>
            </div>
            <div className={styles.ears}>
              <div className={styles.ear}></div>
              <div className={styles.ear}></div>
            </div>
          </div>
        </div>
        <form onSubmit={updateAWSCredentials} className={styles.forms}>
          <input
            onChange={(e) => setAws_access_key_id(e.target.value)}
            value={aws_access_key_id}
            type="text"
            placeholder="AWS Access Key ID"
          />
          <input
            onChange={(e) => setAws_secret_access_key(e.target.value)}
            value={aws_secret_access_key}
            type="password"
            placeholder="AWS Secret Key"
          />
          <button type="submit">Update AWS Credentials</button>
        </form>
        {message && <p>{message}</p>}
      </main>
    </div>
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
