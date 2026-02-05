import { createContext, useContext, useState } from "react";
import socket from "../sockets/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    socket.connect();
    socket.emit("join", data._id);
  };

  const logout = () => {
    socket.disconnect();
    localStorage.clear();
    setUser(null);
  };

  const updateUser = (userData) => {
    const newUser = { ...user, ...userData };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
