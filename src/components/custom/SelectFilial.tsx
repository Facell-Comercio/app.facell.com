import { useFilial } from "@/hooks/useFilial";
import { Register } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import { MultiSelect } from "../ui/multi-select";
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

export const SelectFilial = ({
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

type TSelectMultiFilial = {
  showAll?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  control?: Control<any>;
  register?: Register;
  disabled?: boolean;
  className?: string;
  maxCount?: number;
  value: string[];
  onChange: (value: string[]) => any;
  isLojaTim?: boolean;
  nowrap?: boolean;
};

export const SelectMultiFilial = (props: TSelectMultiFilial) => {
  const { data } = useFilial().getAll({
    filters: {
      isLojaTim: props.isLojaTim ? 1 : 0,
    },
  });
  const filiais = data?.data?.rows || [];

  return (
    // @ts-ignore
    <MultiSelect
      {...props}
      options={filiais.map((grupo: Filial) => ({
        value: grupo.id,
        label: grupo.nome,
      }))}
      onValueChange={props.onChange}
      defaultValue={props.value}
      placeholder="Filial"
      variant="inverted"
      animation={4}
      maxCount={props.maxCount || 1}
    />
  );
};
