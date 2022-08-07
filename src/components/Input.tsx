import { Input as NInput } from "@nextui-org/react";
import { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  color: "default" | "primary" | "secondary" | "success" | "warning" | "error";
  onChange: (e: any) => void;
}

const Input: FC<InputProps> = ({ label, placeholder, type, color, required, onChange }) => {
  const props = {
    rounded: true,
    bordered: true,
    color,
    labelLeft: label,
    "aria-label": label,
    placeholder,
    type,
    required,
    onChange,
  };

  return <>{type === "password" ? <NInput.Password {...props} /> : <NInput {...props} />}</>;
};

export default Input;
