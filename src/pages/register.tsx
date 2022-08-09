import { Grid, Loading } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import FormCard, { FormCardProps } from "../components/FormCard";
import { useAuth } from "../contexts/auth";

const Register: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If there is a logged in user redirect user to the home page
    if (user) {
      router.push("/");
    }
  }, [loading, router, user]);

  const formCardProps: FormCardProps = {
    email,
    password,
    setEmail,
    setPassword,
    type: "Register",
  };

  return (
    <>
      {loading ? (
        <Grid.Container css={{ h: "90vh", dflex: "center" }}>
          <Loading />
        </Grid.Container>
      ) : (
        <FormCard {...formCardProps} />
      )}
    </>
  );
};

export default Register;
