import React, { useEffect, useState, createContext } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (!email) return;
    setUserEmail(email);
  }, []);

  const login = ({ token, email }) => {
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("token", token);
    setUserEmail(email);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    setUserEmail("");
  };

  return (
    <AuthContext.Provider
      value={{
        userEmail,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
