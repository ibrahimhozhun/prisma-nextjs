import { Card, Grid, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth";
import Icon from "./Icon";

interface CardProps {
  type: "error" | "success";
  message: string;
}

const Notification: React.FC<CardProps> = ({ type, message }) => {
  const [show, setShow] = useState<boolean>(false);
  const { errors } = useAuth();

  useEffect(() => {
    // Show the notification after 200ms delay, just to make it smoother
    setTimeout(() => setShow(true), 200);

    // Hide the notification after 3 seconds from its appearance
    setTimeout(() => setShow(false), 3200);

    // Run this use effect function every time errors change
  }, [errors]);

  return (
    <>
      <Card
        css={{
          zIndex: "1",
          position: "fixed",
          right: "3vw",
          top: "15vh",
          minHeight: "7vh",
          w: "25vw",
          // Slide the notification in 0.5 seconds to the right
          transition: "all .5s ease-in-out",
          translateX: show && "0",
          marginRight: !show && "-28rem",
        }}
      >
        <Grid.Container gap={1} css={{ h: "100%" }}>
          <Grid
            xs={2}
            css={{
              bc: `$${type}`,
              minHeight: "7vh",
              dflex: "center",
              shadow: "$md",
            }}
          >
            <Icon icon={type} />
          </Grid>
          <Grid justify='center' xs={10} alignItems='center'>
            <Text h5 css={{ padding: "10px" }}>
              {message}
            </Text>
          </Grid>
        </Grid.Container>
      </Card>
    </>
  );
};

export default Notification;
