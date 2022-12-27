import React from "react";

import { UiContext, uiReducer } from "./";

interface Props {
  children: React.ReactNode;
}

export interface UiState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false,
};

export const UiProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = React.useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({ type: "[Ui] - ToggleMenu" });
  };

  return <UiContext.Provider value={{ ...state, toggleSideMenu }}>{children}</UiContext.Provider>;
};
