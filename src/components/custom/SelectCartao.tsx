import { useCartoes } from "@/hooks/financeiro/useCartoes";
import { Register } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import FormSelect from "./FormSelect";

type Cartao = {
  id: number;
  descricao: string;
  id_matriz: number;
  ativo: boolean;
};
type TSelectCartao = {
  showAll?: boolean;
  name: string;
  label?: string;
  control: Control<any>;
  register?: Register;
  disabled?: boolean;
  className?: string;
  onChange?: (id?: string) => void;
};

const SelectCartao = (props: TSelectCartao) => {
  const { data } = useCartoes().getAll();
  const cartoes = data?.data?.rows || [];
  return (
    <FormSelect
      {...props}
      options={cartoes.map((cartao: Cartao) => ({
        value: String(cartao.id).toString(),
        label: cartao.descricao,
      }))}
    />
  );
};

export default SelectCartao;
