import { Register } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import FormSelect from "./FormSelect";

type TipoContaBancaria = {
  id: string;
  tipo: string;
};
type TSelectTipoContaBancaria = {
  showAll?: boolean;
  name: string;
  label?: string;
  control: Control<any>;
  register?: Register;
  disabled?: boolean;
  className?: string;
};

const SelectTipoContaBancaria = (props: TSelectTipoContaBancaria) => {
  // Use a single state variable for fetching and storing data

  const data = [
    { id: "1", tipo: "CORRENTE" },
    { id: "2", tipo: "POUPANÇA" },
  ];

  return (
    //@ts-ignore
    <FormSelect
      {...props}
      options={
        data?.map((tipoContaBancaria: TipoContaBancaria) => ({
          value: tipoContaBancaria.id.toString(),
          label: tipoContaBancaria.tipo,
        })) || []
      }
    />
  );
};

export default SelectTipoContaBancaria;
