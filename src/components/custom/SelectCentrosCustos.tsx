import { useCentroCustos } from "@/hooks/financeiro/useCentroCustos";
import { Control } from "react-hook-form";
import FormSelect from "./FormSelect";

type CentrosCustos = {
  id: number;
  nome: string;
};
type TSelectCentrosCustos = {
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
};

const SelectCentrosCustos = ({
  name,
  label,
  control,
  disabled,
  className,
  placeholder,
  value,
  onChange,
  id_grupo_economico,
}: TSelectCentrosCustos) => {
  // Use a single state variable for fetching and storing data

  const { data } = useCentroCustos().getAll({
    pagination: {
      pageIndex: 0,
      pageSize: 150,
    },
    filters: {
      id_grupo_economico: id_grupo_economico,
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
        rows.map((centrosCustos: CentrosCustos) => ({
          value: centrosCustos.id.toString(),
          label: centrosCustos.nome,
        })) || []
      }
    />
  );
};

export default SelectCentrosCustos;
