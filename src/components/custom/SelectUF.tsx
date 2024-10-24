import { api } from "@/lib/axios";
import { Register, useQuery } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import { MultiSelect } from "../ui/multi-select";
import FormSelect from "./FormSelect";

type UF = {
  id: number;
  uf: string;
};
type TSelectUF = {
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

  id_grupo_economico?: string;
  id_matriz?: string;
  isLojaTim?: boolean;
};

export const SelectUF = (props: TSelectUF) => {
  // Use a single state variable for fetching and storing data

  const { data } = useQuery({
    queryKey: ["filiais", "uf", "lista"],
    queryFn: () =>
      api
        .get("/filial/ufs", {
          params: {
            filters: {
              id_grupo_economico: props.id_grupo_economico,
              id_matriz: props.id_matriz,
              isLojaTim: props.isLojaTim ? 1 : 0,
            },
          },
        })
        .then((res) => res.data),
    staleTime: Infinity,
  });

  return (
    // @ts-ignore
    <FormSelect
      {...props}
      options={
        data?.map((uf: UF) => ({
          value: uf.uf.toString(),
          label: uf.uf,
        })) || []
      }
    />
  );
};

type TSelectMultiUF = {
  showAll?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  control?: Control<any>;
  register?: Register;
  disabled?: boolean;
  className?: string;
  value?: string[];
  nowrap?: boolean;
  maxCount?: number;
  onChange: (data: any) => any;
};

export const SelectMultiUF = (props: TSelectMultiUF) => {
  // Use a single state variable for fetching and storing data
  const { data } = useQuery({
    queryKey: ["filiais", "uf", "lista"],
    queryFn: () => api.get("/filial/ufs").then((res) => res.data),
    staleTime: Infinity,
  });

  const uf = data || [];

  return (
    // @ts-ignore
    <MultiSelect
      {...props}
      options={uf.map((forma: UF) => ({
        value: forma.uf,
        label: forma.uf,
      }))}
      onValueChange={props.onChange}
      defaultValue={props.value || []}
      placeholder="UF's"
      variant="secondary"
      animation={4}
      maxCount={props.maxCount || 1}
    />
  );
};
