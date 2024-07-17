import { Register, useQuery } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import FormSelect from "./FormSelect";
import fetchApi from "@/api/fetchApi";

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

const SelectFormaPagamento = (props: TSelectFormaPagamento) => {
  // Use a single state variable for fetching and storing data

  const { data } = useQuery({
    queryKey: ['financeiro', 'forma_pagamento', 'lista'],
    queryFn: ()=> fetchApi.financeiro.forma_pagamento.getAll(),
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

export default SelectFormaPagamento;
