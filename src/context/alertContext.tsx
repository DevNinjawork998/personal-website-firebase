import { createContext, useContext, useState, ReactNode } from "react";
import React from "react";

interface AlertContextType {
  isOpen: boolean;
  type: string;
  message: string;
  onOpen: (type: string, message: string) => void;
  onClose: () => void;
}

const AlertContext = createContext<AlertContextType>({
  isOpen: false,
  type: "success",
  message: "Thank for submitting your query",
  onOpen: () => {},
  onClose: () => {},
});

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [state, setState] = useState({
    isOpen: false,
    // Type can be either "success" or "error"
    type: "success",
    // Message to be displayed, can be any string
    message: "Thank for submitting your query",
  });

  const onOpen = (type: string, message: string): void => {
    setState({ isOpen: true, type, message });
  };

  const onClose = (): void => {
    setState({
      isOpen: false,
      type: "end",
      message: "Goodbye I will speak to you very soon",
    });
  };

  return (
    <AlertContext.Provider
      value={{
        ...state,
        onOpen,
        onClose,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = (): AlertContextType => useContext(AlertContext);
