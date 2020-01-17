import React, { createContext, useContext, useState } from "react";

const ErrorContext = createContext(null);

export function ErrorProvider({ children }) {
  function publishError(errToAdd) {
    console.error(errToAdd);
    updateErrors([...errors, errToAdd]);
  }

  function clearError(errToRemove) {
    updateErrors(errors.filter(err => err !== errToRemove));
  }

  function clearAll() {
    updateErrors([]);
  }

  const [errors, updateErrors] = useState([]);
  return <ErrorContext.Provider value={[errors, publishError, clearError, clearAll]}>{children}</ErrorContext.Provider>;
}

export function useErrors() {
    return useContext(ErrorContext);
}

