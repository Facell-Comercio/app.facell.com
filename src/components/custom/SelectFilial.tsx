import { useFilial } from "@/hooks/useFilial";
import { Register } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import FormSelect from "./FormSelect";

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

    const { data} = useFilial().getAll()

    return (
        <FormSelect {...props} options={data?.data?.map((filial: Filial) => ({ value: filial.id.toString(), label: filial.nome })) || []} />
    );
};

export default SelectFilial;
