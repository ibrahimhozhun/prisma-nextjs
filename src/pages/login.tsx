import { Button, Card, Grid, Spacer, Text } from "@nextui-org/react";
import { NextPage } from "next";
import { useAuth } from "../contexts/auth";
import Input from "../components/Input";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const { login, loading, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [loading, router, user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    //TODO: Validate user input first
    //TODO: And do some error handling
    login(email, password);
    console.log(email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <>
      {/*
       //! When page loads login form becames visible for a moment fix it
       */}
      {user ? (
        <Text h2>You already logged in.You will be redirected to home page in 3 seconds.</Text>
      ) : (
        <Grid.Container
          alignItems='center'
          css={{
            h: "90vh",
          }}
          direction='column'
        >
          <Spacer y={2.5} />
          <Grid>
            <form autoComplete='off' onSubmit={handleSubmit}>
              <Card
                css={{
                  h: "42vh",
                }}
              >
                <Card.Header>
                  <Grid.Container justify='center'>
                    <Text h3>Login</Text>
                  </Grid.Container>
                </Card.Header>
                <Card.Body>
                  <Grid.Container direction='column'>
                    <Input
                      value={email}
                      required
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      label='Email'
                      type='email'
                      color='primary'
                      placeholder='mike@example.com'
                    />
                    <Spacer y={1} />
                    <Input
                      value={password}
                      required
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      label='Password'
                      color='primary'
                      type='password'
                    />
                    <Spacer y={1} />
                    <Grid.Container justify='center' alignItems='center'>
                      <Button type='submit' css={{ w: "50%" }}>
                        Login
                      </Button>
                    </Grid.Container>
                  </Grid.Container>
                </Card.Body>
                <Card.Footer>
                  <Link href='/reset-password'>I forgot my password</Link>
                </Card.Footer>
              </Card>
            </form>
          </Grid>
        </Grid.Container>
      )}
    </>
  );
};

export default Login;
