import { Grid } from "@nextui-org/react";
import type { NextPage } from "next";
import Notification from "../components/Notification";
import { useAuth } from "../contexts/auth";

const Home: NextPage = () => {
  const { success } = useAuth();

  return (
    <>
      {/* If success is true, show notification with success message */}
      {success && <Notification type='success' message={success} />}
      <Grid.Container
        justify='center'
        alignItems='center'
        direction='column'
        css={{
          h: "90vh",
          backgroundColor: "$dark",
        }}
      ></Grid.Container>
    </>
  );
};

export default Home;
