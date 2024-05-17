import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { TituloSchemaProps } from "../../../form-data";

const RemoverVencimentos = ({ form }: { form: UseFormReturn<TituloSchemaProps> }) => {
    
    const handleRemoverVencimentos = () => {
        form.setValue('update_vencimentos', true)
        // @ts-ignore
        form.setValue('vencimentos', [])
    }
    
    return (
        <AlertPopUp
            action={handleRemoverVencimentos}
            title="Deseja realmente remover todos os vencimentos da solicitação?!"
            description="Ação não poderá ser desfeita, caso sejam vencimentos ainda não salvos no sistema"
        >
            <Button variant={'destructive'} size={'sm'} ><Trash size={18} className="me-2" /> Remover Vencimentos</Button>
        </AlertPopUp>
    );
}

export default RemoverVencimentos;