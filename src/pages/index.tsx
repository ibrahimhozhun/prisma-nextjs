import { Grid } from "@nextui-org/react";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
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
