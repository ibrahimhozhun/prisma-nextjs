import { Grid, Loading } from "@nextui-org/react";
import { NextPage } from "next";
import { useAuth } from "../contexts/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FormCard, { FormCardProps } from "../components/FormCard";

const Login: NextPage = () => {
  const { loading, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [loading, router, user]);

  const formCardProps: FormCardProps = {
    email,
    password,
    setEmail,
    setPassword,
    type: "Login",
  };

  return (
    <>
      {loading ? (
        <Grid.Container
          // justify='center' alignItems='center'
          css={{ h: "90vh", dflex: "center" }}
        >
          <Loading />
        </Grid.Container>
      ) : (
        <FormCard {...formCardProps} />
      )}
    </>
  );
};

export default Login;
