import { useDepartamentos } from "@/hooks/useDepartamentos";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type UserDepartamento = {
  id: number;
  nome: string;
};

type TSelectUserDepartamento = {
  name: string;
  label?: string;
  form: any;
  disabled?: boolean;
  className?: string;
};

const SelectUserDepartamento = ({
  name,
  label,
  disabled,
  form,
  className,
}: TSelectUserDepartamento) => {
  const { data } = useDepartamentos().getUserDepartamento();
  const rows = data?.data || [];

  const value = form.watch(name);
  function onChange(data: string | number) {
    form.setValue(name, data);
  }

  // Use efeito para definir o valor inicial se estiver vazio
  useEffect(() => {
    if (!value && rows.length > 0) {
      onChange(String(rows[0].id));
    }
  }, [value, rows, onChange]);

  return (
    <div className="flex flex-col space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Select
        value={value}
        onValueChange={onChange}
        disabled={rows.length < 2 || disabled}
      >
        <SelectTrigger className={`w-[180px] ${className}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {rows.map((item: UserDepartamento) => (
            <SelectItem
              className="text-left"
              key={item.id}
              value={String(item.id)}
            >
              {item.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectUserDepartamento;
