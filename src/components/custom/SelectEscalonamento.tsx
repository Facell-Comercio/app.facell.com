import { useConfiguracoes } from "@/hooks/comercial/useConfiguracoes";
import { Register } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import FormSelect from "./FormSelect";

type Escalonamento = {
  id: number;
  descricao: string;
  active: boolean;
};
type TSelectEscalonamento = {
  showAll?: boolean;
  name?: string;
  label?: string;
  control?: Control<any>;
  register?: Register;
  disabled?: boolean;
  className?: string;
  value?: string;
  placeholder?: string;
  onChange?: (id?: string) => void;
};

const SelectEscalonamento = ({
  disabled,
  ...props
}: TSelectEscalonamento) => {
  const { data } =
    useConfiguracoes().getEscalonamentos();

  const escalonamentos = data || [];
  return (
    <FormSelect
      {...props}
      disabled={
        disabled || escalonamentos.length === 0
      }
      options={escalonamentos.map(
        (escalonamento: Escalonamento) => ({
          value: String(
            escalonamento.id
          ).toString(),
          label: escalonamento.descricao,
        })
      )}
    />
  );
};

export default SelectEscalonamento;
