import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import MenuBox from "../components/MenuBox";
import { api } from "../services/api";

import styles from "../styles/pages/About.module.css";

export default function Configurations() {
  const [mousePos, setMousePos] = useState<any>({});
  const [windowDimensions, setWindowDimensions] = useState<any>({});

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    const getWindowDimensions = () => {
      const { innerWidth: width, innerHeight: height } = window;
      return {
        width,
        height,
      };
    };

    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function eye(): { x: number; y: number } {
    let xPos = (mousePos.x * 33) / windowDimensions.width;
    let yPos = (mousePos.y * 6) / windowDimensions.height;
    let x = 20;
    let y = 0;

    if (xPos > 0 && xPos < 33) {
      x = xPos;
    } else if (xPos >= 33) {
      x = 33;
    }

    if (yPos > 0 && yPos < 6) {
      y = yPos;
    } else if (yPos >= 6) {
      y = 6;
    }
    return { x: -26 + x * 0.3, y: y };
  }

  function facial(): { x: number; y: number } {
    let xPos = (mousePos.x * 33) / windowDimensions.width;
    let yPos = (mousePos.y * 6) / windowDimensions.height;

    let x = 20;
    let y = 0;

    if (xPos > 0 && xPos < 33) {
      x = xPos;
    } else if (xPos >= 33) {
      x = 33;
    }

    if (yPos > 0 && yPos < 3) {
      y = yPos;
    } else if (yPos >= 3) {
      y = 3;
    }

    return { x: -12 + x * 0.3, y: y };
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>About - AWS Core Management</title>
      </Head>
      <MenuBox currentPage={"About"} />
      <main className={styles.main}>
        <h1 className={styles.title}>About AWS Core Management</h1>
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
        <p className={styles.textInfo}>
          A AWS Core Management foi desenvolvida por Davi Reis Vieira para o
          projeto de Cloud do 6º semestre de Engenheria da Computação, no
          Insper.
          <br />
          <br />
          Esta plataforma tem como objetivo auxiliar o usuário a gerenciar seus
          serviços da AWS de forma mais simples e intuitiva.
          <br />
          Desenvolvimento utilizando NextJS, ReactJS, NodeJS, TypeScript,
          Terraform, Python e Flask API.
        </p>
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
