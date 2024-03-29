import { useFilial } from "@/hooks/useFilial";
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
    control?: Control<any>
    defaultValue?: string
    disabled?: boolean
}

const SelectFilial = ({ name, label, control, defaultValue, disabled }: TSelectFilial) => {
    // Use a single state variable for fetching and storing data

    const { data } = useFilial().getAll(undefined)
    const rows = data?.data?.rows || []

    return (
        <FormSelect 
            name={name}
            label={label}
            control={control} 
            disabled={disabled}
            defaultValue={defaultValue}
            options={rows.map((filial: Filial) => ({ value: filial.id.toString(), label: filial.nome })) || []} 
        />
    );
};

export default SelectFilial;
