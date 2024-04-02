import { useBanco } from "@/hooks/useBanco";
import { Control } from "react-hook-form";
import FormSelect from "./FormSelect";

type Banco = {
  id: number;
  nome: string;
};
type TSelectBanco = {
  showAll?: boolean;
  name?: string;
  label?: string;
  control?: Control<any>;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (id?: string) => void;
};

const SelectBanco = ({
  name,
  label,
  control,
  disabled,
  className,
  placeholder,
  value,
  onChange,
}: TSelectBanco) => {
  // Use a single state variable for fetching and storing data

  const { data } = useBanco().getAll(undefined);
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
        rows.map((banco: Banco) => ({
          value: banco.id.toString(),
          label: banco.nome,
        })) || []
      }
    />
  );
};

export default SelectBanco;
