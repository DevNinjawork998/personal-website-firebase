import { createContext, useContext, useState } from "react";
import React from "react";

const AlertContext = createContext({});

export const AlertProvider = ({ children }: any) => {
  const [state, setState] = useState({
    isOpen: false,
    // Type can be either "success" or "error"
    type: "success",
    // Message to be displayed, can be any string
    message: "Thank for submiting your query",
  });

  return (
    <AlertContext.Provider
      value={{
        ...state,
        onOpen: (type: string, message: string): void =>
          setState({ isOpen: true, type, message }),
        onClose: () =>
          setState({
            isOpen: false,
            type: "end",
            message: "Goodbye I will speak to you very soon",
          }),
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => useContext(AlertContext);
