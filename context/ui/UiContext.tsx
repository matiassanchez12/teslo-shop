import React from "react";

interface ContextProps {
  isMenuOpen: boolean;
  toggleSideMenu: () => void;
}

export const UiContext = React.createContext({} as ContextProps);
