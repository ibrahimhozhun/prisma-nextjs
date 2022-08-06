import { Button } from "@nextui-org/react";
import { NextPage } from "next";
import { useAuth } from "../contexts/auth";

const Register: NextPage = () => {
  const { register } = useAuth();

  return (
    <>
      <Button onClick={() => register("mike@example.com", "_Password123")}>register</Button>
    </>
  );
};

export default Register;
