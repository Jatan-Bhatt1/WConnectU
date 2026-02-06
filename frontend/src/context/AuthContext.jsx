import { createContext, useContext, useState, useEffect } from "react";
import socket from "../sockets/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const item = localStorage.getItem("user");
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  useEffect(() => {
    if (user?._id) {
      // Connect if disconnected
      if (!socket.connected) {
        socket.connect();
      }
      // Re-join logic ensuring socket ID is ready
      socket.emit("join", user._id);
    }
  }, [user]);

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
