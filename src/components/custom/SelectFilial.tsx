import { useFilial } from "@/hooks/useFilial";
import { Control, UseFormRegister } from "react-hook-form";
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
    register?: UseFormRegister<any>
    defaultValue?: string
    disabled?: boolean
}

const SelectFilial = ({ showAll, name, label, control, register, defaultValue, disabled }: TSelectFilial) => {
    // Use a single state variable for fetching and storing data

    const { data} = useFilial().getAll()

    return (
        <FormSelect 
            name={name}
            label={label}
            control={control} 
            register={register} 
            disabled={disabled}
            defaultValue={defaultValue}
            options={data?.data?.map((filial: Filial) => ({ value: filial.id.toString(), label: filial.nome })) || []} 
        />
    );
};

export default SelectFilial;
