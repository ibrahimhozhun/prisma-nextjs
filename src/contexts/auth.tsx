import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import validator from "validator";
import { useRouter } from "next/router";
import { IError, ResponseType } from "../lib/utils";

interface IUser {
  email: string;
}
interface IAuthContext {
  user: IUser;
  loading: boolean;
  errors: any;
  success: string;
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
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState<string>(null);
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  // When page changes reset errors
  useEffect(() => {
    setErrors(null);
  }, [router.asPath]);

  const handleErrors = (error: any) => {
    // First reset success
    setSuccess(null);

    let errors: any = {};

    console.log(error);

    // If response key is in the error object, then this means it's coming from the server
    if ("response" in error) {
      error = error.response.data.error;

      // If the error is not coming from the server then it could be a validation error but we still need to be sure
    } else if (error.code.includes("INVALID")) {
      // Get the details of the error and assign it to the errors object
      errors[`${error.code.slice(8).trim().toLowerCase()}_validation_error`] = error.message;
    }

    // Format error object to use at client side
    errors[error.code.toLowerCase()] = error.message;

    console.log(errors);

    // And finally set error state
    setErrors(errors);
  };

  const checkFormInput = (email: string, password: string, checkPassword: boolean = false) => {
    // Check email
    if (!validator.isEmail(email)) {
      const error: IError = {
        code: "INVALID_EMAIL",
        message: `Invalid email: ${email}`,
      };

      throw error;
    }

    // Check password if necessary
    if (checkPassword) {
      if (!validator.isStrongPassword(password)) {
        const error: IError = {
          code: "INVALID_PASSWORD",
          message: "Password is not strong enough",
        };

        throw error;
      }
    }
  };

  const getUser = async () => {
    try {
      // Check if there is a logged in user
      const res = await axios.get<ResponseType>("/api/auth/current-user");

      // Assign it to the user state
      setUser(res.data.user);

      // Reset errors if there are any
      setErrors(null);
    } catch (error) {}
    setLoading(false);
  };

  const logout = async () => {
    // Reset errors, success message and user state
    setSuccess(null);
    setErrors(null);
    setUser(null);

    // Then log out
    await axios.get("/api/auth/logout");

    // And redirect user back to home page
    router.push("/");
  };

  const register = async (email: string, password: string) => {
    setLoading(true);

    try {
      // Check user input before making a request to server
      checkFormInput(email, password, true);

      // Register user
      const res = await axios.post<ResponseType>("/api/auth/register", {
        user: { email, password },
      });

      // Get user from response and assign to our user state
      setUser(res.data.user);

      // Set success message
      setSuccess("Registeration successful, please confirm your email address");

      // Reset errors
      setErrors(null);
    } catch (error) {
      handleErrors(error);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      // Check user input firstly
      checkFormInput(email, password);

      // Make login request, if anything goes wrong it will throw an error
      const res = await axios.post<ResponseType>("/api/auth/login", {
        user: { email, password },
      });

      // Get user from response and assign to our user state
      setUser(res.data.user);

      // Set success message
      setSuccess("Successfully logged in");

      // Reset errors
      setErrors(null);
    } catch (error) {
      handleErrors(error);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        errors,
        success,
        login,
        register,
        logout,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
