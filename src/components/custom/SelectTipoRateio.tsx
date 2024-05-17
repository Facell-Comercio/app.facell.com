import { Control } from "react-hook-form";
import FormSelect from "./FormSelect";
import { useRateios } from "@/hooks/financeiro/useRateios";
import {  TipoRateio } from "@/pages/financeiro/contas-pagar/titulos/titulo/store";

type TSelectTipoRateio = {
  showAll?: boolean;
  name?: string;
  label?: string;
  control?: Control<any>;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (data: any) => void;
  id_grupo_economico?: string;
};

const SelectTipoRateio = ({
  name,
  label,
  control,
  disabled,
  className,
  placeholder,
  value,
  onChange,
  id_grupo_economico,
}: TSelectTipoRateio) => {
  // Use a single state variable for fetching and storing data

  const { data } = useRateios().getAll({
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
      placeholder={placeholder || 'MANUAL'}
      value={value}
      onChange={onChange}
      options={
        rows.map((rateio: TipoRateio) => ({
          value: rateio?.id?.toString() || '',
          label: rateio.nome,
        })) || []
      }
    />
  );
};

export default SelectTipoRateio;
