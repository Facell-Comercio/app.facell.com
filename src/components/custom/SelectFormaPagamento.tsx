import fetchApi from "@/api/fetchApi";
import { Register, useQuery } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import { MultiSelect } from "../ui/multi-select";
import FormSelect from "./FormSelect";

type FormaPagamento = {
  id: number;
  forma_pagamento: string;
};
type TSelectFormaPagamento = {
  showAll?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  control?: Control<any>;
  register?: Register;
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange?: (data: any) => any;
};

export const SelectFormaPagamento = (props: TSelectFormaPagamento) => {
  // Use a single state variable for fetching and storing data

  const { data } = useQuery({
    queryKey: ["financeiro", "forma_pagamento", "lista"],
    queryFn: () => fetchApi.financeiro.forma_pagamento.getAll(),
    staleTime: Infinity,
  });

  return (
    // @ts-ignore
    <FormSelect
      {...props}
      options={
        data?.map((formaPagamento: FormaPagamento) => ({
          value: formaPagamento.id.toString(),
          label: formaPagamento.forma_pagamento,
        })) || []
      }
    />
  );
};

type TSelectMultiFormaPagamento = {
  showAll?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  control?: Control<any>;
  register?: Register;
  disabled?: boolean;
  className?: string;
  value?: string[];
  onChange: (data: any) => any;
};

export const SelectMultiFormaPagamento = (
  props: TSelectMultiFormaPagamento
) => {
  // Use a single state variable for fetching and storing data
  const { data } = useQuery({
    queryKey: ["financeiro", "forma_pagamento", "lista"],
    queryFn: () => fetchApi.financeiro.forma_pagamento.getAll(),
    staleTime: Infinity,
  });

  return (
    // @ts-ignore
    <MultiSelect
      {...props}
      options={data.map((forma: FormaPagamento) => ({
        value: forma.id,
        label: forma.forma_pagamento,
      }))}
      onValueChange={props.onChange}
      defaultValue={props.value || []}
      placeholder="Formas de Pagamento"
      variant="inverted"
      animation={4}
      maxCount={1}
    />
  );
};
