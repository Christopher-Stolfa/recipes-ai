import { SidebarContext } from "@/app/context/sidebar-context";
import { ISidebarContextProps } from "@/app/context/types";
import { useContext } from "react";

export const useSidebar = (): ISidebarContextProps => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
