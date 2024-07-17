import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { Repeat2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { TituloSchemaProps } from "../form-data";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";

export const BtnCriarRecorrencia = ({form}:{form: UseFormReturn<TituloSchemaProps> | any | undefined}) => {
    const queryClient = useQueryClient()

    const handleClickCriarRecorrencia = async () => {
        try {
          // e.preventDefault();
          const dados = form.getValues();
    
          await api.post("financeiro/contas-a-pagar/titulo/criar-recorrencia", {
            id: dados.id,
            data_vencimento:
              dados.vencimentos && dados.vencimentos[0].data_vencimento,
            valor: dados.valor,
          });
          queryClient.invalidateQueries({ queryKey: ["financeiro", "contas_pagar", "recorrencia"] });
          toast({
            variant: "success",
            title: "Recorrência criada com sucesso!",
          });
          return true;
        } catch (error) {
          // console.log(error);
          toast({
            variant: "destructive",
            title: "Erro ao tentar criar a recorrência!",
            // @ts-ignore
            description: error.response?.data?.message || error.message,
          });
          return false;
        }
      };


    return (
        <AlertPopUp
            title="Deseja realmente criar uma recorrência?"
            description="Será criada com data 1 mês após a data do primeiro vencimento da solicitação."
            action={handleClickCriarRecorrencia}
        >
            <Button
                type="button"
                title="Uma recorrência será criada com data para 1 mês após a data de vencimento desta solicitação."
                variant={"secondary"}
                size={"sm"}
            >
                <Repeat2 className="me-2" size={18} />
                Criar Recorrência
            </Button>
        </AlertPopUp>
    );
}
