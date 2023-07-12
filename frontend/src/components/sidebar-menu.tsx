import React, { FC } from "react";
import { Link } from "react-router-dom";

import { getLiens } from "../utils/liens";
import Lien from "../utils/types/lien";

const liens = getLiens(6, "text-base-content");

type Props = {
  onCloseDrawer: () => void;
};

const SidebarMenu: FC<Props> = ({ onCloseDrawer }) => {
  const menu = (
    <>
      {liens.map((item: Lien) => (
        <li key={item.id}>
          <Link
            className="flex items-center gap-x-4"
            to={item.path}
            onClick={onCloseDrawer}
          >
            {item.icon}
            <p>{item.label}</p>
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <>
      <li>
        <Link className="flex items-center gap-x-4" to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          Accueil
        </Link>
      </li>
      {menu}
    </>
  );
};

export default SidebarMenu;
