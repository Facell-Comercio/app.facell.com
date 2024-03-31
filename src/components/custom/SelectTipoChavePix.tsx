import { Register } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import FormSelect from "./FormSelect";

type TipoChavePix = {
    id: number,
    tipo: string,
}
type TSelectTipoChavePix = {
    showAll?: boolean,
    name: string,
    label?: string,
    control: Control<any>
    register?: Register
    disabled?: boolean
    className?: string
}

const SelectTipoChavePix = (props: TSelectTipoChavePix) => {
    // Use a single state variable for fetching and storing data
    const data = [
            { id: 1, tipo: "Aleatória" },
            { id: 2, tipo: "E-mail" },
            { id: 3, tipo: "Celular" },
            { id: 4, tipo: "CPF" },
            { id: 5, tipo: "CNPJ" },
        ]
    return (
        <FormSelect {...props} options={data.map((tipoChavePix: TipoChavePix) => ({ value: tipoChavePix.id.toString(), label: tipoChavePix.tipo }))} />
    );
};

export default SelectTipoChavePix;
