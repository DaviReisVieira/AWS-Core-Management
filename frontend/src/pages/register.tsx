import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

import styles from "../styles/pages/Register.module.css";

export default function Register() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [aws_secret_key, setaws_secret_key] = useState("");
  const [aws_access_key_id, setaws_access_key_id] = useState("");

  const { registerUser } = useContext(AuthContext);

  const router = useRouter();

  async function registerFunction(e: any) {
    e.preventDefault();

    try {
      const response = await registerUser({
        username,
        password,
        aws_secret_key,
        aws_access_key_id,
      });

      setMessage(response.data.message);

      setUsername("");
      setPassword("");
      setaws_secret_key("");
      setaws_access_key_id("");

      if (response.code === 200) {
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
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
        <title>Register - AWS Core Management</title>
      </Head>
      <div>
        <main className={styles.main}>
          <h1 className={styles.title}>Register Now</h1>
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
          <form onSubmit={(e) => registerFunction(e)} className={styles.forms}>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              placeholder="Username"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
            />

            <input
              onChange={(e) => setaws_access_key_id(e.target.value)}
              value={aws_access_key_id}
              type="text"
              placeholder="AWS Access Key ID"
            />
            <input
              onChange={(e) => setaws_secret_key(e.target.value)}
              value={aws_secret_key}
              type="password"
              placeholder="AWS Secret Key"
            />
            <button type="submit">Create AWS Core Management</button>
          </form>
          {message && <p className={styles.errorMessage}>{message}</p>}
          <Link className={styles.backButton} href={"/"}>
            Back
          </Link>
        </main>
      </div>
    </div>
  );
}
