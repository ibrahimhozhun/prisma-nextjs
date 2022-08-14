import { Avatar, Button, Dropdown, Grid, Loading, Text } from "@nextui-org/react";
import Link from "next/link";
import Notification from "../components/Notification";
import { useAuth } from "../contexts/auth";

const Navbar: React.FC = () => {
  const { user, loading, logout, success } = useAuth();

  const dropdownHandler = (selectedKey: any) => {
    if (selectedKey === "logout") {
      logout();
    }
  };

  return (
    <>
      {/* If success is true, show notification with success message */}
      {success && <Notification type='success' message={success} />}
      <Grid.Container
        justify='space-between'
        gap={1}
        css={{
          minWidth: "100vw",
          h: "10vh",
          backgroundColor: "$background",
        }}
      >
        <Grid xs={3} justify='center'>
          <Link href='/' passHref>
            <Text
              h2
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
          <Grid xs={3} justify='center' alignItems='center'>
            {/*
            I changed the dropdown trigger because there's a bug in the dropdown component
            related github issue => https://github.com/nextui-org/nextui/issues/649
           */}
            <Dropdown trigger='longPress' placement='bottom-left'>
              <Dropdown.Trigger>
                <Avatar
                  color='warning'
                  squared
                  as='button'
                  icon={
                    <svg
                      style={{
                        height: "25px",
                        width: "25px",
                      }}
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M4 6h16M4 12h16M4 18h16'
                      />
                    </svg>
                  }
                />
              </Dropdown.Trigger>
              <Dropdown.Menu
                color='secondary'
                aria-label='Avatar Actions'
                onAction={dropdownHandler}
              >
                <Dropdown.Item key='account'>
                  <Link href='/account'>{user?.email}</Link>
                </Dropdown.Item>
                <Dropdown.Item key='profile'>
                  <Link href='/profile'>Profile</Link>
                </Dropdown.Item>
                <Dropdown.Item key='logout' color='error' withDivider>
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
    </>
  );
};

export default Navbar;
