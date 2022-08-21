import { Avatar, Button, Dropdown, Grid, Loading, Text, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import Notification from "../components/Notification";
import { useAuth } from "../contexts/auth";
import AuthButtonGroup from "./AuthButtonGroup";

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
        <Grid xs={9} md={3} justify='center'>
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
          <>
            {/* For desktop */}
            <Grid xs={0} md={3} justify='space-evenly' alignItems='center'>
              <Link href='/account' passHref>
                <Text
                  h4
                  color='success'
                  css={{
                    cursor: "pointer",
                    transitionDuration: "500ms",
                    "&:hover": {
                      scale: 1.1,
                    },
                  }}
                >
                  Account
                </Text>
              </Link>
              <Link href='/profile' passHref>
                <Text
                  h4
                  color='success'
                  css={{
                    cursor: "pointer",
                    transitionDuration: "500ms",
                    "&:hover": {
                      scale: 1.1,
                    },
                  }}
                >
                  Profile
                </Text>
              </Link>
              <Button
                auto
                onClick={logout}
                color='error'
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
                      d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                    />
                  </svg>
                }
              />
            </Grid>
            {/* Menu for mobile devices */}
            <Grid xs={3} md={0} justify='center' alignItems='center'>
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
                          d='M4 6h16M4 12h16m-7 6h7'
                        />
                      </svg>
                    }
                  />
                </Dropdown.Trigger>
                <Dropdown.Menu aria-label='Avatar Actions' onAction={dropdownHandler}>
                  <Dropdown.Item key='account'>
                    <Link href='/account' passHref>
                      <Text color='success'>{user?.email}</Text>
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item key='profile'>
                    <Link href='/profile' passHref>
                      <Text color='success'>Profile</Text>
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item key='logout' color='error' textColor='error' withDivider>
                    Log Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Grid>
          </>
        ) : (
          <>
            {/* Menu for mobile devices*/}
            <Grid xs={3} md={0} justify='center' alignItems='center'>
              <Tooltip content={<AuthButtonGroup />} placement='bottomEnd' rounded>
                <Button
                  auto
                  color='warning'
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
                        d='M4 6h16M4 12h16m-7 6h7'
                      />
                    </svg>
                  }
                />
              </Tooltip>
            </Grid>
            {/* For desktop */}
            <Grid xs={0} md={4} justify='center' alignItems='center'>
              <AuthButtonGroup />
            </Grid>
          </>
        )}
      </Grid.Container>
    </>
  );
};

export default Navbar;
