import { Register } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import { MultiSelect } from "../ui/multi-select";
import FormSelect from "./FormSelect";

const multiData = [
  { id: "1", label: "Solicitado" },
  { id: "2", label: "Negado" },
  { id: "3", label: "Aprovado" },
  { id: "4", label: "Pago Parcial" },
  { id: "5", label: "Pago" },
];

const data = [
  { id: "all", label: "Todos" },
  { id: "1", label: "Solicitado" },
  { id: "2", label: "Negado" },
  { id: "3", label: "Aprovado" },
  { id: "4", label: "Pago Parcial" },
  { id: "5", label: "Pago" },
];

type Status = {
  id: string;
  label: string;
};
type TSelectMultiStatus = {
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

export const SelectMultiStatus = (props: TSelectMultiStatus) => {
  return (
    // @ts-ignore
    <MultiSelect
      {...props}
      options={multiData.map((forma: Status) => ({
        value: forma.id,
        label: forma.label,
      }))}
      onValueChange={props.onChange}
      defaultValue={props.value}
      placeholder="Status"
      variant="inverted"
      animation={4}
      maxCount={1}
    />
  );
};

type TSelectStatus = {
  showAll?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  control?: Control<any>;
  register?: Register;
  disabled?: boolean;
  className?: string;
  value: string;
  onChange: (id?: string) => any;
};

export const SelectStatus = (props: TSelectStatus) => {
  return (
    <FormSelect
      name={props.name}
      label={props.label}
      control={props.control}
      disabled={props.disabled}
      className={props.className}
      placeholder={props.placeholder || "MANUAL"}
      value={props.value}
      onChange={props.onChange}
      options={
        data.map((rateio: Status) => ({
          value: rateio?.id?.toString() || "",
          label: rateio.label,
        })) || []
      }
    />
  );
};
