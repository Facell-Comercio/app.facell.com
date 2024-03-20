import { useFilial } from "@/hooks/useFilial";
import { Control } from "react-hook-form";
import FormSelect from "./FormSelect";
import { Register } from "@tanstack/react-query";

type Filial = {
    id: number,
    nome: string,
}
type TSelectFilial = {
    showAll?: boolean,
    name: string,
    label?: string,
    control: Control<any>
    register?: Register
}

const SelectFilial = (props: TSelectFilial) => {
    // Use a single state variable for fetching and storing data

    const { data, isError, isLoading } = useFilial().getAll()

    if (isLoading) return <span>Carregando filiais...</span>; // Provide loading UI

    if (isError) return <span>Erro ao carregar filiais</span>; // Handle errors

    return (
        <FormSelect {...props} options={data?.data?.map((filial: Filial) => ({ value: filial.id.toString(), label: filial.nome })) || []} />
    );
};

export default SelectFilial;
