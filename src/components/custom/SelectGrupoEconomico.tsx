import { useGrupoEconomico } from "@/hooks/useGrupoEconomico";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // Assuming these are custom components

type TSelectGrupoEconomico = {
  value: string | undefined;
  onChange: (id_grupo_economico?: string) => void;
  showAll?: boolean;
  className?: string;
  disabled?: boolean;
};

type GrupoEconomico = {
  id: number;
  nome: string;
  id_matriz: number;
  ativo: boolean;
};

export const SelectGrupoEconomico = ({
  value,
  onChange,
  showAll,
  className,
  disabled,
}: TSelectGrupoEconomico) => {
  const { data } = useGrupoEconomico().getAll();
  const gruposEconomicos = data?.data?.rows || [];

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      {/* Estilização sendo usada no cadastro de orçamentos */}
      <SelectTrigger
        className={`w-[180px] ${className}`}
      >
        <SelectValue placeholder="Selecione o grupo" />
      </SelectTrigger>
      <SelectContent>
        {showAll &&
          gruposEconomicos &&
          gruposEconomicos.length > 1 && (
            <SelectItem value="all">
              TODOS
            </SelectItem>
          )}
        {gruposEconomicos?.map(
          (item: GrupoEconomico) => (
            <SelectItem
              className="text-left"
              key={item.id}
              value={item.id.toString()}
            >
              {item.nome}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
};

import { Register } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import { MultiSelect } from "../ui/multi-select";

type TSelectMultiGrupoEconomico = {
  showAll?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  control?: Control<any>;
  register?: Register;
  disabled?: boolean;
  className?: string;
  value: string[];
  onChange: (value: string[]) => any;
};

export const SelectMultiGrupoEconomico = (
  props: TSelectMultiGrupoEconomico
) => {
  const { data } = useGrupoEconomico().getAll();
  const gruposEconomicos = data?.data?.rows || [];

  return (
    // @ts-ignore
    <MultiSelect
      {...props}
      options={gruposEconomicos.map(
        (grupo: GrupoEconomico) => ({
          value: grupo.id,
          label: grupo.nome,
        })
      )}
      onValueChange={props.onChange}
      defaultValue={props.value}
      placeholder="Grupo Econômico"
      variant="secondary"
      animation={4}
      maxCount={1}
    />
  );
};
