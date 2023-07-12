import { ReactNode } from "react";

export default interface Lien {
  icon: ReactNode;
  label: string;
  path: string;
  id?: number;
}
