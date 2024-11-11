import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button, ButtonProps } from "../ui/button";
import { Input } from "../ui/input";

type ButtonMotivationProps = ButtonProps & {
  action: (motivo: string) => void;
  headerTitle?: string;
  placeholder?: string;
  description?: string;
  equalText?: boolean;
};

const ButtonMotivation = ({
  children,
  action,
  variant,
  size,
  title,
  headerTitle,
  placeholder,
  description,
  equalText,
  disabled,
}: ButtonMotivationProps) => {
  const [motivo, setMotivo] = useState<string>("");
  const actionDisabled = equalText
    ? motivo !== String(placeholder).toUpperCase()
    : !motivo || motivo.length < 10;

  return (
    <AlertDialog>
      <AlertDialogTrigger type="button" asChild>
        <Button title={title} type="button" variant={variant} size={size} disabled={disabled}>
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-fit">
        <AlertDialogHeader>
          <AlertDialogTitle className="whitespace-pre">
            {headerTitle || "Digite o motivo para poder prosseguir"}
          </AlertDialogTitle>
          <AlertDialogDescription className={description ? "mb-2 whitespace-pre" : "hidden"}>
            {description}
          </AlertDialogDescription>
          <Input
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={placeholder || "Ajuste necessário em..."}
            className="whitespace-pre"
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={actionDisabled}
            onClick={() => {
              action(motivo);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ButtonMotivation;
