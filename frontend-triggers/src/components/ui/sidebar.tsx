import { FC, ReactNode } from "react";
import { Menu } from "lucide-react";

import SidebarMenu from "../sidebar-menu";
import ThemeSwitcher from "./theme-switcher";
import plante from "../../assets/images/plante.svg";

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
          <Menu />
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
              <div className="divider" />
              <ThemeSwitcher />
            </div>
            <img src={plante} alt="Illustration svg d'une plante" />
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
