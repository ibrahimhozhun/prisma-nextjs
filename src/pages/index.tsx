import { Button, Grid, Text } from "@nextui-org/react";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div>
      <Grid.Container
        justify="center"
        alignItems="center"
        css={{
          h: "100vh",
          backgroundColor: "$background",
          "@dark": { backgroundColor: "$black" },
        }}
      >
        <Text
          h1
          css={{
            textGradient: "45deg, $blue500 -20%, $green300 50%",
          }}
        >
          Prisma and Next.js
        </Text>
      </Grid.Container>
    </div>
  );
};

export default Home;
