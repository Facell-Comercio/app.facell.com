import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ContaBancaria } from "../../../extrato/components/context";
import { TransacaoPadrao } from "../table/TablePadroes";

const FormNovoPadrao = ({ conta }: { conta: ContaBancaria | null }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const initialTranscaoPadrao: Partial<TransacaoPadrao> = {
    id_conta_bancaria: 0,
    tipo_transacao: "DEBIT",
    descricao: "",
  };
  const [newPadrao, setNewPadrao] = useState<Partial<TransacaoPadrao>>(
    initialTranscaoPadrao
  );

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };
  const [saving, setSaving] = useState<boolean>(false);
  const handleSavePadrao = async () => {
    try {
      if (!conta?.id) {
        throw new Error(
          "Selecione a conta bancária antes de tentar criar um padrão!"
        );
      }
      if (!newPadrao?.descricao || newPadrao?.descricao?.length < 1) {
        throw new Error("Preencha a descrição! No mínimo 1 caracter");
      }
      if (!newPadrao?.tipo_transacao || newPadrao?.tipo_transacao?.length < 1) {
        throw new Error("Preencha o Tipo de transação! DEBIT ou CREDIT");
      }

      setSaving(true);
      await api.post("/financeiro/conciliacao-bancaria/transacao-padrao", {
        descricao: newPadrao.descricao,
        tipo_transacao: newPadrao.tipo_transacao,
        id_conta_bancaria: conta?.id,
      });

      queryClient.invalidateQueries({
        queryKey: [`transacao_padrao_${conta?.id}`],
      });

      toggleOpen();
    } catch (error) {
      toast({
        title: "Erro ao tentar salvar o padrão",
        variant: "destructive",
        description:
        // @ts-ignore
          error?.response?.data?.message || error?.message ||
          "Tente novamente ao atualizar a página.",
      });
    } finally {
      setSaving(false);
    }
  };
  const handleClickCancel = () => {
    toggleOpen();
  };

  if (!conta) {
    return null;
  }

  return (
    <form>
      {open ? (
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Digite o Novo Padrão... CAPSLOCK FREE"
            className="max-w-72"
            value={newPadrao.descricao}
            onChange={(e) =>
              setNewPadrao((state:any) => ({ ...state, descricao: e.target.value }))
            }
          />
          <Select
            value={newPadrao.tipo_transacao}
            onValueChange={(tipo_transacao: "CREDIT" | "DEBIT") =>
              setNewPadrao((state:any) => ({ ...state, tipo_transacao }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="DEBIT">DEBIT</SelectItem>
                <SelectItem value="CREDIT">CREDIT</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            disabled={saving}
            variant={"secondary"}
            onClick={handleClickCancel}
          >
            Cancelar
          </Button>
          <Button disabled={saving} onClick={handleSavePadrao}>
            Salvar
          </Button>
        </div>
      ) : (
        <Button disabled={!conta} onClick={toggleOpen}>
          Novo Padrão
        </Button>
      )}
    </form>
  );
};

export default FormNovoPadrao;
