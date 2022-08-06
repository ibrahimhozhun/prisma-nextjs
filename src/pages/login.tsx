import { Button } from "@nextui-org/react";
import { NextPage } from "next";
import { useAuth } from "../contexts/auth";

const Login: NextPage = () => {
  const { login } = useAuth();

  return (
    <>
      <Button onClick={() => login("mike@example.com", "_Password123")}>login</Button>
    </>
  );
};

export default Login;
