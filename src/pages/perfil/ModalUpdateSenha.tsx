import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

import { ScrollArea } from "@radix-ui/react-scroll-area";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUsers } from "@/hooks/useUsers";
import { useEffect, useRef } from "react";
import { useStorePerfil } from "./store";

type ModalUpdateSenhaProps = {
  id: number;
};
function ModalUpdateSenha({ id }: ModalUpdateSenhaProps) {
  const { mutate: updatePassword, isSuccess } = useUsers().updatePassword();

  const modalOpen = useStorePerfil().modalOpen;
  const closeModal = useStorePerfil().closeModal;
  const password = useRef<HTMLInputElement | null>(null);
  const confirmedPassword = useRef<HTMLInputElement | null>(null);

  useEffect(()=>{
    if(isSuccess){
      closeModal()
    }
  }, [isSuccess])

  function onSubmitData() {
    const senha = password.current?.value;
    const confirmaSenha = confirmedPassword.current?.value;
    if (senha && confirmaSenha) {
      if (senha.length < 6 && confirmaSenha.length < 6) {
        toast({
          title: "A senha deve ter no mínimo 6 caracteres",
          variant: "warning",
        });
        return;
      }
      if (senha !== confirmaSenha) {
        toast({
          title: "As senhas não conferem",
          variant: "warning",
        });
        return;
      }
      updatePassword({
        id,
        senha: senha || "",
        confirmaSenha: confirmaSenha || "",
      });
    }
  }

  return (
    <div>
      <Dialog open={modalOpen} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-xl">
          <ScrollArea className="flex flex-col gap-2 max-h-[80vh]">
            <div className="flex justify-between text-lg font-medium">
              <span>{`Modal de Mudança de Senha`}</span>
            </div>
            <form className="flex flex-col gap-2 flex-wrap justify-between items-end h-full">
              <section className="w-full flex gap-3">
                <div className="flex flex-col flex-1 min-w-40 gap-1">
                  <label className="text-sm font-medium">Senha</label>
                  <Input
                    ref={password}
                    type="password"
                    className="h-9"
                    placeholder="Buscar..."
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-40 gap-1">
                  <label className="text-sm font-medium">
                    Confirmar a Senha
                  </label>
                  <Input
                    ref={confirmedPassword}
                    type="password"
                    className="h-9"
                    placeholder="Buscar..."
                  />
                </div>
              </section>
            </form>
          </ScrollArea>
          <DialogFooter className="flex gap-2 items-end flex-wrap">
            <AlertPopUp
              title={"Tem certeza de que deseja alterar sua senha?"}
              description="Esta ação atualizará sua senha de acesso e você precisará usá-la para fazer login a partir de agora."
              action={() => onSubmitData()}
            >
              <Button type="submit">Mudar</Button>
            </AlertPopUp>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ModalUpdateSenha;
