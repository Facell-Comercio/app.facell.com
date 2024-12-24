import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
const SchemaCPFNome = z.object({
    cpf: z.string(),
    nome: z.string()
});

export type CPFNomeFormData = z.infer<typeof SchemaCPFNome>;

export const useFormCPFNomeData = (data: CPFNomeFormData) => {
    const form  = useForm<CPFNomeFormData>({
        resolver: zodResolver(SchemaCPFNome),
        values: data,
    });
    return {
        form
    };
};