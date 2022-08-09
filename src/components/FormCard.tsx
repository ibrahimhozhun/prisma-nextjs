import { Button, Card, Grid, Loading, Spacer, Text } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction } from "react";
import { useAuth } from "../contexts/auth";
import Input from "./Input";
import Notification from "./Notification";

export interface FormCardProps {
  password: string;
  email: string;
  type: "Login" | "Register";
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
}

const FormCard: FC<FormCardProps> = ({ password, setPassword, email, setEmail, type }) => {
  const { login, register, errors, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    type === "Login" ? login(email, password) : register(email, password);

    if (errors) {
      console.log("well we got some troubles");
      console.log(errors);
    } else if (errors !== null) {
      // console.log(errors);
      // setEmail("");
      // setPassword("");

      setTimeout(() => router.push("/"), 2000);
    }
  };

  // Seperate errors
  const emailError = errors
    ? ("email_validation_error" in errors || "duplicate_error" in errors || "no_user" in errors) &&
      true
    : false;

  const passwordError = errors
    ? ("password_validation_error" in errors || "login_error" in errors) && true
    : false;

  return (
    <>
      {/* If there is any errors, show notification with the error message */}
      {errors && <Notification type='error' message={errors[Object.keys(errors)[0]]} />}
      {loading ? (
        <Loading />
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
                  h: errors ? "45vh" : "42vh",
                }}
              >
                <Card.Header>
                  <Grid.Container justify='center'>
                    <Text h3>{type}</Text>
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
                      placeholder='mike@example.com'
                      color={emailError ? "error" : "primary"}
                      helperText={emailError ? errors[Object.keys(errors)[0]] : null}
                    />
                    <Spacer y={emailError ? 2 : 1} />
                    <Input
                      value={password}
                      required
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      label='Password'
                      color={passwordError ? "error" : "primary"}
                      type='password'
                      helperText={passwordError ? errors[Object.keys(errors)[0]] : null}
                    />
                    <Spacer y={passwordError ? 2 : 1} />
                    <Grid.Container justify='center' alignItems='center'>
                      <Button type='submit' css={{ w: "50%" }}>
                        {type}
                      </Button>
                    </Grid.Container>
                  </Grid.Container>
                </Card.Body>
                <Card.Footer>
                  {type === "Register" ? (
                    <Link href='/login'>I already have an account</Link>
                  ) : (
                    <Link href='/reset-password'>I forgot my password</Link>
                  )}
                </Card.Footer>
              </Card>
            </form>
          </Grid>
        </Grid.Container>
      )}
    </>
  );
};

export default FormCard;
