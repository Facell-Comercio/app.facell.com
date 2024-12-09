import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaEstoque = z.object({
    id_grupo_economico: z.coerce.string().trim().min(1, "Campo Obrigatório"),
    grupo_economico: z.string().trim().min(1, "Campo Obrigatório"),
    uf: z.string().min(2, "Campo obrigatório"),
    id_modelo: z.coerce.string().trim().min(1, "Campo obrigatório"),
    modelo: z
    .string()
    .trim()
    .min(4, "Campo obrigatório")
    .transform((n) => String(n).toUpperCase()),
    id_tamanho: z.coerce.string().trim().min(1, "Campo obrigatório"),
    tamanho: z
    .string()
    .trim()
    .min(1, "Campo obrigatório")
    .transform((n) => String(n).toUpperCase()),
    sexo: z
    .string()
    .trim()
    .min(1, "Campo obrigatório")
    .transform((n) => String(n).toUpperCase()),
    saldo: z.coerce.string(),
    abastecer: z
    .coerce
    .string().
    min(1, "Campo obrigatório")
    .transform((value) => parseInt(value)),
    saldo_futuro: z.string().min(1, "Campo obrigatório")
});

export type EstoqueFormdata =  z.infer<typeof schemaEstoque>

export const useFormEstoqueFardamentoData = (data: EstoqueFormdata) =>{
    
    const form = useForm <EstoqueFormdata>({
        resolver: zodResolver(schemaEstoque)  
    });
    return{
        form,
    }
}  
