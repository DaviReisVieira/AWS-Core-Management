import { Fragment, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthContext, User } from "../contexts/AuthContext";

import awsLogo from "../../public/daviaws.svg";

import styles from "../styles/components/MenuBox.module.css";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface MenuBoxProps {
  currentPage: string;
}

const navLinks = [
  { name: "Dashboard", path: "/dashboard" },
  {
    name: "Configurations",
    path: "/configurations",
  },
  {
    name: "About",
    path: "/about",
  },
];

export default function MenuBox({ currentPage }: MenuBoxProps) {
  const { user, logOut } = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src={awsLogo} alt="AWS Logo" width={90} />
      </div>

      <ul>
        {navLinks.map((link, index) => {
          return (
            <li key={`link_${index}`}>
              <Link href={link.path}>{link.name}</Link>
            </li>
          );
        })}
      </ul>
      <button
        onClick={() => {
          logOut();
        }}
      >
        Logout
      </button>
    </div>
  );
}
