import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (email) return;
    setUserEmail(email);
  }, []);

  const login = ({ token, email }) => {
    setUserEmail(email);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("token", token);
  };

  const logout = () => {
    setUserEmail("");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
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
