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
} from "@/components/ui/alert-dialog"
import { Button, ButtonProps } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";

type ButtonMotivationProps = ButtonProps & {
    action: (motivo: string) => void,
}

const ButtonMotivation = ({
    children, action, variant, size,

}: ButtonMotivationProps) => {
    const [motivo, setMotivo] = useState<string>('');
    return (
        <AlertDialog>
            <AlertDialogTrigger type="button" asChild>
                <Button type="button" variant={variant} size={size}>{children}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Digite o motivo para poder prosseguir</AlertDialogTitle>
                    <Input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ajuste necessário em..."/>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={!motivo || motivo.length < 10} onClick={() => {
                        action(motivo)
                    }}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ButtonMotivation;