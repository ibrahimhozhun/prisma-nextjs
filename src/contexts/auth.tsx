import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { ResponseType } from "../pages/api/user";

interface IUser {
  email: string;
}

interface IAuthContext {
  user: IUser;
  loading: boolean;
  login: (email: string, password: string) => void;
  register: (email: string, password: string) => void;
  logout: () => void;
  getUser: () => void;
}

// Auth Context
const AuthContext = createContext<IAuthContext>(null);

// React hook to use this context
export const useAuth = () => useContext(AuthContext);

// AuthContext Provider
export const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<IUser>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.get<ResponseType>("/api/user?action=currentUser");

      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    await axios.get("/api/user?action=logout");
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post<ResponseType>("/api/user?action=register", {
        user: { email, password },
      });
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post<ResponseType>("/api/user?action=login", {
        user: { email, password },
      });
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        getUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
