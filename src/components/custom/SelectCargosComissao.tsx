import { usePoliticas } from "@/hooks/comercial/usePoliticas";
import { Register } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import { MultiSelect } from "../ui/multi-select";
import FormSelect from "./FormSelect";

type Cargos = {
  id: number;
  cargo: string;
  tipo: string;
};
type TSelectComissao = {
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
  tipo?: "meta" | "agregador";
};

export const SelectCargoComissao = ({
  name,
  label,
  control,
  disabled,
  className,
  placeholder,
  value,
  onChange,
  showAll,
  tipo,
}: TSelectComissao) => {
  // Use a single state variable for fetching and storing data

  const { data } = usePoliticas().getAllCargos({
    filters: {
      tipo,
    },
  });
  const rows = data?.rows || [];

  return (
    <FormSelect
      name={name}
      label={label}
      control={control}
      disabled={disabled}
      className={className}
      placeholder={placeholder ? placeholder : "Selecione o cargo"}
      value={value}
      onChange={onChange}
      options={
        showAll
          ? [
              { value: "all", label: "TODAS" },
              ...rows.map((cargos: Cargos) => ({
                value: cargos.cargo,
                label: cargos.cargo,
              })),
            ]
          : rows.map((cargos: Cargos) => ({
              value: cargos.cargo,
              label: cargos.cargo,
            }))
      }
    />
  );
};

type TSelectMultiComissao = {
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
  nowrap?: boolean;
  tipo?: string;
};

export const SelectMultiCargosComissao = ({ tipo, ...props }: TSelectMultiComissao) => {
  const { data } = usePoliticas().getAllCargos({
    filters: {
      tipo,
    },
  });

  const cargos = data?.rows || [];

  return (
    // @ts-ignore
    <MultiSelect
      {...props}
      options={cargos.map((grupo: Cargos) => ({
        value: grupo.cargo,
        label: grupo.cargo,
      }))}
      onValueChange={props.onChange}
      defaultValue={props.value}
      placeholder="Cargos"
      variant="secondary"
      animation={4}
      maxCount={props.maxCount || 1}
    />
  );
};
