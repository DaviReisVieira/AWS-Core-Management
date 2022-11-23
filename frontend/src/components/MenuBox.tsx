import { Fragment, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthContext, User } from "../contexts/AuthContext";

import awsLogo from "../../public/vercel.svg";

const navigation = [{ name: "Dashboard", href: "/dashboard", admin: false }];

const profile = [{ name: "Configurações", href: "/configurations" }];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface MenuBoxProps {
  currentPage: string;
}

const navLinks = [
  { name: "Dashboard", path: "/dashboard" },
  {
    name: "Configurações",
    path: "/configurations",
  },
  {
    name: "View",
    path: "/services",
  },
  {
    name: "Logout",
    path: "/logout",
  },
];

export default function MenuBox({ currentPage }: MenuBoxProps) {
  const { user, logOut } = useContext(AuthContext);

  return (
    <nav>
      {navLinks.map((link, index) => {
        return (
          <ul key={`link_${index}`}>
            <Link href={link.path}>
              <li key={index}>{link.name}</li>
            </Link>
          </ul>
        );
      })}
    </nav>
  );
}
