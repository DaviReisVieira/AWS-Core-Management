import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { parseCookies } from "nookies";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

import styles from "../styles/pages/Index.module.css";

export default function Home() {
  const { signIn } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignIn(e: any) {
    e.preventDefault();

    const data = {
      username: username,
      password: password,
    };

    const signInMessage = await signIn(data);

    if (signInMessage) {
      setMessage(signInMessage.data.message);
    }
  }

  function eye(): { x: number; y: number } {
    let length = username.length;
    let x = 20;
    let y = 0;

    if (password.length > 0) {
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
    let length = username.length;
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
        <title>AWS Core Management</title>
        <meta name="description" content="Manage your AWS Cloud" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          AWS Core{" "}
          <a
            target={"_blank"}
            href="https://github.com/DaviReisVieira/AWS-Core-Management"
            rel="noreferrer"
          >
            Management
          </a>
        </h1>
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
        <form onSubmit={handleSignIn} className={styles.forms}>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        {message && <p className={styles.errorMessage}>{message}</p>}

        <Link className={styles.registerButton} href={"/register"}>
          Register Now
        </Link>
      </main>

      <footer className={styles.footer}>
        <a target={"_blank"} href="https://davirvs.com.br" rel="noreferrer">
          Powered by Davi Reis
        </a>
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { "awsCoreManagement.accessToken": accessToken } = parseCookies(ctx);

  if (accessToken) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
