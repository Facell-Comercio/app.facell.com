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
  onChange?: (data: any) => any;
  id_grupo_economico?: string;
  id_matriz?: string;
  isLojaTim?: boolean;
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
  id_grupo_economico,
  id_matriz,
  showAll,
  isLojaTim,
}: TSelectFilial) => {
  // Use a single state variable for fetching and storing data

  const { data } = useFilial().getAll({
    filters: {
      id_grupo_economico: id_grupo_economico,
      id_matriz: id_matriz,
      isLojaTim: isLojaTim ? 1 : 0,
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
      placeholder={placeholder ? placeholder : "Selecione a filial"}
      value={value}
      onChange={onChange}
      options={
        showAll
          ? [
              { value: "all", label: "TODAS" },
              ...rows.map((filial: Filial) => ({
                value: String(filial.id),
                label: filial.nome,
              })),
            ]
          : rows.map((filial: Filial) => ({
              value: String(filial.id),
              label: filial.nome,
            }))
      }
    />
  );
};

export default SelectFilial;
