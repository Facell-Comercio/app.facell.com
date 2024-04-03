import { useFilial } from "@/hooks/useFilial";
import { Control } from "react-hook-form";
import FormSelect from "./FormSelect";

type Filial = {
  id: number;
  nome: string;
};
type TSelectFilial = {
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

const SelectFilial = ({
  name,
  label,
  control,
  disabled,
  className,
  placeholder,
  value,
  onChange,
}: TSelectFilial) => {
  // Use a single state variable for fetching and storing data

  const { data } = useFilial().getAll(undefined);
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
        rows.map((filial: Filial) => ({
          value: filial.id.toString(),
          label: filial.nome,
        })) || []
      }
    />
  );
};

export default SelectFilial;
