import { Button, Grid, Text } from "@nextui-org/react";
import type { NextPage } from "next";
import axios from "axios";
import { ReturnType } from "./api/user";

const Home: NextPage = () => {
  const createUser = async () => {
    try {
      // TODO: Validate user input
      const res = await axios.post<ReturnType>("/api/user?action=register", {
        user: {
          email: "skywalker@example.com",
          password: "@Password123",
        },
      });

      console.log(res.status);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

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
        <Button onClick={createUser}>register</Button>
      </Grid.Container>
    </div>
  );
};

export default Home;
