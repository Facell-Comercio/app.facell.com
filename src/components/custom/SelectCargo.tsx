import { useConfiguracoes } from "@/hooks/comercial/useConfiguracoes";
import { useMemo } from "react";
import { CustomCombobox } from "./CustomCombobox";

type TipoCargo = "filial" | "meta" | "agregador";
export type CargoProps = {
  id: string;
  cargo: string;
};
type TSelectCargo = {
  value?: string;
  onChange: (cargo: CargoProps) => void;
  showAll?: boolean;
  label?: string;
  tipo_list?: TipoCargo[];
  disabled?: boolean;
  className?: string;
  tipoValue: "nome" | "id";
};

const SelectCargo = ({
  value,
  onChange,
  label,
  tipo_list,
  tipoValue,
  disabled,
  className,
}: TSelectCargo) => {
  const { data } = useConfiguracoes().getCargos({
    filters: {
      tipo_list,
    },
  });
  const defaultValuesCargos =
    data?.map((value: any) => ({
      value: value.id,
      label: value.cargo,
    })) || [];
  const cargoName = useMemo(
    () =>
      defaultValuesCargos.filter((curr: any) =>
        tipoValue === "id"
          ? curr.value == value
          : String(curr.label).toUpperCase() == String(value).toUpperCase()
      )[0]?.label,
    [value]
  );

  function getCargo(id_cargo: string) {
    return data.filter((cargo: CargoProps) => cargo.id == id_cargo)[0];
  }

  return (
    <span className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <CustomCombobox
        disabled={disabled}
        className="min-w-[38ch] w-full"
        value={cargoName}
        onChange={(id_cargo) => onChange(getCargo(id_cargo))}
        defaultValues={defaultValuesCargos}
        placeholder="Selecione o cargo..."
      />
    </span>
  );
};

export default SelectCargo;
