import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { TituloCRSchemaProps } from "../../../form-data";

type RemoverItensRateioProps = {
  form: UseFormReturn<TituloCRSchemaProps>;
  canEdit?: boolean;
  disabled?: boolean;
  canEditItensRateio: boolean;
};

const RemoverItensRateio = ({ form, canEditItensRateio }: RemoverItensRateioProps) => {
  const handleRemoverItensRateio = () => {
    form.setValue("update_rateio", true);
    // @ts-ignore
    form.setValue("itens_rateio", []);
  };

  return (
    <AlertPopUp
      action={handleRemoverItensRateio}
      title="Deseja realmente remover todos os itens do rateio?!"
      description="Ação não poderá ser desfeita, caso sejam vencimentos ainda não salvos no sistema"
    >
      <Button disabled={!canEditItensRateio} variant={"destructive"} size={"sm"}>
        <Trash size={18} className="me-2" /> Remover Itens
      </Button>
    </AlertPopUp>
  );
};

export default RemoverItensRateio;
