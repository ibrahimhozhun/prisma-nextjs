import { Button, Grid, Loading, Text } from "@nextui-org/react";
import Link from "next/link";
import { useAuth } from "../contexts/auth";

const Navbar: React.FC = () => {
  const { user, loading, logout } = useAuth();

  return (
    <Grid.Container
      justify='space-between'
      gap={1}
      css={{
        "min-width": "100vw",
        h: "10vh",
        backgroundColor: "$background",
      }}
    >
      <Grid xs={3} justify='center'>
        <Link href='/' passHref>
          <Text
            h3
            css={{
              textGradient: "45deg, $purple700, $yellow500 50%",
              cursor: "pointer",
            }}
          >
            Prisma & Next.js
          </Text>
        </Link>
      </Grid>
      {loading ? (
        <Grid xs={4} justify='center'>
          <Loading />
        </Grid>
      ) : user ? (
        <Grid xs={6} justify='center'>
          <Text> {user?.email}</Text>
          <Button onClick={logout}>logout</Button>
        </Grid>
      ) : (
        <Grid xs={4} justify='center'>
          <Button.Group size='sm' flat>
            <Link href='/login' passHref>
              <Button>Login</Button>
            </Link>
            <Link href='/register' passHref>
              <Button>Register</Button>
            </Link>
          </Button.Group>
        </Grid>
      )}
    </Grid.Container>
  );
};

export default Navbar;
