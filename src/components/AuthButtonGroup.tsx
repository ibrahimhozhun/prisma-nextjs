import { Button } from "@nextui-org/react";
import Link from "next/link";

const AuthButtonGroup: React.FC = () => {
  return (
    <Button.Group size='sm' flat>
      <Link href='/login' passHref>
        <Button>Login</Button>
      </Link>
      <Link href='/register' passHref>
        <Button>Register</Button>
      </Link>
    </Button.Group>
  );
};

export default AuthButtonGroup;
