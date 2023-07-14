import React, { FC, ReactNode } from "react";

import SidebarMenu from "../sidebar-menu";
import ThemeSwitcher from "./theme-switcher";

type Props = {
  children: ReactNode;
};

const Sidebar: FC<Props> = ({ children }) => {
  const handleCloseDrawer = () => {
    document.getElementById("my-drawer-2")?.click();
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen items-start justify-start p-8">
        {/* Page content here */}
        <label
          htmlFor="my-drawer-2"
          className="drawer-button lg:hidden flex gap-x-2 cursor-pointer"
        >
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <p>MENU</p>
        </label>
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="w-52 menu p-4 h-full bg-base-200 text-base-content font-bold">
          {/* Sidebar content here */}
          <div className="h-full flex flex-col justify-between">
            <div>
              <SidebarMenu onCloseDrawer={handleCloseDrawer} />
            </div>
            <ThemeSwitcher />
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
