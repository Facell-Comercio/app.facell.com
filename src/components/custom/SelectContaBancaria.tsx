import { useContasBancarias } from "@/hooks/financeiro/useContasBancarias";
import { Control } from "react-hook-form";
import FormSelect from "./FormSelect";

type ContaBancaria = {
  id: number;
  descricao: string;
};
type TSelectContaBancaria = {
  showAll?: boolean;
  name?: string;
  label?: string;
  control?: Control<any>;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (id?: string) => void;
  id_grupo_economico?: string;
  id_matriz?: string;
};

const SelectContaBancaria = ({
  name,
  label,
  control,
  disabled,
  className,
  placeholder,
  value,
  onChange,
  id_grupo_economico,
  id_matriz,
}: TSelectContaBancaria) => {
  // Use a single state variable for fetching and storing data

  const { data } = useContasBancarias().getAll({
    filters: {
      id_grupo_economico: id_grupo_economico,
      id_matriz: id_matriz || "",
    },
  });
  const rows = data?.data?.rows || [];

  return (
    <FormSelect
      name={name}
      label={label}
      control={control}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      options={
        rows.map((filial: ContaBancaria) => ({
          value: filial.id.toString(),
          label: filial.descricao,
        })) || []
      }
    />
  );
};

export default SelectContaBancaria;
